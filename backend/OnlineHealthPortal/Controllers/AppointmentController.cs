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

            var appointment = new Appointment
            {
                PatientId = patient.Id,
                DoctorId = dto.DoctorId,
                AppointmentDate = dto.AppointmentDate,
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
    public async Task<ActionResult<IEnumerable<object>>> GetPatientAppointments()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("UserId missing in token");

            int userId = int.Parse(userIdClaim);
            Console.WriteLine($"🔍 Patient UserId: {userId}");

            var patient = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
            {
                Console.WriteLine("❌ Patient profile not found for UserId: " + userId);
                return NotFound("Patient profile not created. Please complete your profile.");
            }

            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patient.Id)
                .Include(a => a.Doctor)
                .ThenInclude(d => d.User)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new
                {
                    id = a.Id,
                    doctorName = a.Doctor != null && a.Doctor.User != null
                        ? a.Doctor.User.FullName
                        : "Doctor",
                    speciality = a.Doctor != null
                        ? a.Doctor.Speciality
                        : "—",
                    appointmentDate = a.AppointmentDate,
                    type = a.Type,
                    status = a.Status,
                    createdAt = a.CreatedAt
                })
                .ToListAsync();

            Console.WriteLine($"✅ Found {appointments.Count} appointments for patient {patient.Id}");
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error in GetPatientAppointments: {ex.Message}");
            return StatusCode(500, "Server error loading appointments");
        }
    }

    // ===============================
    // GET DOCTOR APPOINTMENTS - ✅ FIXED!
    // ===============================
    [HttpGet("doctor")]
    [Authorize(Roles = "Doctor")]
    public async Task<ActionResult<IEnumerable<object>>> GetDoctorAppointments()
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null)
                return Unauthorized("Doctor not found");

            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == doctor.Id)
                .Include(a => a.Patient)
                .ThenInclude(p => p.User)
                .OrderBy(a => a.AppointmentDate)
                .Select(a => new
                {
                    id = a.Id,
                    patientId = a.PatientId,
                    patientName = a.Patient != null && a.Patient.User != null ? a.Patient.User.FullName : "Unknown Patient",
                    patientPhone = a.Patient != null && a.Patient.User != null ? a.Patient.User.Phone : null,
                    appointmentDate = a.AppointmentDate,
                    type = a.Type ?? "Consultation",
                    status = a.Status ?? "Pending",
                    duration = "30 min",
                    hasPrescription = a.HasPrescription
                })
                .ToListAsync();

            return Ok(appointments);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"GetDoctorAppointments error: {ex.Message}");
            return StatusCode(500, "Server error");
        }
    }

    // ===============================
    // UPDATE STATUS - ✅ FIXED ASYNC + DTO!
    // ===============================
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null)
                return Unauthorized("Doctor not found");

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.DoctorId == doctor.Id);

            if (appointment == null)
                return NotFound("Appointment not found");

            appointment.Status = dto.Status;
            await _context.SaveChangesAsync();

            // 🔔 Notify patient
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == appointment.PatientId);
            if (patient?.UserId != null)
            {
                _notificationService.Create(patient.UserId.Value, $"Your appointment status changed to {dto.Status}");
            }

            return Ok(new { message = "Status updated successfully" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UpdateStatus error: {ex.Message}");
            return StatusCode(500, "Status update failed");
        }
    }

    [HttpPut("{id}/cancel")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> CancelAppointment(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Invalid token");

            int userId = int.Parse(userIdClaim);
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return Unauthorized("Patient profile not found");

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.PatientId == patient.Id);

            if (appointment == null)
                return NotFound("Appointment not found");

            if (appointment.Status == "Completed" || appointment.Status == "Cancelled")
                return BadRequest("Cannot cancel this appointment");

            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();

            Console.WriteLine($"✅ Patient {patient.Id} cancelled appointment {id}");

            return Ok(new { message = "Appointment cancelled successfully" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Cancel error: {ex.Message}");
            return StatusCode(500, "Cancel failed");
        }
    }

    [HttpGet("{id}/available-slots")]
    [Authorize(Roles = "Patient")]
    public async Task<ActionResult<List<DateTime>>> GetAvailableRescheduleSlots(int id, DateTime preferredDate)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);

        var appointment = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id && a.PatientId == patient.Id);
        if (appointment == null) return NotFound();

        var doctorId = appointment.DoctorId;
        var date = preferredDate.Date;

        var availableSlots = new List<DateTime>();
        for (int i = 0; i < 7; i++)
        {
            var checkDate = date.AddDays(i);
            for (int hour = 9; hour <= 17; hour++)
            {
                var slot = new DateTime(checkDate.Year, checkDate.Month, checkDate.Day, hour, 0, 0);

                var isBooked = await _context.Appointments
                    .AnyAsync(a => a.DoctorId == doctorId &&
                                  a.AppointmentDate.Value.Date == checkDate &&
                                  a.AppointmentDate.Value.Hour == hour &&
                                  a.Status != "Cancelled");

                if (!isBooked) availableSlots.Add(slot);
            }
        }

        return Ok(availableSlots.Take(10).ToList());
    }

    [HttpPut("{id}/reschedule")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> RescheduleAppointment(int id, [FromBody] DateTime newDateTime)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);

        var appointment = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id && a.PatientId == patient.Id);
        if (appointment == null) return NotFound();

        var conflict = await _context.Appointments
            .AnyAsync(a => a.DoctorId == appointment.DoctorId &&
                          a.AppointmentDate.HasValue &&
                          a.AppointmentDate.Value.Date == newDateTime.Date &&
                          a.AppointmentDate.Value.Hour == newDateTime.Hour &&
                          a.Status != "Cancelled");

        if (conflict) return BadRequest("New time slot not available");

        appointment.AppointmentDate = newDateTime;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Appointment rescheduled successfully" });
    }


    [HttpGet("appointment/{id}")]
    [Authorize(Roles = "Doctor")]
    public async Task<ActionResult<object>> GetAppointmentById(int id)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            Console.WriteLine($"🔍 Doctor {userId} requesting appointment {id}");

            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .ThenInclude(p => p.User)
                .Include(a => a.Doctor)
                .ThenInclude(d => d.User)
                .FirstOrDefaultAsync(a => a.Id == id && a.Doctor.UserId == userId);

            if (appointment == null)
            {
                Console.WriteLine($"❌ Appointment {id} not found for doctor {userId}");
                return NotFound("Appointment not found or unauthorized");
            }

            return Ok(new
            {
                id = appointment.Id,
                patientName = appointment.Patient?.User?.FullName ?? $"Patient #{appointment.PatientId}",
                appointmentDate = appointment.AppointmentDate?.ToString("yyyy-MM-dd"),
                status = appointment.Status ?? "Unknown",
                hasPrescription = appointment.HasPrescription,
                doctorName = appointment.Doctor?.User?.FullName ?? "Doctor"
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"GetAppointmentById error: {ex}");
            return StatusCode(500, ex.Message);
        }
    }

}

// ✅ DTO - File ke end mein add karo
public class UpdateStatusDto
{
    public string Status { get; set; }
}
