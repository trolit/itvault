import random from "lodash/random";
import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { Seeder } from "typeorm-extension";

import { getRandomRecords } from "./common";

import { User } from "@entities/User";
import { ChatMessage } from "@entities/ChatMessage";
import { WORKSPACE_CHAT_MAX_DEPTH } from "@shared/constants/config";

export default class ChatMessageSeeder implements Seeder {
  public async run(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    const chatMessageRepository = dataSource.getRepository(ChatMessage);

    const mainCommentsCount = random(11, 25);

    // @NOTE DEPTH 1 comments
    for (let index = 0; index < mainCommentsCount; index++) {
      const [user] = await getRandomRecords(userRepository, 1);

      const wordsCount = random(8, 25);

      await chatMessageRepository.save({
        value: faker.random.words(wordsCount),
        createdBy: user,
      });
    }

    // @NOTE DEPTH 2+
    for (let depth = 2; depth < WORKSPACE_CHAT_MAX_DEPTH; depth++) {
      const previousDepthMessagesCount = random(5, 15);

      const previousDepthMessages = await getRandomRecords(
        chatMessageRepository,
        previousDepthMessagesCount,
        [],
        qb =>
          qb.where("depth = :depth", {
            depth: depth - 1,
          })
      );

      for (const previousDepthMessage of previousDepthMessages) {
        const repliesCount = random(2, 5);

        for (
          let replyIterator = 0;
          replyIterator < repliesCount;
          replyIterator++
        ) {
          const wordsCount = random(8, 25);

          const [user] = await getRandomRecords(userRepository, 1);

          await chatMessageRepository.save({
            value: faker.random.words(wordsCount),
            createdBy: user,
            replyTo: previousDepthMessage,
          });
        }
      }
    }
  }
}
