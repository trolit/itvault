import { assert } from "chai";
import { mockRepository } from "../mockRepository";
import { SinonSandbox, createSandbox } from "sinon";

import { UpdateUserDto } from "@shared/types/dtos/UpdateUserDto";

import { UserService } from "@services/UserService";
import { UserRepository } from "@repositories/UserRepository";
import { DataStoreService } from "@services/DataStoreService";

const roleId = 1;

const usersToUpdate: UpdateUserDto[] = [
  {
    id: 1,
    data: { roleId },
  },
  {
    id: 2,
    data: { roleId },
  },
];

describe("UserService tests", () => {
  let sandbox: SinonSandbox;
  let dataStoreService: DataStoreService;

  beforeEach(() => {
    sandbox = createSandbox();

    dataStoreService = sandbox.createStubInstance(DataStoreService);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should throw error that not all roles are available", async () => {
    // Arrange
    const userRepository = mockRepository(UserRepository, sandbox);

    const userService = new UserService(userRepository, dataStoreService);

    // Act
    const result = await userService.updateMany(usersToUpdate);

    // Assert
    assert.equal(result.isSuccess, false);

    assert.equal(
      result.error,
      "Not all roles are available to perform operation."
    );
  });

  it("should save users", async () => {
    // Arrange
    const userRepository = mockRepository(UserRepository, sandbox, {
      fakeManager: {
        find: sandbox.stub().callsFake(() => [{ id: roleId }]),
      },
    });

    const userService = new UserService(userRepository, dataStoreService);

    // Act
    const result = await userService.updateMany(usersToUpdate);

    // Assert
    assert.equal(result.isSuccess, true);

    assert.equal(result.error, undefined);
  });
});
