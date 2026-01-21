using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineHealthPortal.Data;
using OnlineHealthPortal.DTOs;
using System.Security.Claims;

namespace OnlineHealthPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Patient")]
    public class PatientController : ControllerBase
    {
        private readonly HealthPortalContext _context;

        public PatientController(HealthPortalContext context)
        {
            _context = context;
        }

        // 🔹 GET LOGGED-IN PATIENT PROFILE
        [HttpGet("profile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var patient = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return NotFound("Patient not found");

            return Ok(new
            {
                id = patient.Id,
                email = patient.User.Email,
                fullName = patient.User.FullName,
                dateOfBirth = patient.DateOfBirth, 
                phone = patient.User.Phone,
                gender = patient.Gender
            });
        }

        // 🔹 UPDATE PROFILE
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdatePatientDTO dto)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var patient = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return NotFound("Patient not found");

            patient.User.FullName = dto.FullName ?? patient.User.FullName;
            patient.User.Phone = dto.Phone ?? patient.User.Phone;

            patient.Gender = dto.Gender ?? patient.Gender;
            patient.DateOfBirth = dto.DateOfBirth ?? patient.DateOfBirth;

            await _context.SaveChangesAsync();

            return Ok("Profile updated successfully");
        }

    }
}

