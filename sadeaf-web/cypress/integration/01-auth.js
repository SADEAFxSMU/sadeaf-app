import {
  enterAdminHomepage,
  enterClientHomepage,
  enterNonEnabledUserHomepage,
  enterVolunteerHomepage,
} from '../helpers/login-helpers';

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should redirect to login page and show login form', () => {
    cy.location('pathname').should('equals', '/sign-in');
    cy.get('amplify-authenticator').should('exist');
  });

  it('should show /registration for non-enabled users', () => {
    enterNonEnabledUserHomepage();
    cy.location('pathname').should('equals', '/registration');
  });

  it('should show /client for clients', () => {
    enterClientHomepage();
    cy.location('pathname').should('equals', '/client');
    cy.get('.el-calendar__body');
    cy.get('.el-table');
  });

  it('should show /admin for admin', () => {
    enterAdminHomepage();
    cy.location('pathname').should('equals', '/admin');
  });

  it('should show /volunteer for volunteer', () => {
    enterVolunteerHomepage();
    cy.location('pathname').should('equals', '/volunteer');
    cy.get('.volunteer-cal');
  });
});
