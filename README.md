# ninexGo X Analytics 📊

![Work in Progress](https://img.shields.io/badge/status-work%20in%20progress-yellow)

A Next.js-powered analytics dashboard for tracking and visualizing X data. Free X analytics for non-premium users, built with Next.js 15 (App Router). Currently in development, with some features like performance charts coming soon.

## ✨ Features

- **Tweet Engagement**: Track likes, retweets, and replies for your tweets.
- **Follower Counts**: Monitor your follower growth over time.
- **Performance Charts**: Visualize your X performance with interactive charts *(In Progress)*.

## 🧭 Tech Stack

- **Next.js 15** (App Router) - React framework for server-side rendering and static sites
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Typed JavaScript

## 🚀 Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ninexGo/x-analytics.git
   cd x-analytics
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your X API keys to `.env.local`. You’ll need to sign up for the X Developer Platform to obtain API keys. Example:
   ```ini
   NEXT_PUBLIC_X_API_KEY=your-api-key
   NEXT_PUBLIC_X_API_SECRET=your-api-secret
   NEXT_PUBLIC_X_ACCESS_TOKEN=your-access-token
   NEXT_PUBLIC_X_ACCESS_TOKEN_SECRET=your-access-token-secret
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.**

## 🤝 Contributing

We welcome contributions to make **X Analytics** even better! Follow these steps:

1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit:
   ```bash
   git commit -m "Add your feature"
   ```
4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a pull request** to the `main` branch of `ninexGo/x-analytics`.

🚀 We appreciate your contributions!

