var ticketFieldsIdToField = require('./ticket_fields_map');

// Statuses: "open", "pending", "hold", "solved" or "closed"
// Once a ticket is closed it can never be reopened.
// In any other state, it can go to any other state.

class Ticket {

  // Accepts an object with either zendeskJson or json as a key.
  constructor(args) {
    if (args.zendeskJson) {
      this.zendeskJson = args.zendeskJson;
      this.json = this.toJson(this.zendeskJson);
    } else if (args.json) {
      this.json = args.json;
      this.zendeskJson = this.toZendeskJson(this.json);
    }
  }

  static fromZendesk(json) {
    return new Ticket({ zendeskJson: json });
  }

  // Return above Zendesk fields and hydrate with custom task fields
  // Stores custom task fields as top-level JSON using ticketFieldsIdToField
  toJson(zendeskJson) {
    var json = {};
    for (const key in zendeskJson) {
      if (key == 'fields' || key == 'custom_fields') {
        this.zendeskJson.fields.forEach((el) => {
          var fieldFromId = ticketFieldsIdToField[el.id];
          if (fieldFromId && fieldFromId.tag) {
            json[fieldFromId.tag] = el.value;
          }
        });
      } else {
        json[key] = this.zendeskJson[key];
      }
    }
    return json;
  }

  toZendeskJson(json) {
    var zendeskJson = {};
    var ticketFieldsTagToId = {};
    for (const id in ticketFieldsIdToField) {
      var field = ticketFieldsIdToField[id];
      if (field.tag) {
        fieldNameToId[field.tag] = id;
      }
    }

    for (const key in json) {
      var customFieldId = ticketFieldsTagToId[key];
      if (customFieldId) {
        zendeskJson[key] = {
          id: customFieldId,
          value: json[key],
        };
      } else {
        zendeskJson[key] = json[key]
      }
    }
    return zendeskJson;
  }
}

module.exports = Ticket;
