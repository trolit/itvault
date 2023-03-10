### Entities & Migrations

1. Add new entity / update entity.
2. Update [entities config](../backend/src/config/data-source/entities.ts) (if needed).
3. Generate migration:

```bash
npm run migration:generate .\src\migrations\<migration-name>
```

4. Update [migrations config](../backend/src/config/data-source/migrations.ts).
5. Turn on database.
6. Apply migration with the following statement:

```bash
npm run migration:run
```
