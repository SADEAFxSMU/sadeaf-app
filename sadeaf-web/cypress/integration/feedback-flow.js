import { enterAdminHomepage, enterClientHomepage } from '../helpers/login-helpers';

describe('Feedback Flow', () => {
  it('should allow clients to give feedback to fully completed assignments', () => {
    // note: there is already a fully completed assigment in mockdata.sql called Feedback Event
    enterClientHomepage();
    cy.get('[data-test=client-feedback]').click();
    cy.get(
      '.el-table__fixed-body-wrapper > .el-table__body > tbody > .el-table__row > .el-table_2_column_15 > .cell > .el-button'
    ).click();
    cy.get(':nth-child(3) > .el-form-item__content > .el-radio-group > [tabindex="0"] > .el-radio__input').click();
    cy.get(':nth-child(4) > .el-form-item__content > .el-radio-group > [tabindex="0"] > .el-radio__input').click();
    cy.get(':nth-child(7) > .el-form-item__content > .el-radio-group > [tabindex="0"] > .el-radio__input').click();
    cy.get(':nth-child(8) > .el-form-item__content > .el-radio-group > [tabindex="0"] > .el-radio__input').click();
    cy.get(':nth-child(12) > .el-form-item__content > .el-radio-group > [tabindex="0"] > .el-radio__input').click();
    cy.get(
      ':nth-child(19) > .el-form-item__content > .el-radio-group > :nth-child(1) > .el-radio > .el-radio__input'
    ).click();
    cy.get(
      ':nth-child(20) > .el-form-item__content > .el-radio-group > :nth-child(1) > .el-radio > .el-radio__input'
    ).click();
    cy.get('.el-form-item__content > .el-button').click();
  });

  it('should allow admins to see completed feedback', () => {
    enterAdminHomepage();
    cy.get('[data-test=admin-feedback]').click();
    cy.get('.main').contains('Feedback Event');
    cy.get('.main').contains('Test Client');
    cy.get('.main').contains('Test Volunteer');
  });
});
