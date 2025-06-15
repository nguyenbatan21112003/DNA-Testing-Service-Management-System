using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using DNATestSystem.BusinessObjects;
using DNATestSystem.BusinessObjects.Models;

namespace DNATestSystem.Repositories
{
    public partial class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext()
        {
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<BlogPost> BlogPosts { get; set; }

        public virtual DbSet<ConsultRequest> ConsultRequests { get; set; }

        public virtual DbSet<Feature> Features { get; set; }

        public virtual DbSet<Feedback> Feedbacks { get; set; }

        public virtual DbSet<Payment> Payments { get; set; }

        public virtual DbSet<PriceDetail> PriceDetails { get; set; }

        public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

        public virtual DbSet<Role> Roles { get; set; }

        public virtual DbSet<SampleCollectionRecord> SampleCollectionRecords { get; set; }

        public virtual DbSet<SampleCollectionSample> SampleCollectionSamples { get; set; }

        public virtual DbSet<Service> Services { get; set; }

        public virtual DbSet<SystemLog> SystemLogs { get; set; }

        public virtual DbSet<TestProcess> TestProcesses { get; set; }

        public virtual DbSet<TestRequest> TestRequests { get; set; }

        public virtual DbSet<TestResult> TestResults { get; set; }

        public virtual DbSet<TestSample> TestSamples { get; set; }

        public virtual DbSet<TestType> TestTypes { get; set; }

        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<UserProfile> UserProfiles { get; set; }

        public virtual DbSet<UserSelectedService> UserSelectedServices { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BlogPost>(entity =>
            {
                entity.HasKey(e => e.PostId).HasName("PK__BlogPost__AA126038896BD978");

                entity.HasIndex(e => e.Slug, "UQ__BlogPost__BC7B5FB6628EBA0B").IsUnique();

                entity.Property(e => e.PostId).HasColumnName("PostID");
                entity.Property(e => e.AuthorId).HasColumnName("AuthorID");
                entity.Property(e => e.Content).HasColumnType("text");
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.IsPublished).HasDefaultValue(true);
                entity.Property(e => e.Slug).HasMaxLength(100);
                entity.Property(e => e.Summary).HasMaxLength(500);
                entity.Property(e => e.Title).HasMaxLength(255);
                entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

                entity.HasOne(d => d.Author).WithMany(p => p.BlogPosts)
                    .HasForeignKey(d => d.AuthorId)
                    .HasConstraintName("FK__BlogPosts__Autho__32E0915F");
            });

            modelBuilder.Entity<ConsultRequest>(entity =>
            {
                entity.HasKey(e => e.ConsultId).HasName("PK__ConsultR__28859B152268FA69");

                entity.Property(e => e.ConsultId).HasColumnName("ConsultID");
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
                entity.Property(e => e.Message).HasColumnType("text");
                entity.Property(e => e.RepliedAt).HasColumnType("datetime");
                entity.Property(e => e.ReplyMessage).HasColumnType("text");
                entity.Property(e => e.StaffId).HasColumnName("StaffID");
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.Subject).HasMaxLength(255);

                entity.HasOne(d => d.Customer).WithMany(p => p.ConsultRequestCustomers)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK__ConsultRe__Custo__6754599E");

                entity.HasOne(d => d.Staff).WithMany(p => p.ConsultRequestStaffs)
                    .HasForeignKey(d => d.StaffId)
                    .HasConstraintName("FK__ConsultRe__Staff__68487DD7");
            });

            modelBuilder.Entity<Feature>(entity =>
            {
                entity.HasKey(e => e.FeatureId).HasName("PK__Features__82230A298C737335");

                entity.Property(e => e.FeatureId).HasColumnName("FeatureID");
                entity.Property(e => e.Description).HasColumnType("text");
                entity.Property(e => e.Name)
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDF6DC5A65B1");

                entity.Property(e => e.FeedbackId).HasColumnName("FeedbackID");
                entity.Property(e => e.Comment).HasMaxLength(1000);
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.ResultId).HasColumnName("ResultID");
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.Result).WithMany(p => p.Feedbacks)
                    .HasForeignKey(d => d.ResultId)
                    .HasConstraintName("FK__Feedbacks__Resul__6383C8BA");

                entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Feedbacks__UserI__6477ECF3");
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A58C62259D1");

                entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
                entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.PaidAt).HasColumnType("datetime");
                entity.Property(e => e.PaymentMethod).HasMaxLength(50);
                entity.Property(e => e.RequestId).HasColumnName("RequestID");

                entity.HasOne(d => d.Request).WithMany(p => p.Payments)
                    .HasForeignKey(d => d.RequestId)
                    .HasConstraintName("FK__Payments__Reques__60A75C0F");
            });

            modelBuilder.Entity<PriceDetail>(entity =>
            {
                entity.HasKey(e => e.PriceId).HasName("PK__PriceDet__4957584FE8D57CB9");

                entity.Property(e => e.PriceId).HasColumnName("PriceID");
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.Price2Samples).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.Price3Samples).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
                entity.Property(e => e.TimeToResult).HasMaxLength(50);
                entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

                entity.HasOne(d => d.Service).WithMany(p => p.PriceDetails)
                    .HasForeignKey(d => d.ServiceId)
                    .HasConstraintName("FK__PriceDeta__Servi__3E52440B");
            });

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.TokenId).HasName("PK__RefreshT__658FEE8A6B49B744");

                entity.Property(e => e.TokenId).HasColumnName("TokenID");
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.ExpiresAt).HasColumnType("datetime");
                entity.Property(e => e.Token).HasMaxLength(500);
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__RefreshTo__UserI__6B24EA82");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE3A99E52713");

                entity.Property(e => e.RoleId).HasColumnName("RoleID");
                entity.Property(e => e.RoleName).HasMaxLength(50);

                entity.HasMany(d => d.Features).WithMany(p => p.Roles)
                    .UsingEntity<Dictionary<string, object>>(
                        "RoleFeature",
                        r => r.HasOne<Feature>().WithMany()
                            .HasForeignKey("FeatureId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK__RoleFeatu__Featu__29572725"),
                        l => l.HasOne<Role>().WithMany()
                            .HasForeignKey("RoleId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK__RoleFeatu__RoleI__286302EC"),
                        j =>
                        {
                            j.HasKey("RoleId", "FeatureId").HasName("PK__RoleFeat__02D8FE984F43F664");
                            j.ToTable("RoleFeatures");
                            j.IndexerProperty<int>("RoleId").HasColumnName("RoleID");
                            j.IndexerProperty<int>("FeatureId").HasColumnName("FeatureID");
                        });
            });

            modelBuilder.Entity<SampleCollectionRecord>(entity =>
            {
                entity.HasKey(e => e.RecordId).HasName("PK__SampleCo__FBDF78C9BC15D8F2");

                entity.Property(e => e.RecordId).HasColumnName("RecordID");
                entity.Property(e => e.CollectedAt).HasColumnType("datetime");
                entity.Property(e => e.ConfirmedBy).HasMaxLength(100);
                entity.Property(e => e.Location).HasMaxLength(255);
                entity.Property(e => e.Note).HasColumnType("text");
                entity.Property(e => e.ProcessId).HasColumnName("ProcessID");
                entity.Property(e => e.RequestId).HasColumnName("RequestID");

                entity.HasOne(d => d.CollectedByNavigation).WithMany(p => p.SampleCollectionRecords)
                    .HasForeignKey(d => d.CollectedBy)
                    .HasConstraintName("FK__SampleCol__Colle__5629CD9C");

                entity.HasOne(d => d.Process).WithMany(p => p.SampleCollectionRecords)
                    .HasForeignKey(d => d.ProcessId)
                    .HasConstraintName("FK__SampleCol__Proce__5535A963");

                entity.HasOne(d => d.Request).WithMany(p => p.SampleCollectionRecords)
                    .HasForeignKey(d => d.RequestId)
                    .HasConstraintName("FK__SampleCol__Reque__5441852A");
            });

            modelBuilder.Entity<SampleCollectionSample>(entity =>
            {
                entity.HasKey(e => e.CollectedSampleId).HasName("PK__SampleCo__98BC8F30615E9963");

                entity.Property(e => e.CollectedSampleId).HasColumnName("CollectedSampleID");
                entity.Property(e => e.Address).HasMaxLength(255);
                entity.Property(e => e.CollectedBy).HasMaxLength(100);
                entity.Property(e => e.FullName).HasMaxLength(100);
                entity.Property(e => e.Gender).HasMaxLength(10);
                entity.Property(e => e.IdissuedDate).HasColumnName("IDIssuedDate");
                entity.Property(e => e.IdissuedPlace)
                    .HasMaxLength(100)
                    .HasColumnName("IDIssuedPlace");
                entity.Property(e => e.Idnumber)
                    .HasMaxLength(50)
                    .HasColumnName("IDNumber");
                entity.Property(e => e.Idtype)
                    .HasMaxLength(30)
                    .HasColumnName("IDType");
                entity.Property(e => e.Quantity)
                    .HasMaxLength(20)
                    .IsUnicode(false);
                entity.Property(e => e.RecordId).HasColumnName("RecordID");
                entity.Property(e => e.Relationship).HasMaxLength(30);
                entity.Property(e => e.SampleType).HasMaxLength(50);
                entity.Property(e => e.Yob).HasColumnName("YOB");

                entity.HasOne(d => d.Record).WithMany(p => p.SampleCollectionSamples)
                    .HasForeignKey(d => d.RecordId)
                    .HasConstraintName("FK__SampleCol__Recor__59063A47");
            });

            modelBuilder.Entity<Service>(entity =>
            {
                entity.HasKey(e => e.ServiceId).HasName("PK__Services__C51BB0EA5C24E25B");

                entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
                entity.Property(e => e.Category).HasMaxLength(50);
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                entity.Property(e => e.Description).HasMaxLength(255);
                entity.Property(e => e.NumberSample).HasDefaultValue((byte)1);
                entity.Property(e => e.ServiceName).HasMaxLength(100);
                entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
            });

            modelBuilder.Entity<SystemLog>(entity =>
            {
                entity.HasKey(e => e.LogId).HasName("PK__SystemLo__5E5499A8FD203F98");

                entity.Property(e => e.LogId).HasColumnName("LogID");
                entity.Property(e => e.ActionType)
                    .HasMaxLength(50)
                    .IsUnicode(false);
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime");
                entity.Property(e => e.Description).HasColumnType("text");
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User).WithMany(p => p.SystemLogs)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__SystemLog__UserI__36B12243");
            });

            modelBuilder.Entity<TestProcess>(entity =>
            {
                entity.HasKey(e => e.ProcessId).HasName("PK__TestProc__1B39A9765173F1DE");

                entity.Property(e => e.ProcessId).HasColumnName("ProcessID");
                entity.Property(e => e.ClaimedAt).HasColumnType("datetime");
                entity.Property(e => e.CurrentStatus).HasMaxLength(50);
                entity.Property(e => e.KitCode)
                    .HasMaxLength(20)
                    .IsUnicode(false);
                entity.Property(e => e.Notes).HasColumnType("text");
                entity.Property(e => e.ProcessState).HasMaxLength(50);
                entity.Property(e => e.RequestId).HasColumnName("RequestID");
                entity.Property(e => e.StaffId).HasColumnName("StaffID");
                entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

                entity.HasOne(d => d.Request).WithMany(p => p.TestProcesses)
                    .HasForeignKey(d => d.RequestId)
                    .HasConstraintName("FK__TestProce__Reque__4CA06362");

                entity.HasOne(d => d.Staff).WithMany(p => p.TestProcesses)
                    .HasForeignKey(d => d.StaffId)
                    .HasConstraintName("FK__TestProce__Staff__4D94879B");
            });

            modelBuilder.Entity<TestRequest>(entity =>
            {
                entity.HasKey(e => e.RequestId).HasName("PK__TestRequ__33A8519A9426A80B");

                entity.Property(e => e.RequestId).HasColumnName("RequestID");
                entity.Property(e => e.Address).HasMaxLength(255);
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.TypeId).HasColumnName("TypeID");
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.Service).WithMany(p => p.TestRequests)
                    .HasForeignKey(d => d.ServiceId)
                    .HasConstraintName("FK__TestReque__Servi__48CFD27E");

                entity.HasOne(d => d.Type).WithMany(p => p.TestRequests)
                    .HasForeignKey(d => d.TypeId)
                    .HasConstraintName("FK__TestReque__TypeI__49C3F6B7");

                entity.HasOne(d => d.User).WithMany(p => p.TestRequests)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__TestReque__UserI__47DBAE45");
            });

            modelBuilder.Entity<TestResult>(entity =>
            {
                entity.HasKey(e => e.ResultId).HasName("PK__TestResu__97690228838146B3");

                entity.Property(e => e.ResultId).HasColumnName("ResultID");
                entity.Property(e => e.EnteredAt).HasColumnType("datetime");
                entity.Property(e => e.RequestId).HasColumnName("RequestID");
                entity.Property(e => e.ResultData).HasColumnType("text");
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.VerifiedAt).HasColumnType("datetime");

                entity.HasOne(d => d.EnteredByNavigation).WithMany(p => p.TestResultEnteredByNavigations)
                    .HasForeignKey(d => d.EnteredBy)
                    .HasConstraintName("FK__TestResul__Enter__5CD6CB2B");

                entity.HasOne(d => d.Request).WithMany(p => p.TestResults)
                    .HasForeignKey(d => d.RequestId)
                    .HasConstraintName("FK__TestResul__Reque__5BE2A6F2");

                entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.TestResultVerifiedByNavigations)
                    .HasForeignKey(d => d.VerifiedBy)
                    .HasConstraintName("FK__TestResul__Verif__5DCAEF64");
            });

            modelBuilder.Entity<TestSample>(entity =>
            {
                entity.HasKey(e => e.SampleId).HasName("PK__TestSamp__8B99EC0A3F1D96F0");

                entity.Property(e => e.SampleId).HasColumnName("SampleID");
                entity.Property(e => e.Gender)
                    .HasMaxLength(10)
                    .IsUnicode(false);
                entity.Property(e => e.OwnerName).HasMaxLength(100);
                entity.Property(e => e.ProcessId).HasColumnName("ProcessID");
                entity.Property(e => e.Relationship).HasMaxLength(30);
                entity.Property(e => e.RequestId).HasColumnName("RequestID");
                entity.Property(e => e.SampleType).HasMaxLength(50);
                entity.Property(e => e.Yob).HasColumnName("YOB");

                entity.HasOne(d => d.Process).WithMany(p => p.TestSamples)
                    .HasForeignKey(d => d.ProcessId)
                    .HasConstraintName("FK__TestSampl__Proce__5165187F");

                entity.HasOne(d => d.Request).WithMany(p => p.TestSamples)
                    .HasForeignKey(d => d.RequestId)
                    .HasConstraintName("FK__TestSampl__Reque__5070F446");
            });

            modelBuilder.Entity<TestType>(entity =>
            {
                entity.HasKey(e => e.TypeId).HasName("PK__TestType__516F039541C8093B");

                entity.ToTable("TestType");

                entity.Property(e => e.TypeId).HasColumnName("TypeID");
                entity.Property(e => e.TypeName)
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCACB59AC285");

                entity.Property(e => e.UserId).HasColumnName("UserID");
                entity.Property(e => e.CreatedAt).HasColumnType("datetime");
                entity.Property(e => e.Email).HasMaxLength(40);
                entity.Property(e => e.FullName).HasMaxLength(100);
                entity.Property(e => e.Password).HasMaxLength(255);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.RoleId).HasColumnName("RoleID");
                entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

                entity.HasOne(d => d.Role).WithMany(p => p.Users)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK__Users__RoleID__2C3393D0");
            });

            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.HasKey(e => e.ProfileId).HasName("PK__UserProf__290C888421913B3E");

                entity.Property(e => e.ProfileId).HasColumnName("ProfileID");
                entity.Property(e => e.Address).HasMaxLength(255);
                entity.Property(e => e.DateOfBirth).HasColumnType("datetime");
                entity.Property(e => e.Fingerfile)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.Gender).HasMaxLength(10);
                entity.Property(e => e.IdentityFile)
                    .HasMaxLength(100)
                    .IsUnicode(false);
                entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.User).WithMany(p => p.UserProfiles)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__UserProfi__UserI__2F10007B");
            });

            modelBuilder.Entity<UserSelectedService>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__UserSele__3214EC271BA82503");

                entity.Property(e => e.Id).HasColumnName("ID");
                entity.Property(e => e.ConvertedToRequest).HasDefaultValue(false);
                entity.Property(e => e.Note).HasColumnType("text");
                entity.Property(e => e.SelectedAt).HasColumnType("datetime");
                entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.Service).WithMany(p => p.UserSelectedServices)
                    .HasForeignKey(d => d.ServiceId)
                    .HasConstraintName("FK__UserSelec__Servi__4222D4EF");

                entity.HasOne(d => d.User).WithMany(p => p.UserSelectedServices)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__UserSelec__UserI__412EB0B6");

            });

            OnModelCreatingPartial(modelBuilder);
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
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

