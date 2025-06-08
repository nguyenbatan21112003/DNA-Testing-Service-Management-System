using FluentValidation;
using DNATestSystem.BusinessObjects;
using DNATestSystem.Application.Dtos;
using DNATestSystem.Repositories;
namespace DNATestSystem.ModelValidation
{
    public class UserValidateModel : AbstractValidator<UserRegisterModel>
        {
            public UserValidateModel(IApplicationDbContext context)
            {
            RuleFor(x => x.EmailAddress)
                .NotEmpty().WithMessage("Email không được để trống")
                .EmailAddress().WithMessage("Email không hợp lệ")
                    .Must(email => !context.Users.Any(u => u.EmailAddress == email))
                    .WithMessage("Email đã được sử dụng");

            RuleFor(x => x.FullName)
                    .NotEmpty().WithMessage("Họ tên không được để trống");

                RuleFor(x => x.Password)
                    .NotEmpty().WithMessage("Mật khẩu không được để trống")
                    .MinimumLength(6).WithMessage("Mật khẩu tối thiểu 6 ký tự");

                RuleFor(x => x.PhoneNumber)
                    .NotEmpty().WithMessage("Số điện thoại không được để trống")
                    .Matches(@"^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$")
                    .WithMessage("Số điện thoại không hợp lệ")
                    .Length(10)
                    .WithMessage("Số điện thoại phải đủ 10 số !")
                    .Must(phone => !context.Users.Any(u => u.PhoneNumber == phone))
                    .WithMessage("Số điện thoại đã được sử dụng");               
            }
        }
    }
