import random from "lodash/random";
import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { Seeder } from "typeorm-extension";

import { getRandomRecords } from "./common";

import { User } from "@entities/User";
import { Workspace } from "@entities/Workspace";
import { ChatMessage } from "@entities/ChatMessage";
import { WORKSPACE_CHAT_MAX_DEPTH } from "@shared/constants/config";

export default class ChatMessageSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const workspaceRepository = dataSource.getRepository(Workspace);
    const chatMessageRepository = dataSource.getRepository(ChatMessage);

    const workspaces = await workspaceRepository.find();

    for (const workspace of workspaces) {
      const mainCommentsCount = random(10, 15);

      // @NOTE DEPTH 1 comments
      for (let index = 0; index < mainCommentsCount; index++) {
        const [user] = await getRandomRecords(userRepository, 1);

        const valueCount = random(8, 25);

        await chatMessageRepository.save({
          value: faker.random.words(valueCount),
          workspace,
          createdBy: user,
        });
      }

      // @NOTE DEPTH 2+
      for (let depth = 2; depth < WORKSPACE_CHAT_MAX_DEPTH; depth++) {
        const previousDepthMessagesCount = random(3, 9);

        const previousDepthMessages = await getRandomRecords(
          chatMessageRepository,
          previousDepthMessagesCount,
          undefined,
          qb =>
            qb.where("workspace.id = :workspaceId AND depth = :depth", {
              depth: depth - 1,
              workspaceId: workspace.id,
            })
        );

        for (const previousDepthMessage of previousDepthMessages) {
          const repliesCount = random(1, 3);

          for (
            let replyIterator = 0;
            replyIterator < repliesCount;
            replyIterator++
          ) {
            const valueCount = random(8, 25);

            const [user] = await getRandomRecords(userRepository, 1);

            await chatMessageRepository.save({
              value: faker.random.words(valueCount),
              workspace,
              createdBy: user,
              replyTo: previousDepthMessage,
            });
          }
        }
      }
    }
  }
}
