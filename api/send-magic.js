const crypto = require('crypto');

// Global state (ingat Vercel stateless, pake DB kalo mau permanen)
let users = {};

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method salah, goblok!' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email kosong, ngntot!' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  users[email] = {
    verified: false,
    token: token,
    premium: true,
    cookies: [],
    createdAt: new Date().toISOString()
  };

  const magicLink = `https://${req.headers.host}/api/verify?token=${token}&email=${encodeURIComponent(email)}`;

  res.json({
    status: 'success',
    message: 'Magic link berhasil dibuat, cek email lu!',
    magicLink: magicLink,
    email: email
  });
};