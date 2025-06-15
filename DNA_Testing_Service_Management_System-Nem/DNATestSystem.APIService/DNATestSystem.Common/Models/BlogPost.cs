using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DNATestSystem.BusinessObjects.Models;

public partial class BlogPost
{
    [Key]
    public int PostId { get; set; }

    public string? Title { get; set; }

    public string? Slug { get; set; }

    public string? Summary { get; set; }

    public string? Content { get; set; }

    public int? AuthorId { get; set; }

    public bool? IsPublished { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual User? Author { get; set; }
}
