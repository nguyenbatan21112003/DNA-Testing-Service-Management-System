using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.RequestDeclarant;
using DNATestSystem.BusinessObjects.Application.Dtos.Staff;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
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
        public StaffService(IApplicationDbContext context)
        {

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

        public async Task<List<TestRequestViewDto>> AtCenterTestRequestAsync()
        {

            var result = await _context.TestRequests
                .Include(x => x.Service)
                .Include(x => x.RequestDeclarants)
                .Include(x => x.TestSamples)
                .Include(x => x.CollectType)
                .Where(x => x.CollectType.CollectName == "At Center")
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
                .Include(x => x.CollectType)
                .Where(x => x.CollectType.CollectName == "At Home")
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

        public async Task<(bool Success, string Message)> AssignTestProcessAsync(AssignTestProcessDto dto)
        {

            var process = new TestProcess
            {
                RequestId = dto.RequestId,
                StaffId = dto.StaffId,
                ClaimedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Notes = dto.Notes,
            };

            if (dto.CollectionType == "At Home")
            {
                process.KitCode = dto.KitCode;
                process.CurrentStatus = "KIT SENT";
            }
            else if (dto.CollectionType == "At Center")
            {
                process.KitCode = "";
                process.CurrentStatus = "WAITING_FOR_APPOINTMENT";
            }
            else
            {
                return (false, "Invalid CollectType.");
            }
            // là như thế này , nếu mà staff để là At home thì lưu kit
            // và chỉnh CurrentStatus , còn nếu ko có thì coi như là để trống 
            _context.TestProcesses.Add(process);
            await _context.SaveChangesAsync();

            return (true, "Assigned test process successfully.");

        }

        public async Task<List<TestRequestViewDto>> GetAtCenterAdministrativeRequestsAsync(int staffId)
        {
            var result = await _context.TestProcesses
               .Include(p => p.Request)
                   .ThenInclude(r => r.Service)
               .Include(p => p.Request)
                   .ThenInclude(r => r.CollectType) // Type là CollectType
               .Include(p => p.Request)
                   .ThenInclude(r => r.RequestDeclarants)
               .Include(p => p.Request)
                   .ThenInclude(r => r.TestSamples)
               .Where(p => p.StaffId == staffId &&
                           p.Request.CollectType.CollectName == "At Center" &&
                           p.Request.Category == "Administrative")
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

        public async Task<List<TestProcessDto>> GetTestProcessesByStaffIdAsync(int staffId)
        {
            var testProcesses = await _context.TestProcesses
                                    .Include(tp => tp.Request)
                                        .ThenInclude(r => r.Service)
                                    .Include(tp => tp.Request)
                                        .ThenInclude(r => r.CollectType)
                                    .Include(tp => tp.Request)
                                        .ThenInclude(r => r.RequestDeclarants)
                                    .Include(tp => tp.Request)
                                        .ThenInclude(r => r.TestSamples)
                                    .Where(tp => tp.StaffId == staffId && tp.Request != null && tp.Request.Status != "COMPLETED")
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
                },

                Samples = tp.Request.TestSamples.Select(tr => new TestRequestSampleDto
                {
                    OwnerName = tr.OwnerName,
                    Gender = tr.Gender,
                    Relationship = tr.Relationship,
                    Yob = tr.Yob,
                    SampleType = tr.SampleType,
                    CollectedAt = tr.CollectedAt
                }).ToList()
            }).ToList();

            return result;
        }           
   
    }
}
