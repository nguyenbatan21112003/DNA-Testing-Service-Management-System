using FluentValidation;
using DNATestSystem.Repositories;
using DNATestSystem.BusinessObjects.Application.Dtos.Admin;


namespace DNATestSystem.ModelValidation
{
    public class ManagerCreateModelValidator : AbstractValidator<ManagerCreateModel>
    {
        public ManagerCreateModelValidator(IApplicationDbContext context)
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Họ tên không được để trống");

            RuleFor(x => x.EmailAddress)
                .NotEmpty().WithMessage("Email không được để trống")
                .EmailAddress().WithMessage("Email không hợp lệ")
                .Must(email => !context.Users.Any(u => u.Email == email))
                .WithMessage("Email đã tồn tại trong hệ thống");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Số điện thoại không được để trống")
                .Matches(@"^\d{10}$").WithMessage("Số điện thoại phải đủ 10 chữ số")
                .Must(phone => !context.Users.Any(u => u.Phone == phone))
                .WithMessage("Số điện thoại đã tồn tại");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Mật khẩu không được để trống")
                .MinimumLength(6).WithMessage("Mật khẩu tối thiểu 6 ký tự");
        }
    }
}

