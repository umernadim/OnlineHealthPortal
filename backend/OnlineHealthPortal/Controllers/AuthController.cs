using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
        public AuthController(HealthPortalContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.FullName == user.FullName);
            if (existingUser != null)
            {
                return BadRequest("User Already Exist");
            }

            var hashedPassword = PasswordHasher.HashCode(user.PasswordHash);
            user.PasswordHash = hashedPassword;

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
    }
}
