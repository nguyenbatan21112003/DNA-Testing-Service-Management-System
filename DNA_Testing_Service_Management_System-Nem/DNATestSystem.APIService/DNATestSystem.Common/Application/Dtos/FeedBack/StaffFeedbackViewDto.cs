using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.FeedBack
{
    public class StaffFeedbackViewDto
    {
        public int FeedbackId { get; set; }
        public int ResultId { get; set; }
        public int UserId { get; set; }
        public string? UserFullName { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

}
