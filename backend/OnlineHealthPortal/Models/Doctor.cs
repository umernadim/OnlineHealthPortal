using System;
using System.Collections.Generic;

namespace OnlineHealthPortal.Models;

public partial class Doctor
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string? Speciality { get; set; }

    public int? ExperienceYears { get; set; }

    public string? Language { get; set; }

    public decimal? Rating { get; set; }

    public decimal ConsultationFee { get; set; }

    public string? Availability { get; set; }

    public bool IsApproved { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual User? User { get; set; }
}
