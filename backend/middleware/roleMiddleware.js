// Backend authorization is mandatory — the frontend hiding a button is not
// sufficient security. This middleware is the real enforcement point.
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: you do not have permission to do this.' });
  }
  next();
};
