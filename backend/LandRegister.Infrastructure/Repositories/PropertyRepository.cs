using LandRegister.Domain;
using Microsoft.EntityFrameworkCore;

namespace LandRegister.Infrastructure.Repositories
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly ApplicationDbContext _context;

        public PropertyRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Property?> GetByIdAsync(Guid id)
        {
            return await _context.Properties.FindAsync(id);
        }

        public async Task<IEnumerable<Property>> GetAllAsync()
        {
            return await _context.Properties.ToListAsync();
        }

        public async Task<IEnumerable<Property>> GetFilteredAsync(System.Linq.Expressions.Expression<Func<Property, bool>> predicate)
        {
            return await _context.Properties.Where(predicate).ToListAsync();
        }

        public async Task AddAsync(Property property)
        {
            await _context.Properties.AddAsync(property);
        }

        public void Update(Property property)
        {
            _context.Properties.Update(property);
        }

        public void Delete(Property property)
        {
            _context.Properties.Remove(property);
        }
    }
}