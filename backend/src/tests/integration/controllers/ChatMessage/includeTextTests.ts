import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { ITest } from "@integration-tests/probata";
import { StatusCodes as HTTP } from "http-status-codes";
import { SUPER_USER_EMAIL } from "@integration-tests/config";

import { CHAT_MESSAGE_RULES } from "@shared/constants/rules";
import { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";

const { MIN_LENGTH, MAX_LENGTH } = CHAT_MESSAGE_RULES.VALUE;

export const includeTextTests = (arg: {
  baseQuery: any;
  addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
  chatMessageId?: number;
}) => {
  const { baseQuery, addTest, chatMessageId } = arg;

  const appendToAction = chatMessageId ? `${chatMessageId}` : undefined;

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when text is missing`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {},
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when text has only spaces`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {
      text: "                   ",
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when text is too small (<${MIN_LENGTH})`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {
      text: faker.random.alpha({ count: MIN_LENGTH - 1 }),
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.BAD_REQUEST} when text is too long (>${MAX_LENGTH})`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {
      text: faker.random.alpha({ count: MAX_LENGTH + 1 }),
    },
    expect: {
      statusCode: HTTP.BAD_REQUEST,
    },
  });

  addTest({
    description: `returns ${HTTP.CREATED} with sanitized text`,
    session: { user: { email: SUPER_USER_EMAIL } },
    appendToAction,
    query: baseQuery,
    body: {
      text: "<img src=x onload=alert('something1') />this<script>alert('something2')</script>",
    },
    expect: {
      statusCode: HTTP.CREATED,
      callback(response) {
        const body = <IChatMessageDTO>response.body;

        expect(body.value).to.equal("this");
      },
    },
  });
};
