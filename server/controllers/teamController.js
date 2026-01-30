const TeamMember = require('../models/TeamMember');

// GET /api/team
exports.list = async (req, res, next) => {
  try {
    const members = await TeamMember.find().sort({ order: 1 });
    res.json(members);
  } catch (err) {
    next(err);
  }
};

// POST /api/team
exports.create = async (req, res, next) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
};

// PUT /api/team/:id
exports.update = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      return res.status(404).json({
        error: { message: 'Team member not found', code: 'NOT_FOUND' },
      });
    }
    res.json(member);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/team/:id
exports.remove = async (req, res, next) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({
        error: { message: 'Team member not found', code: 'NOT_FOUND' },
      });
    }
    res.json({ message: 'Team member deleted' });
  } catch (err) {
    next(err);
  }
};
