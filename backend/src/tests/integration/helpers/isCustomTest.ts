import { ITest } from "../types/ITest";
import { ICustomTest } from "../types/ICustomTest";

export const isCustomTest = (
  data: ITest | ICustomTest
): data is ICustomTest => {
  const castedData = <ICustomTest>data;

  return !!castedData?.runner;
};
