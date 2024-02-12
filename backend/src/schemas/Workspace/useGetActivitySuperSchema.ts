import { SuperSchema } from "types/SuperSchema";
import { date, number, object, string } from "yup";
import { GetEventsControllerTypes } from "types/controllers/Workspace/GetEventsController";
import { GetActivityControllerTypes } from "types/controllers/Workspace/GetActivityController";

import { DatePrecision } from "@shared/types/enums/DatePrecision";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetActivityControllerTypes.v1.Query> =
  object({
    from: date().required(),
    to: date().required(),
    precision: string().required().oneOf(Object.values(DatePrecision)),
  });

const paramsSchema: SuperSchema.Fragment<GetEventsControllerTypes.v1.Params> =
  object({
    id: number().required(),
  });

export const useGetActivitySuperSchema: SuperSchema.Runner<
  GetActivityControllerTypes.v1.Params,
  void,
  GetActivityControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
