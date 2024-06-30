Generate models:

```bash
npx typeorm-model-generator -h 127.0.0.1 -d alerts -p 5433 -u alerts -x Alerts123* -e postgres -o ./src/database/entities --skipTables "migrations" --noConfig --case-file param --lazy --strictMode
```

Create a new migration:
```bash
npx typeorm migration:create ./src/database/migrations/create-random-table
```

Apply migrations:
```bash
pnpm run migration:run
```

Revert migrations:
```bash
pnpm run migration:revert
```

Apply seeders:
```bash
pnpm run seeder:run
```

Revert seeders:
```bash
pnpm run seeder:revert
```

Start development server:
```bash
nest start --watch
```

Run DB locally:
```bash
docker-compose -f docker-compose.local.yml up --force-recreate --build -d
```
