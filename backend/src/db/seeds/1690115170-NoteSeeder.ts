import sample from "lodash/sample";
import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { Note } from "@db/entities/Note";
import { User } from "@db/entities/User";
import { File } from "@db/entities/File";
import { Seeder } from "typeorm-extension";

import { getRandomRecords } from "./common";

export default class NoteSeeder implements Seeder {
  private _notesPerFile = 10;

  public async run(dataSource: DataSource) {
    const fileRepository = dataSource.getRepository(File);
    const noteRepository = dataSource.getRepository(Note);
    const userRepository = dataSource.getRepository(User);

    const files = await fileRepository.find();

    for (const file of files) {
      for (let index = 0; index < this._notesPerFile; index++) {
        const [user] = await getRandomRecords(userRepository, 1);

        const value = faker.lorem.words(20);

        const deletedAt = sample([new Date(), undefined, undefined, undefined]);

        await noteRepository.save({
          value,
          createdBy: user,
          updatedBy: user,
          file,
          deletedAt,
        });
      }
    }
  }
}
