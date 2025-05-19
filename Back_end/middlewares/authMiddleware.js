function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    res.status(401).json({ message: 'Pas authentifier' });
  }
  
  module.exports = { isAuthenticated };

