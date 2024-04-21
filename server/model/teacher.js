const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');


const nameValidator = [
  {
    validator: (value) => /^[a-zA-Z\s]*$/.test(value),
    message: 'Ism faqat harflardan iborat bo\'lishi kerak',
  },
  {
    validator: (value) => value.length >= 3,
    message: 'Ism kamida 3 belgidan iborat bo\'lishi kerak',
  },
];


const TeacherSchema = new Schema({
  name: { type: String, required: true, validate: nameValidator },
  adminId: { type: Number, required: true },
  loginId: { type: Number, required: true },
  role: { type: String, default: 'user' },
  password: { type: String, required: true },
});


TeacherSchema.pre('save', async function (next) {
    try {
      if (this.isNew || this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
      }
      next();
    } catch (err) {
      next(err);
    }
  });


const Teacher = model('Teacher', TeacherSchema);

module.exports = Teacher;
