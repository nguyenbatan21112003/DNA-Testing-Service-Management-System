using Microsoft.EntityFrameworkCore;
using DNATestSystem.BusinessObjects.Entiry;

namespace SWP391.Interceptor
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; set; }
        public int SaveChanges();
        public Task<int> SaveChangesAsync();

    }
}
