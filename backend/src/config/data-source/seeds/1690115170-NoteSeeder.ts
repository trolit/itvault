import sample from "lodash/sample";
import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { Seeder } from "typeorm-extension";

import { getRandomRecords } from "./common";

import { User } from "@entities/User";
import { File } from "@entities/File";
import { Note } from "@entities/Note";

export default class NoteSeeder implements Seeder {
  private _notesPerFile = 5;

  public async run(dataSource: DataSource) {
    const fileRepository = dataSource.getRepository(File);
    const noteRepository = dataSource.getRepository(Note);
    const userRepository = dataSource.getRepository(User);

    const files = await fileRepository.find();

    for (const file of files) {
      for (let index = 0; index < this._notesPerFile; index++) {
        const [user] = await getRandomRecords(userRepository, 1);

        const value = faker.lorem.words(20);

        const deletedAt = sample([new Date(), undefined]);

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
