using LandRegister.Domain.Entities;
using LandRegister.Infrastructure;
using LandRegister.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;


namespace LandRegister.Tests.Infrastructure
{
    public class PropertyRepositoryTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly PropertyRepository _repository;

        public PropertyRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _repository = new PropertyRepository(_context);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnProperty_WhenExists()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var property = new Property
            {
                Id = Guid.NewGuid(),
                Reference = "REF123",
                SellerContact = "John Doe",
                Price = 100000m,
                Dimensions = "100x50",
                IsTitled = true,
                RegistrationDate = DateTime.UtcNow,
                UserId = userId
            };

            var user = new User { Id = userId, Username = "testuser" };
            await _context.Users.AddAsync(user);
            await _context.Properties.AddAsync(property);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdAsync(property.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(property.Id, result.Id);
            Assert.Equal(property.Reference, result.Reference);
            Assert.Equal(property.SellerContact, result.SellerContact);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenNotExists()
        {
            // Act
            var result = await _repository.GetByIdAsync(Guid.NewGuid());

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllProperties()
        {
            // Arrange
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();
            var properties = new List<Property>
            {
                new Property { Id = Guid.NewGuid(), Reference = "REF1", Price = 50000m, UserId = userId1 },
                new Property { Id = Guid.NewGuid(), Reference = "REF2", Price = 75000m, UserId = userId2 }
            };

            var users = new List<User>
            {
                new User { Id = userId1, Username = "userREF1" },
                new User { Id = userId2, Username = "userREF2" }
            };
            await _context.Users.AddRangeAsync(users);
            await _context.Properties.AddRangeAsync(properties);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            var resultList = result.ToList();
            Assert.Equal(2, resultList.Count);
            Assert.Contains(resultList, p => p.Reference == "REF1");
            Assert.Contains(resultList, p => p.Reference == "REF2");
        }

        [Fact]
        public async Task GetFilteredAsync_ShouldReturnFilteredProperties()
        {
            // Arrange
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();
            var userId3 = Guid.NewGuid();
            var properties = new List<Property>
            {
                new Property { Id = Guid.NewGuid(), Reference = "REF1", Price = 50000m, IsTitled = true, UserId = userId1 },
                new Property { Id = Guid.NewGuid(), Reference = "REF2", Price = 75000m, IsTitled = false, UserId = userId2 },
                new Property { Id = Guid.NewGuid(), Reference = "REF3", Price = 100000m, IsTitled = true, UserId = userId3 }
            };

            var users = new List<User>
            {
                new User { Id = userId1, Username = "userREF1" },
                new User { Id = userId2, Username = "userREF2" },
                new User { Id = userId3, Username = "userREF3" }
            };
            await _context.Users.AddRangeAsync(users);
            await _context.Properties.AddRangeAsync(properties);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetFilteredAsync(p => p.IsTitled);

            // Assert
            Assert.NotNull(result);
            var resultList = result.ToList();
            Assert.Equal(2, resultList.Count);
            Assert.All(resultList, p => Assert.True(p.IsTitled));
        }

        [Fact]
        public async Task AddAsync_ShouldAddPropertyToDatabase()
        {
            // Arrange
            var property = new Property
            {
                Id = Guid.NewGuid(),
                Reference = "NEWREF",
                Price = 200000m
            };

            // Act
            await _repository.AddAsync(property);

            // Assert
            var addedProperty = await _context.Properties.FindAsync(property.Id);
            Assert.NotNull(addedProperty);
            Assert.Equal(property.Reference, addedProperty.Reference);
            Assert.Equal(property.Price, addedProperty.Price);
        }

        [Fact]
        public void Update_ShouldMarkPropertyAsModified()
        {
            // Arrange
            var property = new Property
            {
                Id = Guid.NewGuid(),
                Reference = "ORIGINAL",
                Price = 100000m
            };

            _context.Properties.Add(property);
            _context.SaveChanges();

            // Act
            property.Reference = "UPDATED";
            _repository.Update(property);

            // Assert
            _context.SaveChanges();
            var updatedProperty = _context.Properties.Find(property.Id);
            Assert.NotNull(updatedProperty);
            Assert.Equal("UPDATED", updatedProperty.Reference);
        }

        [Fact]
        public void Delete_ShouldRemovePropertyFromDatabase()
        {
            // Arrange
            var property = new Property
            {
                Id = Guid.NewGuid(),
                Reference = "TODELETE",
                Price = 50000m
            };

            _context.Properties.Add(property);
            _context.SaveChanges();

            // Act
            _repository.Delete(property);
            _context.SaveChanges();

            // Assert
            var deletedProperty = _context.Properties.Find(property.Id);
            Assert.Null(deletedProperty);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}