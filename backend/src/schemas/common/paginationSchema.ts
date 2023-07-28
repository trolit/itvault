import { number } from "yup";

// @TODO rename file

export const pageSchema = number().required().integer().min(1);

export const perPageSchema = number().required().integer().min(5);
