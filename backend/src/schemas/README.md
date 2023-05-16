# Super schema structure

```js
export const mySchema: SuperSchemaRunner = () => {
  return {
    body: useBodySchema(),
    params: useParamsSchema(),
    query: useQuerySchema(),
  };
};

function useBodySchema(): SchemaProvider {
  return () =>
    schemaForType<TYPE>()(
      z.object({})
    );
}

function useParamsSchema(): SchemaProvider {
  return () =>
    schemaForType<TYPE>()(
      z.object({})
    );
}

function useQuerySchema(): SchemaProvider {
  return () =>
    schemaForType<TYPE>()(
      z.object({})
    );
}
```
