using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineHealthPortal.Data;
using OnlineHealthPortal.Models;

namespace OnlineHealthPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        public readonly HealthPortalContext _context;
        public PatientController(HealthPortalContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetPatients()
        {
            return Ok(_context.Patients.ToList());
        }

        [HttpGet("id")]
        public IActionResult GetPatientById(int id)
        {
            var patient = _context.Patients.Find(id);
            if(patient == null)
            {
                return NotFound("Patient Not Found");
            }
            return Ok("Patient fetched successfully.");
        }

        [HttpPost]
        public IActionResult AddPatient(Patient patient)
        {
            _context.Patients.Add(patient);
            _context.SaveChanges();
            return Ok("Patient Added Successfully");
        }
    }
}
