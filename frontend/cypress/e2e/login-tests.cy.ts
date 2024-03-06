// https://docs.cypress.io/api/introduction/api.html

import {
  ROUTE_LOGIN_NAME,
  ROUTE_DASHBOARD_NAME,
} from "@/assets/constants/routes";

describe("Login tests", function () {
  let data: Record<string, { email: string; password: string }>;

  before(() => {
    cy.fixture("users").then(users => {
      console.log(users.HEAD_ADMIN.email);

      data = users;
    });
  });

  beforeEach(() => {
    cy.visit(`/${ROUTE_LOGIN_NAME}`);
  });

  it("visits page", () => {
    cy.contains("button", "Sign in");
  });

  it("gets error that email is invalid", () => {
    cy.get("[type='text']").type("invalid-email");
    cy.get("[type='password']").type("1234");
    cy.contains("button", "Sign in").click();
    cy.get(".n-form-item-feedback__line").contains("Must be valid email");
  });

  it(`gets redirected to ${ROUTE_DASHBOARD_NAME}`, () => {
    const {
      HEAD_ADMIN: { email, password },
    } = data;

    cy.get("[type='text']").type(email);
    cy.get("[type='password']").type(password);
    cy.contains("button", "Sign in").click();
    cy.url().should("include", ROUTE_DASHBOARD_NAME);
  });
});
