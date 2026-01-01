using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineHealthPortal.Data;

namespace OnlineHealthPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly HealthPortalContext _context;
        public NotificationController(HealthPortalContext context)
        {
            _context = context;
        }
        [HttpGet("{userId}")]
        public IActionResult GetbyUser(int userId)
        {
            var list = _context.Notifications.Where(n => n.UserId == userId).ToList();
            return Ok(list);
        }
    }
}
