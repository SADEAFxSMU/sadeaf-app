import {
  clickLogoutButton,
  enterAdminHomepage,
  enterClientHomepage,
  enterVolunteerHomepage,
} from '../helpers/login-helpers';

describe('Correct Opt-In flow', () => {
  it('should allow volunteers to opt in for an assignment created by a client', () => {
    const newAssignmentName = 'Volunteer opt in success test';

    // --- Create assignment from client ---
    enterClientHomepage();
    // open calendar on 21th day
    cy.get(':nth-child(4) > :nth-child(6) > .el-calendar-day').click();
    // event name
    cy.get('.el-form > :nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
      .click()
      .type(newAssignmentName);
    // event skill
    cy.get('.el-checkbox-group > :nth-child(1)').click();
    // event purpose
    cy.get('[data-test=client-create-event-purpose]').click().type('{downarrow}{enter}');
    // event category
    cy.get('[data-test=client-create-event-category]').click().type('{downarrow}{enter}');
    // event education
    cy.get('[data-test=client-create-event-education]').click().type('{downarrow}{enter}');
    // assignment timing
    cy.get(':nth-child(2) > .el-form-item > .el-form-item__content > :nth-child(1) > .el-input__inner')
      .click()
      .focus()
      .type('{selectall}{backspace} 10:00 {enter}');
    cy.get('.el-form-item__content > :nth-child(2) > .el-input__inner')
      .click()
      .focus()
      .type('{selectall}{backspace} 16:00 {enter}');
    // address field
    cy.get('.el-autocomplete > .el-input > .el-input__inner')
      .click()
      .type('Singapore Management University')
      .wait(4000)
      .type('{downarrow}{enter}');
    // submit
    cy.get('.el-form-item__content > .el-button-group > :nth-child(1)').click();
    cy.get(':nth-child(4) > :nth-child(6) > .el-calendar-day').contains(newAssignmentName);
    clickLogoutButton();

    // --- Volunteer opt-in ---
    enterVolunteerHomepage();
    cy.get('#tab-pendingAssignments').click();

    // Accept the newly added available assignment
    cy.get('#tab-pendingAssignments').click();
    cy.wait(1000);
    cy.get(':nth-last-child(1) > .header > .el-button').eq(0).click({ force: true });
    cy.get('.el-dialog__footer > div > .el-button').click();

    // check that it is present in opted in assignments
    cy.get('#tab-optInHistory').click();
    cy.get('#pane-optInHistory > :nth-last-child(1) > .assignment-card').contains(newAssignmentName);
    clickLogoutButton();

    // --- Admin approve ---
    enterAdminHomepage();
    // Match the newly added event
    cy.get(
      ':nth-last-child(1)> .opt-in > .opt-in-details > .select-container > .el-select > .el-input > .el-input__inner'
    )
      .click()
      .type('{downarrow}{enter}', { force: true });
    cy.get(':nth-last-child(1) > .opt-in > .opt-in-details > .select-container > .el-button').click({ force: true });
    clickLogoutButton();

    // --- Check that volunteer is matched ---
    enterVolunteerHomepage();
    cy.get(':nth-child(4) > :nth-child(6) > .el-calendar-day').click();
    cy.get('.el-dialog__body').contains(newAssignmentName);
    cy.get('.el-dialog__body').contains('MATCHED');
    clickLogoutButton();

    // --- Check that client is matched to Test Volunteer ---
    enterClientHomepage();
    cy.get(':nth-child(4) > :nth-child(6) > .el-calendar-day').click();
    cy.get('.el-dialog__body').contains(newAssignmentName);
    cy.get('.el-dialog__body').contains('MATCHED');
    cy.get('.el-dialog__body').contains('Test Volunteer');
  });
});
