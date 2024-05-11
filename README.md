Generate models:

```bash
npx typeorm-model-generator -h 127.0.0.1 -d alerts -p 5434 -u test -x test -e test -o ./src/database/entities --skipTables "migrations" --noConfig --case-file param --lazy --strictMode
```

Create a new migration:
```bash
npx typeorm migration:create ./src/database/migrations/create-random-table
```

Apply migrations:
```bash
npm run migration:run
```

Revert migrations:
```bash
npm run migration:revert
```

Start development server:
```bash
nest start --watch
```

Run DB locally:
```bash
docker-compose -f docker-compose.local.yml up --force-recreate --build -d
```
