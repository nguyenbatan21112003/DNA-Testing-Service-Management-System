﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.BusinessObjects.Application.Dtos.ApiResponse;
using DNATestSystem.BusinessObjects.Application.Dtos.ConsultRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.FeedBack;
using DNATestSystem.BusinessObjects.Application.Dtos.Pdf;
using DNATestSystem.BusinessObjects.Application.Dtos.SampleCollectionForms;
using DNATestSystem.BusinessObjects.Application.Dtos.Staff;
using DNATestSystem.BusinessObjects.Application.Dtos.TestProcess;
using DNATestSystem.BusinessObjects.Application.Dtos.TestRequest;
using DNATestSystem.BusinessObjects.Application.Dtos.TestResult;
using DNATestSystem.BusinessObjects.Application.Dtos.TestSample;
using DNATestSystem.BusinessObjects.Models;

namespace DNATestSystem.Services.Interface
{
    public interface IStaffService
    {
        Task<List<PendingConsultDto>> PendingConsultResultsAsync();
        Task<bool> UpdateConsultResultAsync(UpdateConsultRequestDto updateConsultRequestDto);
        //Task<(bool Success, string Message, int? RequestId)> SubmitTestRequestAsync(TestRequestSubmissionDto dto);
        Task<List<TestRequestViewDto>> PendingTestRequestAsync();
        Task<List<TestRequestViewDto>> AtCenterTestRequestAsync();
        Task<List<TestRequestViewDto>> AtHomeTestRequestAsync();
        Task<ApiResponseDto> AssignTestProcessAsync(AssignTestProcessDto dto);

        //
        Task<List<TestRequestViewDto>> GetAtCenterAdministrativeRequestsAsync();
        //
        Task<List<TestProcessDto>> GetTestProcessesByStaffIdAsync();
        //
        //Task<List<TestSampleDto>> GetSamplesByStaffAndRequestAsync(int requestId);
        //đổi lại tên method
        Task<List<StaffGetTestSampleDto>> GetSamplesByRequestAsync(int requestId);
        //gửi đơn
        Task<bool> CreateSampleCollectionsAsync(SampleCollectionFormsSummaryDto request);
        //update TestProcess 49
        Task<bool> MarkTestProcessSampleReceivedAsync(UpdateTestProcessModel model);
        // update Sample 51
        Task<bool> UpdateTestSamplesByRequestAsync(UpdateTestSampleDto dto);

        Task<List<StaffFeedbackViewDto>> GetFeedbacksByStaffIdAsync(int staffId);
        //
        Task<bool> UpdateTestRequestStatusAsync(UpdateTestRequestModel model);
        //Tao test Result
        Task<bool> CreateTestResultByStaffAsync(CreateTestResultDto dto);

        Task<SampleCollectionFormsSummaryDto> GetSampleCollectionsByStaffIdAsync(GetSampleCollectionFormsModel request);

        //Task<bool> CreateSampleCollectionsAsync(SampleCollectionFormsSummaryDto request);
        //68
        Task<List<GetTestResultDto>> GetTestResultsByTestRequestIdAsync(int test_requestId);
        //69
        Task<StaffFeedbackDto> GetFeedbackByTestRequestIdAsync(int test_requestId);

        //
        Task<UpdateKitCodeByTestProcess> UpdateKitCodeByTestProcessIdAsync(UpdateKitCodeByTestProcess dto);

        Task<List<UpdatedTestSampleDto>> UpdateTesSampleByTestRequestAndSampleId(List<UpdatedTestSampleDto> dtos);
    
        Task<bool> UpdateTestResultByResultIdAsync(StaffUpdateTestResult dto);
        Task<string?> GetFingerprintImageBySlugAsync(int collectId);

    }
}
