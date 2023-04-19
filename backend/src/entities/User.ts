import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  AfterUpdate,
  BeforeInsert,
} from "typeorm";
import bcrypt from "bcrypt";

import { Base } from "./Base";
import { Role } from "./Role";
import { Di } from "@enums/Di";
import { instanceOf } from "@helpers/instanceOf";
import { BCRYPT_SALT_ROUNDS } from "@config/index";
import { UserToWorkspace } from "./UserToWorkspace";
import { DataStoreUser } from "@utils/DataStoreUser";
import { DataStoreKeyType } from "@enums/DataStoreKeyType";
import { IDataStoreService } from "@interfaces/service/IDataStoreService";

@Entity("users")
export class User extends Base {
  @Column()
  email!: string;

  @Column()
  password!: string;

  @ManyToOne(() => Role, role => role.users, {
    nullable: false,
  })
  role!: Role;

  @OneToMany(() => UserToWorkspace, userToWorkspace => userToWorkspace.user)
  userToWorkspace: UserToWorkspace[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
  }

  @AfterUpdate()
  async onUpdate() {
    if (this.id && (this.deletedAt !== null || this.role)) {
      const dataStoreService = instanceOf<IDataStoreService>(
        Di.DataStoreService
      );

      const authenticatedUser = await dataStoreService.get<DataStoreUser>(
        this.id,
        DataStoreKeyType.AuthenticatedUser
      );

      if (!authenticatedUser) {
        return;
      }

      if (this.deletedAt) {
        await dataStoreService.delete(
          this.id,
          DataStoreKeyType.AuthenticatedUser
        );

        return;
      }

      if (this.role) {
        const ttl = await dataStoreService.ttl(
          this.id,
          DataStoreKeyType.AuthenticatedUser
        );

        await dataStoreService.set(
          this.id,
          DataStoreKeyType.AuthenticatedUser,
          { ...authenticatedUser, roleId: this.role.id },
          { withTTL: { seconds: Math.abs(ttl) } }
        );
      }
    }
  }
}
