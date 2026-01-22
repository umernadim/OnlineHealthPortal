using System;
using System.Collections.Generic;

namespace OnlineHealthPortal.Models;

public partial class HealthRecord
{
    public int Id { get; set; }

    public int PatientId { get; set; }

    public string RecordType { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public DateTime UploadedAt { get; set; }

    public string FileName { get; set; } = null!;

    public DateTime? RecordDate { get; set; }

    public string? Notes { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public virtual Patient Patient { get; set; } = null!;
}
