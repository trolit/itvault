# Super schema

## ...in a nutshell

```ts
type SchemaProvider = (ZodSchema | null) | Promise<ZodSchema | null>;

type SuperSchema = {
  params: SchemaProvider;
  body: SchemaProvider;
  query: SchemaProvider;
};

// get super schema
const superSchema: SuperSchema = await useSuperSchemaRunner();

// build schema for request's `params`
const schema = await superSchema.params();

// use schema provider (e.g. zod) features
const result = await schema.safeParseAsync(request.params);
```

## ...basics

Super schema is basically "container" for up to 3 schema builders (type -> [SchemaProvider](../types/super-schema.ts)). Each schema builder targets one of `request` properties (`query`, `params`, `body`). Object with these schema builders is obtained after calling [SuperSchemaRunner](../types/super-schema.ts). This allows to extract common calls (like getting instance of user repository which could be afterwards passed to query and params schema builders).

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
