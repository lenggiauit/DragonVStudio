using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Admin
{
    public class GetMockInterviewIdByEventBookingDateRequest
    {
        [Required]
        public Guid EventBookingDateId { get; set; }
    }
}
