import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import GmailOperations from './gmailOperations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Simple middleware
app.use(cors());
app.use(express.json());

// Logging helper
const log = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🔹 [${timestamp}] ${message}`);
  if (data) {
    console.log('📊 Data:', JSON.stringify(data, null, 2));
  }
  console.log('─'.repeat(80));
};

const logError = (message, error) => {
  const timestamp = new Date().toISOString();
  console.log(`\n❌ [${timestamp}] ERROR: ${message}`);
  console.log('🚨 Error Details:', error.message);
  console.log('📍 Stack:', error.stack);
  console.log('═'.repeat(80));
};

const logSuccess = (operation, result) => {
  const timestamp = new Date().toISOString();
  console.log(`\n✅ [${timestamp}] SUCCESS: ${operation}`);
  console.log('🎯 Result:', JSON.stringify(result, null, 2));
  console.log('═'.repeat(80));
};

// Health check
app.get('/health', (req, res) => {
  log('Health check requested');
  res.json({ status: 'OK', service: 'Gmail Test API' });
});

// Main test endpoint
app.post('/api/test-gmail', async (req, res) => {
  const { accessToken } = req.body;
  
  if (!accessToken) {
    logError('Test Gmail Request', new Error('Access token is required'));
    return res.status(400).json({ error: 'Access token is required' });
  }

  log('🚀 Starting Gmail Operations Test', { tokenLength: accessToken.length });

  try {
    const gmailOps = new GmailOperations(accessToken);
    const testResults = {};

    log('📧 Initializing Gmail Operations...');
    
    // Test 1: Get User Profile
    log('🔍 TEST 1: Getting user profile...');
    try {
      const profile = await gmailOps.getUserProfile();
      testResults.userProfile = profile;
      logSuccess('Get User Profile', profile);
    } catch (error) {
      logError('Get User Profile', error);
      testResults.userProfile = { error: error.message };
    }

    // Test 2: Get Gmail Labels
    log('🏷️ TEST 2: Getting Gmail labels...');
    try {
      const labels = await gmailOps.getLabels();
      testResults.labels = { count: labels.length, labels: labels.slice(0, 5) };
      logSuccess('Get Labels', `Found ${labels.length} labels`);
      console.log('📋 First 5 labels:', labels.slice(0, 5).map(l => l.name));
    } catch (error) {
      logError('Get Labels', error);
      testResults.labels = { error: error.message };
    }

    // Test 3: Get Recent Emails (Last 5)
    log('📨 TEST 3: Getting last 5 emails...');
    try {
      const recentEmails = await gmailOps.getLastEmails(5);
      testResults.recentEmails = {
        count: recentEmails.emails.length,
        totalInInbox: recentEmails.totalCount,
        emails: recentEmails.emails.map(email => ({
          id: email.id,
          subject: email.subject,
          from: email.from,
          date: email.date,
          isUnread: email.isUnread,
          snippet: email.snippet?.substring(0, 100) + '...'
        }))
      };
      logSuccess('Get Recent Emails', `Found ${recentEmails.emails.length} emails`);
      
      // Log each email nicely
      recentEmails.emails.forEach((email, index) => {
        console.log(`\n📧 Email ${index + 1}:`);
        console.log(`  📨 Subject: ${email.subject}`);
        console.log(`  👤 From: ${email.from}`);
        console.log(`  📅 Date: ${email.date}`);
        console.log(`  ${email.isUnread ? '🔵 UNREAD' : '📖 READ'}`);
        console.log(`  📝 Snippet: ${email.snippet?.substring(0, 80)}...`);
      });
    } catch (error) {
      logError('Get Recent Emails', error);
      testResults.recentEmails = { error: error.message };
    }

    // Test 4: Get Unread Emails
    log('🔵 TEST 4: Getting unread emails...');
    try {
      const unreadEmails = await gmailOps.getUnreadEmails(10);
      testResults.unreadEmails = {
        count: unreadEmails.emails.length,
        emails: unreadEmails.emails.map(email => ({
          id: email.id,
          subject: email.subject,
          from: email.from,
          date: email.date
        }))
      };
      logSuccess('Get Unread Emails', `Found ${unreadEmails.emails.length} unread emails`);
      
      unreadEmails.emails.forEach((email, index) => {
        console.log(`🔵 Unread ${index + 1}: ${email.subject} (from: ${email.from})`);
      });
    } catch (error) {
      logError('Get Unread Emails', error);
      testResults.unreadEmails = { error: error.message };
    }

    // Test 5: Get Emails from Last 2 Days
    log('📅 TEST 5: Getting emails from last 2 days...');
    try {
      const recentDaysEmails = await gmailOps.getEmailsFromDaysAgo(2, 10);
      testResults.last2DaysEmails = {
        count: recentDaysEmails.emails.length,
        emails: recentDaysEmails.emails.map(email => ({
          id: email.id,
          subject: email.subject,
          from: email.from,
          date: email.date
        }))
      };
      logSuccess('Get Last 2 Days Emails', `Found ${recentDaysEmails.emails.length} emails from last 2 days`);
    } catch (error) {
      logError('Get Last 2 Days Emails', error);
      testResults.last2DaysEmails = { error: error.message };
    }

    // Test 6: Search Emails
    log('🔍 TEST 6: Searching emails with query "is:important"...');
    try {
      const searchResults = await gmailOps.searchEmails('is:important', 5);
      testResults.searchResults = {
        query: 'is:important',
        count: searchResults.emails.length,
        emails: searchResults.emails.map(email => ({
          id: email.id,
          subject: email.subject,
          from: email.from,
          date: email.date
        }))
      };
      logSuccess('Search Important Emails', `Found ${searchResults.emails.length} important emails`);
    } catch (error) {
      logError('Search Emails', error);
      testResults.searchResults = { error: error.message };
    }

    // Test 7: Get AI Summary
    log('🤖 TEST 7: Getting AI-friendly email summary...');
    try {
      const aiSummary = await gmailOps.getEmailSummaryForAI(5);
      testResults.aiSummary = {
        count: aiSummary.length,
        summary: aiSummary
      };
      logSuccess('Get AI Summary', `Generated summary for ${aiSummary.length} emails`);
      
      aiSummary.forEach((email, index) => {
        console.log(`🤖 AI Email ${index + 1}:`);
        console.log(`  📨 ${email.subject}`);
        console.log(`  👤 ${email.from}`);
        console.log(`  🔵 ${email.isUnread ? 'Unread' : 'Read'}`);
        console.log(`  📎 ${email.hasAttachments ? 'Has attachments' : 'No attachments'}`);
      });
    } catch (error) {
      logError('Get AI Summary', error);
      testResults.aiSummary = { error: error.message };
    }

    // Final Summary
    log('🎉 ALL TESTS COMPLETED!', {
      totalTests: 7,
      successfulTests: Object.values(testResults).filter(result => !result.error).length,
      failedTests: Object.values(testResults).filter(result => result.error).length
    });

    res.json({
      success: true,
      message: 'Gmail operations test completed',
      timestamp: new Date().toISOString(),
      testResults
    });

  } catch (error) {
    logError('Gmail Operations Test', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Catch all
app.use((req, res) => {
  log('404 - Endpoint not found', { method: req.method, url: req.url });
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/test-gmail'
    ]
  });
});

app.listen(PORT, () => {
  console.log('🚀'.repeat(50));
  console.log('🚀 Gmail Test API Server Started! 🚀');
  console.log('🚀'.repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`📧 Test Gmail: POST http://localhost:${PORT}/api/test-gmail`);
  console.log(`📋 Body: { "accessToken": "your-token-here" }`);
  console.log('🚀'.repeat(50));
});

export default app;