using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Services.Communication.Request.Admin
{
    public class GetPrivateTalkIdByEventBookingDateRequest
    {
        [Required]
        public Guid EventBookingDateId { get; set; }
    }
}
