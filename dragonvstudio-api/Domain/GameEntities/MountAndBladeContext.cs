using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DragonVStudio.API.Domain.GameEntities
{
    public partial class MountAndBladeContext : DbContext
    {
        public static readonly ILoggerFactory loggerFactory = LoggerFactory.Create(builder => { builder.AddConsole(); });

        public MountAndBladeContext(DbContextOptions<MountAndBladeContext> dbContextOptions) : base(dbContextOptions) { }

        public virtual DbSet<Player> Players { get; set; }
        public virtual DbSet<Faction> Factions { get; set; }
        public virtual DbSet<Log> Logs { get; set; } 
        public virtual DbSet<BanRecords> BanRecords { get; set; }

        public virtual DbSet<PersonalProperties> PersonalProperties { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLoggerFactory(loggerFactory);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            OnModelCreatingPartial(modelBuilder);
        }
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
