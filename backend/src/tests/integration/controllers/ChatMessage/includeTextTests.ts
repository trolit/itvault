import { faker } from "@faker-js/faker";
import { ITest } from "@integration-tests/probata";
import { StatusCodes as HTTP } from "http-status-codes";
import { SUPER_USER_EMAIL } from "@integration-tests/config";

import { CHAT_MESSAGE_RULES } from "@shared/constants/rules";

const { MIN_LENGTH, MAX_LENGTH } = CHAT_MESSAGE_RULES.VALUE;

export const includeTextTests = (arg: {
  baseQuery: any;
  addTest: <Q, B>(data: Omit<ITest<Q, B>, "method">) => void;
  appendToAction?: string;
}) => {
  const { baseQuery, addTest, appendToAction } = arg;

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
};
