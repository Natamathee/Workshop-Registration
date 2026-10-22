# Workshop Registration System API

A RESTful backend API for discovering workshops and managing member registrations. It supports user authentication, role-based access control, workshop administration, and workshop registration rules.

## Features

### Authentication and Users

- Register and log in with email and password
- Password hashing with bcryptjs
- JWT bearer-token authentication via the Authorization header only; login still sets an HTTP-only cookie, which is not used for authentication
- Roles: `admin` and `member`
- Protected routes and role-based authorization
- Registration accepts either role, following PJ01-SportFacility and PJ02-EquipmentRent
- Logout clears the cookie; clients must discard their bearer token, which remains valid until expiration

### Workshops

- Public workshop listing and detail endpoints
- Case-insensitive search by name, description, instructor, or location using `?search=`
- Admin-only create, update, and delete operations
- Workshop fields: name, description, instructor, workshop date, location, capacity, and active status
- Workshop dates must be real calendar dates in `YYYY-MM-DD` format and cannot precede today in UTC
- Capacity must be a positive integer and cannot be reduced below the existing registration count
- Workshop deletion is a soft delete; registration history remains available
- Workshop names may repeat, for example for recurring courses on different dates

### Registrations

- Members can register for active workshops using the workshop ID
- Members can view, update, and delete their own registrations
- Admins can view, update, and delete any registration; creation is member-only
- Each registration has its own ID and references its workshop and authenticated member
- Editing moves a registration to another eligible workshop; omitted workshop retains the current value
- Ownership comes from authentication and cannot be changed through request bodies
- Deletion permanently removes the registration and frees its workshop seat

### Registration Rules

- Registration is permitted through the workshop date, including today, using UTC dates
- Registration count cannot exceed workshop capacity
- A member can have only one registration per workshop
- A member can have at most three active workshop registrations
- An active registration refers to a workshop with `isActive=true` and `workshopDate` today or later; past or soft-deleted workshops do not count toward the three-workshop limit
- Create and update enforce the same rules; an update excludes its own record from duplicate, capacity, and active-count checks
- Changing a workshop's date cannot reactivate registrations in a way that exceeds any member's active-registration limit
- History remains readable/deletable after the workshop date or workshop deletion. Editing requires an eligible target workshop
- Workshop and registration mutations are serialized within one Node.js process; the database also has a unique index on `(user, workshop)` to prevent duplicate registrations

The count-based capacity and active-registration checks assume one backend process. Multiple server processes require database-level transaction/locking coordination to enforce those counts across instances. No approval, waitlist, attendance tracking, or payment workflow is specified.

### Security and Documentation

- Helmet security headers
- CORS support
- Request rate limiting: 100 requests per IP per 10 minutes
- HTTP parameter pollution protection
- Swagger/OpenAPI documentation at `/api-docs`
- Health check at `/health` (application status only; does not check database connectivity)

## Technology Stack

- Node.js and Express.js
- MongoDB with Mongoose ODM
- JWT and bcryptjs
- Swagger UI and OpenAPI
- Nodemon for development

Dependency ranges and locked versions match PJ02-EquipmentRent, including Express `^5.1.0` and Mongoose `^8.24.4`. This project follows the same CommonJS modules, async controllers, authentication middleware, Mongoose models, and response conventions as PJ01/PJ02.

## Project Structure

```text
config/          Environment and database configuration
controllers/     Request handlers and business rules
middleware/      Authentication, authorization, and mutation serialization
models/          Mongoose schemas and registration uniqueness index
routes/          Express API routes and Swagger documentation
server.js        Application entry point
```

## Setup

1. From `PJ03-WorkshopRegist`, install the locked dependencies:

   ```bash
   npm ci
   ```

2. Set `MONGO_URI` in `config/config.env` to your MongoDB connection string. It is intentionally blank initially. Set your own `JWT_SECRET` before deploying; the included value is generated for local development.

   ```dotenv
   NODE_ENV=development
   PORT=5000
   MONGO_URI=
   JWT_SECRET=<your-secret>
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   FRONTEND_URL=http://localhost:3000
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

The API runs on `http://localhost:5000` by default. Change `PORT` if another project already uses port 5000. With `MONGO_URI` blank, welcome, Swagger UI, and health endpoints work; database-backed APIs require a configured connection. Allow Mongoose to create the registration uniqueness index when connecting to a new database.

## API Routes

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/logout`
- `GET /api/v1/workshops` (public; optional `?search=photography`)
- `GET /api/v1/workshops/:id` (public)
- `POST /api/v1/workshops` (admin)
- `PUT /api/v1/workshops/:id` (admin)
- `DELETE /api/v1/workshops/:id` (admin)
- `GET /api/v1/registrations` (member or admin)
- `GET /api/v1/registrations/:id` (owner or admin)
- `POST /api/v1/registrations` (member)
- `PUT /api/v1/registrations/:id` (owner or admin)
- `DELETE /api/v1/registrations/:id` (owner or admin)

Successful responses use `{ success: true, data }`, with `count` for lists. Registration and login return the JWT in `data.token`. Errors use `{ success: false, error }`. Explicit validation errors return 400, missing credentials 401, forbidden access 403, missing resources 404, and registration/capacity conflicts 409. As in PJ01/PJ02, other unhandled Mongoose validation/cast errors reach the global error handler and default to 500. Registration duplicate-key errors are handled as 409.

### Workshop Request Example

```json
{
  "name": "Introduction to Photography",
  "description": "Learn practical camera skills",
  "instructor": "Example Instructor",
  "workshopDate": "2026-12-01",
  "location": "Training room A",
  "capacity": 20
}
```

Use a date that is today or later when trying this example.

### Registration Request Example

```json
{
  "workshop": "<workshop MongoDB ID>"
}
```

The workshop ID comes from the workshop response's `_id`. To move an existing registration, send the same body with the new workshop ID using `PUT /api/v1/registrations/:id`.

Send `Authorization: Bearer <JWT>` with protected requests. In Swagger, click **Authorize** and paste `data.token` without the `Bearer ` prefix.

## Checks

```bash
npm test
```

`npm test` performs the same entry-point syntax check as PJ01/PJ02. Use Swagger UI against a test MongoDB database to verify database integration. Development verification exercised real HTTP routes, controllers, middleware, and schemas with in-memory persistence; it did not connect to your database.

