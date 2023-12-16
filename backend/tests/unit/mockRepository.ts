import * as typeorm from "typeorm";
import { SinonSandbox, SinonStubbedInstance } from "sinon";

export const mockRepository = <T>(
  Class: { new (): T },
  sandbox: SinonSandbox,
  overrides: {
    fakeManager?: Partial<typeorm.EntityManager>;
    fakeQueryRunner?: Partial<typeorm.QueryRunner>;
  } = {}
): SinonStubbedInstance<T> => {
  const {
    fakeManager: fakeManagerOverrides,
    fakeQueryRunner: fakeQueryRunnerOverrides,
  } = overrides;

  const fakeManager = {
    getRepository: sandbox.stub().returnsThis(),
    createQueryBuilder: sandbox.stub().returnsThis(),
    useTransaction: sandbox.stub().returnsThis(),
    where: sandbox.stub().returnsThis(),
    find: sandbox.stub().returnsThis(),
    create: sandbox.stub().returnsThis(),
    save: sandbox.stub().returnsThis(),
    ...fakeManagerOverrides,
  };

  const fakeQueryRunner = {
    manager: fakeManager,
    release: sandbox.stub().returnsThis(),
    commitTransaction: sandbox.stub().returnsThis(),
    rollbackTransaction: sandbox.stub().returnsThis(),
    ...fakeQueryRunnerOverrides,
  };

  const repository = sandbox.createStubInstance(Class);

  (repository as any).useTransaction = () => fakeQueryRunner;

  return repository;
};
