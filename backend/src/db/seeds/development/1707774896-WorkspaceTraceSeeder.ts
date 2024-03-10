import dayjs from "dayjs";
import sample from "lodash/sample";
import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { User } from "@db/entities/User";
import { Note } from "@db/entities/Note";
import { Seeder } from "typeorm-extension";
import { Bucket } from "@db/entities/Bucket";
import { Variant } from "@db/entities/Variant";
import { Workspace } from "@db/entities/Workspace";
import { Blueprint } from "@db/entities/Blueprint";
import { WorkspaceTrace } from "@db/entities/WorkspaceTrace";
import { getRandomRecords } from "@db/seeds/helpers/getRandomRecords";

import { Action } from "@shared/types/enums/Action";

const TOTAL_TRACES = 150;
const DATES_RANGE_IN_DAYS = 30;

export default class ChatMessageSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const workspaceRepository = dataSource.getRepository(Workspace);
    const workspaceTraceRepository = dataSource.getRepository(WorkspaceTrace);

    const noteRepository = dataSource.getRepository(Note);
    const bucketRepository = dataSource.getRepository(Bucket);
    const variantRepository = dataSource.getRepository(Variant);
    const blueprintRepository = dataSource.getRepository(Blueprint);

    const AVAILABLE_ENTITIES = [
      {
        name: Note.name,
        repository: noteRepository,
      },
      {
        name: Blueprint.name,
        repository: blueprintRepository,
      },
      {
        name: Bucket.name,
        repository: bucketRepository,
      },
      {
        name: Variant.name,
        repository: variantRepository,
      },
    ];

    const to = dayjs();
    const from = to.subtract(DATES_RANGE_IN_DAYS, "days");

    const toAsString = to.format(`YYYY-MM-DD HH:mm:ss`);
    const fromAsString = from.format(`YYYY-MM-DD HH:mm:ss`);

    for (let index = 0; index < TOTAL_TRACES; index++) {
      const [user] = await getRandomRecords(userRepository, 1);
      const [workspace] = await getRandomRecords(workspaceRepository, 1);

      const target = sample(AVAILABLE_ENTITIES) || AVAILABLE_ENTITIES[0];

      const [record] = await getRandomRecords<any>(target.repository, 1);

      const action = sample([Action.Create, Action.Update]);
      const createdAt = faker.date.between(fromAsString, toAsString);

      await workspaceTraceRepository.save({
        user,
        entity: target.name,
        action,
        createdAt,
        workspace,
        targetId: record?.id,
      });
    }
  }
}
