import Mailtrap from '@xedi/mailtrap';

export default function({Cypress, cy, on, config}) {
    on('task', {
        'mailtrap:inbox:list': () => {
            return Mailtrap.setApiToken(config.env['MAILTRAP_API_TOKEN'])
                .inboxes();
        },
        'mailtrap:inbox:show': (inbox_id) => {
            return Mailtrap.setApiToken(config.env['MAILTRAP_API_TOKEN'])
                .inbox(inbox_id);
        },
        'mailtrap:inbox:wait': ({ inbox_id, search_params, timeout, interval }) => {
            Mailtrap.setApiToken(config.env['MAILTRAP_API_TOKEN']);

            return Mailtrap.inbox(inbox_id)
                .then((inbox) => {
                    return inbox.waitForMessages(search_params, timeout, interval)
                      .then((messages) => {
                        if (messages.count() === 1) {
                          return messages.pop();
                        }

                        return messages;
                      });
                });
        }
    });
};
