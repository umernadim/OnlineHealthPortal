namespace OnlineHealthPortal.DTOs
{
    public class CreateAppointmentDTO
    {
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }  
        public string Type { get; set; } = null!;
    }


}
