import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";

describe("Dashboard tests", function () {
  before(() => {
    cy.fixture("users").then(users => {
      const { HEAD_ADMIN } = users;
    });
  });

  beforeEach(() => {
    cy.signIn("head.admin@itvault.dev", "1234");
  });

  it("visits page", () => {
    cy.visit(`/${ROUTE_DASHBOARD_NAME}`);
    cy.getByDataCy("welcome-card").should("exist");
  });

  after(() => {
    cy.signOut("head.admin@itvault.dev");
  });
});
