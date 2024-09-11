import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import { supabase } from './supabaseClient';
import Home from "./Home";
import Navbar from "./Navbar";
import ModelPage from "./ModelPage";
import Login from "./Login";
import Signup from "./Signup";
import About from "./About";
import Contact from "./Contact";
import Team from "./Team";
import ProjectDetails from "./ProjectDetails";
import Footer from "./Footer";
import Profile from "./Profile";
import ManageURLs from "./ManageURLs";
import RestrictedPage from "./RestrictedPage";
import Chatbot from "./Chatbot";
import ChatHistory from "./ChatHistory";
import CloudStorage from "./CloudStorage";

function App() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    fetchURLs();
  }, []);

  const fetchURLs = async () => {
    try {
      const { data, error } = await supabase
        .from('model_urls')
        .select('*')
        .order('name');

      if (error) throw error;
      setUrls(data || []);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
          <Navbar urls={urls} />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/team" element={<Team />} />
              <Route path="/project-details" element={<ProjectDetails />} />
              <Route
                path="/models/:modelName"
                element={
                  <ProtectedRoute>
                    <ModelPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat-history"
                element={
                  <ProtectedRoute>
                    <ChatHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cloud-storage"
                element={
                  <ProtectedRoute>
                    <CloudStorage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-urls"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ManageURLs onUrlsUpdate={fetchURLs} />
                  </ProtectedRoute>
                }
              />
              <Route path="/restricted" element={<RestrictedPage />} />
            </Routes>
          </main>
          <Chatbot />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;