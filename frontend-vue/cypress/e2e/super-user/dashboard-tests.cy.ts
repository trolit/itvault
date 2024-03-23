import { EMAIL } from "./config";
import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";

describe("Dashboard tests", function () {
  beforeEach(() => {
    cy.intercept("GET", "**/workspaces*").as("getWorkspaces");
    cy.signIn(EMAIL);
    cy.visit(`/${ROUTE_DASHBOARD_NAME}`);
    cy.wait("@getWorkspaces");
  });

  it("opens page", () => {
    cy.getByDataCy("app-header").should("exist");
    cy.getByDataCy("welcome-card").should("exist");
    cy.getByDataCy("brand-dropdown").should("exist");
    cy.getByDataCy("workspace-dropdown").should("not.exist");
    cy.getByDataCy("profile-dropdown").should("exist");
    cy.getByDataCy("workspaces-card").should("exist");
  });

  after(() => {
    cy.signOut(EMAIL);
  });
});
