using System.Linq.Expressions;

namespace LandRegister.Domain
{
    public interface IPropertyRepository
    {
        Task<Property?> GetByIdAsync(Guid id);
        Task<IEnumerable<Property>> GetAllAsync();
        Task<IEnumerable<Property>> GetFilteredAsync(Expression<Func<Property, bool>> predicate);
        Task AddAsync(Property property);
        void Update(Property property);
        void Delete(Property property);
    }
}