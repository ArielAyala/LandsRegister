using LandRegister.Application.DTOs;

namespace LandRegister.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> GetByIdAsync(Guid id);
        Task<UserDto?> GetByUsernameAsync(string username);
        Task<UserDto?> GetByEmailAsync(string email);
        Task<UserDto> CreateAsync(CreateUserDto dto);
        Task UpdateAsync(Guid id, UpdateUserDto dto);
        Task DeleteAsync(Guid id);
        Task<string> AuthenticateAsync(LoginDto dto);
    }
}