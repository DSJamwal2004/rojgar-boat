🚤 ROJGAR-Boat

ROJGAR-Boat is a full-stack community service platform designed to connect local workers (sweepers, helpers, electricians, shop assistants, etc.) with nearby employers using GPS-based matching and AI-driven job recommendations.

The platform focuses on employment accessibility, local hiring, and smart job discovery for semi-skilled and unskilled workers.

🌐 Live Demo

Frontend (Vercel):
👉 https://rojgar-boat.vercel.app

    ⚠️ Note: The backend is hosted on Render (free tier).
    If the app hasn’t been used for some time, the first request may take 10–30 seconds while the backend wakes up.
    This is normal behavior for free hosting.

✨ Core Features

👷 Worker Features

   Secure worker registration & login (JWT)

   Create and update worker profile

   Upload profile photo

   Apply for jobs

   Track applications (Pending / Accepted / Rejected)

   AI-recommended jobs based on skills & experience

   GPS-based nearby jobs

   Sort jobs by:

      - Newest

      - Salary

      - AI match score

View when a job was posted (Just now / hours ago / days ago)

🏢 Employer Features

   Secure employer registration & login

   Create and update employer profile

   Post jobs with live GPS location

   View all posted jobs

   View applications per job

   Accept / reject worker applications

   Delete completed or unwanted jobs

   Rate workers after job completion

   Employer dashboard with live statistics

🤖 Smart Matching System
🔹 AI Job Recommendations

   Matches jobs using:

   - Worker skills

   - Experience

   - Job requirements

   Each AI-recommended job shows:

   - AI match percentage

   - Explanation of why it was recommended

Default sorting: Best AI match

🔹 GPS-Based Job Matching

   Uses worker’s live location

   Finds nearby jobs using GeoJSON

   Distance filters:

    - 2 km

    - 5 km

    - 10 km

Sort options:

   - Distance

   - Salary

   - Newest jobs

🛠 Tech Stack

Frontend

 - React.js

 - Tailwind CSS

 - React Router

 - Hosted on Vercel

Backend

 - Node.js

 - Express.js

 - MongoDB (Mongoose)

 - JWT Authentication

 - Hosted on Render

Other Technologies

 - Cloudinary – image uploads

 - GeoJSON – location-based queries

 - AI / NLP logic – skill-based job matching

 - RESTful APIs

📁 Project Structure (Simplified)

ROJGAR-Boat/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md

🚀 Deployment Architecture

User Browser
     ↓
Vercel (React Frontend)
     ↓
Render (Node + Express API)
     ↓
MongoDB Database

- Frontend and backend are decoupled

- Frontend communicates with backend via absolute API URLs

- Fully production-ready deployment model

🔐 Authentication & Security

 - JWT-based authentication

 - Role-based access (Worker / Employer)

 - Protected backend routes

 - Secure API communication

 - Environment variables for secrets

🧪 How to Use

 - Open the live site

 - Register as Worker or Employer

 - Complete your profile

 - Employer:

    - Post jobs

    - Manage applications

 - Worker:

    - View jobs

    - Apply

    - Explore AI & GPS recommendations

📌 Future Enhancements

 - In-app chat between worker and employer

 - Push notifications

 - Admin dashboard

 - Multi-language support

 - Advanced AI scoring

 - Paid backend hosting (no sleep delay)

🤝 Community Impact

ROJGAR-Boat aims to:

 - Improve local employment accessibility

 - Reduce dependency on middlemen

 - Enable fast hiring for small businesses

 - Empower workers using technology

📄 License

This project is built for educational and community service purposes.

🙌 Final Note

This project demonstrates:

   - Full-stack development

   - Real-world deployment (Vercel + Render)

   - Secure authentication

   - AI & GPS-based features

   - Production-ready architecture

## LICENSE 
This project is licensed under the MIT License.
