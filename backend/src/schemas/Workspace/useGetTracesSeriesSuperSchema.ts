import { number, object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { IDateService } from "types/services/IDateService";
import { GetTracesSeriesControllerTypes } from "types/controllers/Workspace/GetTracesSeriesController";

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
import { useUnixTimestampInSecondsSchema } from "@schemas/common/useUnixTimestampInSecondsSchema";

const querySchema: SuperSchema.Fragment<GetTracesSeriesControllerTypes.v1.Query> =
  object({
    from: useUnixTimestampInSecondsSchema(),
    to: useUnixTimestampInSecondsSchema().test((value, ctx) => {
      const dateService = getInstanceOf<IDateService>(Di.DateService);

      const from = dateService.parse(ctx.parent.from).toISOString();
      const to = dateService.parse(value).toISOString();

      const diff = dateService.getDifference({
        from,
        to,
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
    filters: object()
      .default({})
      .transform(value => JSON.parse(value))
      .required()
      .shape({
        userId: number().optional().min(1),
      }),
  });

const paramsSchema: SuperSchema.Fragment<GetTracesSeriesControllerTypes.v1.Params> =
  object({
    id: number().required(),
  });

export const useGetTracesSeriesSuperSchema: SuperSchema.Runner<
  GetTracesSeriesControllerTypes.v1.Params,
  void,
  GetTracesSeriesControllerTypes.v1.Query
> = defineSuperSchemaRunner(() => {
  return {
    params: paramsSchema,
    query: querySchema,
  };
});
