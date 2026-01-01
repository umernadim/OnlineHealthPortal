using System;
using System.Collections.Generic;

namespace OnlineHealthPortal.Models;

public partial class HealthRecord
{
    public int Id { get; set; }

    public int? PatientId { get; set; }

    public string? RecordType { get; set; }

    public string? FilePath { get; set; }

    public DateTime? UploadedAt { get; set; }

    public virtual Patient? Patient { get; set; }
}
