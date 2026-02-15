# Gmail Operations Backend 📧

Simple Express.js backend for testing Gmail API operations with comprehensive logging.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   pnpm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   ```

3. **Start Server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

## 📋 API Endpoints

### Health Check
```http
GET http://localhost:3001/health
```

### Test Gmail Operations
```http
POST http://localhost:3001/api/test-gmail
Content-Type: application/json

{
  "accessToken": "your-google-oauth-access-token"
}
```

## 🔧 What It Tests

When you send a POST request to `/api/test-gmail` with an access token, it will:

1. **👤 Get User Profile** - Basic Gmail account info
2. **🏷️ Get Gmail Labels** - All available labels
3. **📨 Get Last 5 Emails** - Recent inbox messages  
4. **🔵 Get Unread Emails** - All unread messages
5. **📅 Get Last 2 Days Emails** - Recent messages from past 2 days
6. **🔍 Search Important Emails** - Search with query "is:important"
7. **🤖 Generate AI Summary** - Email data formatted for AI processing

## 📊 Logging Output

The server provides detailed, colorful console logs:

```
🔹 [2026-02-15T10:30:00.000Z] 🚀 Starting Gmail Operations Test
📊 Data: {"tokenLength": 180}
────────────────────────────────────────────────────────────

✅ [2026-02-15T10:30:01.000Z] SUCCESS: Get User Profile
🎯 Result: {
  "emailAddress": "user@gmail.com",
  "messagesTotal": 1234,
  "threadsTotal": 567
}
════════════════════════════════════════════════════════════
```

## 🔐 Getting Access Token

1. **From Frontend**: The access token comes from your NextAuth.js Google OAuth flow
2. **From Frontend Session**: Use `session.accessToken` from your authenticated user
3. **For Testing**: You can get one from Google OAuth 2.0 Playground

## 🎯 Perfect for Testing

- **Comprehensive Logging** - See exactly what's happening
- **Error Handling** - Clear error messages with stack traces  
- **All Operations** - Tests read, search, profile, labels in one request
- **AI Ready** - Formats data for AI agent consumption
- **Easy Integration** - Simple REST API for frontend connection

## 🔄 Development

Start with auto-restart for development:
```bash
npm run dev
```

## 📝 Example Response

```json
{
  "success": true,
  "message": "Gmail operations test completed", 
  "timestamp": "2026-02-15T10:30:05.000Z",
  "testResults": {
    "userProfile": {
      "emailAddress": "user@gmail.com",
      "messagesTotal": 1234
    },
    "recentEmails": {
      "count": 5,
      "emails": [...]
    },
    "unreadEmails": {
      "count": 3,
      "emails": [...]
    }
  }
}
```

## 🚨 Error Logging

Errors are logged with full details:
```
❌ [2026-02-15T10:30:01.000Z] ERROR: Get User Profile
🚨 Error Details: Invalid access token
📍 Stack: Error: Invalid access token at ...
════════════════════════════════════════════════════════════
```

Perfect for development and debugging! 🎉