using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Models
{
    [Table("CollectType")]
    public class CollectType
    {
        [Key]
        [Column("CollectID")] 
        public int CollectTypeId { get; set; }

        [Column("CollectName")]
        public string CollectName { get; set; }

        public ICollection<TestRequest> TestRequests { get; set; }
    }

}
