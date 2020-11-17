import { enterVolunteerHomepage } from '../helpers/login-helpers';

describe('Volunteer Calendar', () => {
  beforeEach(() => {
    enterVolunteerHomepage();
  });

  it('should enter correctly rendered volunteer homepage ', () => {
    cy.location('pathname').should('equals', '/volunteer');
    cy.get('.volunteer-cal');
  });
});
