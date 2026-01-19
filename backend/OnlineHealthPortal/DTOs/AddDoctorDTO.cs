namespace OnlineHealthPortal.DTOs
{
    public class AddDoctorDTO
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Speciality { get; set; } = null!;
        public int ExperienceYears { get; set; }
        public decimal ConsultationFee { get; set; }
        public string? Language { get; set; }
        public string? Availability { get; set; }
    }

}
