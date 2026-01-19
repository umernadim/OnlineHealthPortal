using System;
using System.Collections.Generic;

namespace OnlineHealthPortal.Models;

public partial class Prescription
{
    public int Id { get; set; }

    public int? AppointmentId { get; set; }

    public string? Medicines { get; set; }

    public string? Notes { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? DosageInstructions { get; set; }

    public virtual Appointment? Appointment { get; set; }
}
