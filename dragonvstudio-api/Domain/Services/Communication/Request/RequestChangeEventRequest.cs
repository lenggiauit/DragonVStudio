using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request
{
    public class RequestChangeEventRequest
    {
        [Required]
        public Guid EventId { get; set; }
        public Guid? EventBookingDateId { get; set; }
        [Required]
        public string Reason { get; set; }
    }
}
