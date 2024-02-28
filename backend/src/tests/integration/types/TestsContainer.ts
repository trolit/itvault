export type TestsContainer = {
  beforeAll(suite: Mocha.Suite): void;

  loadToSuite(suite: Mocha.Suite): void;
};
