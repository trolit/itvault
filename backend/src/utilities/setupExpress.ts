import express, { Application } from "express";

export const setupExpress = (app: Application) => {
  app.use(express.json());

  return 1;
};
