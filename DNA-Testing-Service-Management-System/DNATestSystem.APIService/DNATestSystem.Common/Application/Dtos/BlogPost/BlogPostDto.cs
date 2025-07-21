using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DNATestSystem.BusinessObjects.Application.Dtos.BlogPost
{
    public class BlogPostDto
    {
        public string? Title { get; set; }

        public string? Slug { get; set; }

        public string? Summary { get; set; }

        public string? Content { get; set; }

        public int? AuthorId { get; set; }

        public bool? IsPublished { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public string? ThumbnailUrl { get; set; }
    }
}
