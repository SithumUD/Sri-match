import API from './base.service';

/**
 * SupportService
 * Handles user support tickets and communication with admins.
 */
const SupportService = {
    /**
     * Create a new support ticket
     */
    createTicket: (ticketData) => {
        return API.post('/support/tickets', ticketData);
    },

    /**
     * Get list of tickets created by the current user
     */
    getMyTickets: () => {
        return API.get('/support/tickets');
    },

    /**
     * Get messages for a specific support ticket
     */
    getTicketMessages: (ticketId) => {
        return API.get(`/support/tickets/${ticketId}/messages`);
    },

    /**
     * Send a reply to an existing ticket
     */
    replyToTicket: (ticketId, messageData) => {
        return API.post(`/support/tickets/${ticketId}/messages`, messageData);
    }
};

export default SupportService;
