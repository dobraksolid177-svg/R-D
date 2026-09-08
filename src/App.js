import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [cookie, setCookie] = useState('');
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = '/api';

  const sendMagic = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/send-magic`, { email });
      alert(`✅ Magic Link berhasil!\n\nLink: ${res.data.magicLink}\n\nCek email lu (simulasi), ngntot!`);
    } catch (err) {
      alert('❌ Gagal, coba lagi!');
    }
    setLoading(false);
  };

  const addCookie = async () => {
    if (!cookie) return alert('Isi cookie dulu, tolol!');
    setLoading(true);
    try {
      await axios.post(`${API}/add-cookie`, { email, cookie });
      alert('✅ Cookie berhasil ditambahkan, anjir!');
      setCookie('');
    } catch (err) {
      alert('❌ Gagal tambah cookie!');
    }
    setLoading(false);
  };

  const getStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/status/${email}`);
      setData(res.data);
    } catch (err) {
      alert('❌ Akun gak ditemukan!');
      setData(null);
    }
    setLoading(false);
  };

  const getHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/history/${email}`);
      setHistory(res.data);
    } catch (err) {
      alert('❌ Gagal ambil riwayat!');
    }
    setLoading(false);
  };

  const exportJSON = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/export/${email}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${email}-premium.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('❌ Gagal export!');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>R♥D</h1>
        <p style={styles.subtitle}>Buat Akun AM Premium Gratis, Anjir!</p>
        
        <div style={styles.inputGroup}>
          <input
            placeholder='Email lu, ngntot!'
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
          <button onClick={sendMagic} style={styles.button} disabled={loading}>
            {loading ? 'Loading...' : 'Kirim Magic Link'}
          </button>
        </div>

        <div style={styles.inputGroup}>
          <input
            placeholder='Cookie manual (opsional)'
            value={cookie}
            onChange={e => setCookie(e.target.value)}
            style={styles.input}
            disabled={loading}
          />
          <button onClick={addCookie} style={styles.button} disabled={loading}>
            {loading ? 'Loading...' : 'Tambah Cookie'}
          </button>
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={getStatus} style={styles.buttonSmall} disabled={loading}>
            Cek Status
          </button>
          <button onClick={getHistory} style={styles.buttonSmall} disabled={loading}>
            Riwayat
          </button>
          <button onClick={exportJSON} style={styles.buttonSmall} disabled={loading}>
            Export JSON
          </button>
        </div>

        {data && (
          <div style={styles.dataBox}>
            <h3 style={{ color: '#ff0040' }}>📊 Status Akun:</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}

        {history.length > 0 && (
          <div style={styles.dataBox}>
            <h3 style={{ color: '#ff0040' }}>📜 Riwayat Goblok:</h3>
            {history.map((h, i) => (
              <p key={i} style={styles.historyItem}>
                • {h.action} - {h.time}
                {h.cookie && ` (Cookie: ${h.cookie.substring(0, 20)}...)`}
              </p>
            ))}
          </div>
        )}

        <p style={styles.footer}>Dibuat buat Kori, biar para Dongo seneng. | v1.0</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    background: 'rgba(20, 0, 0, 0.92)',
    padding: '35px',
    borderRadius: '25px',
    boxShadow: '0 0 50px rgba(255, 0, 64, 0.3), inset 0 0 50px rgba(255, 0, 64, 0.05)',
    border: '2px solid #ff0040',
    maxWidth: '650px',
    width: '100%',
    transition: 'all 0.3s'
  },
  title: {
    fontSize: '4.5rem',
    color: '#ff0040',
    textShadow: '0 0 30px #ff0040, 0 0 60px #ff004088',
    margin: '0',
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: '5px'
  },
  subtitle: {
    color: '#ff6666',
    textAlign: 'center',
    fontSize: '1.1rem',
    marginBottom: '30px',
    fontStyle: 'italic',
    borderBottom: '1px solid #ff004033',
    paddingBottom: '15px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '15px'
  },
  input: {
    padding: '14px',
    borderRadius: '12px',
    border: '2px solid #ff0040',
    background: '#1a1a1a',
    color: '#ffcccc',
    fontSize: '1rem',
    outline: 'none',
    transition: '0.3s'
  },
  button: {
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #ff0040, #cc0033)',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  buttonSmall: {
    padding: '12px 20px',
    borderRadius: '10px',
    border: '2px solid #ff0040',
    background: 'transparent',
    color: '#ff0040',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s',
    fontSize: '0.9rem',
    flex: '1',
    minWidth: '100px'
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '15px',
    justifyContent: 'center'
  },
  dataBox: {
    background: '#0d0d0d',
    padding: '15px',
    borderRadius: '12px',
    color: '#00ff88',
    fontSize: '0.8rem',
    overflowX: 'auto',
    marginTop: '20px',
    border: '1px solid #00ff8833'
  },
  historyItem: {
    margin: '5px 0',
    padding: '5px',
    background: '#1a1a1a',
    borderRadius: '5px',
    fontSize: '0.75rem'
  },
  footer: {
    color: '#666',
    textAlign: 'center',
    marginTop: '25px',
    fontSize: '0.75rem',
    borderTop: '1px solid #ff004033',
    paddingTop: '15px'
  }
};

export default App;