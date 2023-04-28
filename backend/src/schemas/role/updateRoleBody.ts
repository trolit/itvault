import Zod, { RefinementCtx, z, ZodIssueCode } from "zod";

import { SuperSchemaRunner } from "@utils/types";
import { schemaForType } from "@helpers/schemaForType";
import { UpdatePermissionDto, UpdateRoleDto } from "@dtos/UpdateRoleDto";

const updateRoleBodySchemaRunner: SuperSchemaRunner = () => {
  const permissionSchema = schemaForType<UpdatePermissionDto>()(
    z.object({
      id: z.number().positive(),
      enabled: z.boolean(),
    })
  );

  return schemaForType<UpdateRoleDto>()(
    z.object({
      name: z.string(),
      permissions: z.array(permissionSchema).nonempty(),
    })
  );
};

export const updateRoleBodySchema = (() => {
  return updateRoleBodySchemaRunner;
})();
