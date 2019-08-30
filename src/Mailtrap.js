import Mailtrap from '@xedi/mailtrap';

export default function({ Cypress, cy }) {
    const fetchCypressEnvVar = (key, log_message) => {
        let env_var = Cypress.env(key);

        if (! env_var) {
            if (! log_message) {
                log_message = `${key} must be set in the Cypress environment`;
            }

            cy.log(log_message);

            throw new RangeError(log_message);
        }

        return env_var
    }

    Cypress.Commands.add('verifyEmail', (email_address) => {
        const api_token = fetchCypressEnvVar('MAILTRAP_API_TOKEN'),
            inbox_id = fetchCypressEnvVar('MAILTRAP_INBOX_ID');

        return new Promise((resolve, reject) => {
            cy.log('Verifying account');

            Mailtrap.setAuthorizationToken(api_token)
                .inbox(inbox_id)
                .waitForEmail(
                    email_address,
                    (message) => {
                        const body = await message.getHtmlBody(),
                            doc = new DOMParser().parseFromString(body, 'text/html'),
                            btn = doc.querySelector('a');

                        await cy.request((
                            url: btn.getAttribute('href'),
                            method: 'GET'
                        ));

                        await message.delete();

                        resolve(true);
                    },
                    (error) => {
                        reject(error);
                    }
                );
        });
    });

    Cypress.Commands.add('forgotPassword', (email_address, new_password) => {
        const api_token = fetchCypressEnvVar('MAILTRAP_API_TOKEN'),
            inbox_id = fetchCypressEnvVar('MAILTRAP_INBOX_ID');

        return new Promise((resolve, reject) => {
            Mailtrap.setAuthorizationToken(api_token)
                .inbox(inbox_id)
                .waitForEmail(
                    email_address,
                    (message) => {
                        const body = await message.getHtmlBody(),
                            doc = new DOMParser().parseFromString(body, 'text/html'),
                            btn = doc.querySelector('a');

                        cy.visit(btn.getAttribute('href'));
                        cy.get('#password').type(new_password);
                        cy.get('#password_confirmation').type(new_password);
                        cy.get('form').submit();

                        resolve(true);
                    },
                    (error) => {
                        reject(error);
                    }
                );
        });
    });
};
