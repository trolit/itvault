export type TestsGroup = {
  beforeAll(suite: Mocha.Suite): void;

  loadToSuite(suite: Mocha.Suite): void;
};
