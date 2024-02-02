import { Tag } from "@db/entities/Tag";
import { faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";

export default setSeederFactory(Tag, () => {
  const tag = new Tag();

  tag.value = faker.word.noun();

  return tag;
});
