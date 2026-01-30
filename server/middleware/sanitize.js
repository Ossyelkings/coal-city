function stripDollarKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(stripDollarKeys);
  }

  const clean = {};
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$')) continue;
    clean[key] = stripDollarKeys(obj[key]);
  }
  return clean;
}

const sanitize = (req, res, next) => {
  if (req.body) req.body = stripDollarKeys(req.body);
  if (req.params) req.params = stripDollarKeys(req.params);
  next();
};

module.exports = sanitize;
