# Super schema

## ...in a nutshell

```ts
type SchemaProvider = (ZodSchema | null) | Promise<ZodSchema | null>;

// obtained after calling `SuperSchemaRunner`
const superSchema = {
  params: SchemaProvider,
  body: SchemaProvider,
  query: SchemaProvider,
};

// build schema for request's `params`
const schema = await superSchema.params();

// use schema provider features (e.g. zod)
const result = await schema.safeParseAsync(request.params);
```

## ...basics

Super schema is basically "container" for up to 3 schema builders. Each schema builder targets one of `request` properties (`query`, `params` and `body`). That object is obtained after calling [SuperSchemaRunner](../types/super-schema.ts). This allows to extract common calls.

Each super schema object property (params, body, query) expects [SchemaProvider](../types/super-schema.ts) - parameterless function that builds up schema.

## ...template

```js
export const mySchema: SuperSchemaRunner = defineSuperSchemaRunner((common: SuperCommonParam) => {
  return {
    body: useBodySchema(),
    params: ...,
    query: ...,
  };
});

function useBodySchema(): SchemaProvider {
  return () =>
    schemaForType<TYPE>()(
      z.object({})
    );
}
```
