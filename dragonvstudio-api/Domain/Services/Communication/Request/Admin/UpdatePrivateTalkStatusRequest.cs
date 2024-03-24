using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Admin
{
    public class UpdatePrivateTalkStatusRequest
    {
        [Required]
        public Guid Id { get; set; }
        public Guid? EventBookingDateId { get; set; }
        public string Status { get; set; }
    }
}
