import { faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";

import { Tag } from "@entities/Tag";

export default setSeederFactory(Tag, () => {
  const tag = new Tag();

  tag.value = faker.word.noun();

  return tag;
});
