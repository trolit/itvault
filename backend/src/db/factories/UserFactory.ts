import { faker } from "@faker-js/faker";
import { User } from "@db/entities/User";
import { setSeederFactory } from "typeorm-extension";

export default setSeederFactory(User, () => {
  const user = new User();

  user.firstName = faker.name.firstName();

  user.lastName = faker.name.lastName();

  user.email = faker.internet.email(
    faker.name.firstName().toLowerCase(),
    faker.name.lastName().toLowerCase(),
    "itvault.dev"
  );

  user.password = faker.internet.password();

  return user;
});
