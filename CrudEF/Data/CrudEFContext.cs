using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CrudEF.Models;

namespace CrudEF.Data
{
    public class CrudEFContext : DbContext
    {
        public CrudEFContext (DbContextOptions<CrudEFContext> options)
            : base(options)
        {
        }

        public DbSet<CrudEF.Models.Movie>? Movie { get; set; }
    }
}
