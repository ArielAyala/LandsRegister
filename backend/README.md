# LandRegister Backend

## Development Setup

### PostgreSQL Database

This project uses PostgreSQL for data persistence. To run a lightweight PostgreSQL instance in development:

1. Ensure Docker is installed and running.
2. In the backend directory, run:
   ```
   docker-compose up -d
   ```
   This will start a PostgreSQL container with data persistence.

3. To stop the database:
   ```
   docker-compose down
   ```
   The data will persist in a Docker volume.

### Running the Application

1. Ensure the database is running (see above).
2. Run the API:
   ```
   dotnet run --project LandRegister.Api
   ```

### Database Migrations

To create and apply EF Core migrations:

1. Navigate to the Infrastructure project:
   ```
   cd LandRegister.Infrastructure
   ```

2. Add a migration:
   ```
   dotnet ef migrations add InitialCreate
   ```

3. Update the database:
   ```
   dotnet ef database update
   ```

### API Endpoints

- Health check: `GET /api/health`
- Test endpoints: `GET /api/test`, `POST /api/test`
- Properties:
  - `GET /api/properties` - Get all properties
  - `GET /api/properties/{id}` - Get property by ID
  - `POST /api/properties` - Create new property
  - `PUT /api/properties/{id}` - Update property
  - `DELETE /api/properties/{id}` - Delete property