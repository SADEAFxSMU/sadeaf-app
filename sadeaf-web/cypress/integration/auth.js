const siteUrl = 'http://localhost:3000';

describe('Login', () => {
  beforeEach(() => {
    cy.visit(siteUrl);
  });

  it('should redirect to login page and show login form', () => {
    cy.location('pathname').should('equals', '/sign-in');
    cy.get('amplify-authenticator').should('exist');
  });

  it('should show /registration for non-enabled users', () => {
    cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-user@huansen.dev', { force: true });
    cy.get('[data-test=sign-in-password-input]').first().type('password123', { force: true });
    cy.get('[data-test="sign-in-sign-in-button"]').first().click();
    cy.location('pathname').should('equals', '/registration');
  });

  it('should show /client for clients', () => {
    cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-client@huansen.dev', { force: true });
    cy.get('[data-test=sign-in-password-input]').first().type('password123', { force: true });
    cy.get('[data-test="sign-in-sign-in-button"]').first().click();
    cy.location('pathname').should('equals', '/client');
  });

  it('should show /admin for admin', () => {
    cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-admin@huansen.dev', { force: true });
    cy.get('[data-test=sign-in-password-input]').first().type('password123', { force: true });
    cy.get('[data-test="sign-in-sign-in-button"]').first().click();
    cy.location('pathname').should('equals', '/admin');
  });

  it('should show /volunteer for volunteer', () => {
    cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-volunteer@huansen.dev', { force: true });
    cy.get('[data-test=sign-in-password-input]').first().type('password123', { force: true });
    cy.get('[data-test="sign-in-sign-in-button"]').first().click();
    cy.location('pathname').should('equals', '/volunteer');
  });
});
