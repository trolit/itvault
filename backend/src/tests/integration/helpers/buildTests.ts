import { ITest } from "../types/ITest";

export const buildTests = <BQ = { version: number }, BB = void>(
  general: {
    baseBody?: BB;
    baseQuery: BQ;
  },
  builder: (arg: { addTest: <Q, B>(data: ITest<Q, B>) => void }) => void
) => {
  const tests: ITest<any, any>[] = [];

  const { baseQuery, baseBody } = general;

  const addTestBuilder = <Q, B>(data: ITest<Q, B>) => {
    tests.push({
      ...data,
      query: { ...baseQuery, ...data.query },
      body: baseBody ? { ...baseBody, ...data.body } : data.body,
    });
  };

  builder({ addTest: addTestBuilder });

  return tests;
};
