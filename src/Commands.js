import Mailtrap from '@xedi/mailtrap';

export default function({Cypress, cy}) {
    Cypress.Commands.add('getInbox', (inbox_id) => {
        return cy.task('mailtrap:inbox:get', inbox_id);
    });

    Cypress.Commands.add('deleteMessage', (inbox_id, message_id) => {
        return cy.task('mailtrap:message:delete', { inbox_id, message_id });
    });

    Cypress.Commands.add('waitForEmail', (inbox_id, search_params, timeout = 6000, interval = 1000) => {
        return cy.task('mailtrap:inbox:wait', { inbox_id, search_params, timeout, interval });
    });
}
