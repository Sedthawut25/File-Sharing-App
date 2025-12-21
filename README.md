CloudShare - File Upload & Sharing App


    🧩 Features
	•	📌 User Authentication via Clerk (email/password)
	•	📤 File Upload with credits deduction
	•	📁 List and view user’s files
	•	🌐 Public sharing links for files
	•	📥 File Download via public link
	•	📊 User Credits tracking
	•	⚙️ Backend API with Java / Spring Boot
	•	📦 MongoDB storage
	•	📍 Frontend built with React

⸻

🏁 Getting Started

⚙️ Prerequisites

Make sure you have installed:
	•	Java 21 or above
	•	MongoDB (local or cloud)
	•	Node.js
	•	Clerk account (for user authentication)






    Step 1: Clone the Repository
https://github.com/Sedthawut25/File-Sharing-App.git (frontend, backend)




Step 2: Backend Setup
1.	Create .env or application.properties with environment variables:
spring.data.mongodb.uri=mongodb://localhost:27017/cloudshare

server.servlet.context-path=/api/v1.0

clerk.issuer=https://<your-clerk-instance>.clerk.accounts.dev
clerk.jwks-url=https://<your-clerk-instance>.clerk.accounts.dev/.well-known/jwks.json
clerk.webhook.secret=<YOUR_WEBHOOK_SECRET>

razorpay.key.id=your_key_id
razorpay.key.secret=your_key_secret



2.	Enable CORS (if running frontend separately)
3.	Run Backend:

./mvnw spring-boot:run



Step 3: Frontend Setup
cd frontend
npm install
npm run dev

=------------------------------------------------------------------------------------

🧠 How it Works

User Login

Users authenticate using Clerk. After login, user can:
	•	View dashboard
	•	Upload files
	•	Manage files
	•	Get public shareable links

⸻

File Upload
	•	User uploads 1–5 files at a time
	•	Each upload deducts credits
	•	Backend saves file metadata & file on server
	•	Frontend shows updated credits

⸻

Public Sharing
	•	Files can be toggled public/private
	•	Public link can be shared with anyone
	•	Anyone with the link can view/download file without logging in

⸻

⚠️ Known Limitations / Notes

✅ Authentication (Clerk)
	•	Login is handled by Clerk.
	•	Profile data currently stores email only.
	•	First name / last name / avatar are not persisted yet.
	•	To use in production, you should sync additional profile fields from Clerk (e.g., Clerk user metadata / user profile API).

❗ Payments
	•	Real payment flow is not implemented yet.
	•	Payment module is currently a scaffold for future development.

❗ File Upload for New Accounts
	•	File upload may fail for newly registered accounts (first-time users).
	•	Current build works for existing users, but a brand-new Clerk account might not be able to upload immediately.
	•	Likely root causes:
	•	Profile/Credits initialization is not triggered for new users (missing /register sync step).
	•	API requests are rejected by backend security/CORS when token is missing/invalid or when origins are not allowed.

✅ Recommended Fix (next dev task):
	•	Auto-create user profile + initial credits on first login (server-side), or ensure frontend calls /register once after Clerk login before enabling upload.
	•	Improve backend CORS configuration for deployed domains (Vercel/Render) and ensure Authorization: Bearer <token> is always sent on protected endpoints.

⸻

🧩 How to Extend

Add Full User Profile Sync
	1.	Create JWT template in Clerk dashboard
	2.	Sync firstname, lastname, profileImageUrl into user profile in backend

⸻

Add Payment Support

Payment integration with Razorpay/Stripe can be implemented by:
	1.	Creating payment gateway interface
	2.	Integrate real provider logic
	3.	Store transaction records in MongoDB
	4.	Add UI for checkout flow

⸻

🛡️ Security
	•	JWT authentication using Clerk tokens in Spring Security filter
	•	CORS is enabled for frontend domain
	•	Auth middleware protects secure endpoints






🗂️ **API Endpoints**
Method
Endpoint
Description
GET
/files/my
Get files for current user
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
Get user remaining credits
POST
/register
Register user profile





📦 Technologies
	•	Java
	•	Spring Boot
	•	MongoDB
	•	React
	•	Clerk (Auth)
	•	Axios

⸻

🧾 License

MIT License

