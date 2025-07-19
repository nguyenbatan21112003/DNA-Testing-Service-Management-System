using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using DNATestSystem.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Hangfire;
using Hangfire.SqlServer;
using DNATestSystem.ModelValidation;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Service;
using DNATestSystem.BusinessObjects.Entities;
using DNATestSystem.Services.Interface;
using DNATestSystem.BusinessObjects.Application.Dtos.Mail;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình JwtSettings trước khi thêm vào DI container
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettings);  // Đảm bảo JwtSettings được thêm vào DI container

// EF Core + DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        x => x.MigrationsAssembly("DNATestSystem.Repositories")));

builder.Services.AddHangfire(config =>
{
    config.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection"));
});


builder.Services.AddScoped<IApplicationDbContext>(provider =>
    provider.GetRequiredService<ApplicationDbContext>());
//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseSqlServer("Server=NEM\\SQLEXPRESS;Database=SWP391;Trusted_Connection=True;TrustServerCertificate=True"));



//builder.Services.AddScoped<IApplicationDbContext>(provider =>
//    provider.GetRequiredService<ApplicationDbContext>());
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
               .AllowCredentials();
    });
});
//if (FirebaseApp.DefaultInstance == null)
//{
//    FirebaseApp.Create(new AppOptions
//    {
//        Credential = GoogleCredential.FromFile("D:\\FPT\\PRN211\\SWP391-Code\\SWP391\\firebase-adminsdk.json")
//    });
//}

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddControllers()
    .AddFluentValidation(fv =>
    {
        fv.RegisterValidatorsFromAssemblyContaining<UserValidateModel>(); // hoặc bất kỳ validator nào bạn viết
    });

builder.Services.Configure<MailSettings>(
    builder.Configuration.GetSection("MailSettings"));
// ✅ Đăng ký cấu hình Mailgun từ appsettings
builder.Services.Configure<MailGunSetting>(
    builder.Configuration.GetSection("MailgunSettings"));


// Đăng ký service gửi mail (nếu có)
// Service + Session + Cache
builder.Services.AddScoped<IUserService, UserService>(); // Đảm bảo IUserService đã được đăng ký đúng
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IManagerService, ManagerService>();
builder.Services.AddScoped<IPriceDetails, PriceDetailService>();
builder.Services.AddScoped<IVnPayService, VnPayService>();
builder.Services.AddScoped<IStaffService, StaffService>();
builder.Services.AddScoped<IMailService, MailService>();
builder.Services.AddScoped<RefreshTokenCleanupService>();
// ✅ Đăng ký HttpClient và MailgunService
builder.Services.AddHttpClient<MailgunService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddHangfireServer();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDistributedMemoryCache(); // BẮT BUỘC cho session
builder.Services.AddSession();
builder.Services.AddAuthorization(); // Thêm dòng này để fix lỗi

builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ToDoApp",
        Version = "v1",
        Description = "ToDoApp API"
    });
    option.CustomSchemaIds(type => type.FullName);

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT code",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    option.AddSecurityDefinition("Bearer", securityScheme);
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {securityScheme, new string[]{} }
    });
});

// Cấu hình JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(jwtSettings["SecretKey"])),
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"]
    };
});

// Cấu hình Session
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromSeconds(30); // sau 30s ko làm gì thì phải loging lại
    options.Cookie.HttpOnly = true; // khi các bạn luu cookie xuống browser, nó sẽ ko cho phép javastric đọc
    options.Cookie.IsEssential = true; // tự động add vào request xong r save vào browser
});
builder.Services.AddHttpContextAccessor();
//builder.WebHost.UseUrls("http://0.0.0.0:5000");
//builder.WebHost.UseUrls("https://0.0.0.0:5001");

// Sau khi cấu hình xong, gọi builder.Build() một lần duy nhất
var app = builder.Build();

// Cấu hình middleware cho app
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

GlobalConfiguration.Configuration.UseSqlServerStorage(
    builder.Configuration.GetConnectionString("DefaultConnection"));
app.UseHangfireDashboard();
// Job chạy mỗi 2 giờ

RecurringJob.AddOrUpdate<RefreshTokenCleanupService>(
    "cleanup-expired-tokens",
    x => x.CleanupExpiredTokensAsync(),
    Cron.Hourly // mỗi tiếng chạy 1 lần
);
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

//app.UseCors(policy =>
//{
//    policy.WithOrigins("http://localhost:5173")  // FE Vite
//          .AllowAnyMethod()
//          .AllowAnyHeader();
//});
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();
app.MapControllers();
app.Run();
