const siteUrl = 'http://localhost:3000';

describe('Login', () => {
  beforeEach(() => {
    cy.visit(siteUrl);
  });

  it('should redirect to login page and show login form', () => {
    cy.location('pathname').should('equals', '/sign-in');
    cy.get('amplify-authenticator').should('exist');
  });

  it('should show /registration for non-enabled users', { includeShadowDom: true }, () => {
    cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-user@huansen.dev');
    cy.get('[data-test=sign-in-password-input]').first().type('password123');
    cy.get('[data-test="sign-in-sign-in-button"]').first().click();
    cy.location('pathname').should('equals', '/registration');
  });

  it('should show /client for clients', { includeShadowDom: true }, () => {
    cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-client@huansen.dev');
    cy.get('[data-test=sign-in-password-input]').first().type('password123');
    cy.get('[data-test="sign-in-sign-in-button"]').first().click();
    cy.location('pathname').should('equals', '/client');
  });

  it('should show /admin for admin', { includeShadowDom: true }, () => {
    cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-admin@huansen.dev');
    cy.get('[data-test=sign-in-password-input]').first().type('password123');
    cy.get('[data-test="sign-in-sign-in-button"]').first().click();
    cy.location('pathname').should('equals', '/admin');
  });

  it('should show /volunteer for clients', { includeShadowDom: true }, () => {
    cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-volunteer@huansen.dev');
    cy.get('[data-test=sign-in-password-input]').first().type('password123');
    cy.get('[data-test="sign-in-sign-in-button"]').first().click();
    cy.location('pathname').should('equals', '/volunteer');
  });
});
