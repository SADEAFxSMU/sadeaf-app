export function enterClientHomepage() {
  cy.visit('/');
  cy.wait(1500);
  cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-client@huansen.dev', { force: true });
  cy.get('[data-test=sign-in-password-input]').first().type('password123', { force: true });
  cy.get('[data-test="sign-in-sign-in-button"]').first().click();
  cy.wait(3000);
}

export function enterVolunteerHomepage() {
  cy.visit('/');
  cy.wait(1500);
  cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-volunteer@huansen.dev', { force: true });
  cy.get('[data-test=sign-in-password-input]').first().type('password123', { force: true });
  cy.get('[data-test="sign-in-sign-in-button"]').first().click();
  cy.wait(3000);
}

export function enterAdminHomepage() {
  cy.visit('/');
  cy.wait(1500);
  cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-admin@huansen.dev', { force: true });
  cy.get('[data-test=sign-in-password-input]').first().type('password123', { force: true });
  cy.get('[data-test="sign-in-sign-in-button"]').first().click();
  cy.wait(3000);
}

export function clickLogoutButton() {
  cy.get('[data-test=logout-button]').click({ force: true });
}
