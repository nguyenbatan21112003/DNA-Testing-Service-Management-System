using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using DNATestSystem.BusinessObjects;
using DNATestSystem.BusinessObjects.Models;

namespace DNATestSystem.Repositories
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }


        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    //optionsBuilder.UseLazyLoadingProxies();
        //    optionsBuilder.UseSqlServer("Server=NEM\\SQLEXPRESS;Database=SWP391;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true");
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RefreshToken>()
                        .HasOne(rt => rt.User)
                        .WithMany(u => u.RefreshTokens)  // 👈 chính xác tên navigation trong User
                        .HasForeignKey(rt => rt.UserId)
                        .OnDelete(DeleteBehavior.Restrict); // hoặc Cascade nếu muốn xóa theo


            modelBuilder.Entity<RefreshToken>()
              .ToTable("RefreshToken");
            base.OnModelCreating(modelBuilder);
        }

        public int SaveChanges()
        {
            
            return base.SaveChanges();
        }

        public EntityEntry<T> Entry<T>(T entity) where T : class
        {
            return base.Entry(entity);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();
        }
    }
}

