using Microsoft.EntityFrameworkCore;
using DNATestSystem.BusinessObjects.Entities;
using DNATestSystem.BusinessObjects.Models;

namespace DNATestSystem.Repositories
{
    public interface IApplicationDbContext
    {
        // User-related
        DbSet<User> Users { get; set; }
        DbSet<UserProfile> UserProfiles { get; set; }
        DbSet<RefreshToken> RefreshTokens { get; set; }
        DbSet<Role> Roles { get; set; }

        // Test-related
        DbSet<TestRequest> TestRequests { get; set; }
        DbSet<TestResult> TestResults { get; set; }
        DbSet<TestProcess> TestProcesses { get; set; }
        DbSet<TestSample> TestSamples { get; set; }
        DbSet<TestType> TestTypes { get; set; }

        // Sample collection
        DbSet<SampleCollectionRecord> SampleCollectionRecords { get; set; }
        DbSet<SampleCollectionSample> SampleCollectionSamples { get; set; }

        // Services and pricing
        DbSet<Service> Services { get; set; }
        DbSet<PriceDetail> PriceDetails { get; set; }
        DbSet<Payment> Payments { get; set; }

        // Logs & Feedback
        DbSet<SystemLog> SystemLogs { get; set; }
        DbSet<Feedback> Feedbacks { get; set; }

        // Consultations and features
        DbSet<ConsultRequest> ConsultRequests { get; set; }
        DbSet<Feature> Features { get; set; }

        // Content
        DbSet<BlogPost> BlogPosts { get; set; }
        DbSet<UserSelectedService> UserSelectedServices { get; set; }

        // Save changes
        int SaveChanges();
        Task<int> SaveChangesAsync();
    }

}
