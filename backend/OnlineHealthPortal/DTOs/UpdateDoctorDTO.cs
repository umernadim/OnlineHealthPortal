namespace OnlineHealthPortal.DTOs
{
    public class UpdateDoctorDTO
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Speciality { get; set; }
        public int? ExperienceYears { get; set; }
        public decimal? ConsultationFee { get; set; }
        public string? Language { get; set; }
        public string? Availability { get; set; }
    }
}
