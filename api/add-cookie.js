let users = {};
let historyStore = {};

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method salah!' });
  }

  const { email, cookie } = req.body;
  if (!email || !cookie) {
    return res.status(400).json({ error: 'Email atau cookie kosong, tolol!' });
  }

  if (!users[email]) {
    return res.status(404).json({ error: 'Akun gak ditemukan, daftar dulu!' });
  }

  if (!users[email].verified) {
    return res.status(403).json({ error: 'Verifikasi dulu sebelum tambah cookie, goblok!' });
  }

  users[email].cookies.push(cookie);
  
  if (!historyStore[email]) historyStore[email] = [];
  historyStore[email].push({
    action: 'add_cookie',
    cookie: cookie,
    time: new Date().toISOString()
  });

  res.json({
    status: 'success',
    message: 'Cookie berhasil ditambahkan, anjir!',
    totalCookies: users[email].cookies.length
  });
};