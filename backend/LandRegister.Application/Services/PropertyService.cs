using LandRegister.Application.DTOs;
using LandRegister.Application.Interfaces;
using LandRegister.Domain;

namespace LandRegister.Application.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _propertyRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PropertyService(IPropertyRepository propertyRepository, IUnitOfWork unitOfWork)
        {
            _propertyRepository = propertyRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<PropertyDto?> GetByIdAsync(Guid id)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            return property == null ? null : MapToDto(property);
        }

        public async Task<IEnumerable<PropertyDto>> GetAllAsync()
        {
            var properties = await _propertyRepository.GetAllAsync();
            return properties.Select(MapToDto);
        }

        // Accept userId extracted from the authenticated request
        public async Task<PropertyDto> CreateAsync(CreatePropertyDto dto, Guid userId)
        {
            var property = new Property
            {
                Id = Guid.NewGuid(),
                Reference = dto.Reference,
                SellerContact = dto.SellerContact,
                Price = dto.Price,
                LocationLink = dto.LocationLink,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Dimensions = dto.Dimensions,
                IsTitled = dto.IsTitled,
                RegistrationDate = DateTime.UtcNow,
                UserId = userId
            };

            await _propertyRepository.AddAsync(property);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(property);
        }

        public async Task UpdateAsync(Guid id, UpdatePropertyDto dto)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property == null) throw new KeyNotFoundException("Property not found");

            property.Reference = dto.Reference;
            property.SellerContact = dto.SellerContact;
            property.Price = dto.Price;
            property.LocationLink = dto.LocationLink;
            property.Latitude = dto.Latitude;
            property.Longitude = dto.Longitude;
            property.Dimensions = dto.Dimensions;
            property.IsTitled = dto.IsTitled;

            _propertyRepository.Update(property);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property == null) throw new KeyNotFoundException("Property not found");

            _propertyRepository.Delete(property);
            await _unitOfWork.SaveChangesAsync();
        }

        private static PropertyDto MapToDto(Property property)
        {
            return new PropertyDto
            {
                Id = property.Id,
                Reference = property.Reference,
                SellerContact = property.SellerContact,
                Price = property.Price,
                LocationLink = property.LocationLink,
                Latitude = property.Latitude,
                Longitude = property.Longitude,
                Dimensions = property.Dimensions,
                IsTitled = property.IsTitled,
                RegistrationDate = property.RegistrationDate,
                UserId = property.UserId,
                User = property.User != null ? property.User.Username : string.Empty
            };
        }
    }
}