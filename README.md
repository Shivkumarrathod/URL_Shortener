# URL Shortener

Simple URL shortener built with Express, PostgreSQL, and Redis.

## Stack

- Node.js
- Express
- PostgreSQL
- Redis

## Features

- Create short URLs with `POST /shorten`
- Redirect short codes with `GET /:code`
- View URL stats with `GET /stats/:code`
- Redis caching for code resolution
- Redis-backed rate limiting

## Project Structure

```text
.
├── server.js
├── src
│   ├── app.js
│   ├── controllers
│   ├── db
│   │   ├── pool.js
│   │   └── schema.sql
│   ├── middleware
│   ├── routes
│   ├── services
│   └── utiles
└── tests
      └── integration
```

## Environment Variables

Create a `.env` file in the project root with these values:

```env
PORT=3000
NODE_ENV=development

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=urlshortener

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# App
BASE_URL=http://localhost:3000
CACHE_TTL=3600
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=10
```

## Run With Docker

Start PostgreSQL:

```powershell
docker run -d `
   --name urlshotener-postgres `
   -e POSTGRES_USER=postgres `
   -e POSTGRES_PASSWORD=postgres `
   -e POSTGRES_DB=urlshortener `
   -p 5432:5432 `
   postgres:16-alpine
```

Start Redis:

```powershell
docker run -d `
   --name urlshortener-redis `
   -p 6379:6379 `
   redis:7-alpine
```

## Load Database Schema

PowerShell does not support `<` redirection the same way as `cmd` or Bash. Use one of these forms.

PowerShell:

```powershell
Get-Content .\src\db\schema.sql | docker exec -i urlshotener-postgres psql -U postgres -d urlshortener
```

Command Prompt or Bash:

```bash
docker exec -i urlshotener-postgres psql -U postgres -d urlshortener < src/db/schema.sql
```

## Install And Start

Install dependencies:

```powershell
npm install
```

Start the app:

```powershell
npm start
```

Start in development mode:

```powershell
npm run dev
```

## API Endpoints

Create a short URL:

```http
POST /shorten
Content-Type: application/json

{
   "url": "https://example.com"
}
```

Example response:

```json
{
   "code": "abc123",
   "shortUrl": "http://localhost:3000/abc123"
}
```

Redirect to the original URL:

```http
GET /:code
```

Get stats for a short code:

```http
GET /stats/:code
```

## Query The Database In Docker

List tables:

```powershell
docker exec -it urlshotener-postgres psql -U postgres -d urlshortener -c "\dt"
```

Describe the `urls` table:

```powershell
docker exec -it urlshotener-postgres psql -U postgres -d urlshortener -c "\d urls"
```

Describe the `clicks` table:

```powershell
docker exec -it urlshotener-postgres psql -U postgres -d urlshortener -c "\d clicks"
```

Show all URLs:

```powershell
docker exec -it urlshotener-postgres psql -U postgres -d urlshortener -c "SELECT * FROM urls;"
```

Show all clicks:

```powershell
docker exec -it urlshotener-postgres psql -U postgres -d urlshortener -c "SELECT * FROM clicks;"
```

Show clicks joined with short codes:

```powershell
docker exec -it urlshotener-postgres psql -U postgres -d urlshortener -c "SELECT c.id, u.code, u.long_url, c.clicked_at, c.ip, c.user_agent FROM clicks c JOIN urls u ON u.id = c.url_id ORDER BY c.clicked_at DESC;"
```

Open an interactive `psql` session:

```powershell
docker exec -it urlshotener-postgres psql -U postgres -d urlshortener
```

Inside `psql`, useful commands are:

```sql
\dt
\d urls
\d clicks
SELECT * FROM urls;
SELECT * FROM clicks;
```

## Health Check

```http
GET /health
```

Expected response:

```json
{
   "status": "ok"
}
```
