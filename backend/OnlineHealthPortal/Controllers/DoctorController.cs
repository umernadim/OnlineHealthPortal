using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineHealthPortal.Data;
using OnlineHealthPortal.DTOs;
using OnlineHealthPortal.Helpers;
using OnlineHealthPortal.Models;
using System.IO;
using System.Security.Claims;

namespace OnlineHealthPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly HealthPortalContext _context;
        private readonly ILogger<DoctorController> _logger;

        public DoctorController(HealthPortalContext context, ILogger<DoctorController> logger)
        {
            _context = context;
            _logger = logger;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetDoctor(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .Where(d => d.Id == id && d.IsApproved == true)
                .Select(d => new
                {
                    id = d.Id,
                    fullName = d.User.FullName,
                    email = d.User.Email,
                    phone = d.User.Phone,
                    photo = d.User.ProfilePhoto != null
    ? $"{Request.Scheme}://{Request.Host}/{d.User.ProfilePhoto}"
    : $"{Request.Scheme}://{Request.Host}/images/default-avatar.jpg",
    bio = d.Bio,
                    speciality = d.Speciality,
                    experienceYears = d.ExperienceYears,
                    consultationFee = d.ConsultationFee,
                    rating = d.Rating ?? 0,
                    language = d.Language,
                    availability = d.Availability,
                    patientsTreated = _context.Appointments
            .Where(a => a.DoctorId == d.Id && a.Status == "Completed")
            .Select(a => a.PatientId)
            .Distinct()
            .Count()
                })
                .FirstOrDefaultAsync();

            if (doctor == null) return NotFound("Doctor not found");
            return Ok(doctor);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDoctors(
            [FromQuery] string? specialty = null,
            [FromQuery] decimal? minRating = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            var doctors = _context.Doctors
                .Include(d => d.User)
                .Where(d => d.IsApproved == true)
                .Select(d => new
                {
                    id = d.Id,
                    fullName = d.User.FullName ?? "Dr. Specialist",
                    speciality = d.Speciality ?? "General Physician",
                    experienceYears = d.ExperienceYears ?? 0,
                    rating = d.Rating ?? 0,
                    phone = d.User.Phone ?? "",
                    photo = d.User.ProfilePhoto != null
    ? $"{Request.Scheme}://{Request.Host}/{d.User.ProfilePhoto}"
    : $"{Request.Scheme}://{Request.Host}/images/default-avatar.jpg",

                    consultationFee = d.ConsultationFee
                });

            // Filters
            if (!string.IsNullOrEmpty(specialty))
                doctors = doctors.Where(d => d.speciality.Contains(specialty, StringComparison.OrdinalIgnoreCase));

            if (minRating.HasValue)
                doctors = doctors.Where(d => d.rating >= minRating.Value);

            // Pagination
            var total = await doctors.CountAsync();
            var result = await doctors
                .OrderByDescending(d => d.rating)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { doctors = result, total, page, pageSize });
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<object>>> GetDoctorsAdmin(
            [FromQuery] string? specialty = null,
            [FromQuery] bool? isApproved = null)
        {
            var doctors = _context.Doctors
                .Include(d => d.User)
                .Select(d => new
                {
                    id = d.Id,
                    fullName = d.User.FullName,
                    email = d.User.Email,
                    phone = d.User.Phone,
                    photo = d.User.ProfilePhoto,
                    speciality = d.Speciality,
                    experienceYears = d.ExperienceYears,
                    consultationFee = d.ConsultationFee,
                    isApproved = d.IsApproved,
                    status = d.IsApproved ? "Approved" : "Pending",
                    rating = d.Rating ?? 0
                });

            if (!string.IsNullOrEmpty(specialty))
                doctors = doctors.Where(d => d.speciality.Contains(specialty));

            if (isApproved.HasValue)
                doctors = doctors.Where(d => d.isApproved == isApproved.Value);

            var result = await doctors.OrderByDescending(d => d.isApproved).ToListAsync();
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AddDoctor([FromBody] AddDoctorDTO dto)
        {
            try
            {
                // Email duplicate check
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                    return BadRequest("Email already registered");

                // Create User account
                var user = new User
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    PasswordHash = PasswordHasher.HashCode(dto.Password),
                    Role = "Doctor",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create Doctor profile
                var doctor = new Doctor
                {
                    UserId = user.Id,
                    Speciality = dto.Speciality,
                    ExperienceYears = dto.ExperienceYears,
                    ConsultationFee = dto.ConsultationFee,
                    Language = dto.Language,
                    Availability = dto.Availability,
                    IsApproved = false,
                    Rating = 0
                };

                _context.Doctors.Add(doctor);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Doctor added by Admin: {Email}", dto.Email);
                return Ok(new
                {
                    message = "Doctor added successfully (Pending Approval)",
                    doctorId = doctor.Id
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding doctor: {Email}", dto.Email);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDTO dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound("Doctor not found");

            doctor.IsApproved = dto.IsApproved;
            await _context.SaveChangesAsync();

            var status = dto.IsApproved ? "Approved" : "Pending";
            _logger.LogInformation("Doctor {Id} status changed to {Status}", id, status);

            return Ok(new { message = $"Doctor {status} successfully" });
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound("Doctor not found");

            // Soft delete - just deactivate
            var user = await _context.Users.FindAsync(doctor.UserId);
            if (user != null)
            {
                user.IsActive = false;
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Doctor deactivated successfully" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult> UpdateDoctor(int id, [FromBody] UpdateDoctorDTO dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound();

            var user = await _context.Users.FindAsync(doctor.UserId);
            if (user == null) return NotFound();

            // Update fields
            user.FullName = dto.FullName ?? user.FullName;
            user.Phone = dto.Phone ?? user.Phone;

            doctor.Speciality = dto.Speciality ?? doctor.Speciality;
            doctor.ExperienceYears = dto.ExperienceYears ?? doctor.ExperienceYears;
            doctor.ConsultationFee = dto.ConsultationFee ?? doctor.ConsultationFee;
            doctor.Language = dto.Language ?? doctor.Language;
            doctor.Availability = dto.Availability ?? doctor.Availability;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Doctor updated successfully" });
        }

        [HttpGet("profile")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<object>> GetDoctor()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var doctor = await _context.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null) return NotFound();

            var photoUrl = doctor.User.ProfilePhoto != null
                ? $"https://localhost:7224/{doctor.User.ProfilePhoto}"
                : "/images/default-avatar.jpg";

            var documentUrl = doctor.UploadDocument != null
                ? $"https://localhost:7224/{doctor.UploadDocument}"
                : null;

            return Ok(new
            {
                id = doctor.Id,
                fullName = doctor.User.FullName,
                email = doctor.User.Email,
                phone = doctor.User.Phone,
                photo = photoUrl,
                speciality = doctor.Speciality,
                experienceYears = doctor.ExperienceYears,
                consultationFee = doctor.ConsultationFee,
                language = doctor.Language,
                availability = doctor.Availability,
                document = documentUrl,  // ✅ Single document URL
                isApproved = doctor.IsApproved
            });
        }


        [HttpPost("profile/photo")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult> UploadProfilePhoto(IFormFile photo)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            if (photo == null || photo.Length == 0)
                return BadRequest("No file uploaded");

            if (!photo.ContentType.StartsWith("image/"))
                return BadRequest("Only image files allowed");

            if (photo.Length > 5 * 1024 * 1024)
                return BadRequest("File too large (max 5MB)");

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/profiles");
            Directory.CreateDirectory(uploadsPath);

            var fileName = $"{userId}_{Guid.NewGuid()}_{Path.GetFileName(photo.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await photo.CopyToAsync(stream);
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            user.ProfilePhoto = $"uploads/profiles/{fileName}";
            await _context.SaveChangesAsync();

            var fullPhotoUrl = $"{Request.Scheme}://{Request.Host}/{user.ProfilePhoto}";

            return Ok(new
            {
                message = "Profile photo updated!",
                photoUrl = fullPhotoUrl
            });
        }
        [HttpPut("profile/availability")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult> UpdateAvailability([FromBody] UpdateAvailabilityDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null) return NotFound();

            doctor.Availability = dto.availability;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Availability updated!" });
        }

        [HttpPost("documents")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult> UploadDoctorDocument(IFormFile file)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null) return NotFound("Doctor not found");
            if (file == null || file.Length == 0) return BadRequest("No file");

            // VALIDATE FILE
            if (!new[] { "image/jpeg", "image/png", "application/pdf" }.Contains(file.ContentType))
                return BadRequest("Only JPG, PNG, PDF allowed");
            if (file.Length > 5 * 1024 * 1024) return BadRequest("Max 5MB");

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/doctors");
            Directory.CreateDirectory(uploadsPath);

            if (!string.IsNullOrEmpty(doctor.UploadDocument))
            {
                var oldFilePath = Path.Combine(uploadsPath, doctor.UploadDocument.Replace("uploads/doctors/", ""));
                if (System.IO.File.Exists(oldFilePath))
                    System.IO.File.Delete(oldFilePath);
            }

            var fileName = $"document_{doctor.Id}_{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            doctor.UploadDocument = $"uploads/doctors/{fileName}";

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Document replaced successfully!",
                path = $"https://localhost:7224/{doctor.UploadDocument}"
            });
        }

        [HttpGet("patients")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<IEnumerable<object>>> GetMyPatients()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);

                if (doctor == null) return NotFound("Doctor not found");

                // ✅ FIXED: REAL APPOINTMENT DATES!
                var patients = await _context.Patients
                    .Where(p => _context.Appointments.Any(a =>
                        a.PatientId == p.Id && a.DoctorId == doctor.Id))
                    .Select(p => new
                    {
                        id = p.Id,
                        fullName = p.User.FullName,

                        // ✅ LAST VISIT: Actual last appointment date
                        lastVisit = _context.Appointments
                            .Where(a => a.PatientId == p.Id && a.DoctorId == doctor.Id)
                            .OrderByDescending(a => a.AppointmentDate)
                            .Select(a => a.AppointmentDate)
                            .FirstOrDefault() != null
        ? _context.Appointments
            .Where(a => a.PatientId == p.Id && a.DoctorId == doctor.Id)
            .OrderByDescending(a => a.AppointmentDate)
            .Select(a => a.AppointmentDate)
            .FirstOrDefault()!.Value.ToString("dd MMM yyyy")
        : "No visit",

                        // ✅ NEXT APPOINTMENT: Future appointments
                        nextAppointment = _context.Appointments
                            .Where(a => a.PatientId == p.Id && a.DoctorId == doctor.Id
                                       && a.AppointmentDate > DateTime.Now
                                       && (a.Status == "Scheduled" || a.Status == "Confirmed"))
                            .OrderBy(a => a.AppointmentDate)
                            .Select(a => a.AppointmentDate)
                            .FirstOrDefault() != null
        ? _context.Appointments
            .Where(a => a.PatientId == p.Id && a.DoctorId == doctor.Id
                        && a.AppointmentDate > DateTime.Now
                        && (a.Status == "Scheduled" || a.Status == "Confirmed"))
            .OrderBy(a => a.AppointmentDate)
            .Select(a => a.AppointmentDate)
            .FirstOrDefault()!.Value.ToString("dd MMM yyyy")
        : "None scheduled",

                        status = "active",
                        recordCount = _context.HealthRecords.Count(h => h.PatientId == p.Id)
                    })
                    .OrderByDescending(p => p.recordCount)
                    .Take(20)
                    .ToListAsync();

                return Ok(patients);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetPatients error: {ex.Message}");
                return StatusCode(500, "Server error");
            }
        }


    }
}

