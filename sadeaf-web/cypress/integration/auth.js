const siteUrl = 'http://localhost:3000';

const users = {

}

describe('Typing Test : Input', () => {

  beforeEach(() => {
    cy.visit(siteUrl);
  })

  it('should redirect to login page and show login form', () => {
    cy.location('pathname').should('equals', '/sign-in');
    cy.get('amplify-authenticator').should('exist');
  })

  it('should login as volunteer', { includeShadowDom: true }, () => {
    cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-volunteer@huansen.dev');
    cy.get('[data-test=sign-in-password-input]').first().type('password123');
    cy.get('[data-test="sign-in-sign-in-button"]').first().click();
  })
});
