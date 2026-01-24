using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineHealthPortal.Data;
using OnlineHealthPortal.Models;
using OnlineHealthPortal.Services;
using System.Security.Claims;

namespace OnlineHealthPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // ✅ Any logged-in user
    public class PrescriptionController : ControllerBase
    {
        private readonly HealthPortalContext _context;
        private readonly NotificationService _notificationService;

        public PrescriptionController(
            HealthPortalContext context,
            NotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        // =====================================================
        // 🧑‍⚕️ DOCTOR → CREATE PRESCRIPTION
        // =====================================================
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CreatePrescription([FromBody] Prescription prescription)
        {
            var doctorUserId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == prescription.AppointmentId);

            if (appointment == null)
                return BadRequest("Invalid appointment");

            // 🔐 Doctor ownership
            if (appointment.Doctor.UserId != doctorUserId)
                return Forbid("Not your appointment");

            // 🔐 Appointment must be completed
            if (appointment.Status != "Completed")
                return BadRequest("Appointment must be completed first");

            // 🔐 Prevent duplicate prescription
            bool alreadyExists = await _context.Prescriptions
                .AnyAsync(p => p.AppointmentId == appointment.Id);

            if (alreadyExists)
                return BadRequest("Prescription already exists");

            var newPrescription = new Prescription
            {
                AppointmentId = appointment.Id,
                Medicines = prescription.Medicines,
                DosageInstructions = prescription.DosageInstructions,
                Notes = prescription.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.Prescriptions.Add(newPrescription);

            // Mark appointment as prescribed
            appointment.HasPrescription = true;

            await _context.SaveChangesAsync();

            // 🔔 Notify patient
            if (appointment.Patient?.UserId != null)
            {
                _notificationService.Create(
                    appointment.Patient.UserId.Value,
                    "Your prescription has been added by the doctor"
                );
            }

            return Ok(new
            {
                message = "Prescription created successfully",
                prescriptionId = newPrescription.Id
            });
        }

        // =====================================================
        // 🧑‍🦰 PATIENT → VIEW PRESCRIPTIONS
        // =====================================================
        [HttpGet("patient")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<IEnumerable<object>>> GetPatientPrescriptions()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return NotFound("Patient profile not found");

            var prescriptions = await _context.Prescriptions
                .Where(p =>
                    _context.Appointments.Any(a =>
                        a.Id == p.AppointmentId &&
                        a.PatientId == patient.Id
                    )
                )
                .Include(p => p.Appointment)
                    .ThenInclude(a => a.Doctor)
                        .ThenInclude(d => d.User)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    id = p.Id,
                    doctorName = p.Appointment.Doctor.User.FullName,
                    appointmentDate = p.Appointment.AppointmentDate,
                    medicines = p.Medicines,
                    dosageInstructions = p.DosageInstructions,
                    notes = p.Notes,
                    createdAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(prescriptions);
        }
    }
}
