using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PortfolioTracker.Models;

namespace PortfolioTracker.Data
{
	public class PortfolioTrackerContext : DbContext
    {
        public PortfolioTrackerContext (DbContextOptions<PortfolioTrackerContext> options)
            : base(options)
        {
        }

        public DbSet<Portfolio> Portfolio { get; set; }

        public DbSet<Asset> Asset { get; set; }

        public DbSet<TradeHistory> TradeHistory { get; set; }

        public DbSet<User> User { get; set; }
    }
}
