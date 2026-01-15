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
        public IActionResult Register(RegisterDTO dto)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.FullName == dto.FullName);
            if (existingUser != null)
            {
                return BadRequest("User Already Exist");
            }

            var hashedPassword = PasswordHasher.HashCode(dto.PasswordHash);
            dto.PasswordHash = hashedPassword;
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = hashedPassword,
                Role = dto.Role
            };

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok("User registered successfully.");
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDTO dto)
        {
            var isUser = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (isUser == null)
            {
                return Unauthorized("User Not Found");
            }
            if(isUser.PasswordHash != PasswordHasher.HashCode(dto.PasswordHash))
            {
                return Unauthorized("Invalid Password");
            }
            var token = _tokenService.GenerateToken(isUser);
            return Ok(new { Token = token });
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




    }
}
