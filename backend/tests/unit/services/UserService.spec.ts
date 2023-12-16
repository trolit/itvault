import { assert } from "chai";
import { mockRepository } from "../mockRepository";
import { SinonSandbox, createSandbox } from "sinon";

import { UpdateUserDto } from "@shared/types/dtos/UpdateUserDto";

import { UserService } from "@services/UserService";
import { UserRepository } from "@repositories/UserRepository";
import { DataStoreService } from "@services/DataStoreService";

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
    const usersToUpdate: UpdateUserDto[] = [
      {
        id: 1,
        data: { roleId: 1 },
      },
      {
        id: 2,
        data: { roleId: 3 },
      },
    ];

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
});
