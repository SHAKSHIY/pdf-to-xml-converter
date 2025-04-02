// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
  const [file, setFile] = useState(null);
  const [xmlOutput, setXmlOutput] = useState('');
  const [history, setHistory] = useState([]);

  // Get token from localStorage
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
      setXmlOutput(res.data.xml);
      fetchHistory(); // refresh conversion history
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
      // It's optional to show an error here
    }
  };

  // Fetch conversion history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <h2>PDF-to-XML Converter Dashboard</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input type="file" onChange={handleFileChange} accept="application/pdf" />
        <button onClick={handleUpload}>Convert PDF</button>
      </div>

      {xmlOutput && (
        <div style={{ marginBottom: '1rem' }}>
          <h3>Conversion Result:</h3>
          <textarea
            rows="10"
            cols="80"
            readOnly
            value={xmlOutput}
            style={{ width: '100%' }}
          ></textarea>
          <div>
            <button onClick={() => navigator.clipboard.writeText(xmlOutput)}>
              Copy XML
            </button>
            <a
              href={`data:text/xml;charset=utf-8,${encodeURIComponent(xmlOutput)}`}
              download="converted.xml"
              style={{ marginLeft: '1rem' }}
            >
              <button>Download XML</button>
            </a>
          </div>
        </div>
      )}

      <div>
        <h3>Conversion History</h3>
        {history.length ? (
          <ul>
            {history.map((conv) => (
              <li key={conv._id}>
                {new Date(conv.createdAt).toLocaleString()} - Conversion ID: {conv._id}
              </li>
            ))}
          </ul>
        ) : (
          <p>No conversions yet.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
