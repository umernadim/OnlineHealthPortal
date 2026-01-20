namespace OnlineHealthPortal.DTOs
{
    public class UpdateDoctorProfileDTO
    {
        public string? fullName { get; set; }
        public string? phone { get; set; }
        public string? speciality { get; set; }
        public int? experienceYears { get; set; }
        public decimal? consultationFee { get; set; }
        public string? language { get; set; }
        public string? availability { get; set; }
    }
}
