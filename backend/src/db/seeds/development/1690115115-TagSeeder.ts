import { DataSource } from "typeorm";
import { Tag } from "@db/entities/Tag";
import { Seeder, SeederFactoryManager } from "typeorm-extension";

export default class TagSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ) {
    const tagFactory = factoryManager.get(Tag);

    await tagFactory.saveMany(20);
  }
}
