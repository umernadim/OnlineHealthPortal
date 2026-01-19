using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineHealthPortal.Data;
using OnlineHealthPortal.DTOs;
using OnlineHealthPortal.Models;
using OnlineHealthPortal.Services;
using System.Security.Claims;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class AppointmentController : ControllerBase
{
    private readonly HealthPortalContext _context;
    private readonly NotificationService _notificationService;

    public AppointmentController(
        HealthPortalContext context,
        NotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    // ===============================
    // CREATE APPOINTMENT (PATIENT)
    // ===============================
    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDTO dto)
    {
        try
        {
            Console.WriteLine($"DoctorId: {dto.DoctorId}");
            Console.WriteLine($"Date: {dto.AppointmentDate}");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            Console.WriteLine($"UserId from token: {userId}");

            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            Console.WriteLine($"Patient found: {patient != null}");

            if (patient == null)
                return Unauthorized("Patient profile not found");

            var doctor = await _context.Doctors.FindAsync(dto.DoctorId);
            if (doctor == null || !doctor.IsApproved)
                return BadRequest("Doctor not available");

            var appointmentDate = dto.AppointmentDate.Date;  
            var appointmentHour = dto.AppointmentDate.Hour;   

            var conflict = await _context.Appointments
                .AnyAsync(a => a.DoctorId == dto.DoctorId &&
                              a.AppointmentDate.HasValue &&          
                              a.AppointmentDate.Value.Date == appointmentDate &&
                              a.AppointmentDate.Value.Hour == appointmentHour &&
                              a.Status != "Cancelled");

            if (conflict)
                return BadRequest("This time slot is already booked");

            // ✅ CREATE APPOINTMENT
            var appointment = new Appointment
            {
                PatientId = patient.Id,
                DoctorId = dto.DoctorId,
                AppointmentDate = dto.AppointmentDate,  // Direct assign
                Type = dto.Type,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            Console.WriteLine($"✅ Appointment created: {appointment.Id}");

            return Ok(new
            {
                message = "Appointment booked successfully",
                appointmentId = appointment.Id
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}");
            return StatusCode(500, ex.Message);
        }
    }


    // ===============================
    // GET PATIENT APPOINTMENTS
    // ===============================
    [HttpGet("patient")]
    [Authorize(Roles = "Patient")]
    public IActionResult GetPatientAppointments()
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        );

        var patient = _context.Patients
            .FirstOrDefault(p => p.UserId == userId);

        if (patient == null)
            return Unauthorized();

        var list = _context.Appointments
            .Where(a => a.PatientId == patient.Id)
            .OrderByDescending(a => a.AppointmentDate)
            .ToList();

        return Ok(list);
    }

    // ===============================
    // GET DOCTOR APPOINTMENTS
    // ===============================
[HttpGet("doctor")]
[Authorize(Roles = "Doctor")]
public async Task<ActionResult<IEnumerable<Appointment>>> GetDoctorAppointments()
{
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);

    if (doctor == null) return Unauthorized();

    var appointments = await _context.Appointments
        .Where(a => a.DoctorId == doctor.Id)
        .Include(a => a.Patient)
        .OrderBy(a => a.AppointmentDate)
        .Select(a => new
        {
            id = a.Id,
            patientId = a.PatientId,
            patientName = a.Patient.User.FullName,  // Patient name
            appointmentDate = a.AppointmentDate,
            type = a.Type,
            status = a.Status
        })
        .ToListAsync();

    return Ok(appointments);
}

    // ===============================
    // UPDATE STATUS (DOCTOR ONLY)
    // ===============================
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Doctor")]
    public IActionResult UpdateStatus(int id, [FromBody] string status)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        );

        var doctor = _context.Doctors
            .FirstOrDefault(d => d.UserId == userId);

        var appt = _context.Appointments
            .FirstOrDefault(a => a.Id == id && a.DoctorId == doctor.Id);

        if (appt == null)
            return Unauthorized("Not your appointment");

        appt.Status = status;
        _context.SaveChanges();

        // 🔔 Notify patient
        var patient = _context.Patients.Find(appt.PatientId);
        if (patient?.UserId != null)
            _notificationService.Create(
                patient.UserId.Value,
                $"Your appointment status changed to {status}"
            );

        return Ok("Status updated");
    }
}
