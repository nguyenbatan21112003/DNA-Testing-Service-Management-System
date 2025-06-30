using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.RequestDeclarant;
using DNATestSystem.BusinessObjects.Application.Dtos.Staff;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;
using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace DNATestSystem.Services.Service
{
    public class StaffService : IStaffService
    {
        private readonly IApplicationDbContext _context;
        // Constructor injection for the database context
        public StaffService(IApplicationDbContext context) {

            _context = context;
        }

        public async Task<List<PendingConsultDto>> PendingConsultResultsAsync()
        {
            var data = await _context.ConsultRequests
                            .Where(s => s.Status == "Pending")
                            .Select(x => new PendingConsultDto
                            {
                                ConsultId = x.ConsultId,
                                FullName = x.FullName,
                                Phone = x.Phone,
                                Category = x.Category,
                                ServiceId = x.ServiceId,
                                Message = x.Message,
                                CreatedAt = x.CreatedAt,
                                RepliedAt = x.RepliedAt
                            })
                            .ToListAsync();
            return data;
        }

        public async Task<bool> UpdateConsultResultAsync(UpdateConsultRequestDto updateConsultRequestDto)
        {

            var consult = await _context.ConsultRequests.FindAsync(updateConsultRequestDto.ConsultId);
            if (consult == null) return false;

            consult.StaffId = updateConsultRequestDto.StaffId;
            consult.Status = updateConsultRequestDto.Status;
            consult.RepliedAt = updateConsultRequestDto.RepliedAt;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<(bool Success, string Message, int? RequestId)> SubmitTestRequestAsync(TestRequestSubmissionDto dto)
        {
            using var transaction = await (_context as DbContext)!.Database.BeginTransactionAsync();


            try
            {
                int collectTypeId = dto.TestRequest.TypeId switch
                {
                    1 => 1, // At Center
                    2 => 2, // At Home
                    _ => throw new ArgumentException("Invalid TypeId")
                };
                var testRequest = new TestRequest
                {
                    UserId = dto.TestRequest.UserId,
                    ServiceId = dto.TestRequest.ServiceId,
                    TypeId = dto.TestRequest.TypeId,
                    Category = dto.TestRequest.Category,
                    ScheduleDate = dto.TestRequest.ScheduleDate,
                    Address = dto.TestRequest.Address,
                    Status = dto.TestRequest.Status,
                    CreatedAt = DateTime.Now
                };

                _context.TestRequests.Add(testRequest);
                await _context.SaveChangesAsync();

                var declarant = new RequestDeclarant
                {
                    RequestId = testRequest.RequestId,
                    FullName = dto.Declarant.FullName,
                    Gender = dto.Declarant.Gender,
                    Address = dto.Declarant.Address,
                    IdentityNumber = dto.Declarant.IdentityNumber,
                    IdentityIssuedDate = dto.Declarant.IdentityIssuedDate,
                    IdentityIssuedPlace = dto.Declarant.IdentityIssuedPlace,
                    Phone = dto.Declarant.Phone,
                    Email = dto.Declarant.Email
                };

                _context.RequestDeclarants.Add(declarant);

                foreach (var s in dto.Samples)
                {
                    var sample = new TestSample
                    {
                        RequestId = testRequest.RequestId,
                        OwnerName = s.OwnerName,
                        Gender = s.Gender,
                        Relationship = s.Relationship,
                        SampleType = s.SampleType,
                        Yob = s.Yob,
                        CollectedAt = DateTime.Now
                    };

                    _context.TestSamples.Add(sample);
                }

                var invoice = new Invoice
                {
                    RequestId = testRequest.RequestId,
                    PaidAt = dto.Invoice.PaidAt
                };

                _context.Invoices.Add(invoice);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return (true, "Đăng ký xét nghiệm thành công", testRequest.RequestId);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, ex.InnerException?.Message ?? ex.Message, null);
            }
        }

        public async Task<List<TestRequestViewDto>> PendingTestRequestAsync()
        {

            var result = await _context.TestRequests
                .Where(x => x.Status == "Pending")
                .Include(x => x.Service)
                .Include(x => x.RequestDeclarants)
                .Include(x => x.TestSamples)
                .Include(x => x.CollectType)
                .Select(x => new TestRequestViewDto
                {
                    RequestId = x.RequestId,
                    ServiceName = x.Service.ServiceName,
                    CollectionType = x.CollectType.CollectName,
                    Category = x.Category,
                    Status = x.Status,
                    ScheduleDate = x.ScheduleDate,
                    CreatedAt = x.CreatedAt,
                    Address = x.Address,
                    Declarant = x.RequestDeclarants.Select(d => new DeclarantDto
                    {
                        FullName = d.FullName,
                        Gender = d.Gender,
                        IdentityNumber = d.IdentityNumber,
                        IdentityIssuedDate = d.IdentityIssuedDate,
                        IdentityIssuedPlace = d.IdentityIssuedPlace,
                        Address = d.Address,
                        Phone = d.Phone,
                        Email = d.Email
                    }).FirstOrDefault(),
                    Sample = x.TestSamples.Select(s => new TestSampleDto
                    {
                        OwnerName = s.OwnerName,
                        Gender = s.Gender,
                        Relationship = s.Relationship,
                        Yob = s.Yob,
                        SampleType = s.SampleType,
                    }).ToList()
                })
                .ToListAsync();

            return result;
        }

    }
}
