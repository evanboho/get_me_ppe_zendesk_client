var ticketFieldsIdToField = require('./ticket_fields_map');

// Fields:
// id
// external_id
// via
// created_at
// updated_at
// type
// subject
// raw_subject
// description
// priority
// status
// recipient
// requester_id
// submitter_id
// assignee_id
// organization_id
// group_id
// collaborator_ids
// follower_ids
// email_cc_ids
// forum_topic_id
// problem_id
// has_incidents
// is_public
// due_at
// tags
// custom_fields
// satisfaction_rating
// sharing_agreement_ids
// fields
// followup_ids
// ticket_form_id
// brand_id
// satisfaction_probability
// allow_channelback
// allow_attachments

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
