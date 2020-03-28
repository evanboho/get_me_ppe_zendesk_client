var GetMePpeZendeskClient = require('./lib/get_me_ppe_zendesk_client');

var client = new GetMePpeZendeskClient;

var command = process.argv.slice(2);

switch(command[0]) {
  case 'getUsers':
    client.getUsers();
    break;
  case 'getTicketFields':
    client.getTicketFields();
    break;
  case 'getTickets':
    client.getTickets();
    break;
  case 'getTicket':
    var id = command[1];
    if (id == undefined) {
      console.error('Missing id arg');
      return;
    }
    client.getTicket(id);
    break;
  case 'updateTicketStatus':
    var id = command[1];
    if (id == undefined) {
      console.error('Missing id arg');
      return;
    }
    var status = command[2];
    if (id == undefined) {
      console.error('Missing status arg');
      return;
    }
    client.updateTicketState(id, status);
    break;
  default:
    console.error(`Unknown command '${command[0]}'`)
}
