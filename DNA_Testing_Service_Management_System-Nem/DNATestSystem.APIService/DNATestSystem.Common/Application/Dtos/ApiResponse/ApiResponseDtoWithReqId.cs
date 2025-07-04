using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.ApiResponse
{
    public class ApiResponseDtoWithReqId : ApiResponseDto
    {
        public int? RequestId { get; set; }

    }
}
