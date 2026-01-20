namespace OnlineHealthPortal.DTOs
{
    public class DoctorProfileDTO
    {
        public int id { get; set; }
        public string fullName { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string photo { get; set; }
        public string speciality { get; set; }
        public int experienceYears { get; set; }
        public decimal consultationFee { get; set; }
        public string language { get; set; }
        public string availability { get; set; }
        public bool isApproved { get; set; }
    }
}
