# LandsRegister

Full-stack solution for managing land properties and users. The project delivers an ASP.NET Core API protected with JWT and a React front end that consumes the endpoints to maintain the land registry.

## Tech stack

- **Backend:** ASP.NET Core Web API (.NET 8), Entity Framework Core, PostgreSQL.
- **Application & domain layers:** Service and repository abstractions encapsulating business logic.
- **Authentication:** JWT Bearer via ASP.NET Core Authentication.
- **Frontend:** React + Vite + TypeScript, React Router, Axios.
- **Styling:** Mobile-first modular CSS with custom design tokens.
- **Infrastructure:** Docker Compose scaffolding and EF Core migrations (in progress).

## Project status

🚧 This project is under construction. The core backend and the first iteration of authentication/property screens are in place, but additional validations, workflows, and end-to-end tests are still pending.

## Quick start

1. Configure environment secrets:
   - Set the database connection string in `backend/LandRegister.Api/appsettings.Development.json`.
   - Ensure JWT configuration (Key, Issuer, Audience) is properly set in `backend/LandRegister.Api/appsettings.json` (or override via environment variables for production).
   
   Example JWT configuration in `appsettings.json`:
   ```json
   {
     "Jwt": {
       "Key": "your-super-secure-secret",
       "Issuer": "LandRegister.Api",
       "Audience": "LandRegister.Api"
     }
   }
   ```
   For production, use a strong, randomly generated key and consider environment variables like `ASPNETCORE_Jwt__Key`.
2. From the `backend` directory, run:
   ```powershell
   dotnet restore
   dotnet ef database update
   dotnet run --project LandRegister.Api
   ```
3. In a separate terminal, start the frontend from `frontend`:
   ```powershell
   npm install
   npm run dev
   ```
4. Open `http://localhost:5173`, create or log into an account, and explore the dashboard.

## Next steps

- Harden backend validations and add unit tests.
- Implement richer role/permission workflows.
- Polish UX details and introduce automated end-to-end coverage.
