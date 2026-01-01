using System;
using System.Collections.Generic;

namespace OnlineHealthPortal.Models;

public partial class Patient
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string? Gender { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Phone { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<HealthRecord> HealthRecords { get; set; } = new List<HealthRecord>();

    public virtual User? User { get; set; }
}
