using Microsoft.AspNetCore.Mvc;
using OnlineHealthPortal.Data;
using OnlineHealthPortal.Models;
using OnlineHealthPortal.Services;

[Route("api/[controller]")]
[ApiController]
public class AppointmentController : ControllerBase
{
    private readonly HealthPortalContext _context;
    private readonly NotificationService _notificationService;

    public AppointmentController(HealthPortalContext context, NotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    [HttpPost]
    public IActionResult CreateAppointment(Appointment appointment)
    {
        _context.Appointments.Add(appointment);
        _context.SaveChanges();

        var doctor = _context.Doctors.Find(appointment.DoctorId);
        var patient = _context.Patients.Find(appointment.PatientId);

        if (doctor?.UserId != null)
        {
            _notificationService.Create(doctor.UserId.Value, "New appointment request received.");
        }

        if (patient?.UserId != null)
        {
            _notificationService.Create(patient.UserId.Value, "Your appointment has been booked.");
        }

        return Ok("Appointment created and notifications sent.");
    }

    [HttpGet("patient/{id}")]
    public IActionResult GetByPatient(int id)
    {
        var list = _context.Appointments.Where(a => a.PatientId == id).ToList();
        return Ok(list);
    }
}
