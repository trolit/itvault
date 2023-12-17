export const ACCOUNT_RULES = {
  FIRST_NAME: {
    MIN_LENGTH: 2,
  },

  LAST_NAME: {
    MIN_LENGTH: 2,
  },

  EMAIL: {
    MAX_LENGTH: 254,
  },

  PASSWORD: {
    MIN_LENGTH: 7,
    ONE_DIGIT_LETTER_REGEX: /\d/,
    ONE_LOWERCASE_LETTER_REGEX: /[a-z]/,
    ONE_UPPERCASE_LETTER_REGEX: /[A-Z]/,
    ONE_SPECIAL_CHARACTER_REGEX: /[*.!@#$%^&(){}[\]:;<>,.?/~_+-=|]/,
  },
};
