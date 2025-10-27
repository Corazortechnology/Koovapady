import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./Navbar";
import Footer from "./Footer";
import FamilySections from "./FamilySection";
import FeedbackForm from "./FeedbackForm";
import FunAndFast from "./FunAndFast";
import EnterHouse from "./EnterHouse";
import Goldies from "./Goldies";
import KeyDates from "./KeyDates";
import WeAndUs from "./WeAndUs";
import Memories from "./Memories";
import Happiness from "./Happiness";
import FolderPage from "./FolderPage";
import PasswordPage from "./PasswordPage";

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem("authenticated") === "true";
  });

  useEffect(() => {
    // Keep state in sync across tabs
    const onStorage = (e) => {
      if (e.key === "authenticated") {
        setAuthenticated(sessionStorage.getItem("authenticated") === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLoginSuccess = () => setAuthenticated(true);
  const handleLogout = () => {
    sessionStorage.removeItem("authenticated");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <PasswordPage onSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <Navbar onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<FamilySections />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/fun" element={<FunAndFast />} />
        <Route path="/house" element={<EnterHouse />} />
        <Route path="/grandparents" element={<Goldies />} />
        <Route path="/events" element={<KeyDates />} />
        <Route path="/cousins" element={<WeAndUs />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/happiness" element={<Happiness />} />
        <Route path="/folder/:id" element={<FolderPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}
