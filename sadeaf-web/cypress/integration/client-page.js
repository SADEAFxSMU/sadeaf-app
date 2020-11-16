describe('Client Page', () => {
  beforeEach(() => {
    enterClientHomepage();
  });

  it('should show the correctly rendered client homepage', () => {
    cy.location('pathname').should('equals', '/client');
    cy.get('.el-calendar__body');
    cy.get('.el-table');
  });
});

describe('Client Create New Assignment', () => {
  beforeEach(() => {
    enterClientHomepage();
    // open calendar on 20th day
    cy.get(':nth-child(4) > :nth-child(5) > .el-calendar-day').click();
  });

  it('should error when submitting empty new assignment form', () => {
    pressCreateNewAssignmentButton();
    cy.get('.el-dialog__body').contains('Please enter a name for this Event');
    cy.get('.el-dialog__body').contains('Please enter a purpose');
    cy.get('.el-dialog__body').contains('Please enter an address');
  });

  it('should error when submitting assignment timing <2hrs apart', () => {
    cy.get(':nth-child(2) > .el-form-item > .el-form-item__content > :nth-child(1) > .el-input__inner')
      .click()
      .focus()
      .type('{selectall}{backspace} 11:00');
    cy.get('.el-form-item__content > :nth-child(2) > .el-input__inner')
      .click()
      .focus()
      .type('{selectall}{backspace} 12:00');
    pressCreateNewAssignmentButton();
    cy.get('.el-dialog__body').contains('Minimum duration is 2 hours');
  });

  it('should submit the form when all fields are correctly filled', () => {
    // event name
    cy.get('.el-form > :nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
      .click()
      .type('Some new assignment');
    // event skill
    cy.get('.el-checkbox-group > :nth-child(1)').click();
    // event purpose
    cy.get('.field-purpose > .el-select > .el-input > .el-input__inner')
      .click()
      .get('.el-select-dropdown__wrap > .el-scrollbar__view > :nth-child(3)')
      .click();
    // assignment timing
    cy.get(':nth-child(2) > .el-form-item > .el-form-item__content > :nth-child(1) > .el-input__inner')
      .click()
      .focus()
      .type('{selectall}{backspace} 11:00');
    cy.get('.el-form-item__content > :nth-child(2) > .el-input__inner')
      .click()
      .focus()
      .type('{selectall}{backspace} 15:00');
    // address field
    cy.get('.field-location > :nth-child(2) > :nth-child(1) > .el-input__inner')
      .click()
      .type('Singapore Management University');
    pressCreateNewAssignmentButton();
    cy.get(':nth-child(4) > :nth-child(5) > .el-calendar-day').contains('Some new assignment');
  });
});

function enterClientHomepage() {
  cy.visit('/');
  cy.get('[data-test=sign-in-email-input]').first().type('sadeaf-client@huansen.dev', { force: true });
  cy.get('[data-test=sign-in-password-input]').first().type('password123', { force: true });
  cy.get('[data-test="sign-in-sign-in-button"]').first().click();
}

function pressCreateNewAssignmentButton() {
  cy.get('.el-form-item__content > .el-button-group > :nth-child(1)').click();
}
