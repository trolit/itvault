import cloneDeep from "lodash/cloneDeep";
import { useDateService } from "@/services/useDateService";

const firstAfterSecond = 1;
const firstBeforeSecond = -1;
const keepOriginalOrder = 0;

export const sortArrayByPinnedAt = <T extends { pinnedAt: string | null }>(
  data: T[]
) => {
  const clonedData = cloneDeep(data);
  const dateService = useDateService();

  clonedData.sort(
    ({ pinnedAt: firstPinnedAt }, { pinnedAt: secondPinnedAt }) => {
      // @NOTE > 0 - sort (a) after (b)
      // @NOTE < 0 - sort (a) before (b)
      // @NOTE = 0 - keep original (a), (b) order

      if (!firstPinnedAt && !secondPinnedAt) {
        return keepOriginalOrder;
      }

      if (!firstPinnedAt || !secondPinnedAt) {
        return firstPinnedAt ? firstBeforeSecond : firstAfterSecond;
      }

      const isFirstPinnedAtAfterSecond = dateService
        .date(firstPinnedAt)
        .isAfter(secondPinnedAt);

      return isFirstPinnedAtAfterSecond ? firstBeforeSecond : firstAfterSecond;
    }
  );

  return clonedData;
};
