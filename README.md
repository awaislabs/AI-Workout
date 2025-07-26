💪 AI Workout Plan Builder
A full-stack AI-powered workout planner that generates customized multi-week workout plans based on user inputs. Built using Next.js, TypeScript, Tailwind CSS, PostgreSQL (Neon), and OpenAI API (securely integrated through backend only).

🚀 Features
✨ Modern UI based on Figma mockups

📋 Form to collect fitness goals, duration, and level

🧠 AI-generated weekly workout plans (OpenAI)

📦 Backend with secure API integration (no frontend token exposure)

🗃️ PostgreSQL database via Neon for storing user queries & plans

📱 Responsive design, mobile-first layout

🔄 Sample data used when OpenAI quota is exceeded

🧑‍💻 Technologies Used
Frontend: Next.js, TypeScript, Tailwind CSS

State Management: React Hooks

Backend: API Routes (Next.js), OpenAI Integration

Database: Neon PostgreSQL

Deployment Ready: Easily deploy to Vercel and Neon

⚙️ Getting Started
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/ai-workout-planner.git
cd ai-workout-planner
2. Install Dependencies
bash
Copy
Edit
npm install
# or
yarn install
3. Create .env.local
env
Copy
Edit
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_neon_postgres_connection_string
4. Set Up Database
Make sure your Neon PostgreSQL instance is active.

Run the migration (if Prisma is used):

bash
Copy
Edit
npx prisma db push
Or manually ensure the schema matches:

sql
Copy
Edit
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal TEXT,
  level TEXT,
  duration TEXT,
  result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
5. Run the Development Server
bash
Copy
Edit
npm run dev
Visit http://localhost:3000 to use the app.

🔐 Note on OpenAI API
If the quota is exceeded, the app will gracefully fall back to mock sample data so the UI and flow remain functional for review purposes.


📝 Feedback
Feel free to open an issue or suggest improvements via Pull Request.
For hiring managers, please reach out if you'd like a quick demo walkthrough.

📧 Contact
Awais Rehman
📩 devawaisrehman@gmail.com
🌐 Linkedin.com/in/awaisxtech
