import { SuperSchema } from "types/SuperSchema";
import { date, number, object, string } from "yup";
import { IDateService } from "types/services/IDateService";
import { GetEventsControllerTypes } from "types/controllers/Workspace/GetEventsController";
import { GetActivityControllerTypes } from "types/controllers/Workspace/GetActivityController";

import { Di } from "@enums/Di";
import { DatePrecision } from "@shared/types/enums/DatePrecision";
import {
  INSIGHTS_ACTIVITY_UNIT,
  INSIGHTS_ACTIVITY_MAX_DIFF,
} from "@shared/constants/config";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const querySchema: SuperSchema.Fragment<GetActivityControllerTypes.v1.Query> =
  object({
    from: date().required(),
    to: date()
      .required()
      .test((value, ctx) => {
        const dateService = getInstanceOf<IDateService>(Di.DateService);

        const diff = dateService.getDifference({
          from: ctx.parent.from,
          to: value,
          unit: INSIGHTS_ACTIVITY_UNIT,
        });

        if (diff > INSIGHTS_ACTIVITY_MAX_DIFF) {
          return ctx.createError({
            message: setYupError(
              CUSTOM_MESSAGES.DATE.MAX_DIFFERENCE,
              `${INSIGHTS_ACTIVITY_MAX_DIFF} ${INSIGHTS_ACTIVITY_UNIT}`,
              diff
            ),
          });
        }

        return true;
      }),
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
