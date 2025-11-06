using System.Linq.Expressions;
using LandRegister.Domain;
using LandRegister.Domain.Entities;

namespace LandRegister.Domain.Interfaces
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