const CompanyInfo = require('../models/CompanyInfo');

// GET /api/company
exports.get = async (req, res, next) => {
  try {
    let info = await CompanyInfo.findOne();
    if (!info) {
      info = await CompanyInfo.create({});
    }
    res.json(info);
  } catch (err) {
    next(err);
  }
};

// PUT /api/company
exports.update = async (req, res, next) => {
  try {
    let info = await CompanyInfo.findOne();
    if (!info) {
      info = await CompanyInfo.create(req.body);
    } else {
      Object.assign(info, req.body);
      await info.save();
    }
    res.json(info);
  } catch (err) {
    next(err);
  }
};
