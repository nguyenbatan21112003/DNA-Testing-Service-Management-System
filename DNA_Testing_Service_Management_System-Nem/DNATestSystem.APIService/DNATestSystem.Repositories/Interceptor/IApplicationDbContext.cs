using Microsoft.EntityFrameworkCore;
using DNATestSystem.BusinessObjects.Entities;
using DNATestSystem.BusinessObjects.Models;

namespace DNATestSystem.Repositories
{
    public interface IApplicationDbContext
    {
         DbSet<BlogPost> BlogPosts { get; set; }

         DbSet<ConsultRequest> ConsultRequests { get; set; }

         DbSet<Feature> Features { get; set; }

         DbSet<Feedback> Feedbacks { get; set; }

         DbSet<PriceDetail> PriceDetails { get; set; }

         DbSet<RefreshToken> RefreshTokens { get; set; }

        DbSet<Role> Roles { get; set; }

        DbSet<Service> Services { get; set; }

         DbSet<SystemLog> SystemLogs { get; set; }

       DbSet<TestProcess> TestProcesses { get; set; }

         DbSet<TestRequest> TestRequests { get; set; }

         DbSet<TestResult> TestResults { get; set; }

        DbSet<TestSample> TestSamples { get; set; }

         DbSet<TestType> TestTypes { get; set; }

         DbSet<User> Users { get; set; }

         DbSet<UserProfile> UserProfiles { get; set; }

         DbSet<UserSelectedService> UserSelectedServices { get; set; }

         DbSet<Invoice> Invoices { get; set; }

        DbSet<CollectType> CollectTypes { get; set; }

        // Save changes
        int SaveChanges();
        Task<int> SaveChangesAsync();
    }

}
