using LandRegister.Application.DTOs;

namespace LandRegister.Application.Interfaces
{
    public interface IPropertyService
    {
        Task<PropertyDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<PropertyDto>> GetAllAsync();
        Task<PropertyDto> CreateAsync(CreatePropertyDto dto, Guid userId);
        Task UpdateAsync(Guid id, UpdatePropertyDto dto);
        Task DeleteAsync(Guid id);
    }
}