export const ACCOUNT_RULES = {
  FIRST_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 60,
  },

  LAST_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 60,
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

export const BLUEPRINT_RULES = {
  DESCRIPTION: {
    MIN_LENGTH: 10,
  },

  COLOR: {
    REGEX: /^#[a-zA-Z0-9]{6}$/,
  },
};

export const FILE_RULES = {
  FILENAME: {
    REGEX: /^[^<>:;,?"*|]+$/,
  },
};

export const CHAT_MESSAGE_RULES = {
  VALUE: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 600,
  },
};

// @NOTE consider changing properties names to those defined in DTOs
export const NOTE_RULES = {
  VALUE: {
    MAX_LENGTH: 1000,
  },
};

export const VARIANT_RULES = {
  NAME: {
    MIN_LENGTH: 2,
  },
};

export const WORKSPACE_RULES = {
  NAME: {
    REGEX: /^[a-zA-Z0-9- ]*$/,
  },

  DESCRIPTION: {
    MAX_LENGTH: 255,
  },

  TAGS: {
    MIN_LENGTH: 1,
    REGEX: /^[a-zA-Z0-9]*$/,
  },
};

export const BUNDLE_RULES = {
  TEXT: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 200,
  },
};
