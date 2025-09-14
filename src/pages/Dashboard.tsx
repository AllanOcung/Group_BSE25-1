// pages/Dashboard.tsx
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-20">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to your dashboard! You are signed in.</p>
      </main>
      <Footer />
    </div>
  );
};

// Make sure this is default export
export default Dashboard;
