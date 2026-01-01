using Microsoft.AspNetCore.Mvc;
using OnlineHealthPortal.Data;
using OnlineHealthPortal.Models;
using OnlineHealthPortal.Services;

namespace OnlineHealthPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        private readonly HealthPortalContext _context;
        private readonly NotificationService _notificationService;

        public PrescriptionController(HealthPortalContext context, NotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [HttpPost]
        public IActionResult CreatePrescription(Prescription prescription)
        {
            _context.Prescriptions.Add(prescription);
            _context.SaveChanges();

            var appointment = _context.Appointments.Find(prescription.AppointmentId);
            if (appointment == null) return BadRequest("Invalid appointment.");

            var patient = _context.Patients.Find(appointment.PatientId);
            if (patient?.UserId != null)
            {
                _notificationService.Create(patient.UserId.Value, "New prescription has been added");
            }

            return Ok("Prescription added and patient notified.");
        }
    }
}
