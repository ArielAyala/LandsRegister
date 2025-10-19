using LandRegister.Domain;
using Microsoft.EntityFrameworkCore;

namespace LandRegister.Infrastructure
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure entities here
        }

        public DbSet<Property> Properties { get; set; }

    }
}