import { z } from "zod";
import { SuperSchemaRunner, SchemaProvider } from "super-schema-types";

import { BundleDto } from "@dtos/BundleDto";
import { BundleExpire } from "@enums/BundleExpire";

import { schemaForType } from "@schemas/common/schemaForType";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

import { IBody } from "@controllers/Bundle/StoreController";

export const useStoreSuperSchema: SuperSchemaRunner = defineSuperSchemaRunner(
  () => {
    return {
      body: useBodySchema(),
    };
  }
);

function useBodySchema(): SchemaProvider {
  const valueSchema = schemaForType<BundleDto>()(
    z.object({
      blueprintId: z.number(),
      variantIds: z.array(z.string()),
    })
  );

  return () =>
    schemaForType<IBody>()(
      z.object({
        note: z.optional(z.string()),
        expiration: z.nativeEnum(BundleExpire),
        values: z.array(valueSchema).min(1),
      })
    );
}
