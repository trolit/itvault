import { FILES } from "@config";

export const CUSTOM_MESSAGES = {
  GENERAL: {
    UNIQUE: "%s must be unique!",
    ALREADY_TAKEN: "This %s is already taken.",
    MIN_CHARACTERS: "Should include at least %s characters.",
    MAX_CHARACTERS: "Should include up to %s characters.",
    MIN_MAX_CHARACTERS: "Should include from %s to %s characters.",
    SHOULD_NOT_END_WITH: "Should not end with %s",
    NOT_EDITABLE: "This %s is not editable.",
    NOT_AVAILABLE: "This %s is not available.",
    NOT_ASSIGNABLE: "This %s is not assignable.",
    REQUIRE_ONE_OF: "Either %s or %s should be provided.",
    HEXADECIMAL_FORMAT: "%s needs to be in hexadecimal pattern (e.g. #4231E2)",
    WRONG_VERSION: "Wrong resource version (available: ${values})",
  },

  BLUEPRINTS: {
    SOME_NOT_AVAILABLE: "One or more blueprints are not available.",
  },

  BUCKETS: {
    INVALID_CONFIGURATION: "Buckets configuration is invalid!",
  },

  FILE: {
    DUPLICATE_FILE:
      "There is already file with such name under given dir (%s).",
    VARIANTS_CONFLICT:
      "File %s was selected with %s different variants. Please update your configuration to use only one variant or remove one of the blueprints.",
    ONLY_ONE_ROOT_INDICATOR: `Relative path should only contain one root indicator '${FILES.ROOT}'`,
    SHOULD_START_WITH_ROOT_INDICATOR: `Relative path should start with root indicator '${FILES.ROOT}'`,
  },

  NOTE: {
    RESOURCE_NOT_SPECIFIED: "Resource not specified.",
    RESOURCE_NOT_AVAILABLE: "Resource is not available.",
  },

  PERMISSION: {
    MISSING_PERMISSION: "Permission '%s' (%s) must be provided in request.",
  },

  AUTH: {
    PASSWORD: {
      ONE_LOWERCASE_LETTER: "At least one lowercase letter.",
      ONE_UPPERCASE_LETTER: "At least one uppercase letter.",
      ONE_DIGIT: "At least one digit.",
      ONE_SPECIAL_CHARACTER: "At least one special character.",
    },
  },

  USER: {
    NO_PERSONAL_ACCOUNT_CHANGES: "Can't change personal account.",
  },

  VARIANT: {
    MUST_REFERENCE_FILE: "Must reference file.",
  },
};
