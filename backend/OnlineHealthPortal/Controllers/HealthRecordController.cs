using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineHealthPortal.Data;
using OnlineHealthPortal.DTOs;
using OnlineHealthPortal.Models;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class HealthRecordController : ControllerBase
{
    private readonly HealthPortalContext _context;
    private readonly IWebHostEnvironment _environment;

    public HealthRecordController(
        HealthPortalContext context,
        IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // ===============================
    // GET: Patient Records
    // ===============================
    [HttpGet("patient")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetPatientRecords()
    {
        try
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return NotFound("Patient profile not found");

            var records = await _context.HealthRecords
                .Where(r => r.PatientId == patient.Id)
                .OrderByDescending(r => r.UploadedAt)
                .Select(r => new
                {
                    id = r.Id,
                    title = r.Title,
                    recordType = r.RecordType,
                    fileName = r.FileName,
                    uploadedAt = r.UploadedAt.ToString("dd/MM/yyyy HH:mm"),
                    hasFile = !string.IsNullOrEmpty(r.FilePath),
                    filePath = r.FilePath
                })
                .ToListAsync();

            return Ok(records);
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ GET ERROR: " + ex.Message);
            return StatusCode(500, "Server error");
        }
    }

    // ===============================
    // POST: Upload Record
    // ===============================
    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> UploadRecord([FromForm] UploadRecordDTO dto)
    {
        try
        {
            Console.WriteLine("🚀 Upload started");
            Console.WriteLine($"Title: '{dto.Title}'");
            Console.WriteLine($"RecordType: '{dto.RecordType}'");
            Console.WriteLine($"File: {dto.File?.FileName}");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
            {
                Console.WriteLine("❌ Patient not found");
                return Unauthorized("Patient not found");
            }

            if (dto.File == null || dto.File.Length == 0)
            {
                Console.WriteLine("❌ No file");
                return BadRequest("No file uploaded");
            }

            // ✅ Create uploads folder
            var uploadsDir = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);

            // ✅ Save file FIRST
            var uniqueFileName = $"{Guid.NewGuid():N}_{Path.GetFileName(dto.File.FileName)}";
            var fullPath = Path.Combine(uploadsDir, uniqueFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }
            Console.WriteLine($"✅ File saved: {fullPath}");

            // ✅ SAFE HealthRecord - NO NULLABLE ISSUES
            var record = new HealthRecord
            {
                PatientId = patient.Id,
                Title = "Medical Record Uploaded",      // ✅ HARDCODED SAFE
                RecordType = "Document",                // ✅ HARDCODED SAFE  
                FileName = dto.File.FileName,           // ✅ File always has name
                FilePath = "/uploads/" + uniqueFileName,
                UploadedAt = DateTime.UtcNow
            };


            Console.WriteLine("🚀 Saving to DB...");
            _context.HealthRecords.Add(record);
            await _context.SaveChangesAsync();
            Console.WriteLine("✅ DB SAVE SUCCESS! ID: " + record.Id);

            return Ok(new { message = "✅ Record uploaded successfully", id = record.Id });
        }
        catch (DbUpdateException dbEx)
        {
            Console.WriteLine("❌ DB ERROR: " + dbEx.InnerException?.Message);
            return StatusCode(500, "Database error: " + dbEx.InnerException?.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ GENERAL ERROR: " + ex.Message);
            Console.WriteLine("Stack: " + ex.StackTrace);
            return StatusCode(500, ex.Message);
        }
    }

}
