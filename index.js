var zendesk = require('node-zendesk');


function GetMePpeZendeskClient() {
  var organizationFields = {};
  var client = zendesk.createClient({
    username:  process.env.ZD_API_USERNAME,
    token:     process.env.ZD_API_TOKEN,
    remoteUri: 'https://getmeppe-sfbay.zendesk.com/api/v2'
  });

  function getUsers() {
    client.users.list((err, req, result) => {
      if (err) {
        console.log(err);
        return;
      }
      result.forEach((r) => {
        console.log(JSON.stringify(r, null, 2, true));
      })
    });
  }

  function getTickets() {
    client.users.list((err, req, result) => {
      if (err) {
        console.log(err);
        return;
      }
      result.forEach((r) => {
        console.log(JSON.stringify(r, null, 2, true));
      })
    });
  }

  function getOrganizationFields() {
    client.organizationfields.list((err, req, result) => {
      result.forEach((item) => {
        organizationFields[item.id] = item;
      });
      console.log(organizationFields)
    })
  }

  return {
    getUsers: getUsers,
    getTickets: getTickets,
    getOrganizationFields: getOrganizationFields,
  }
}

var client = new GetMePpeZendeskClient
client.getOrganizationFields()
