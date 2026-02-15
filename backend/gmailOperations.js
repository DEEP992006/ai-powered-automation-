import { google } from 'googleapis';
import { format, subDays, parseISO } from 'date-fns';

export class GmailOperations {
  constructor(accessToken) {
    this.auth = new google.auth.OAuth2();
    this.auth.setCredentials({ access_token: accessToken });
    this.gmail = google.gmail({ version: 'v1', auth: this.auth });
  }

  // ==================== READ OPERATIONS ====================

  /**
   * Get last N emails from inbox
   * @param {number} maxResults - Number of emails to fetch (default: 10, max: 500)
   * @param {string} query - Gmail search query (optional)
   * @returns {Object} Email list with metadata
   */
  async getLastEmails(maxResults = 10, query = 'in:inbox') {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults: Math.min(maxResults, 500),
        q: query,
      });

      if (!response.data.messages) {
        return { emails: [], totalCount: 0 };
      }

      const emailPromises = response.data.messages.map(async (message) => {
        return await this.getEmailDetails(message.id);
      });

      const emails = await Promise.all(emailPromises);
      
      return {
        emails: emails.filter(Boolean),
        totalCount: response.data.resultSizeEstimate,
        nextPageToken: response.data.nextPageToken
      };
    } catch (error) {
      throw new Error(`Failed to fetch emails: ${error.message}`);
    }
  }

  /**
   * Get emails from specific days ago
   * @param {number} daysAgo - Number of days ago to search from
   * @param {number} maxResults - Number of emails to fetch
   * @returns {Object} Email list from specified date range
   */
  async getEmailsFromDaysAgo(daysAgo = 1, maxResults = 50) {
    const dateFrom = format(subDays(new Date(), daysAgo), 'yyyy/MM/dd');
    const query = `after:${dateFrom}`;
    
    return await this.getLastEmails(maxResults, query);
  }

  /**
   * Get emails from specific sender
   * @param {string} senderEmail - Sender's email address
   * @param {number} maxResults - Number of emails to fetch
   * @returns {Object} Email list from sender
   */
  async getEmailsFromSender(senderEmail, maxResults = 20) {
    const query = `from:${senderEmail}`;
    return await this.getLastEmails(maxResults, query);
  }

  /**
   * Get unread emails
   * @param {number} maxResults - Number of emails to fetch
   * @returns {Object} Unread email list
   */
  async getUnreadEmails(maxResults = 50) {
    const query = 'is:unread';
    return await this.getLastEmails(maxResults, query);
  }

  /**
   * Get detailed information about a specific email
   * @param {string} messageId - Gmail message ID
   * @returns {Object} Detailed email information
   */
  async getEmailDetails(messageId) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });

      const message = response.data;
      const headers = message.payload.headers;
      
      const getHeader = (name) => headers.find(h => h.name === name)?.value || '';
      
      let body = '';
      let attachments = [];

      // Extract body content
      if (message.payload.body.data) {
        body = Buffer.from(message.payload.body.data, 'base64').toString();
      } else if (message.payload.parts) {
        for (const part of message.payload.parts) {
          if (part.mimeType === 'text/plain' && part.body.data) {
            body = Buffer.from(part.body.data, 'base64').toString();
            break;
          } else if (part.mimeType === 'text/html' && part.body.data) {
            body = Buffer.from(part.body.data, 'base64').toString();
          }
        }
        
        // Extract attachments
        attachments = message.payload.parts
          .filter(part => part.filename && part.filename.length > 0)
          .map(part => ({
            filename: part.filename,
            mimeType: part.mimeType,
            size: part.body.size,
            attachmentId: part.body.attachmentId
          }));
      }

      return {
        id: message.id,
        threadId: message.threadId,
        subject: getHeader('Subject'),
        from: getHeader('From'),
        to: getHeader('To'),
        cc: getHeader('Cc'),
        bcc: getHeader('Bcc'),
        date: getHeader('Date'),
        timestamp: parseInt(message.internalDate),
        body: body,
        snippet: message.snippet,
        labelIds: message.labelIds,
        attachments: attachments,
        isUnread: message.labelIds?.includes('UNREAD') || false,
        isImportant: message.labelIds?.includes('IMPORTANT') || false,
      };
    } catch (error) {
      console.error(`Failed to get email details for ${messageId}:`, error.message);
      return null;
    }
  }

  /**
   * Search emails with advanced query
   * @param {string} searchQuery - Gmail search query
   * @param {number} maxResults - Number of results to return
   * @returns {Object} Search results
   */
  async searchEmails(searchQuery, maxResults = 25) {
    return await this.getLastEmails(maxResults, searchQuery);
  }

  // ==================== WRITE OPERATIONS ====================

  /**
   * Send email to single recipient
   * @param {Object} emailData - Email details
   * @returns {Object} Sent email information
   */
  async sendEmail({ to, subject, body, cc = '', bcc = '', attachments = [] }) {
    try {
      let email = [
        `To: ${to}`,
        cc ? `Cc: ${cc}` : '',
        bcc ? `Bcc: ${bcc}` : '',
        `Subject: ${subject}`,
        'Content-Type: text/html; charset=utf-8',
        '',
        body
      ].filter(Boolean).join('\n');

      const encodedEmail = Buffer.from(email).toString('base64url');

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail,
        },
      });

      return {
        success: true,
        messageId: response.data.id,
        threadId: response.data.threadId,
        to,
        subject,
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send email to multiple recipients
   * @param {Object} emailData - Email details with multiple recipients
   * @returns {Array} Array of sent email results
   */
  async sendBulkEmails({ recipients, subject, body, cc = '', bcc = '' }) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendEmail({
          to: recipient,
          subject,
          body,
          cc,
          bcc
        });
        results.push({ ...result, recipient, error: null });
      } catch (error) {
        results.push({
          success: false,
          recipient,
          error: error.message,
          timestamp: Date.now()
        });
      }
    }

    return {
      results,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length
    };
  }

  /**
   * Reply to an email
   * @param {string} messageId - Original message ID to reply to
   * @param {string} replyBody - Reply content
   * @returns {Object} Reply result
   */
  async replyToEmail(messageId, replyBody) {
    try {
      const originalEmail = await this.getEmailDetails(messageId);
      
      if (!originalEmail) {
        throw new Error('Original email not found');
      }

      const replyTo = originalEmail.from;
      const subject = originalEmail.subject.startsWith('Re:') 
        ? originalEmail.subject 
        : `Re: ${originalEmail.subject}`;

      return await this.sendEmail({
        to: replyTo,
        subject,
        body: replyBody,
      });
    } catch (error) {
      throw new Error(`Failed to reply to email: ${error.message}`);
    }
  }

  /**
   * Forward an email
   * @param {string} messageId - Message ID to forward
   * @param {string} to - Recipient email
   * @param {string} additionalMessage - Additional message to add
   * @returns {Object} Forward result
   */
  async forwardEmail(messageId, to, additionalMessage = '') {
    try {
      const originalEmail = await this.getEmailDetails(messageId);
      
      if (!originalEmail) {
        throw new Error('Original email not found');
      }

      const subject = originalEmail.subject.startsWith('Fwd:') 
        ? originalEmail.subject 
        : `Fwd: ${originalEmail.subject}`;

      const forwardBody = `
        ${additionalMessage}
        
        ---------- Forwarded message ---------
        From: ${originalEmail.from}
        Date: ${originalEmail.date}
        Subject: ${originalEmail.subject}
        To: ${originalEmail.to}
        
        ${originalEmail.body}
      `;

      return await this.sendEmail({
        to,
        subject,
        body: forwardBody,
      });
    } catch (error) {
      throw new Error(`Failed to forward email: ${error.message}`);
    }
  }

  // ==================== EMAIL MANAGEMENT ====================

  /**
   * Mark emails as read/unread
   * @param {Array} messageIds - Array of message IDs
   * @param {boolean} markAsRead - True to mark as read, false for unread
   * @returns {Object} Operation result
   */
  async markEmailsAsRead(messageIds, markAsRead = true) {
    try {
      const labelToAdd = markAsRead ? [] : ['UNREAD'];
      const labelToRemove = markAsRead ? ['UNREAD'] : [];

      const response = await this.gmail.users.messages.batchModify({
        userId: 'me',
        requestBody: {
          ids: messageIds,
          addLabelIds: labelToAdd,
          removeLabelIds: labelToRemove,
        },
      });

      return {
        success: true,
        modifiedCount: messageIds.length,
        operation: markAsRead ? 'marked_as_read' : 'marked_as_unread'
      };
    } catch (error) {
      throw new Error(`Failed to modify email read status: ${error.message}`);
    }
  }

  /**
   * Delete emails (move to trash)
   * @param {Array} messageIds - Array of message IDs
   * @returns {Object} Operation result
   */
  async deleteEmails(messageIds) {
    try {
      const deletePromises = messageIds.map(id => 
        this.gmail.users.messages.trash({
          userId: 'me',
          id: id,
        })
      );

      await Promise.all(deletePromises);

      return {
        success: true,
        deletedCount: messageIds.length
      };
    } catch (error) {
      throw new Error(`Failed to delete emails: ${error.message}`);
    }
  }

  /**
   * Add labels to emails
   * @param {Array} messageIds - Array of message IDs
   * @param {Array} labelIds - Array of label IDs to add
   * @returns {Object} Operation result
   */
  async addLabelsToEmails(messageIds, labelIds) {
    try {
      await this.gmail.users.messages.batchModify({
        userId: 'me',
        requestBody: {
          ids: messageIds,
          addLabelIds: labelIds,
        },
      });

      return {
        success: true,
        modifiedCount: messageIds.length,
        labelsAdded: labelIds
      };
    } catch (error) {
      throw new Error(`Failed to add labels: ${error.message}`);
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get Gmail labels
   * @returns {Array} List of Gmail labels
   */
  async getLabels() {
    try {
      const response = await this.gmail.users.labels.list({
        userId: 'me',
      });

      return response.data.labels.map(label => ({
        id: label.id,
        name: label.name,
        type: label.type,
        messageListVisibility: label.messageListVisibility,
        labelListVisibility: label.labelListVisibility,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch labels: ${error.message}`);
    }
  }

  /**
   * Get user profile information
   * @returns {Object} User profile
   */
  async getUserProfile() {
    try {
      const response = await this.gmail.users.getProfile({
        userId: 'me',
      });

      return {
        emailAddress: response.data.emailAddress,
        messagesTotal: response.data.messagesTotal,
        threadsTotal: response.data.threadsTotal,
        historyId: response.data.historyId,
      };
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  // ==================== AI-FRIENDLY METHODS ====================

  /**
   * Get email summary for AI processing
   * @param {number} maxResults - Number of emails to analyze
   * @returns {Array} Simplified email data for AI
   */
  async getEmailSummaryForAI(maxResults = 10) {
    try {
      const emailsData = await this.getLastEmails(maxResults);
      
      return emailsData.emails.map(email => ({
        id: email.id,
        subject: email.subject,
        from: email.from,
        date: email.date,
        snippet: email.snippet,
        isUnread: email.isUnread,
        isImportant: email.isImportant,
        hasAttachments: email.attachments.length > 0,
      }));
    } catch (error) {
      throw new Error(`Failed to get AI summary: ${error.message}`);
    }
  }

  /**
   * Execute email action based on AI command
   * @param {Object} action - Action object from AI
   * @returns {Object} Action result
   */
  async executeAIAction(action) {
    try {
      switch (action.type) {
        case 'send_email':
          return await this.sendEmail(action.data);
        
        case 'reply_to_email':
          return await this.replyToEmail(action.data.messageId, action.data.replyBody);
        
        case 'forward_email':
          return await this.forwardEmail(action.data.messageId, action.data.to, action.data.message);
        
        case 'mark_as_read':
          return await this.markEmailsAsRead(action.data.messageIds, true);
        
        case 'mark_as_unread':
          return await this.markEmailsAsRead(action.data.messageIds, false);
        
        case 'delete_emails':
          return await this.deleteEmails(action.data.messageIds);
        
        case 'search_emails':
          return await this.searchEmails(action.data.query, action.data.maxResults);
        
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      throw new Error(`Failed to execute AI action: ${error.message}`);
    }
  }
}

export default GmailOperations;