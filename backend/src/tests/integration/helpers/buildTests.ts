import { ITest } from "../types/ITest";
import { Method } from "../types/Method";

export const buildTests = <BQ = { version: number }, BB = void>(
  general: {
    method: Method;
    baseBody?: BB;
    baseQuery: BQ;
  },
  builder: (arg: {
    addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
  }) => void
) => {
  const tests: ITest<any, any>[] = [];

  const { baseQuery, baseBody, method } = general;

  const addTestBuilder = <Q, B>(data: Omit<ITest<Q, B>, "method">) => {
    tests.push({
      ...data,
      method,
      query: { ...baseQuery, ...data.query },
      body: baseBody ? { ...baseBody, ...data.body } : data.body,
    });
  };

  builder({ addTest: addTestBuilder });

  return tests;
};
