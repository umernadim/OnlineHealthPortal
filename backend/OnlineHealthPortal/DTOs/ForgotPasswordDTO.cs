namespace OnlineHealthPortal.DTOs
{
    public class ForgotPasswordDTO
    {
        public string Email { get; set; }
    }

    public class VerifyCodeDto
    {
        public string Email { get; set; }
        public string Code { get; set; }
    }


    public class ResetPasswordDTO
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
    }

}
