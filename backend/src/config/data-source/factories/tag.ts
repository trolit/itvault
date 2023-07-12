import { faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";

import { Tag } from "@entities/Tag";

export const tag = setSeederFactory(Tag, () => {
  const tag = new Tag();

  tag.value = faker.word.noun();

  return tag;
});
