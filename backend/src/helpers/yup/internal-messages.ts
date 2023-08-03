import { setLocale } from "yup";

setLocale({
  number: {
    min: "Value should (at least) equal ${value}",
  },
  // @TODO add more messages
});
