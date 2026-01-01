using System.Security.Cryptography;
using System.Text;

namespace OnlineHealthPortal.Helpers
{
    public static class PasswordHasher
    {
        public static string HashCode(string password)
        {
            var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hashedBytes = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hashedBytes);
        }
    }
}
