import dayjs from "dayjs";
import random from "lodash/random";

export const generateCode = (length = 30) => {
  const randomAddNumber = random(50000, 9999999999);
  const randomSubtractNumber = random(500, 30000);

  const now = dayjs();

  const sum = now.unix() - randomSubtractNumber + randomAddNumber;

  return sum.toString().padStart(length, "0");
};
