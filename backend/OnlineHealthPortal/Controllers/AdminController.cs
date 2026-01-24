using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineHealthPortal.Data;
using OnlineHealthPortal.Models;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]  // Admin only!
public class AdminController : ControllerBase
{
    private readonly HealthPortalContext _context;

    public AdminController(HealthPortalContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetAdminStats()
    {
        try
        {
            var stats = new
            {
                totalUsers = await _context.Users.CountAsync(),
                totalDoctors = await _context.Doctors.CountAsync(d => d.IsApproved),
                totalPatients = await _context.Patients.CountAsync(),
                totalAppointments = await _context.Appointments.CountAsync(),
                activeAppointments = await _context.Appointments.CountAsync(a =>
                    a.Status == "Pending" || a.Status == "Confirmed"),
                pendingDoctors = await _context.Doctors.CountAsync(d => !d.IsApproved),
                totalPrescriptions = await _context.Prescriptions.CountAsync()
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AdminStats error: {ex.Message}");
            return StatusCode(500, "Server error");
        }
    }

    [HttpGet("weekly-appointments")]
    public async Task<ActionResult<List<object>>> GetWeeklyAppointments()
    {
        try
        {
            var startOfWeek = DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek);
            var weeklyData = await _context.Appointments
                .Where(a => a.CreatedAt >= startOfWeek && a.CreatedAt != null)
                .GroupBy(a => a.CreatedAt.Value.DayOfWeek)
                .Select(g => new
                {
                    day = g.Key.ToString().Substring(0, 3),
                    appointments = g.Count()
                })
                .OrderBy(x => (int)Enum.Parse(typeof(DayOfWeek), x.day, true)) // Fix ordering
                .ToListAsync();

            // Fill missing days
            var days = new[] { "Mon", "Tue", "Wed", "Thu", "Fri" };
            var result = days.Select(day => weeklyData.FirstOrDefault(w => w.day == day)
                ?? new { day, appointments = 0 }).ToList();

            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"WeeklyAppointments error: {ex.Message}");
            return Ok(new List<object>()); // Empty chart data
        }
    }

    [HttpGet("patients")]
    public async Task<ActionResult<List<object>>> GetAllPatients()
    {
        try
        {
            Console.WriteLine("🔍 Fetching patients from Users table...");
                
            // ✅ STEP 1: Get ALL users with Patient role
            var patientUsers = await _context.Users
                .Where(u => u.Role != null && u.Role.Contains("Patient"))
                .Select(u => new
                {
                    id = u.Id,
                    patientId = $"#P{u.Id:D4}",
                    name = u.FullName != null ? u.FullName :
                           (u.Email != null ? u.Email.Substring(0, u.Email.IndexOf("@")) : "N/A"),
                    email = u.Email ?? "N/A",
                    phone = u.Phone ?? "N/A",
                    status = u.IsActive ? "Active" : "Inactive",
                    role = "Patient",  
                    hasPatientProfile = _context.Patients.Any(p => p.UserId == u.Id),
                    appointmentsCount = _context.Appointments.Count(a => a.Patient.UserId == u.Id)
                })
                .OrderByDescending(u => u.id)
                .ToListAsync();

            Console.WriteLine($"✅ Found {patientUsers.Count} Patient-role users");


            if (patientUsers.Count == 0)
            {
                Console.WriteLine("⚠️ No Patient-role users found, showing all active users...");

                var fallbackUsers = await _context.Users
                    .Where(u => u.IsActive == true)
                    .Select(u => new
                    {
                        id = u.Id,
                        patientId = $"#P{u.Id:D4}",
                        name = u.FullName != null ? u.FullName :
                               (u.Email != null ? u.Email.Substring(0, u.Email.IndexOf("@")) : "N/A"),
                        email = u.Email ?? "N/A",
                        phone = u.Phone ?? "N/A",
                        status = "Active",
                        role = u.Role != null && u.Role.Contains("Patient") ? "Patient" : "User",
                        hasPatientProfile = false,
                        appointmentsCount = 0
                    })
                    .OrderByDescending(u => u.id)
                    .Take(50)
                    .ToListAsync();

                Console.WriteLine($"✅ Showing {fallbackUsers.Count} active users as patients");
                return Ok(fallbackUsers);
            }

            return Ok(patientUsers);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ ERROR: {ex.Message}");
            return Ok(new List<object>());
        }
    }


    [HttpDelete("patients/{userId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePatient(int userId)
    {
        try
        {
            Console.WriteLine($"🗑️ Admin deleting Patient UserId: {userId}");

            // ✅ Find user
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                Console.WriteLine("❌ User not found");
                return NotFound("Patient not found");
            }

            // ✅ Delete related data CASCADE
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient != null)
            {
                _context.Patients.Remove(patient);
                Console.WriteLine("✅ Deleted Patient profile");
            }

            List<Appointment> appointments = new List<Appointment>();
List<Prescription> prescriptions = new List<Prescription>();

if (patient != null)
{
    appointments = await _context.Appointments.Where(a => a.PatientId == patient.Id).ToListAsync();
    prescriptions = await _context.Prescriptions.Where(p => p.Appointment.PatientId == patient.Id).ToListAsync();
}

            if (appointments.Count > 0)
            {
                _context.Appointments.RemoveRange(appointments);
                Console.WriteLine($"✅ Deleted {appointments.Count} appointments");
            }

            if (prescriptions.Count > 0)
            {
                _context.Prescriptions.RemoveRange(prescriptions);
                Console.WriteLine($"✅ Deleted {prescriptions.Count} prescriptions");
            }

            // ✅ FINAL - Delete User account
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            Console.WriteLine($"✅ COMPLETELY DELETED Patient: {user.Email}");
            return Ok(new { message = "Patient account deleted successfully", userId });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ DeletePatient ERROR: {ex.Message}");
            return StatusCode(500, "Delete failed - contact support");
        }
    }

    [HttpGet("appointments")]
    public async Task<ActionResult<List<object>>> GetAllAppointments()
    {
        try
        {
            Console.WriteLine("🔍 Fetching all appointments...");

            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .ThenInclude(p => p.User)
                .Include(a => a.Doctor)
                .ThenInclude(d => d.User)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new
                {
                    id = a.Id,
                    patientName = a.Patient != null && a.Patient.User != null
    ? (a.Patient.User.FullName != null ? a.Patient.User.FullName : "Unknown Patient")
    : "N/A",
patientEmail = a.Patient != null && a.Patient.User != null
    ? (a.Patient.User.Email != null ? a.Patient.User.Email : "N/A")
    : "N/A",
doctorName = a.Doctor != null && a.Doctor.User != null
    ? $"Dr. {a.Doctor.User.FullName}"
    : "Unknown Doctor",
                    doctorSpeciality = a.Doctor.Speciality ?? "General",
                    appointmentDate = a.AppointmentDate.HasValue
                        ? a.AppointmentDate.Value.ToString("dd MMM yyyy")
                        : "N/A",
                    appointmentTime = a.AppointmentDate.HasValue
                        ? a.AppointmentDate.Value.ToString("HH:mm")
                        : "N/A",
                    status = a.Status ?? "Pending",
                    type = a.Type ?? "Consultation",
                    createdAt = a.CreatedAt.HasValue ? a.CreatedAt.Value.ToString("dd/MM/yyyy HH:mm") : "N/A"
                })
                .Take(100)  // Performance limit
                .ToListAsync();

            Console.WriteLine($"✅ Found {appointments.Count} appointments");
            return Ok(appointments);
        }
        catch (Exception ex)
        {

            Console.WriteLine($"❌ Appointments ERROR: {ex.Message}");
            return Ok(new List<object>());
        }
    }

    [HttpGet("doctors")]
    public async Task<ActionResult<List<object>>> GetAllDoctors()
    {
        try
        {
            Console.WriteLine("🔍 GetAllDoctors called");

            // ✅ DEBUG: Check total doctors
            var totalDoctors = await _context.Doctors.CountAsync();
            Console.WriteLine($"Total Doctors in DB: {totalDoctors}");

            var doctors = await _context.Doctors
                .Include(d => d.User)
                .OrderBy(d => d.User.FullName) // Use a property that is always available for ordering
                .ToListAsync();

            // Project to anonymous type in memory to avoid expression tree limitations
            var doctorDtos = doctors.Select(d =>
                new
                {
                    id = d.Id,
                    name = "Dr. " +
                        (!string.IsNullOrEmpty(d.User?.FullName)
                            ? d.User.FullName
                            : (!string.IsNullOrEmpty(d.User?.Email) && d.User.Email.Contains("@")
                                ? d.User.Email.Substring(0, d.User.Email.IndexOf("@"))
                                : "Doctor")),
                    speciality = d.Speciality ?? "General Medicine"
                })
                .OrderBy(d => d.name)
                .ToList();

            Console.WriteLine($"✅ Found {doctorDtos.Count} doctors");
            return Ok(doctorDtos);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ GetDoctors ERROR: {ex.Message}");
            return Ok(new List<object>());
        }
    }



}

