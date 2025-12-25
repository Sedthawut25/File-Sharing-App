# CloudShare – File Upload & Sharing App (Fullstack Starter)

CloudShare is a fullstack file upload and sharing application starter, designed for developers who want a modern frontend combined with a scalable backend architecture.

This project provides a working foundation for file uploads, public sharing, user credits, and authentication, while leaving room for customization and extension.

---

## 🧩 Features

• 📌 User Authentication via Clerk (email/password)  
• 📤 File upload with credit-based usage  
• 📁 List and manage user files  
• 🌐 Public shareable links for files  
• 📥 File download via public link  
• 📊 User credits tracking system  
• ⚙️ Backend API built with Java & Spring Boot  
• 📦 MongoDB for data storage  
• 📍 Frontend built with React  

---

## 🏁 Getting Started

### ⚙️ Prerequisites

Make sure you have the following installed:

• Java 21 or higher  
• MongoDB (local or cloud instance)  
• Node.js (LTS recommended)  
• Clerk account (for authentication)  

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Sedthawut25/File-Sharing-App.git



Step 2: Backend Setup
	1.	Create application.properties (or .env) and configure environment variables:
spring.data.mongodb.uri=mongodb://localhost:27017/cloudshare
server.servlet.context-path=/api/v1.0

clerk.issuer=https://<your-clerk-instance>.clerk.accounts.dev
clerk.jwks-url=https://<your-clerk-instance>.clerk.accounts.dev/.well-known/jwks.json
clerk.webhook.secret=<YOUR_WEBHOOK_SECRET>

razorpay.key.id=your_key_id
razorpay.key.secret=your_key_secret






Run the backend:
./mvnw spring-boot:run


Step 3: Frontend Setup
cd frontend
npm install
npm run dev




 How It Works

User Login

Users authenticate via Clerk. After login, users can:

• Access dashboard
• Upload files
• Manage uploaded files
• Generate public shareable links

⸻

File Upload

• Users can upload 1–5 files at a time
• Each upload deducts credits
• Backend stores file metadata and files on the server
• Frontend reflects updated credit balance

⸻

Public Sharing

• Files can be toggled public/private
• Public links can be shared with anyone
• Public users can view or download files without authentication

⸻

⚠️ Known Limitations & Notes

Authentication (Clerk)

• Authentication is handled by Clerk
• Profile data currently stores email only
• First name, last name, and avatar are not persisted
• Production usage should sync additional profile fields via Clerk user metadata API

⸻

Payments

• Real payment processing is not implemented
• Payment module is a scaffold for future integration (Stripe / Razorpay)

⸻

File Upload for New Accounts

• File upload may fail for newly registered users
• Existing users work correctly
• Possible causes:
• Profile or credit initialization not triggered on first login
• /register endpoint not called after authentication
• CORS or missing Authorization headers

✅ Recommended Fix (Next Development Task)
• Auto-create user profile and initial credits on first login (server-side)
• Or ensure frontend calls /register once after Clerk login
• Improve backend CORS settings for deployed environments (Vercel / Render)

⸻

🧩 How to Extend

Add Full User Profile Sync
	1.	Create a JWT template in Clerk Dashboard
	2.	Sync firstname, lastname, and profileImageUrl into backend profile

⸻

Add Payment Support

To implement payments:
	1.	Create a payment gateway interface
	2.	Integrate Stripe or Razorpay provider
	3.	Store transaction records in MongoDB
	4.	Add frontend checkout UI

⸻

🛡️ Security

• JWT authentication via Clerk tokens
• Spring Security filter for protected endpoints
• CORS enabled for frontend domains
• Authorization required for secure APIs



Method
Endpoint
Description
GET
/files/my
Get current user files
POST
/files/upload
Upload files
GET
/files/public/{id}
Get public file info
GET
/files/download/{id}
Download file
GET
/users/credits
Get remaining credits
POST
/register
Register user profile

All protected endpoints require Authorization: Bearer <JWT>


Technologies

• Java
• Spring Boot
• MongoDB
• React
• Clerk (Authentication)
• Axios