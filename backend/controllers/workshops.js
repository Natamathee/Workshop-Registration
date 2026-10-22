const Workshop = require("../models/Workshop");
const Registration = require("../models/Registration");

const parseWorkshopInput = ({ workshopDate, capacity }) => {
  if (typeof workshopDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(workshopDate)) {
    return { error: "A valid workshopDate in YYYY-MM-DD format is required" };
  }
  const date = new Date(`${workshopDate}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== workshopDate) {
    return { error: "Invalid workshop date" };
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (date < today) return { error: "Workshop date cannot be in the past" };
  if (!Number.isInteger(capacity) || capacity < 1) {
    return { error: "Capacity must be a positive integer" };
  }
  return { workshopDate: date, capacity };
};

const workshopFields = ({ name, description, instructor, location }) => ({ name, description, instructor, location });

exports.getWorkshops = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.search !== undefined) {
      if (typeof req.query.search !== "string") {
        return res.status(400).json({ success: false, error: "search must be a string" });
      }
      const search = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = ["name", "description", "instructor", "location"].map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    }
    const workshops = await Workshop.find(filter).sort({ workshopDate: 1, name: 1 });
    res.status(200).json({ success: true, count: workshops.length, data: workshops });
  } catch (error) {
    next(error);
  }
};

exports.getWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findOne({ _id: req.params.id, isActive: true });
    if (!workshop) return res.status(404).json({ success: false, error: "Workshop not found" });
    res.status(200).json({ success: true, data: workshop });
  } catch (error) {
    next(error);
  }
};

exports.createWorkshop = async (req, res, next) => {
  try {
    const parsed = parseWorkshopInput(req.body);
    if (parsed.error) return res.status(400).json({ success: false, error: parsed.error });
    const workshop = await Workshop.create({ ...workshopFields(req.body), ...parsed });
    res.status(201).json({ success: true, data: workshop });
  } catch (error) {
    next(error);
  }
};

exports.updateWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findOne({ _id: req.params.id, isActive: true });
    if (!workshop) return res.status(404).json({ success: false, error: "Workshop not found" });
    const parsed = parseWorkshopInput({
      workshopDate: req.body.workshopDate === undefined ? workshop.workshopDate.toISOString().slice(0, 10) : req.body.workshopDate,
      capacity: req.body.capacity === undefined ? workshop.capacity : req.body.capacity,
    });
    if (parsed.error) return res.status(400).json({ success: false, error: parsed.error });
    const count = await Registration.countDocuments({ workshop: workshop.id });
    if (parsed.capacity < count) {
      return res.status(409).json({ success: false, error: "Capacity cannot be less than existing registrations" });
    }

    // Rescheduling a past workshop can reactivate its existing registrations.
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const activeWorkshops = await Workshop.find({ isActive: true, workshopDate: { $gte: today }, _id: { $ne: workshop.id } });
    const activeIds = activeWorkshops.map((item) => item.id);
    const members = await Registration.distinct("user", { workshop: workshop.id });
    for (const user of members) {
      const activeCount = await Registration.countDocuments({ user, workshop: { $in: activeIds } });
      if (activeCount >= 3) {
        return res.status(409).json({ success: false, error: "Workshop change would exceed a member's active registration limit" });
      }
    }

    const fields = workshopFields(req.body);
    Object.keys(fields).forEach((key) => { if (fields[key] === undefined) delete fields[key]; });
    const updated = await Workshop.findOneAndUpdate(
      { _id: workshop.id, isActive: true },
      { ...fields, ...parsed },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, error: "Workshop not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteWorkshop = async (req, res, next) => {
  try {
    const workshop = await Workshop.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false },
      { new: true }
    );
    if (!workshop) return res.status(404).json({ success: false, error: "Workshop not found" });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
