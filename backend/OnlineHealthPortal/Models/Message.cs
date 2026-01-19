using System;
using System.Collections.Generic;

namespace OnlineHealthPortal.Models;

public partial class Message
{
    public int Id { get; set; }

    public int SenderId { get; set; }

    public int ReceiverId { get; set; }

    public string? MessageText { get; set; }

    public string? FilePath { get; set; }

    public DateTime Timestamp { get; set; }

    public bool IsRead { get; set; }
}
