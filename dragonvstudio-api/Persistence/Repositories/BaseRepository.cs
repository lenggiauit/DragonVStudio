using DragonVStudio.API.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Persistence.Repositories
{
    public abstract class BaseRepository
    {
        protected readonly DragonVContext _context;

        protected BaseRepository(DragonVContext context)
        {
            _context = context;
        }
    }
}