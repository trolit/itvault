/// <reference types="cypress" />

declare namespace Cypress {
  import { Element } from "cypress";

  interface Chainable {
    signIn(email: string): Chainable<void>;

    signOut(email: string): Chainable<void>;

    getByDataCy(value: string): Chainable<Element>;
  }
}
