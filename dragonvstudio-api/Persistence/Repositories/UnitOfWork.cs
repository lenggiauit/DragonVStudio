using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DragonVContext _context;
        public UnitOfWork(DragonVContext context)
        {
            _context = context;
        }
        public async Task CompleteAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}