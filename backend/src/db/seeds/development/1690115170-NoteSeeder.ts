import sample from "lodash/sample";
import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { File } from "@db/entities/File";
import { User } from "@db/entities/User";
import { Note } from "@db/entities/Note";
import { Seeder } from "typeorm-extension";
import { getRandomRecords } from "@db/seeds/helpers/getRandomRecords";

import { getOptionsOfTraceRelatedEntity } from "@helpers/getOptionsOfTraceRelatedEntity";

export default class NoteSeeder implements Seeder {
  private _notesPerFile = 10;

  public async run(dataSource: DataSource) {
    const fileRepository = dataSource.getRepository(File);
    const noteRepository = dataSource.getRepository(Note);
    const userRepository = dataSource.getRepository(User);

    const files = await fileRepository.find({ relations: { workspace: true } });

    for (const file of files) {
      for (let index = 0; index < this._notesPerFile; index++) {
        const [user] = await getRandomRecords(userRepository, 1);

        const value = faker.lorem.words(20);

        const deletedAt = sample([new Date(), undefined, undefined, undefined]);

        await noteRepository.save(
          {
            value,
            createdBy: user,
            updatedBy: user,
            file,
            deletedAt,
          },
          getOptionsOfTraceRelatedEntity({
            userId: user.id,
            workspaceId: file.workspace.id,
          })
        );
      }
    }
  }
}
