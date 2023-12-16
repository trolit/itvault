import { In } from "typeorm";
import { assert } from "chai";
import { mockRepository } from "../mockRepository";
import { SinonFakeTimers, SinonSandbox, createSandbox } from "sinon";

import { User } from "@entities/User";
import { Role } from "@entities/Role";
import { UpdateUserDto } from "@shared/types/dtos/UpdateUserDto";

import { UserService } from "@services/UserService";
import { DataStoreService } from "@services/DataStoreService";
import { UserRepository } from "@repositories/UserRepository";

const roleId = 1;

const usersToUpdate: UpdateUserDto[] = [
  {
    id: 1,
    data: { isActive: true, roleId },
  },
  {
    id: 2,
    data: { isActive: false },
  },
];

describe("UserService tests", () => {
  let sandbox: SinonSandbox;
  let clock: SinonFakeTimers;
  const fakeDate = new Date(2019, 1, 1, 0, 0);
  let dataStoreService: DataStoreService;

  beforeEach(() => {
    sandbox = createSandbox();

    clock = sandbox.useFakeTimers({
      now: fakeDate,
    });

    dataStoreService = sandbox.createStubInstance(DataStoreService);
  });

  afterEach(() => {
    clock.restore();

    sandbox.restore();
  });

  it("should throw error that not all roles are available", async () => {
    // Arrange
    const { repository: userRepository, manager } = mockRepository(
      UserRepository,
      sandbox
    );

    const userService = new UserService(userRepository, dataStoreService);

    // Act
    const result = await userService.updateMany(usersToUpdate);

    // Assert
    assert.equal(
      manager.find.calledOnceWith(Role, {
        where: {
          id: In([1]),
        },
      }),
      true
    );

    assert.equal(result.isSuccess, false);

    assert.equal(
      result.error,
      "Not all roles are available to perform operation."
    );
  });

  it("should save users", async () => {
    // Arrange
    const { repository: userRepository, manager } = mockRepository(
      UserRepository,
      sandbox,
      {
        fakeManager: {
          find: sandbox.stub().callsFake(() => [{ id: roleId }]),
        },
      }
    );

    const userService = new UserService(userRepository, dataStoreService);

    // Act
    const result = await userService.updateMany(usersToUpdate);

    // Assert
    assert.equal(
      manager.find.calledOnceWith(Role, {
        where: {
          id: In([1]),
        },
      }),
      true
    );

    assert.equal(manager.create.calledTwice, true);

    assert.equal(
      manager.save.calledOnceWith(User, [
        {
          id: 1,
          deletedAt: null,
          role: { id: roleId },
        },
        {
          id: 2,
          deletedAt: fakeDate,
        },
      ]),
      true
    );

    assert.equal(result.isSuccess, true);

    assert.equal(result.error, undefined);
  });
});
