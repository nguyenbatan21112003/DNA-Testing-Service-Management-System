﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.TestProcess
{
    public class TestProcessInfoDto
    {
        public int ProcessId { get; set; }
        public int? RequestId { get; set; }  
        public int? StaffId { get; set; }
        public string KitCode { get; set; }
        public string CurrentStatus { get; set; }
        public string ProcessState { get; set; }
        public string Notes { get; set; }
    }
}
