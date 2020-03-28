# Get Me PPE Zendesk Client

## Setup
Add configuration to the ENV:

    > export ZD_API_USERNAME="<Email of Zendesk User who generated API token>"
    > export ZD_API_TOKEN="<Zendesk API token>"
   
## CLI

Some things you can do:

    > node index.js getUsers
    > node index.js getTicketFields
    > node index.js getTickets
    > node index.js getTicket 1 # id of ticket in Zendesk

## Tickets

All fields returned by the Zendesk API:

    id, external_id, via, created_at, updated_at, type, subject, raw_subject, 
    description, priority, status, recipient, requester_id, submitter_id, assignee_id, 
    organization_id, group_id, collaborator_ids, follower_ids, email_cc_ids, 
    forum_topic_id, problem_id, has_incidents, is_public, due_at, tags, custom_fields, 
    satisfaction_rating, sharing_agreement_ids, fields, followup_ids, ticket_form_id, 
    brand_id, satisfaction_probability, allow_channelback, allow_attachments
    
### Fields and Custom Fields
These are two fields that have the structure:

    {
      id: 3000000000
      value: true
    }
    
For ease of use, the Ticket#toJson function converts these to more usable JSON by using the ticketfields.
