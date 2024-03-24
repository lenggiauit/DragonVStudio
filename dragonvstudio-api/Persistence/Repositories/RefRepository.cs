using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Models;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services.Communication.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Persistence.Repositories
{
    public class RefRepository : BaseRepository, IRefRepository
    {
        private readonly ILogger<RefRepository> _logger;
        public RefRepository(DragonVContext context, ILogger<RefRepository> logger) : base(context)
        {
            _logger = logger;
        }
         
        
    }
}
