using Microsoft.EntityFrameworkCore;
using DNATestSystem.BusinessObjects.Entities;
using DNATestSystem.BusinessObjects.Models;

namespace DNATestSystem.Repositories
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public int SaveChanges();
        public Task<int> SaveChangesAsync();

    }
}
