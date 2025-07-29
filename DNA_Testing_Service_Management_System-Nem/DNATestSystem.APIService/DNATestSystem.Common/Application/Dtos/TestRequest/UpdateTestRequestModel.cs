using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestRequest
{
    public class UpdateTestRequestModel
    {
        public int RequestId { get; set; }
        public string? NewStatus { get; set; } // Trạng thái cập nhật
    }
}
