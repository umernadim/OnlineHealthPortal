using OnlineHealthPortal.Data;
using OnlineHealthPortal.Models;

namespace OnlineHealthPortal.Services
{
    public class NotificationService
    {
        private readonly HealthPortalContext _context;
        public NotificationService(HealthPortalContext context)
        {
            _context = context;
        }
        public void Create(int userId, string message)
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                IsRead = false
            };
            _context.Notifications.Add(notification);
            _context.SaveChanges();
        }
    }
}
