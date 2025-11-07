using LandRegister.Application.DTOs;
using LandRegister.Application.Services;
using LandRegister.Domain.Entities;
using LandRegister.Domain.Interfaces;
using Moq;
using Xunit;

namespace LandRegister.Tests.Application
{
    public class PropertyServiceTests
    {
        private readonly Mock<IPropertyRepository> _propertyRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly PropertyService _propertyService;

        public PropertyServiceTests()
        {
            _propertyRepositoryMock = new Mock<IPropertyRepository>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _propertyService = new PropertyService(_propertyRepositoryMock.Object, _unitOfWorkMock.Object);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnPropertyDto_WhenPropertyExists()
        {
            // Arrange
            var propertyId = Guid.NewGuid();
            var property = new Property
            {
                Id = propertyId,
                Reference = "REF123",
                SellerContact = "John Doe",
                Price = 100000m,
                Dimensions = "100x50",
                IsTitled = true,
                RegistrationDate = DateTime.UtcNow,
                UserId = Guid.NewGuid()
            };

            _propertyRepositoryMock.Setup(repo => repo.GetByIdAsync(propertyId))
                .ReturnsAsync(property);

            // Act
            var result = await _propertyService.GetByIdAsync(propertyId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(property.Id, result.Id);
            Assert.Equal(property.Reference, result.Reference);
            Assert.Equal(property.SellerContact, result.SellerContact);
            Assert.Equal(property.Price, result.Price);
            Assert.Equal(property.Dimensions, result.Dimensions);
            Assert.Equal(property.IsTitled, result.IsTitled);
            Assert.Equal(property.RegistrationDate, result.RegistrationDate);
            Assert.Equal(property.UserId, result.UserId);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenPropertyDoesNotExist()
        {
            // Arrange
            var propertyId = Guid.NewGuid();
            _propertyRepositoryMock.Setup(repo => repo.GetByIdAsync(propertyId))
                .ReturnsAsync((Property?)null);

            // Act
            var result = await _propertyService.GetByIdAsync(propertyId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllPropertiesAsDtos()
        {
            // Arrange
            var properties = new List<Property>
            {
                new Property { Id = Guid.NewGuid(), Reference = "REF1", Price = 50000m },
                new Property { Id = Guid.NewGuid(), Reference = "REF2", Price = 75000m }
            };

            _propertyRepositoryMock.Setup(repo => repo.GetAllAsync())
                .ReturnsAsync(properties);

            // Act
            var result = await _propertyService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            var resultList = result.ToList();
            Assert.Equal(2, resultList.Count);
            Assert.Equal("REF1", resultList[0].Reference);
            Assert.Equal("REF2", resultList[1].Reference);
        }

        [Fact]
        public async Task CreateAsync_ShouldAddPropertyAndSaveChanges()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var createDto = new CreatePropertyDto
            {
                Reference = "NEWREF",
                SellerContact = "Jane Smith",
                Price = 200000m,
                Dimensions = "200x100",
                IsTitled = false
            };

            Property? capturedProperty = null;
            _propertyRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Property>()))
                .Callback<Property>(p => capturedProperty = p);
            _unitOfWorkMock.Setup(uow => uow.SaveChangesAsync(default))
                .ReturnsAsync(1);

            // Act
            var result = await _propertyService.CreateAsync(createDto, userId);

            // Assert
            Assert.NotNull(result);
            Assert.NotEqual(Guid.Empty, result.Id);
            Assert.Equal(createDto.Reference, result.Reference);
            Assert.Equal(createDto.SellerContact, result.SellerContact);
            Assert.Equal(createDto.Price, result.Price);
            Assert.Equal(createDto.Dimensions, result.Dimensions);
            Assert.Equal(createDto.IsTitled, result.IsTitled);
            Assert.Equal(userId, result.UserId);

            _propertyRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<Property>()), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(default), Times.Once);

            Assert.NotNull(capturedProperty);
            Assert.Equal(userId, capturedProperty.UserId);
            Assert.NotEqual(DateTime.MinValue, capturedProperty.RegistrationDate);
        }
    }
}