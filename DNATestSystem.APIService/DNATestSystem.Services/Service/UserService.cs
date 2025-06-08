using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using DNATestSystem.Application.Dtos;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DNATestSystem.BusinessObjects.Entiry;
using SWP391.Interceptor;
using DNATestSystem.Application.Hash;


namespace SWP391.Service
{
    public class UserService : IUserService
    {
        private readonly IApplicationDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public UserService(IApplicationDbContext context , IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
        }

        //Salting: đã mặn thêm muối
        public User? Login(UserLoginModel loginModel)
        {
            var user = _context.Users
                .FirstOrDefault(x => x.EmailAddress == loginModel.EmailAddress);
            if (user == null)
            {
                return null;
            }
            var password = loginModel.Password + user.salting;

            if (HashHelper.BCriptVerify(password, user.Password))
            {
                return user;
            }
            return null;
        }



        public int Register(UserRegisterModel user)
        {
            //// Kiểm tra trùng email
            //var existingUser = _context.Users
            //    .FirstOrDefault(u => u.EmailAddress == user.EmailAddress);
            //// Kiểm tra trung số
            //var existingPhoneNumber = _context.Users
            //    .FirstOrDefault(u => u.PhoneNumber == user.PhoneNumber);
            //if (existingUser != null && existingPhoneNumber != null)
            //{
            //    return -1; // Email đã tồn tại
            //}

            // Sinh salt + mã hóa password
            var salting = HashHelper.GenerateRandomString(100);
            var password = user.Password + salting;
            var hashPassword = HashHelper.BCriptHash(password);

            // Tạo user mới
            var data = new DNATestSystem.BusinessObjects.Entiry.User
            {
                FullName = user.FullName,
                EmailAddress = user.EmailAddress,
                Password = hashPassword,
                PhoneNumber = user.PhoneNumber,
                salting = salting,
                Role = DNATestSystem.BusinessObjects.Entiry.Role.Customer,
                //CreateAt = DateTime.Now
            };

            _context.Users.Add(data);
            _context.SaveChanges();

            return data.Id;
        }

        public string GenerateJwt(User user)
        {

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Email , user.EmailAddress),
                new Claim(ClaimTypes.Role , user.Role.ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
                signingCredentials: new SigningCredentials(
                        key,
                        SecurityAlgorithms.HmacSha256Signature
                        ));
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool VerifyCurrentPassword(string email, string currentPassword)
        {
            var user = _context.Users.FirstOrDefault(u => u.EmailAddress == email);
            if (user == null) return false;

            var saltedPassword = currentPassword + user.salting;
            return HashHelper.BCriptVerify(saltedPassword, user.Password);
        }

        public void RequestPasswordChange(string email, string newPassword)
        {
            var otp = new Random().Next(100000, 999999).ToString();

            var user = _context.Users.FirstOrDefault(u => u.EmailAddress == email);
            if (user == null) throw new Exception("User not found");

            var salt = user.salting;
            var hashNewPass = HashHelper.BCriptHash(newPassword + salt);

            PasswordChangeStore.Requests[email] = new PendingPasswordChange
            {
                Email = email,
                NewPassword = hashNewPass,
                Otp = otp
            };

            Console.WriteLine($"[OTP] Gửi đến {email}: {otp}");
            // TODO: Gửi email/sms thật
        }
        public bool ConfirmOtp(string email, string otp)
        {
            if (!PasswordChangeStore.Requests.ContainsKey(email)) return false;

            var pending = PasswordChangeStore.Requests[email];
            if (pending.Otp != otp) return false;

            var user = _context.Users.FirstOrDefault(u => u.EmailAddress == email);
            if (user == null) return false;

            user.Password = pending.NewPassword;
            _context.SaveChanges();

            PasswordChangeStore.Requests.Remove(email);
            return true;
        }
        public void ChangePassword(string email, string newPassword)
        {
            var user = _context.Users.FirstOrDefault(u => u.EmailAddress == email);
            if (user == null) throw new Exception("Không tìm thấy người dùng");

            var saltedPassword = newPassword + user.salting;
            user.Password = HashHelper.BCriptHash(saltedPassword);
            _context.SaveChanges();
        }

      
    }
}

