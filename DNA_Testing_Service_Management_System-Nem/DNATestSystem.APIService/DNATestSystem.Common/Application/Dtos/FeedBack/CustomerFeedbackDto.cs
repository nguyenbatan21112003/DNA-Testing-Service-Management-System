using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.FeedBack
{
    public class CustomerFeedbackDto
    {
        public int FeedbackId { get; set; }
        public int? ResultId { get; set; }
        //public int UserId { get; set; }  không dùng vì do có thông tin userId trong token
        public int? Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
