let users = {};

module.exports = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email kosong!' });
  }

  if (!users[email]) {
    return res.status(404).json({ error: 'Akun gak ada!' });
  }

  const exportData = {
    ...users[email],
    exportTime: new Date().toISOString(),
    exportedBy: 'R♥D Premium Generator'
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${email}-premium-data.json"`);
  res.json(exportData);
};