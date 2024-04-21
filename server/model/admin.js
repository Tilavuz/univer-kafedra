const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt')

const nameValidator = [
  {
    validator: (value) => /^[a-zA-Z\s]*$/.test(value),
    message: "Ism faqat harflardan iborat bo'lishi kerak",
  },
  {
    validator: (value) => value.length >= 3,
    message: "Ism kamida 3 belgidan iborat bo'lishi kerak",
  },
];

const departmentNameValidator = [
  {
    validator: (value) => /^[a-zA-Z\s]*$/.test(value),
    message: "Kafedra nomi faqat harflardan iborat bo'lishi kerak",
  },
  {
    validator: (value) => value.length >= 10,
    message: "Kafedra nomi kamida 10 belgidan iborat bo'lishi kerak",
  },
];


const AdminSchema = new Schema({
  name: { type: String, required: true, validate: nameValidator },
  departmentName: {
    type: String,
    required: true,
    validate: departmentNameValidator,
  },
  loginId: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

AdminSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (err) {
    next(err);
  }
});

AdminSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    if (update.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(update.password, salt);
      this.update({}, { $set: { password: hashedPassword } });
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Admin = model('Admin', AdminSchema);
module.exports = Admin;
