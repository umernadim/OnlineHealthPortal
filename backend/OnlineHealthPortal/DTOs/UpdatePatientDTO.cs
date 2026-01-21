namespace OnlineHealthPortal.DTOs
{
    public class UpdatePatientDTO
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public DateOnly? DateOfBirth { get; set; }
    }

}
