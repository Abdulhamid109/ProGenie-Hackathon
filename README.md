# ProGenie

**ProGenie** is a smart job-matching platform built using **Next.js**, designed to streamline the recruitment process for both job seekers and recruiters. It features a **user panel**, an **admin dashboard**, and a recruiter system powered by **document similarity and intelligent shortlisting algorithms**.

---

## ⚙️ Features

* 🧑‍💼 **User Panel**:
  Users can create profiles, upload resumes, and apply for jobs.

* 🛠️ **Admin Panel**:
  Admins manage job postings, users, and oversee system operations.

* 🤖 **Intelligent Matching**:
  When a user applies for a job, their resume is evaluated using a **document similarity algorithm** (e.g., cosine similarity or embeddings). Candidates are ranked based on a **relevance threshold**.

* 🎯 **Candidate Shortlisting**:
  Only candidates who meet or exceed the threshold score are **shortlisted automatically**.

* 🔔 **Recruiter Notifications**:
  Recruiters receive real-time notifications of shortlisted candidates.
  They can review profiles and choose whether to send **interview/test links** to selected applicants.

---

## 🧪 Tech Stack

* **Frontend**: Next.js 14, TypeScript, TailwindCSS
* **Backend**: Node.js, Next.js API Routes
* **Database**: MongoDB or PostgreSQL
* **Authentication**: NextAuth / Firebase Auth
* **Document Similarity**: Python microservice (e.g., using SpaCy/BERT or cosine similarity)
* **Deployment**: Vercel

---

## 🛠 Getting Started Locally

First, install dependencies:

```bash
npm install
# or
yarn install
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
```

Visit `https://progenie.vercel.app` in your browser.

---

## 🧠 Document Similarity & Ranking Logic

1. When a user clicks **Apply**, their resume is matched against the job description.
2. A **similarity score** is generated using NLP-based matching.
3. If the score ≥ **defined threshold** (e.g., 80%), the candidate is **shortlisted**.
4. The shortlisted candidate's profile is sent to the **recruiter's dashboard** for further review.

---

## 🚀 Deployment

ProGenie is be deployed with [Vercel](https://vercel.com) at [ProGenie](https://progenie.vercel.com)

More deployment details: [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)

---

## 📚 Learn More

* [Next.js Documentation](https://nextjs.org/docs)
* [Next.js Learn Course](https://nextjs.org/learn)
* [Vercel](https://vercel.com)
* [Document Similarity Techniques (Medium)](https://medium.com/search?q=document%20similarity)

---

## 🤝 Contributions

Have ideas or improvements? PRs and issues are welcome!
Let’s make ProGenie the future of smart hiring.

