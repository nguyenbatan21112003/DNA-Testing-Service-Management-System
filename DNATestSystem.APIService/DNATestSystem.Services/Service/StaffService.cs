using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.ApiResponse;
using DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.FeedBack;
using DNATestSystem.BusinessObjects.Application.Dtos.Pdf;
using DNATestSystem.BusinessObjects.Application.Dtos.RequestDeclarant;
using DNATestSystem.BusinessObjects.Application.Dtos.SampleCollectionForms;
using DNATestSystem.BusinessObjects.Application.Dtos.Staff;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;
using DNATestSystem.BusinessObjects.Models;
using DNATestSystem.Repositories;
using DNATestSystem.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace DNATestSystem.Services.Service
{
    public class StaffService : IStaffService
    {
        private readonly IApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        //thằng này sẽ có thể xác định được userId
        // Constructor injection for the database context
        public StaffService(IApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;

        }
        private int GetCurrentUserId()
        {
            var claim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
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

        public async Task<List<TestRequestViewDto>> PendingTestRequestAsync()
        {

            var result = await _context.TestRequests
                .Where(x => x.Status == "Pending")
                .Include(x => x.Service)
                .Include(x => x.RequestDeclarants)
                .Include(x => x.TestSamples)
                .Select(x => new TestRequestViewDto
                {
                    RequestId = x.RequestId,
                    ServiceName = x.Service.ServiceName,
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

        public async Task<List<TestRequestViewDto>> AtCenterTestRequestAsync()
        {

            var result = await _context.TestRequests
                .Include(x => x.Service)
                .Include(x => x.RequestDeclarants)
                .Include(x => x.TestSamples)
                .Include(x => x.CollectType)
                .Where(x => x.CollectType.CollectName.ToLower() == "at center")
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

        public async Task<List<TestRequestViewDto>> AtHomeTestRequestAsync()
        {

            var result = await _context.TestRequests
                .Include(x => x.Service)
                .Include(x => x.RequestDeclarants)
                .Include(x => x.TestSamples)
                .Where(x => x.CollectType.CollectName.ToLower() == "at home")
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

        public async Task<List<TestRequestViewDto>> GetAtCenterAdministrativeRequestsAsync()
        {
            int staffId = GetCurrentUserId();
            if (staffId == 0) return new List<TestRequestViewDto>();

            var result = await _context.TestProcesses
                .Include(p => p.Request)
                    .ThenInclude(r => r.Service)
                .Include(p => p.Request)
                    .ThenInclude(r => r.CollectType)
                .Include(p => p.Request)
                    .ThenInclude(r => r.RequestDeclarants)
                .Include(p => p.Request)
                    .ThenInclude(r => r.TestSamples)
                .Where(p => p.StaffId == staffId &&
                            p.Request.CollectType.CollectName.ToLower() == "at center" &&
                            p.Request.Category.ToLower() == "administrative")
                .Select(p => new TestRequestViewDto
                {
                    RequestId = p.Request.RequestId,
                    ServiceName = p.Request.Service.ServiceName,
                    CollectionType = p.Request.CollectType.CollectName,
                    Category = p.Request.Category,
                    Status = p.Request.Status,
                    ScheduleDate = p.Request.ScheduleDate,
                    CreatedAt = p.Request.CreatedAt,
                    Address = p.Request.Address,
                    Declarant = p.Request.RequestDeclarants.Select(d => new DeclarantDto
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
                    Sample = p.Request.TestSamples.Select(s => new TestSampleDto
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

        public async Task<List<TestProcessDto>> GetTestProcessesByStaffIdAsync()
        {
            int staffId = GetCurrentUserId();
            if (staffId == 0) return new List<TestProcessDto>();

            var testProcesses = await _context.TestProcesses
                .Include(tp => tp.Request)
                    .ThenInclude(r => r.Service)
                .Include(tp => tp.Request)
                    .ThenInclude(r => r.CollectType)
                .Include(tp => tp.Request)
                    .ThenInclude(r => r.RequestDeclarants)
                .Include(tp => tp.Request)
                    .ThenInclude(r => r.TestSamples)
                .Where(tp =>
                    tp.StaffId == staffId &&
                    tp.Request.Status.ToLower() != "completed"
                )
                .ToListAsync();

            var result = testProcesses.Select(tp => new TestProcessDto
            {
                Request = new RequestDto
                {
                    RequestId = tp.Request.RequestId,
                    ServiceId = tp.Request.ServiceId,
                    ServiceName = tp.Request.Service?.ServiceName,
                    TypeId = tp.Request.TypeId,
                    CollectType = tp.Request.CollectType?.CollectName,
                    Category = tp.Request.Category,
                    ScheduleDate = tp.Request.ScheduleDate,
                    Address = tp.Request.Address,
                    Status = tp.Request.Status,
                    CreatedAt = tp.Request.CreatedAt
                },

                TestProcess = new TestProcessInfoDto
                {
                    ProcessId = tp.ProcessId,
                    RequestId = tp.RequestId,
                    StaffId = tp.StaffId,
                    KitCode = tp.KitCode ?? "",
                    CurrentStatus = tp.CurrentStatus,
                    Notes = tp.Notes
                },

                Declarant = tp.Request.RequestDeclarants.FirstOrDefault() == null ? null : new DeclarantDto
                {
                    FullName = tp.Request.RequestDeclarants.First().FullName,
                    Gender = tp.Request.RequestDeclarants.First().Gender,
                    IdentityNumber = tp.Request.RequestDeclarants.First().IdentityNumber,
                    IdentityIssuedDate = tp.Request.RequestDeclarants.First().IdentityIssuedDate,
                    IdentityIssuedPlace = tp.Request.RequestDeclarants.First().IdentityIssuedPlace,
                    Address = tp.Request.RequestDeclarants.First().Address,
                    Phone = tp.Request.RequestDeclarants.First().Phone,
                    Email = tp.Request.RequestDeclarants.First().Email
                }
            }).ToList();

            return result;
        }

        public async Task<List<StaffGetTestSampleDto>> GetSamplesByRequestAsync(int requestId)
        {
            int staffId = GetCurrentUserId();
            if (staffId == 0) return new List<StaffGetTestSampleDto>();

            var isAuthorized = await _context.TestProcesses
                .AnyAsync(p => p.RequestId == requestId && p.StaffId == staffId);

            if (!isAuthorized)
                return new List<StaffGetTestSampleDto>();

            var samples = await _context.TestSamples
                .Where(s => s.RequestId == requestId)
                .Select(s => new StaffGetTestSampleDto
                {
                    SampleId = s.SampleId,
                    OwnerName = s.OwnerName,
                    Gender = s.Gender,
                    Relationship = s.Relationship,
                    SampleType = s.SampleType,
                    Yob = s.Yob
                })
                .ToListAsync();

            return samples;
        }

        public async Task<ApiResponseDto> AssignTestProcessAsync(AssignTestProcessDto dto)
        {
            var collectionType = dto.CollectionType?.Trim().ToLower();

            var request = await _context.TestRequests
                .FirstOrDefaultAsync(r => r.RequestId == dto.RequestId);

            if (request == null)
            {
                return new ApiResponseDto
                {
                    Success = false,
                    Message = "Không tìm thấy đơn xét nghiệm."
                };
            }

            // ✅ Bước 2: Nếu status là 'Confirmed' thì không được tiếp tục
            if (request.Status != null && request.Status.Trim().ToLower() == "confirmed")
            {
                return new ApiResponseDto
                {
                    Success = false,
                    Message = "Không thể gán xử lý vì đơn đã được xác nhận (Confirmed)."
                };
            }

            var process = new TestProcess
            {
                RequestId = dto.RequestId,
                StaffId = dto.StaffId,
                ClaimedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Notes = dto.Notes
            };

            switch (collectionType)
            {
                case "at home":
                    process.KitCode = dto.KitCode;
                    process.CurrentStatus = "KIT NOT SENT";

                    break;

                case "at center":
                    process.KitCode = string.Empty;
                    process.CurrentStatus = "WAITING_FOR_APPOINTMENT";
                    break;

                default:
                    return new ApiResponseDto
                    {
                        Success = false,
                        Message = "Invalid CollectionType. Accepted values: 'At Home', 'At Center'."
                    };
            }

            _context.TestProcesses.Add(process);
            await _context.SaveChangesAsync();

            return new ApiResponseDto
            {
                Success = true,
                Message = "Assigned test process successfully."
            };
        }

        public async Task<bool> CreateSampleCollectionsAsync(SampleCollectionFormsSummaryDto request)
        {
            var process = await _context.TestProcesses
                .Include(p => p.Request)
                .FirstOrDefaultAsync(p => p.ProcessId == request.ProcessId);

            if (process == null)
                return false;

            var forms = request.sampleProviders.Select(p => new SampleCollectionForm
            {
                CollectionId = request.CollectionId,
                ProcessId = request.ProcessId,
                RequestId = process.RequestId,
                Location = request.location,
                FullName = p.FullName,
                Yob = p.Yob,
                Gender = p.Gender,
                Idtype = p.IdType,
                Idnumber = p.Idnumber,
                IdissuedDate = p.IdissuedDate,
                IdissuedPlace = p.IdissuedPlace,
                Address = p.Address,
                SampleType = p.SampleType,
                Quantity = p.Quantity,
                Relationship = p.Relationship,
                HasGeneticDiseaseHistory = p.HasGeneticDiseaseHistory,
                FingerprintImage = p.FingerprintImage,
                ConfirmedBy = p.ConfirmedBy,
                Note = p.Note
            }).ToList();

            _context.SampleCollectionForms.AddRange(forms);

            process.CurrentStatus = "SAMPLE_RECEIVED";
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<string?> GetFingerprintImageBySlugAsync(int collectId)
        {
            var form = await _context.SampleCollectionForms
              .Where(f => f.CollectionId == collectId)
              .Select(f => f.FingerprintImage)
              .FirstOrDefaultAsync();
            return form;
        }

        public async Task<bool> MarkTestProcessSampleReceivedAsync(UpdateTestProcessModel model)
        {
            int staffId = GetCurrentUserId();
            if (staffId == 0) return false;

            var process = await _context.TestProcesses
                .FirstOrDefaultAsync(p => p.ProcessId == model.ProcessId && p.StaffId == staffId);

            if (process == null)
                return false;

            process.CurrentStatus = "SAMPLE_RECEIVED";
            process.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateTestSamplesByRequestAsync(UpdateTestSampleDto dto)
        {
            int staffId = GetCurrentUserId();
            if (staffId == 0) return false;

            // Kiểm tra quyền
            var hasPermission = await _context.TestProcesses
                .AnyAsync(p => p.RequestId == dto.RequestId && p.StaffId == staffId);
            if (!hasPermission)
                return false;

            // Lấy các sample thuộc request
            var samples = await _context.TestSamples
                .Where(s => s.RequestId == dto.RequestId)
                .ToListAsync();

            if (!samples.Any()) return false;

            // Update tất cả với cùng dữ liệu
            foreach (var sample in samples)
            {
                sample.OwnerName = dto.OwnerName;
                sample.Gender = dto.Gender;
                sample.Relationship = dto.Relationship;
                sample.SampleType = dto.SampleType;
                sample.Yob = dto.Yob;
                sample.CollectedAt = dto.CollectedAt;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<StaffFeedbackViewDto>> GetFeedbacksByStaffIdAsync(int staffId)
        {
            var feedbacks = await _context.Feedbacks
                .Include(f => f.Result)
                .Include(f => f.User)
                .Where(f => f.Result != null && f.Result.EnteredBy == staffId)
                .Select(f => new StaffFeedbackViewDto
                {
                    FeedbackId = f.FeedbackId,
                    ResultId = f.ResultId ?? 0,
                    UserId = f.UserId ?? 0,
                    UserFullName = f.User!.FullName,
                    Rating = f.Rating ?? 0,
                    Comment = f.Comment,
                    CreatedAt = f.CreatedAt
                })
                .ToListAsync();

            return feedbacks;
        }

        public async Task<bool> UpdateTestRequestStatusAsync(UpdateTestRequestModel model)
        {
            var request = await _context.TestRequests.FindAsync(model.RequestId);
            if (request == null)
                throw new Exception("Không tìm thấy đơn xét nghiệm.");

            request.Status = model.NewStatus;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CreateTestResultByStaffAsync(CreateTestResultDto dto)
        {
            int staffId = GetCurrentUserId();
            if (staffId == 0)
                throw new Exception("Không xác định được staff từ token.");

            var requestExists = await _context.TestRequests.AnyAsync(r => r.RequestId == dto.RequestId);
            if (!requestExists)
                throw new Exception("Request không tồn tại.");

            var result = new TestResult
            {
                RequestId = dto.RequestId,
                EnteredBy = staffId,
                ResultData = dto.Data,
                Status = "Pending",
                EnteredAt = DateTime.UtcNow
            };

            _context.TestResults.Add(result);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<SampleCollectionFormsSummaryDto> GetSampleCollectionsByStaffIdAsync(GetSampleCollectionFormsModel request)
        {
            int staffId = GetCurrentUserId(); // Lấy từ JWT
            if (staffId == 0) return null;

            var process = await _context.TestProcesses
                .Include(p => p.SampleCollectionForms)
                .FirstOrDefaultAsync(p => p.ProcessId == request.ProcessId && p.StaffId == staffId);

            if (process == null) return null;

            var anyForm = process.SampleCollectionForms.FirstOrDefault();
            if (anyForm == null) return null;

            var result = new SampleCollectionFormsSummaryDto
            {
                CollectionId = anyForm.CollectionId,
                ProcessId = process.ProcessId,
                location = anyForm.Location,
                sampleProviders = process.SampleCollectionForms.Select(f => new SampleProviders
                {
                    FullName = f.FullName,
                    Gender = f.Gender,
                    Yob = f.Yob,
                    IdType = f.Idtype,
                    Idnumber = f.Idnumber,
                    IdissuedDate = f.IdissuedDate,
                    IdissuedPlace = f.IdissuedPlace,
                    Address = f.Address,
                    SampleType = f.SampleType,
                    Quantity = f.Quantity,
                    Relationship = f.Relationship,
                    HasGeneticDiseaseHistory = f.HasGeneticDiseaseHistory ?? false,
                    FingerprintImage = f.FingerprintImage,
                    ConfirmedBy = f.ConfirmedBy,
                    Note = f.Note
                }).ToList()
            };
            return result;
        }

        public async Task<List<GetTestResultDto>> GetTestResultsByTestRequestIdAsync(int test_requestId)
        {
            var data = _context.TestResults
                        .Where(x => x.RequestId == test_requestId);

            if (data == null || !data.Any())
            {
                return new List<GetTestResultDto>();
            }
            return await data.Select(x => new GetTestResultDto
            {
                ResultId = x.ResultId,
                RequestId = x.RequestId,
                EnteredBy = x.EnteredBy,
                VerifiedAt = x.VerifiedAt,
                ResultData = x.ResultData,
                Status = x.Status,
                VerifiedBy = x.VerifiedBy,
                EnteredAt = x.EnteredAt
            }).ToListAsync();

        }
        public async Task<StaffFeedbackDto> GetFeedbackByTestRequestIdAsync(int test_requestId)
        {
            var data = _context.Feedbacks
                       .Where(x => x.ResultId == test_requestId);
            if (data == null || !data.Any())
            {
                return new StaffFeedbackDto();
            }
            return await data.Select(x => new StaffFeedbackDto
            {
                FeedbackId = x.FeedbackId,
                Comment = x.Comment,
                CreatedAt = x.CreatedAt,
                Rating = x.Rating,
                ResultId = x.ResultId,
                UserId = x.UserId
            }).FirstOrDefaultAsync();

        }
        public async Task<UpdateKitCodeByTestProcess> UpdateKitCodeByTestProcessIdAsync(UpdateKitCodeByTestProcess dto)
        {
            var process = await _context.TestProcesses
                .FirstOrDefaultAsync(p => p.ProcessId == dto.ProcessId);
            if (process == null)
                return null;
            process.KitCode = dto.KitCode;
            process.UpdatedAt = DateTime.UtcNow;
            process.CurrentStatus = "Kit Sent";
            await _context.SaveChangesAsync();
            return new UpdateKitCodeByTestProcess
            {
                ProcessId = process.ProcessId,
                KitCode = process.KitCode
            };

        }

        public async Task<List<UpdatedTestSampleDto>> UpdateTesSampleByTestRequestAndSampleId(List<UpdatedTestSampleDto> dtos)
        {
            var updatedList = new List<UpdatedTestSampleDto>();

            foreach (var item in dtos)
            {
                var sample = await _context.TestSamples
                    .FirstOrDefaultAsync(x => x.SampleId == item.SampleId && x.RequestId == item.RequestId);

                if (sample == null) continue;

                // Cập nhật dữ liệu
                sample.OwnerName = item.OwnerName;
                sample.Gender = item.Gender;
                sample.Relationship = item.Relationship;
                sample.SampleType = item.SampleType;
                sample.Yob = item.Yob;
                sample.CollectedAt = item.CollectedAt;

                updatedList.Add(item);
            }

            await _context.SaveChangesAsync();
            return updatedList;
        }
        public async Task<bool> UpdateTestResultByResultIdAsync(StaffUpdateTestResult dto)
        {

            var result = await _context.TestResults
                .FirstOrDefaultAsync(r => r.ResultId == dto.ResultID);
            if (result == null) return false;
            result.ResultData = dto.ResultData;
            result.VerifiedAt = DateTime.UtcNow;
            result.Status = "Pending";
            await _context.SaveChangesAsync();
            return true;
        }

    }
}

