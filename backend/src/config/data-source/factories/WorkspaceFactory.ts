import random from "lodash/random";
import { faker } from "@faker-js/faker";
import kebabCase from "lodash/kebabCase";
import { setSeederFactory } from "typeorm-extension";

import { Workspace } from "@entities/Workspace";

export default setSeederFactory(Workspace, () => {
  const workspace = new Workspace();

  const name = faker.lorem.words(5);

  workspace.name = name;

  workspace.description = faker.lorem.words(random(10, 30));

  workspace.slug = kebabCase(name);

  return workspace;
});
