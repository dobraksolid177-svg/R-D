let users = {};

module.exports = (req, res) => {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.status(400).send('Token atau email kosong, tolol!');
  }

  if (users[email] && users[email].token === token) {
    users[email].verified = true;
    users[email].verifiedAt = new Date().toISOString();
    
    res.send(`
      <html>
        <head>
          <style>
            body { background: #0a0a0a; color: #00ff88; font-family: Arial; text-align: center; padding: 50px; }
            h1 { color: #ff0040; text-shadow: 0 0 20px #ff0040; }
            .success { border: 2px solid #00ff88; padding: 20px; border-radius: 10px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>R♥D</h1>
            <h2>✅ AKUN PREMIUM BERHASIL DIVERIFIKASI!</h2>
            <p>Email: ${email}</p>
            <p>Status: <strong style="color:#ff0040;">PREMIUM AKTIF</strong></p>
            <p>Kembali ke <a href="/" style="color:#ff0040;">R♥D</a> untuk lanjutkan.</p>
          </div>
        </body>
      </html>
    `);
  } else {
    res.status(401).send(`
      <html>
        <head>
          <style>
            body { background: #0a0a0a; color: #ff4444; font-family: Arial; text-align: center; padding: 50px; }
            .error { border: 2px solid #ff4444; padding: 20px; border-radius: 10px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>❌ GAGAL VERIFIKASI!</h1>
            <p>Token salah atau kadaluarsa, ngntot!</p>
            <a href="/" style="color:#ff0040;">Coba lagi</a>
          </div>
        </body>
      </html>
    `);
  }
};