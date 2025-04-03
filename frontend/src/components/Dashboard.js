import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [xml, setXml] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [activeView, setActiveView] = useState("xml");
  const [conversionHistory, setConversionHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState(0);
  const ws = useRef(null);
  const token = localStorage.getItem("token");

  // Wrap fetchProfile in useCallback so it remains stable
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (error) {
      console.error("Profile error:", error);
    }
  }, [token]);

  // Wrap fetchHistory in useCallback so it remains stable
  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/history", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm, sort: "desc" },
      });
      setConversionHistory(res.data);
    } catch (error) {
      console.error("History error:", error);
    }
  }, [token, searchTerm]);

  // useEffect now includes fetchProfile and fetchHistory in its dependency array
  useEffect(() => {
    fetchProfile();
    fetchHistory();
    // Set up WebSocket connection for real-time status updates
    ws.current = new WebSocket("ws://localhost:5000");
    ws.current.onmessage = (event) => {
      const status = JSON.parse(event.data);
      setProgress(status.progress);
    };
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [fetchProfile, fetchHistory]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }
    const formData = new FormData();
    formData.append("pdf", file);
    try {
      const res = await axios.post("http://localhost:5000/api/convert", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setXml(res.data.xml);
      setOriginalText(res.data.originalText);
      fetchHistory();
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Conversion failed");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="profile">
          <h3>Profile</h3>
          {profile ? (
            <div>
              <p>ID: {profile._id}</p>
              <p>Email: {profile.email}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="history">
          <h3>Conversion History</h3>
          <form onSubmit={handleSearchSubmit}>
            <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
            <button type="submit">Search</button>
          </form>
          <ul>
            {conversionHistory.map((conv) => (
              <li
                key={conv._id}
                onClick={() => {
                  setXml(conv.xmlResult);
                  setOriginalText(conv.originalText);
                }}
              >
                <strong>{conv.pdfName || "Unnamed PDF"}</strong>
                <br />
                {new Date(conv.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="main-content">
        <h1>PDF-to-XML Converter</h1>
        <div className="upload-section">
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button onClick={handleConvert}>Convert PDF</button>
          <p>Conversion Progress: {progress}%</p>
        </div>
        <div className="viewer">
          <div className="tabs">
            <button onClick={() => setActiveView("xml")} className={activeView === "xml" ? "active" : ""}>
              XML Preview
            </button>
            <button onClick={() => setActiveView("original")} className={activeView === "original" ? "active" : ""}>
              Original PDF Text
            </button>
          </div>
          <div className="content">
            {activeView === "xml" ? (
              <pre>{xml}</pre>
            ) : (
              <pre>{originalText}</pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;