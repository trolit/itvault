import { faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";

import { User } from "@entities/User";

export const user = setSeederFactory(User, () => {
  const user = new User();

  user.email = faker.internet.email(
    faker.name.firstName(),
    faker.name.lastName(),
    "itvault.dev"
  );

  user.password = faker.internet.password();

  return user;
});
