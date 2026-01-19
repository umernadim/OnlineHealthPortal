using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineHealthPortal.Data;
using OnlineHealthPortal.DTOs;
using OnlineHealthPortal.Helpers;
using OnlineHealthPortal.Models;
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
                    photo = d.User.ProfilePhoto ?? "default-avatar.jpg",
                    speciality = d.Speciality,
                    experienceYears = d.ExperienceYears,
                    consultationFee = d.ConsultationFee,
                    rating = d.Rating ?? 0,
                    language = d.Language,
                    availability = d.Availability
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
                    photo = d.User.ProfilePhoto ?? "default-avatar.jpg",
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

        /// <summary>
        /// Get all doctors for admin (Admin only)
        /// </summary>
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
    }
}

