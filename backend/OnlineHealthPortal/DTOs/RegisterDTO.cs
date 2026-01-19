namespace OnlineHealthPortal.DTOs
{
    public class RegisterDTO
    {
        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PasswordHash { get; set; } = null!;

        public string Role { get; set; } = null!;

        public string? Phone { get; set; }
    }
}
