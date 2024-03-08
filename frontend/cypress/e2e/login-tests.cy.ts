// https://docs.cypress.io/api/introduction/api.html

import {
  ROUTE_LOGIN_NAME,
  ROUTE_DASHBOARD_NAME,
} from "@/assets/constants/routes";

describe("Login tests", function () {
  const email = Cypress.env("USER_WITH_ALL_PERMISSIONS");

  beforeEach(() => {
    cy.visit(`/${ROUTE_LOGIN_NAME}`);
  });

  it("visits page", () => {
    cy.getByDataCy("submit-button").should("exist");
  });

  it("shows validation errors on invalid form", () => {
    cy.getByDataCy("email-input").type("invalidEmail");
    cy.getByDataCy("password-input").type("1234");
    cy.getByDataCy("submit-button").click();
    cy.get(".n-form-item-feedback__line").should("exist");
  });

  it(`redirects to ${ROUTE_DASHBOARD_NAME} on sign in`, () => {
    cy.getByDataCy("email-input").type(email);
    cy.getByDataCy("password-input").type(Cypress.env("PASSWORD"));
    cy.getByDataCy("submit-button").click();
    cy.url().should("include", ROUTE_DASHBOARD_NAME);
  });

  after(() => {
    cy.signOut(email);
  });
});
