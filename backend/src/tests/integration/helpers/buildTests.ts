import { ITest } from "../types/ITest";
import { Method } from "../types/Method";
import { ICustomTest } from "../types/ICustomTest";

export const buildTests = <BQ = { version: number }, BB = void>(
  general: {
    method: Method;
    baseBody?: BB;
    baseQuery: BQ;
  },
  builder: (arg: {
    addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
    addCustomTest: (
      data: Omit<ICustomTest, "method" | "query" | "body">
    ) => void;
  }) => void
) => {
  const tests: (ITest<any, any> | ICustomTest)[] = [];

  const { baseQuery, baseBody, method } = general;

  const addTestBuilder = <Q, B>(data: Omit<ITest<Q, B>, "method">) => {
    tests.push({
      ...data,
      method,
      query: { ...baseQuery, ...data.query },
      body: baseBody ? { ...baseBody, ...data.body } : data.body,
    });
  };

  const addCustomTestBuilder = (
    data: Omit<ICustomTest, "method" | "query" | "body">
  ) => {
    tests.push({
      ...data,
      method,
      body: baseBody,
      query: baseQuery,
    });
  };

  builder({ addTest: addTestBuilder, addCustomTest: addCustomTestBuilder });

  return tests;
};
