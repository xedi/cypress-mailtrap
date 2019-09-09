const Mailtrap = require('@xedi/mailtrap');

module.exports = function({ on, config }) {
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
        },
        'mailtrap:message:get': ({ inbox_id, message_id }) => {
            return Mailtrap.setApiToken(config.env['MAILTRAP_API_TOKEN'])
                .message(inbox_id, message_id);
        },

        'mailtrap:message:delete': ({ inbox_id, message_id }) => {
            return Mailtrap.setApiToken(config.env['MAILTRAP_API_TOKEN'])
                .message(inbox_id, message_id)
                .then((message) => {
                    message.delete();

                    return 'deleted';
                });
        }
    });
};
