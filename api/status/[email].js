let users = {};

module.exports = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email kosong, bgst!' });
  }

  if (!users[email]) {
    return res.status(404).json({ error: 'Akun gak ada, daftar dulu!' });
  }

  res.json({
    email: email,
    verified: users[email].verified,
    premium: users[email].premium,
    cookies: users[email].cookies,
    totalCookies: users[email].cookies.length,
    createdAt: users[email].createdAt,
    verifiedAt: users[email].verifiedAt || null,
    status: users[email].verified ? 'PREMIUM ACTIVE' : 'PENDING VERIFICATION'
  });
};