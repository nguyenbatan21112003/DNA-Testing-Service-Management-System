﻿using System;
using System.Collections.Generic;

namespace DNATestSystem.BusinessObjects.Models;

public partial class Role
{
    public int RoleId { get; set; }

    public string? RoleName { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
