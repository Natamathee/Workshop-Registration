const Registration = require("../models/Registration");
const Workshop = require("../models/Workshop");

const populateRegistration = (query) => query
  .populate("workshop", "name description instructor workshopDate location capacity isActive")
  .populate("user", "name email tel role");

const validateRegistration = async ({ workshopId, user, excludeId }) => {
  if (typeof workshopId !== "string" || !/^[a-fA-F0-9]{24}$/.test(workshopId)) {
    return { status: 400, error: "A valid workshop ID is required" };
  }
  const workshop = await Workshop.findOne({ _id: workshopId, isActive: true });
  if (!workshop) return { status: 404, error: "Workshop not found or inactive" };
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (workshop.workshopDate < today) {
    return { status: 400, error: "Cannot register after the workshop date" };
  }

  const exclude = excludeId ? { _id: { $ne: excludeId } } : {};
  const duplicate = await Registration.findOne({ user, workshop: workshop.id, ...exclude });
  if (duplicate) return { status: 409, error: "Member is already registered for this workshop" };
  const count = await Registration.countDocuments({ workshop: workshop.id, ...exclude });
  if (count >= workshop.capacity) return { status: 409, error: "Workshop capacity has been reached" };

  const activeWorkshops = await Workshop.find({ isActive: true, workshopDate: { $gte: today } });
  const activeIds = activeWorkshops.map((item) => item.id);
  const activeCount = await Registration.countDocuments({ user, workshop: { $in: activeIds }, ...exclude });
  if (activeCount >= 3) return { status: 409, error: "Member can have at most 3 active workshop registrations" };
  return { workshop };
};

const registrationError = (error, res, next) => {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, error: "Member is already registered for this workshop" });
  }
  next(error);
};

exports.getRegistrations = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };
    const registrations = await populateRegistration(Registration.find(filter).sort({ createdAt: 1 }));
    res.status(200).json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    next(error);
  }
};

exports.getRegistration = async (req, res, next) => {
  try {
    const registration = await populateRegistration(Registration.findById(req.params.id));
    if (!registration) return res.status(404).json({ success: false, error: "Registration not found" });
    if (req.user.role !== "admin" && registration.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized to view this registration" });
    }
    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    next(error);
  }
};

exports.createRegistration = async (req, res, next) => {
  try {
    const validated = await validateRegistration({ workshopId: req.body.workshop, user: req.user.id });
    if (validated.error) return res.status(validated.status).json({ success: false, error: validated.error });
    const registration = await Registration.create({ workshop: validated.workshop.id, user: req.user.id });
    res.status(201).json({ success: true, data: await populateRegistration(Registration.findById(registration.id)) });
  } catch (error) {
    registrationError(error, res, next);
  }
};

exports.updateRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, error: "Registration not found" });
    if (req.user.role !== "admin" && registration.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized to edit this registration" });
    }
    const workshopId = req.body.workshop === undefined ? registration.workshop.toString() : req.body.workshop;
    const validated = await validateRegistration({ workshopId, user: registration.user, excludeId: registration.id });
    if (validated.error) return res.status(validated.status).json({ success: false, error: validated.error });
    const updated = await Registration.findByIdAndUpdate(
      req.params.id,
      { workshop: validated.workshop.id },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, error: "Registration not found" });
    res.status(200).json({ success: true, data: await populateRegistration(Registration.findById(updated.id)) });
  } catch (error) {
    registrationError(error, res, next);
  }
};

exports.deleteRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, error: "Registration not found" });
    if (req.user.role !== "admin" && registration.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized to delete this registration" });
    }
    await registration.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
