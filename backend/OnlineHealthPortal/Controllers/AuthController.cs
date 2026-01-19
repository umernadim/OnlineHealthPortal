using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineHealthPortal.Data;
using OnlineHealthPortal.DTOs;
using OnlineHealthPortal.Helpers;
using OnlineHealthPortal.Models;
using OnlineHealthPortal.Services;

namespace OnlineHealthPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly HealthPortalContext _context;
        private readonly TokenService _tokenService;
        private readonly EmailService _emailService;
        public AuthController(HealthPortalContext context, TokenService tokenService, EmailService emailService)
        {
            _context = context;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            if (_context.Users.Any(u => u.Email == dto.Email))
                return BadRequest("Email already registered");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,           // ✅ Save phone
                PasswordHash = PasswordHasher.HashCode(dto.PasswordHash),
                Role = "Patient",            // ✅ Fixed
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var patient = new Patient
            {
                UserId = user.Id,
                Phone = dto.Phone  
            };
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Patient registered successfully" });
        }


        [HttpPost("login")]
        public IActionResult Login(LoginDTO dto)
        {
            var isUser = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (isUser == null)
                return Unauthorized("User Not Found");

            if (isUser.PasswordHash != PasswordHasher.HashCode(dto.PasswordHash))
                return Unauthorized("Invalid Password");

            var token = _tokenService.GenerateToken(isUser);

            return Ok(new
            {
                Token = token,
                Role = isUser.Role,  
                UserId = isUser.Id,
                Email = isUser.Email
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDTO dto)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
                if (user == null) return BadRequest("Email not found");

                var resetCode = new PasswordResetCode
                {
                    Email = dto.Email,
                    Code = new Random().Next(100000, 999999).ToString(),
                    Expiry = DateTime.Now.AddMinutes(10)
                };

                _context.PasswordResetCodes.Add(resetCode);
                await _context.SaveChangesAsync();

                // 👇 YAHAN EMAIL SEND KARO
                await _emailService.SendAsync(
                    dto.Email,
                    "Your Reset Code",
                    $"Your code is: {resetCode.Code}"
                );

                return Ok("Reset code sent to your email.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("verify-code")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyCodeDto dto)
        {
            var record = await _context.PasswordResetCodes
                .FirstOrDefaultAsync(x => x.Email == dto.Email && x.Code == dto.Code);

            if (record == null)
                return BadRequest("Invalid or expired code");

            if (record.Expiry < DateTime.UtcNow)
                return BadRequest("Code expired");

            return Ok();
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword(ResetPasswordDTO dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null) return BadRequest("User not found");

            user.PasswordHash = PasswordHasher.HashCode(dto.NewPassword);
            _context.SaveChanges();

            return Ok("Password updated successfully");
        }

        [HttpPost("resend-code")]
        public IActionResult ResendCode(ForgotPasswordDTO dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null) return BadRequest("Email not found");

            // delete old codes
            var oldCodes = _context.PasswordResetCodes.Where(x => x.Email == dto.Email);
            _context.PasswordResetCodes.RemoveRange(oldCodes);

            var newCode = new Random().Next(100000, 999999).ToString();

            _context.PasswordResetCodes.Add(new PasswordResetCode
            {
                Email = dto.Email,
                Code = newCode,
                Expiry = DateTime.Now.AddMinutes(10)
            });

            _context.SaveChanges();

            _emailService.SendAsync(dto.Email, "Your New Reset Code", $"Your new code is: {newCode}");

            return Ok("New code sent");
        }
    }
}
