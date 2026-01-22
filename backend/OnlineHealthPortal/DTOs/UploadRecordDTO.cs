namespace OnlineHealthPortal.DTOs
{
    public class UploadRecordDTO
    {
        public string Title { get; set; }
        public string RecordType { get; set; }
        public IFormFile File { get; set; }

    }


}
