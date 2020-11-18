import { enterClientHomepage } from '../helpers/login-helpers';

describe('Client Create New Assignment', () => {
  beforeEach(() => {
    enterClientHomepage();
    // open calendar on 20th day
    cy.get(':nth-child(5) > :nth-child(5) > .el-calendar-day').click();
  });

  it('should error when submitting empty new assignment form', () => {
    cy.get('.el-form-item__content > .el-button-group > :nth-child(1)').click();
    cy.get('.el-dialog__body').contains('Please enter a name for this Event');
    cy.get('.el-dialog__body').contains('Please enter a purpose');
    cy.get('.el-dialog__body').contains('Please enter an event skill!');
    cy.get('.el-dialog__body').contains('Please enter a valid address');
    cy.get('.el-dialog__body').contains('Minimum duration is 2 hours');
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
    cy.get('.el-form-item__content > .el-button-group > :nth-child(1)').click();
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
    cy.get('[data-test=client-create-event-purpose]').click().type('{downarrow}{enter}');
    // event category
    cy.get('[data-test=client-create-event-category]').click().type('{downarrow}{enter}');
    // event education
    cy.get('[data-test=client-create-event-education]').click().type('{downarrow}{enter}');
    // assignment timing
    cy.get(':nth-child(2) > .el-form-item > .el-form-item__content > :nth-child(1) > .el-input__inner')
      .click()
      .focus()
      .type('{selectall}{backspace} 11:00 {enter}');
    cy.get('.el-form-item__content > :nth-child(2) > .el-input__inner')
      .click()
      .focus()
      .type('{selectall}{backspace} 15:00 {enter}');
    // address field
    cy.get('.el-autocomplete > .el-input > .el-input__inner')
      .click()
      .type('Singapore Management University')
      .wait(4000)
      .type('{downarrow}{enter}');
    cy.get('.el-form-item__content > .el-button-group > :nth-child(1)').click();
    cy.get(':nth-child(5) > :nth-child(5) > .el-calendar-day').contains('Some new assignment');
  });
});
