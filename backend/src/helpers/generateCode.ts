import dayjs from "dayjs";
import random from "lodash/random";
import shuffle from "lodash/shuffle";

export const generateCode = (length = 30) => {
  const randomAddNumber = random(50000, 9999999999);
  const randomSubtractNumber = random(500, 30000);

  const now = dayjs();

  const sum = now.unix() - randomSubtractNumber + randomAddNumber;

  const rawCode = sum.toString().padStart(length, "0");

  const codeAsArray = shuffle(rawCode.toString().split(""));

  return codeAsArray.join("");
};
