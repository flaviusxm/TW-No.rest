const require_auth = (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ error: 'Nu este autentificat !' });
    }
    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ error: 'Eroare autentificare' });
  }
};

module.exports = { require_auth };