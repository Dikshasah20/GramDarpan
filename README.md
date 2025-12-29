# 🌾 GramDarpan  
### *A Digital Window into Rural Employment & Development*

---

## 📖 Overview

**GramDarpan** is a web application designed to make government open data from the **Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)** accessible and understandable to every citizen.  
It allows users to view **district-wise performance**, **past trends**, and **comparative insights** in an easy, visual, and language-friendly interface.

The app is built with the goal of **bridging the data literacy gap** for rural citizens — helping them see how their district is performing in employment generation and fund utilization under the MGNREGA program.

---

## 🎯 Objectives

- Present complex government data in a **simple and visual way**.  
- Enable **district-level insight** into MGNREGA’s performance metrics.  
- Provide **multilingual** and **audio-assisted** accessibility for rural users.  
- Work **reliably even when the API is down**, through local caching and ETL.  
- Detect the user’s **district automatically** using location services.  

---

## 🧩 Key Features

- 📍 **Auto District Detection:** Automatically identifies a user’s district via geolocation or IP.  
- 📊 **Interactive Dashboard:** Displays workers employed, job cards, wages paid, and more.  
- 🕓 **Historical Data:** View trends and compare monthly performance over time.  
- 🧠 **Simple Visuals:** Icons, charts, and audio guides for low-literacy users.  
- 🗣️ **Multi-language Support:** English + Hindi (with voice support).  
- 🔒 **Offline Cache:** Shows last updated data even if the API is unavailable.  
- 🌍 **Responsive Design:** Optimized for mobile and low-bandwidth connections.  

---

## 🏗️ System Architecture

User → Frontend (React PWA) → API (Node.js + Express) → Database (PostgreSQL)
↑
ETL Worker (Fetches from data.gov.in API)
↓
Local Data Cache + Redis + Storage

sql
Copy code

### Components:
- **Frontend:** React (Vite) + Tailwind CSS + Workbox for PWA caching  
- **Backend:** Node.js + Express REST API  
- **Database:** PostgreSQL (with PostGIS for geolocation queries)  
- **Cache:** Redis (for fast district-level snapshot access)  
- **Data Ingestion:** Cron-based ETL fetching monthly MGNREGA data from [data.gov.in](https://www.data.gov.in/catalog/mahatma-gandhi-national-rural-employment-guarantee-act-mgnrega)

---

## ⚙️ Tech Stack

| Layer | Technology Used |
|-------|-----------------|
| **Frontend** | React, Tailwind CSS, Chart.js, Workbox |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL + PostGIS |
| **Caching** | Redis |
| **Deployment** | Ubuntu VPS (Nginx + PM2) |
| **APIs** | data.gov.in MGNREGA API |
| **Geo-detection** | HTML5 Geolocation + Reverse Geocoding (PostGIS / Nominatim) |

---

## 🗂️ Database Schema (Simplified)

```sql
CREATE TABLE district (
  id SERIAL PRIMARY KEY,
  state TEXT,
  district_name TEXT,
  district_code TEXT UNIQUE,
  centroid GEOMETRY(Point,4326)
);

CREATE TABLE mgnrega_monthly (
  id SERIAL PRIMARY KEY,
  district_id INT REFERENCES district(id),
  year SMALLINT,
  month SMALLINT,
  workers BIGINT,
  jobcards BIGINT,
  wages_paid BIGINT,
  avg_days_per_household NUMERIC(5,2),
  payment_delay_days NUMERIC(5,2),
  fetched_at TIMESTAMP DEFAULT now(),
  UNIQUE (district_id, year, month)
);
🚀 Installation & Setup
1. Clone the repository
bash
Copy code
git clone https://github.com/<your-username>/gramdarpan.git
cd gramdarpan
2. Setup environment
Create a .env file in the root directory:

ini
Copy code
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/gramdarpan
REDIS_URL=redis://localhost:6379
DATA_API=https://api.data.gov.in/resource/mgnrega
3. Install dependencies
bash
Copy code
npm install
4. Run the backend
bash
Copy code
npm run dev
5. Run the frontend
bash
Copy code
cd client
npm run dev
🌍 Deployment
Host on VPS (DigitalOcean / AWS / Linode)

Setup Nginx reverse proxy for backend + static files

Use PM2 for managing Node.js services

Enable HTTPS using Let’s Encrypt

Configure cron job for ETL updates (every 6 hours)

🧭 Future Enhancements
📱 Android PWA Install prompt

🔈 Audio Narration in multiple Indian languages

🧾 Printable PDF summary of district performance

📈 Panchayat-level data granularity

🧑‍🤝‍🧑 Community feedback and issue-reporting module

📸 Demo
🎥 Loom Video Walkthrough: [Add your Loom link here]
🌐 Live Hosted URL: [Add your hosted project link here]

💬 About the Project
GramDarpan is inspired by the spirit of Digital India — making open government data truly open, understandable, and useful for citizens of all literacy levels.
It aims to promote transparency, empowerment, and accountability in rural employment programs through technology and accessible design.

🧑‍💻 Author
Diksha Sah
B.Tech (Computer Science & Engineering)
[Oriental Institute of Science & Technology, Bhopal]
📧 Email: [your email]
🔗 LinkedIn: [your LinkedIn profile]

📜 License
This project is licensed under the MIT License – free to use, modify, and distribute with attribution.

⭐ If you like this project, consider giving it a star on GitHub!
yaml
Copy code

---

Would you like me to make this README **in markdown format with icons, badges, and section dividers** (ready for GitHub visual style)? I can beautify it for you next.












