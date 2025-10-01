
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
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

function App() {
  return (
    <Router>
      <Navbar />
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
      </Routes>
      <Footer />
    </Router>
  )
}

export default App;
