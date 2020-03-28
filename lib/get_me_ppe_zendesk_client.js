var zendesk = require('node-zendesk');
var Ticket = require('./ticket')

module.exports = function() {
  var ticketFieldsKeysToExtract = [
    'tag',
    'title'
  ]

  var client = zendesk.createClient({
    username:  process.env.ZD_API_USERNAME,
    token:     process.env.ZD_API_TOKEN,
    remoteUri: 'https://getmeppe-sfbay.zendesk.com/api/v2'
  });

  /* Gets all users. Not sure what we'll need this for at the moment. Here for reference.
   * If no callback provided, logs array of Zendesk User objects to console.
   *
   * @param {Function} cb(Error, Request, Array<Object>)
   */
  function getUsers(cb) {
    client.users.list((err, req, result) => {
      if (err) {
        if (cb) {
          cb(err, req, result);
        } else {
          console.log(err);
        }
        return;
      }

      if (cb) {
        cb(err, req, result);
      } else {
        result.forEach((r) => {
          console.log(JSON.stringify(r, null, 2, true));
        })
      }

    });
  }

  /* Gets all tickets
   * If no callback provided, logs array of Tickets to console.
   * TODO: pagination?
   *
   * @param {Function} cb(Error, Request, Array<Ticket>)
   */
   function getTickets(cb) {
    client.tickets.list((err, req, result) => {
      if (err) {
        if (cb) {
          cb(err, req, result);
        } else {
          console.error(`Error fetching tickets: ${err}`);
        }
        return;
      }

      var tickets = result.map((el) => Ticket.fromZendesk(el));

      if (cb) {
        cb(err, req, tickets);
      } else {
        tickets.forEach((ticket) => {
          console.log(JSON.stringify(ticket.json, null, 2, true));
        });
      }
    });
  }

  /* Gets ticket by id
   * If no callback provided, logs Ticket to console.
   * TODO: pagination?
   *
   * @param {Integer} ticketId
   * @param {Function} cb(Error, Request, Ticket)
   */
  function getTicket(ticketId, cb) {
    client.tickets.show(ticketId, (err, req, result) => {
      if (err) {
        if (cb) {
          cb(err, req, result);
        } else {
          console.error(`Error fetching ticket: ${err}`);
        }
        return;
      }

      var ticket = Ticket.fromZendesk(result);
      if (cb) {
        cb(err, req, ticket);
      } else {
        console.log(ticket.json);
      }
    });
  }

  function updateTicketState(ticketId, status, cb) {
    client.tickets.update(ticketId, { ticket: { status: status } }, (err, req, result) => {
      console.log(err, req, result);
    });
  }

  /* Gets ticket fields and logs to console
   * Use this function to load ticket fields to copy/paste into ticket_fields_map.js
   *
   * @param {Function} cb(Error, Request, Array<Object>)
   */
  function getTicketFields(cb) {
    client.ticketfields.list((err, req, result) => {
      if (err) {
        if (cb) {
          cb(err, req, result);
        } else {
          console.error(`Error fetching ticket fields: ${err}`);
        }
        return;
      }

      var ticketFields = {};
      result.forEach((item) => {
        var field = {};
        ticketFieldsKeysToExtract.forEach((key) => {
          field[key] = item[key];
        })
        ticketFields[item.id] = field;
      });

      if (cb) {
        cb(err, req, ticketFields);
      } else {
        console.log(ticketFields);
      }
    })
  }

  return {
    getUsers: getUsers,
    getTicket: getTicket,
    getTickets: getTickets,
    getTicketFields: getTicketFields,
    updateTicketState: updateTicketState,
  }
}
