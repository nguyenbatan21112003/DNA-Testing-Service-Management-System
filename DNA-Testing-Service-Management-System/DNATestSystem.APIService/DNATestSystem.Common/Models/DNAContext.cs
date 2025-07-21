using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DNATestSystem.BusinessObjects.Models;

public partial class DNAContext : DbContext
{
    public DNAContext()
    {
    }

    public DNAContext(DbContextOptions<DNAContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BlogPost> BlogPosts { get; set; }


    public virtual DbSet<ConsultRequest> ConsultRequests { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<PriceDetail> PriceDetails { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<RequestDeclarant> RequestDeclarants { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SampleCollectionForm> SampleCollectionForms { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<SystemLog> SystemLogs { get; set; }

    public virtual DbSet<TestProcess> TestProcesses { get; set; }

    public virtual DbSet<TestRequest> TestRequests { get; set; }

    public virtual DbSet<TestResult> TestResults { get; set; }

    public virtual DbSet<TestSample> TestSamples { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserProfile> UserProfiles { get; set; }

    public virtual DbSet<UserSelectedService> UserSelectedServices { get; set; }

    public virtual DbSet<Weather> Weathers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=NEM\\SQLEXPRESS;Database=DNATestingSystem_V4;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__BlogPost__AA12603848F6980A");

            entity.HasIndex(e => e.Slug, "UQ__BlogPost__BC7B5FB6C3DFC4AD").IsUnique();

            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.AuthorId).HasColumnName("AuthorID");
            entity.Property(e => e.Content).HasMaxLength(500);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsPublished).HasDefaultValue(true);
            entity.Property(e => e.Slug).HasMaxLength(100);
            entity.Property(e => e.Summary).HasMaxLength(500);
            entity.Property(e => e.ThumbnailUrl)
                .HasMaxLength(255)
                .HasColumnName("ThumbnailURL");
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Author).WithMany(p => p.BlogPosts)
                .HasForeignKey(d => d.AuthorId)
                .HasConstraintName("FK__BlogPosts__Autho__52593CB8");
        });

        //modelBuilder.Entity<CollectType>(entity =>
        //{
        //    entity.HasKey(e => e.CollectId).HasName("PK__CollectT__8AAA9E2A3E2467C5");

        //    entity.ToTable("CollectType");

        //    entity.Property(e => e.CollectId).HasColumnName("CollectID");
        //    entity.Property(e => e.CollectName).HasMaxLength(20);
        //});

        modelBuilder.Entity<ConsultRequest>(entity =>
        {
            entity.HasKey(e => e.ConsultId).HasName("PK__ConsultR__28859B15D1A54837");

            entity.Property(e => e.ConsultId).HasColumnName("ConsultID");
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Message).HasColumnType("text");
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.RepliedAt).HasColumnType("datetime");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Service).WithMany(p => p.ConsultRequests)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK__ConsultRe__Servi__0D7A0286");

            entity.HasOne(d => d.Staff).WithMany(p => p.ConsultRequests)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__ConsultRe__Staff__0C85DE4D");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDF64843CAC2");

            entity.Property(e => e.FeedbackId).HasColumnName("FeedbackID");
            entity.Property(e => e.Comment).HasMaxLength(1000);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.ResultId).HasColumnName("ResultID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Result).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.ResultId)
                .HasConstraintName("FK__Feedbacks__Resul__08B54D69");

            entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Feedbacks__UserI__09A971A2");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.InvoiceId).HasName("PK__Invoice__D796AAD5A8ABCEEA");

            entity.ToTable("Invoice");

            entity.Property(e => e.InvoiceId).HasColumnName("InvoiceID");
            entity.Property(e => e.PaidAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.RequestId).HasColumnName("RequestID");

            entity.HasOne(d => d.Request).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__Invoice__Request__04E4BC85");
        });

        modelBuilder.Entity<PriceDetail>(entity =>
        {
            entity.HasKey(e => e.PriceId).HasName("PK__PriceDet__4957584F991D0168");

            entity.Property(e => e.PriceId).HasColumnName("PriceID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IncludeVat)
                .HasDefaultValue(false)
                .HasColumnName("IncludeVAT");
            entity.Property(e => e.Price2Samples).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Price3Samples).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.TimeToResult).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Service).WithMany(p => p.PriceDetails)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK__PriceDeta__Servi__60A75C0F");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.TokenId).HasName("PK__RefreshT__658FEE8A63BC8EAD");

            entity.Property(e => e.TokenId).HasColumnName("TokenID");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.ExpiresAt).HasColumnType("datetime");
            entity.Property(e => e.Token).HasMaxLength(500);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__RefreshTo__UserI__10566F31");
        });

        modelBuilder.Entity<RequestDeclarant>(entity =>
        {
            entity.HasKey(e => e.DeclarantId).HasName("PK__RequestD__761301B7DA89E42D");

            entity.Property(e => e.DeclarantId).HasColumnName("DeclarantID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.IdentityIssuedPlace).HasMaxLength(100);
            entity.Property(e => e.IdentityNumber).HasMaxLength(50);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.RequestId).HasColumnName("RequestID");

            entity.HasOne(d => d.Request).WithMany(p => p.RequestDeclarants)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__RequestDe__Reque__75A278F5");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE3A1C9BEB2F");

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<SampleCollectionForm>(entity =>
        {
            entity.HasKey(e => e.CollectionId).HasName("PK__SampleCo__7DE6BC24DD0B0FC3");

            entity.Property(e => e.CollectionId).HasColumnName("CollectionID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.ConfirmedBy).HasMaxLength(100);
            entity.Property(e => e.FingerprintImage).HasMaxLength(255);
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
            entity.Property(e => e.Location).HasMaxLength(255);
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.ProcessId).HasColumnName("ProcessID");
            entity.Property(e => e.Quantity)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Relationship).HasMaxLength(30);
            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.SampleType).HasMaxLength(50);
            entity.Property(e => e.Yob).HasColumnName("YOB");

            entity.HasOne(d => d.Process).WithMany(p => p.SampleCollectionForms)
                .HasForeignKey(d => d.ProcessId)
                .HasConstraintName("FK__SampleCol__Proce__7D439ABD");

            entity.HasOne(d => d.Request).WithMany(p => p.SampleCollectionForms)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__SampleCol__Reque__7C4F7684");
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__Services__C51BB0EA63D279C9");

            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.IsPublished).HasDefaultValue(false);
            entity.Property(e => e.IsUrgent).HasDefaultValue(false);
            entity.Property(e => e.NumberSample).HasDefaultValue((byte)1);
            entity.Property(e => e.ServiceName).HasMaxLength(100);
            entity.Property(e => e.Slug).HasMaxLength(100);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<SystemLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__SystemLo__5E5499A814EFC147");

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
                .HasConstraintName("FK__SystemLog__UserI__571DF1D5");
        });

        modelBuilder.Entity<TestProcess>(entity =>
        {
            entity.HasKey(e => e.ProcessId).HasName("PK__TestProc__1B39A976841D6A2B");

            entity.Property(e => e.ProcessId).HasColumnName("ProcessID");
            entity.Property(e => e.ClaimedAt).HasColumnType("datetime");
            entity.Property(e => e.CurrentStatus).HasMaxLength(50);
            entity.Property(e => e.KitCode)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Notes).HasColumnType("text");
            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Request).WithMany(p => p.TestProcesses)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__TestProce__Reque__71D1E811");

            entity.HasOne(d => d.Staff).WithMany(p => p.TestProcesses)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK__TestProce__Staff__72C60C4A");
        });

        modelBuilder.Entity<TestRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__TestRequ__33A8519A098458F7");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.TypeId).HasColumnName("TypeID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Service).WithMany(p => p.TestRequests)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK__TestReque__Servi__6E01572D");

            //entity.HasOne(d => d.Type).WithMany(p => p.TestRequests)
            //    .HasForeignKey(d => d.TypeId)
            //    .HasConstraintName("FK__TestReque__TypeI__6EF57B66");

            entity.HasOne(d => d.User).WithMany(p => p.TestRequests)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__TestReque__UserI__6D0D32F4");
        });

        modelBuilder.Entity<TestResult>(entity =>
        {
            entity.HasKey(e => e.ResultId).HasName("PK__TestResu__97690228F6F7D0EE");

            entity.Property(e => e.ResultId).HasColumnName("ResultID");
            entity.Property(e => e.EnteredAt).HasColumnType("datetime");
            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.ResultData).HasColumnType("text");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.VerifiedAt).HasColumnType("datetime");

            entity.HasOne(d => d.EnteredByNavigation).WithMany(p => p.TestResultEnteredByNavigations)
                .HasForeignKey(d => d.EnteredBy)
                .HasConstraintName("FK__TestResul__Enter__01142BA1");

            entity.HasOne(d => d.Request).WithMany(p => p.TestResults)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__TestResul__Reque__00200768");

            entity.HasOne(d => d.VerifiedByNavigation).WithMany(p => p.TestResultVerifiedByNavigations)
                .HasForeignKey(d => d.VerifiedBy)
                .HasConstraintName("FK__TestResul__Verif__02084FDA");
        });

        modelBuilder.Entity<TestSample>(entity =>
        {
            entity.HasKey(e => e.SampleId).HasName("PK__TestSamp__8B99EC0A67441256");

            entity.Property(e => e.SampleId).HasColumnName("SampleID");
            entity.Property(e => e.CollectedAt).HasColumnType("datetime");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.OwnerName).HasMaxLength(100);
            entity.Property(e => e.Relationship).HasMaxLength(30);
            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.SampleType).HasMaxLength(50);
            entity.Property(e => e.Yob).HasColumnName("YOB");

            entity.HasOne(d => d.Process).WithMany(p => p.TestSamples)
                .HasConstraintName("FK__TestSampl__Proce__797309D9");

            entity.HasOne(d => d.Request).WithMany(p => p.TestSamples)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK__TestSampl__Reque__787EE5A0");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC1C7DA556");

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
                .HasConstraintName("FK__Users__RoleID__4BAC3F29");
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.ProfileId).HasName("PK__UserProf__290C88849B96C232");

            entity.Property(e => e.ProfileId).HasColumnName("ProfileID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.DateOfBirth).HasColumnType("datetime");
            entity.Property(e => e.Fingerfile)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.IdentityId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("IdentityID");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.UserProfiles)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__UserProfi__UserI__4E88ABD4");
        });

        modelBuilder.Entity<UserSelectedService>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UserSele__3214EC279551C329");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ConvertedToRequest).HasDefaultValue(false);
            entity.Property(e => e.IncludeVat)
                .HasDefaultValue(false)
                .HasColumnName("IncludeVAT");
            entity.Property(e => e.Note).HasColumnType("text");
            entity.Property(e => e.SelectedAt).HasColumnType("datetime");
            entity.Property(e => e.ServiceId).HasColumnName("ServiceID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Service).WithMany(p => p.UserSelectedServices)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK__UserSelec__Servi__66603565");

            entity.HasOne(d => d.User).WithMany(p => p.UserSelectedServices)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__UserSelec__UserI__656C112C");
        });

        modelBuilder.Entity<Weather>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Weather");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.RecordDate).HasColumnName("recordDate");
            entity.Property(e => e.Temperature).HasColumnName("temperature");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
