LearnCast

LearnCast is an innovative podcast platform where users can upload their podcasts, listen to others, and interact with creators. It combines modern technologies to enhance user engagement with additional features such as QR code generation for creator support.

Features

	•	Podcast Creation & Listening:
	•	Users can upload podcasts with ease.
	•	Listen to a diverse range of podcasts from other creators.
	•	Cloudinary Integration:
	•	Cloud-based storage for seamless podcast uploads and efficient media management.
	•	MongoDB Database:
	•	Robust and scalable database for user and podcast data.
	•	Admin Dashboard:
	•	Comprehensive dashboard for admins to manage platform content and users.
	•	Membership Option:
	•	Users can subscribe for exclusive features and perks.
	•	QR Code for UPI Support:
	•	Each podcast generates a QR code linked to the creator’s UPI ID for direct support.

Tech Stack

Frontend

	•	React + Vite
	•	TailwindCSS: Modern CSS framework for styling.
	•	PostCSS: Optimized styling pipeline.

Backend

	•	Node.js
	•	Express.js
	•	MongoDB: Database for persistent storage.
	•	Cloudinary API: Media management and storage.

Deployment

	•	Fully optimized for modern cloud-based environments.

Installation

	1.	Clone the repository:

git clone https://github.com/Anantdevs/Minor-Project

	2.	Install dependencies:

# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install


	3.	Set up environment variables:
	•	Create a .env file in both the backend and frontend directories.
	•	Backend .env example:

PORT=5000
MONGO_URI=your_mongodb_uri
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret


	•	Frontend .env example:

VITE_BACKEND_URL=http://localhost:5000


	4.	Start the project:

# Start the backend
npm run build
npm run dev



License

This project is licensed under the MIT License.
