# TalaqqeeHub 🌙

Connecting Hearts to the Quran through Code.
A modern, interactive platform for digital Talaqqi.

**TalaqqeeHub** is a real-time Learning Management System (LMS) designed specifically to connect Quran students with certified teachers (Ustadz) globally. It digitizes the traditional Talaqqi (Quranic recitation) process by providing interactive, word-by-word evaluation tools.

## Demo

Live Demo: [Insert Live Website URL Here]

Overview Video: [Insert YouTube/Loom Link Here]

## The Problem It Solves

Messy Manual Notes: Traditional recitation notes are often written on paper, get lost, and are hard to track over time.

Geographical Barriers: Students struggle to find the right Ustadz if they are restricted by their physical location.

Lack of Progress Tracking: Without a digital history, students forget their past mistakes and struggle to evaluate their learning curve.

## Key Features (The Solution)

**Strict Role-Based Access (RLS):** Securely separated experiences for Students and Teachers (Ustadz).

**Real-time Booking System:** Students can browse teachers, pick schedules, and define specific Surah/Ayah ranges for their recitation session.

**Interactive Evaluation Board (Killer Feature):** The app dynamically fetches the exact Arabic verses from a public API based on the student's booking. Teachers can click individual Arabic words to highlight mistakes instantly and save the exact coordinates.

**Real-time Notifications:** Powered by Supabase Channels, users get instantly notified of booking requests, approvals, and completed evaluations without refreshing the page.

## Tech Stack & Architecture

### Frontend
- React.js (Vite)
- Tailwind CSS (Styling & Responsive Design)
- Lucide React (Icons)

### Backend & Database (Supabase)
- PostgreSQL with Row Level Security (RLS)
- Supabase Auth
- Supabase Realtime (WebSockets)

### Third-Party Integration:
[Al Quran Cloud API](https://api.quran.cloud): Fetches Uthmani Arabic text dynamically based on Surah and Ayah parameters.

## Database Schema

The core relational flow in PostgreSQL:

`users`: Stores profile data and roles (student or teacher).

`bookings`: Handles the session state (pending, confirmed, cancelled, completed) and schedule metadata (Surah number, start/end ayah).

`session_notes`: Stores the Ustadz's feedback and the array of mistake coordinates (mistake_words).

`notifications`: Tracks real-time alerts.


## Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Node.js (v16 or higher)
- A Supabase account and project.

### Installation

- Clone the repository:
    ```
    git clone [https://github.com/yourusername/talaqqeehub.git](https://github.com/yourusername/talaqqeehub.git)
    cd talaqqeehub
    ```
- Install dependencies:
    ```
    npm install
    ```
- Set up Environment Variables. Create a .env file in the root directory and add your Supabase keys:
    ```
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
- Run the Database Migrations. Ensure you have created the users, bookings, session_notes, and notifications tables in your Supabase SQL editor with the appropriate RLS policies.
- Start the Development Server:
    ```
    npm run dev
    ```

🤝 Acknowledgments

Built with ❤️ to empower Quranic learning globally.
A big thanks to the open-source community and the Al Quran Cloud API for making this possible.