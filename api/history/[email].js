let historyStore = {};

module.exports = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email kosong!' });
  }

  if (!historyStore[email]) {
    return res.json([]);
  }

  res.json(historyStore[email]);
};