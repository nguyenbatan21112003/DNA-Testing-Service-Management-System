﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Vnpay
{
    public class PaymentInformationModel
    {
        public int RequestId { get; set; }
        public string OrderType { get; set; }
        public double Amount { get; set; }
        public string OrderDescription { get; set; }
        public string Name { get; set; }
    }

}
