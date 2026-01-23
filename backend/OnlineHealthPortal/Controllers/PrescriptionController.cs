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
    [Authorize(Roles = "Doctor")]
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

        [HttpPost]
        public async Task<IActionResult> CreatePrescription(Prescription prescription)
        {
            // 🔐 Logged-in doctor id
            var doctorUserId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            // 🔎 Appointment fetch with validation
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == prescription.AppointmentId);

            if (appointment == null)
                return BadRequest("Invalid appointment");

            // 🔐 Doctor ownership check
            if (appointment.Doctor.UserId != doctorUserId)
                return Forbid("You are not allowed to write prescription for this appointment");

            // 🔐 Status check
            if (appointment.Status != "Completed")
                return BadRequest("Prescription allowed only after appointment is completed");

            // 🔐 Prevent duplicate prescription
            var alreadyExists = await _context.Prescriptions
                .AnyAsync(p => p.AppointmentId == appointment.Id);

            if (alreadyExists)
                return BadRequest("Prescription already exists for this appointment");

            // ✅ Create prescription
            var newPrescription = new Prescription
            {
                AppointmentId = appointment.Id,
                Medicines = prescription.Medicines,
                DosageInstructions = prescription.DosageInstructions,
                Notes = prescription.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.Prescriptions.Add(newPrescription);

            // Optional: mark appointment as prescribed
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
    }
}
