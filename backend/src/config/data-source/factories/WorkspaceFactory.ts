import { faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";

import { Workspace } from "@entities/Workspace";

export default setSeederFactory(Workspace, () => {
  const workspace = new Workspace();

  workspace.name = faker.word.verb();

  return workspace;
});
