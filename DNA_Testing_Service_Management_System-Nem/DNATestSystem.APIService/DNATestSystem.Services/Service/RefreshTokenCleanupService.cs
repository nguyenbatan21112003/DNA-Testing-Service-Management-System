using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DNATestSystem.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DNATestSystem.Services.Service
{
    public class RefreshTokenCleanupService
    {

        private readonly IApplicationDbContext _context;

        public RefreshTokenCleanupService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CleanupExpiredTokensAsync()
        {
            var now = DateTime.UtcNow;
            var expired = await _context.RefreshTokens
                .Where(t => t.ExpiresAt < now)
                .ToListAsync();

            if (expired.Any())
            {
                _context.RefreshTokens.RemoveRange(expired);
                await _context.SaveChangesAsync();
            }
        }

    }
}
