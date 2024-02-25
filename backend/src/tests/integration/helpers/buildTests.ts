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
    addCustomTest: (data: ICustomTest) => void;
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

  const addCustomTestBuilder = (data: ICustomTest) => {
    tests.push({ ...data });
  };

  builder({ addTest: addTestBuilder, addCustomTest: addCustomTestBuilder });

  return tests;
};
