/// <reference types="cypress" />

declare namespace Cypress {
  import { Element } from "cypress";

  interface Chainable {
    signIn(email: string, password: string): Chainable<void>;

    signOut(): Chainable<void>;

    getByDataCy(value: string): Chainable<Element>;
  }
}
