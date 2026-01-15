using System;
using System.Collections.Generic;

namespace OnlineHealthPortal.Models;

public partial class PasswordResetCode
{
    public int Id { get; set; }

    public string? Email { get; set; }

    public string? Code { get; set; }

    public DateTime? Expiry { get; set; }
}
