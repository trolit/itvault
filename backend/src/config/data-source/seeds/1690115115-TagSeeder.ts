import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

import { Tag } from "@entities/Tag";

export default class TagSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const tagFactory = factoryManager.get(Tag);

    await tagFactory.saveMany(15);
  }
}
