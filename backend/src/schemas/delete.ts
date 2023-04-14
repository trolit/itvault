import { z } from "zod";

import { Di } from "@enums/Di";
import { User } from "@entities/User";
import { SuperSchemaRunner } from "@utils/types";
import { schemaForType } from "@helpers/schemaForType";
import { existsSuperRefine } from "./common/existsSuperRefine";

const deleteSchemaRunner: SuperSchemaRunner = () => {
  const isRecordAvailable = existsSuperRefine<User>(Di.UserRepository);

  return schemaForType<{ id: number }>()(
    z.object({
      id: z.coerce.number().superRefine(isRecordAvailable),
    })
  );
};

export const deleteSchema = (() => {
  return deleteSchemaRunner;
})();

export const deleteSchema2 = <T>(repository: Di) => {
  const isRecordAvailable = existsSuperRefine<T>(repository);

  return schemaForType<{ id: number }>()(
    z.object({
      id: z.coerce.number().superRefine(isRecordAvailable),
    })
  );
};
