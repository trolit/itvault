import { setLocale } from "yup";

setLocale({
  mixed: {
    required: "Field is required",
  },
  string: {
    email: "Must be valid email",
  },
});
