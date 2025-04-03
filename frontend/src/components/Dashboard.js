// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import './Dashboard.css'; // (Optional: for custom styling)

function Dashboard() {
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('xml'); // 'xml' or 'original'
  const [result, setResult] = useState(null); // { xml, originalText, conversionId }
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a PDF file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult({ xml: res.data.xml, originalText: res.data.originalText, conversionId: res.data.conversionId });
      fetchHistory();
    } catch (error) {
      console.error(error);
      alert('Upload or conversion failed.');
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchProfile();
  }, []);

  return (
    <div className="dashboard-container" style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div className="sidebar" style={{ width: '250px', padding: '1rem', borderRight: '1px solid #ccc' }}>
        <h3>Profile</h3>
        {profile ? (
          <div>
            <p><strong>ID:</strong> {profile._id}</p>
            <p><strong>Email:</strong> {profile.email}</p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
        <hr />
        <h3>Conversion History</h3>
        {history.length ? (
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {history.map((conv) => (
              <li key={conv._id} style={{ marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => setResult({ xml: conv.xmlResult, originalText: conv.originalText, conversionId: conv._id })}>
                {new Date(conv.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No conversions yet.</p>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ flex: 1, padding: '1rem' }}>
        <h2>PDF-to-XML Converter Dashboard</h2>
        <div style={{ marginBottom: '1rem' }}>
          <input type="file" onChange={handleFileChange} accept="application/pdf" />
          <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>Convert PDF</button>
        </div>

        {result && (
          <div>
            <div className="tabs" style={{ marginBottom: '1rem' }}>
              <button onClick={() => setActiveTab('xml')} style={{ marginRight: '1rem', background: activeTab === 'xml' ? '#ddd' : '#fff' }}>XML Preview</button>
              <button onClick={() => setActiveTab('original')} style={{ background: activeTab === 'original' ? '#ddd' : '#fff' }}>Original PDF Text</button>
            </div>
            {activeTab === 'xml' ? (
              <div>
                <h3>Converted XML</h3>
                <textarea rows="10" cols="80" readOnly value={result.xml} style={{ width: '100%' }}></textarea>
                <div>
                  <button onClick={() => navigator.clipboard.writeText(result.xml)}>Copy XML</button>
                  <a href={`data:text/xml;charset=utf-8,${encodeURIComponent(result.xml)}`} download="converted.xml" style={{ marginLeft: '1rem' }}>
                    <button>Download XML</button>
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <h3>Original PDF Text</h3>
                <textarea rows="10" cols="80" readOnly value={result.originalText} style={{ width: '100%' }}></textarea>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
