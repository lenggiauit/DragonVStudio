using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace DragonVStudio.API.Domain.Entities
{
    public partial class DragonVContext : DbContext
    {
        public static readonly ILoggerFactory loggerFactory = LoggerFactory.Create(builder => { builder.AddConsole(); }); 

        public DragonVContext(DbContextOptions<DragonVContext> dbContextOptions) : base(dbContextOptions) { }

        public virtual DbSet<Comment> Comment { get; set; }
        public virtual DbSet<Conversation> Conversation { get; set; }
        public virtual DbSet<ConversationMessage> ConversationMessage { get; set; }
        public virtual DbSet<ConversationUsers> ConversationUsers { get; set; }
        public virtual DbSet<Permission> Permission { get; set; }
        public virtual DbSet<PermissionInRole> PermissionInRole { get; set; }
        
        public virtual DbSet<Role> Role { get; set; } 
        public virtual DbSet<User> User { get; set; } 
        public virtual DbSet<Language> Language { get; set; }
        //
        public virtual DbSet<BlogPost> BlogPost { get; set; }
        public virtual DbSet<Category> Category { get; set; }
        public virtual DbSet<Tag> Tag { get; set; }
        public virtual DbSet<PostComment> PostComment { get; set; }
         
        public virtual DbSet<Notification> Notification { get; set; } 
  
        public virtual DbSet<FileSharing> FileSharing { get; set; }

        public virtual DbSet<Feedback> Feedback { get; set; }

        public virtual DbSet<Games> Games { get; set; }
        public virtual DbSet<GameItems> GameItems { get; set; }
        public virtual DbSet<UserGameItems> UserGameItems { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLoggerFactory(loggerFactory); 
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        { 
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.CommentContent).HasColumnName("Comment");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");

                
            });

            modelBuilder.Entity<Conversation>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.LastMessage).HasMaxLength(500);

                entity.Property(e => e.LastMessageDate).HasColumnType("datetime");

                entity.Property(e => e.Title).HasMaxLength(250);
            });

            modelBuilder.Entity<ConversationMessage>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.LovedByUids)
                    .HasColumnName("LovedByUIds")
                    .HasMaxLength(1000);

                entity.Property(e => e.Message).HasMaxLength(1500);

                entity.Property(e => e.SeenByUids)
                    .HasColumnName("SeenByUIds")
                    .HasMaxLength(1000);
                 
            });

            modelBuilder.Entity<ConversationUsers>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();
            });

            modelBuilder.Entity<Permission>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .HasMaxLength(50)
                    .IsFixedLength();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(250);

                entity.Property(e => e.IsActive).HasDefaultValueSql("((1))");

                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<PermissionInRole>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever(); 
               
            });
             
            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(250);

                entity.Property(e => e.IsSystemRole).HasDefaultValueSql("((0))");

                entity.Property(e => e.Name).HasMaxLength(50);
            });
             
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Address).HasMaxLength(250);

                entity.Property(e => e.Avatar).HasMaxLength(255);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Email).HasMaxLength(250);

                entity.Property(e => e.FullName).HasMaxLength(150);

                entity.Property(e => e.IsActive).HasDefaultValueSql("((1))");
                 
                entity.Property(e => e.Password).HasMaxLength(250);

                entity.Property(e => e.Phone)
                    .HasMaxLength(20)
                    .IsFixedLength();

                entity.Property(e => e.UserName).HasMaxLength(250);
 
            }); 

            modelBuilder.Entity<Language>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(100);

            });

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Comment).HasMaxLength(5000);

            });

            modelBuilder.Entity<Games>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

            });

            modelBuilder.Entity<GameItems>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

            });

            modelBuilder.Entity<UserGameItems>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

            });


            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
