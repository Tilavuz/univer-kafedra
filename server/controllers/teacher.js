const Teacher = require('../model/teacher');
const Admin = require('../model/admin');
const bcrypt = require('bcrypt')
const File = require('../model/file')
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const secretKey = '72tilav51'


// Random raqam generatsiyasi
function generateRandomNumber() {
  let randomNumber = '';
  for (let i = 0; i < 16; i++) {
    const digit = i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10);
    randomNumber += digit.toString();
  }
  return randomNumber;
}

const generateToken = (data) => {
  const token = jwt.sign({ ...data }, secretKey, { expiresIn: '6h' })
  return token
}

const addTeacher = async (req, res) => {
  try {

    let loginId = generateRandomNumber();
    let existingTeacher = await Teacher.findOne({ loginId }).exec();

    while (existingTeacher) {
      loginId = generateRandomNumber();
      existingTeacher = await Teacher.findOne({ loginId }).exec();
    }

    const teacher = new Teacher({
      ...req.body,
      loginId,
    });

    const errors = teacher.validateSync();
    if (errors) {
      const errorMessages = Object.values(errors.errors).map((error) => error.message);
      return res.status(422).json({ errors: errorMessages });
    }

    await teacher.save();

    res.status(201).json({ message: 'Ustoz qo\'shildi', teacher });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server xatosi');
  }
};

const getAllTeacher = async (req, res) => {
  try {
    const techers = await Teacher.find({ adminId: req.user.loginId })
    res.json(techers);
  }catch(err) {
    console.log(err);
  }

}

const putTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ loginId: req.body.loginId });
    if (!teacher) {
        return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }
    
    teacher.name = req.body.name ? req.body.name : teacher.name 
    teacher.departmentName = req.body.departmentName ? req.body.departmentName : teacher.name
    req.body.password && (teacher.password = req.body.password)

    const token = generateToken({
        name: teacher.name,
        role: teacher.role,
        loginId: teacher.loginId
    })

    await teacher.save()

    return res.json({ message: 'Amal bajarildi', token });
} catch (err) {
    console.error('O\'zgarishda xatolik:', err);
    return res.status(500).json({ message: 'Server xatosi' });
}
}

const addFile = async (req, res) => {
  try {

    const loginId = req.user.loginId
    const author = req.user.name

    const fileData = {
      ...req.body,
      file: req.file.filename,
      loginId,
      author
    }

    if(fileData.file && fileData.desc && fileData.loginId) {
      const file = new File(fileData)
      file.save()
      return res.json({ message: 'Fayl yuborildi' })
    }
    
    return res.json({ message: 'Yuborayotgan malumotlaringiz to\'liq emas' })
  
  }catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Malumot yuborilmadi', details: err });
  }
}

const getAllFiles = async (req, res) => {
  try {
    const files = await File.find({ loginId: req.user.loginId })
    const datas = files.reverse()
    res.json(datas)
  }catch(err) {
    console.log(err);
  }
}

const deleteFile = async (req, res) => {
  try {
    const { file } = req.params
    const deleteData = await File.findOne({ file })
    const filePath = path.join('uploads', file);

    if (!deleteData) {
      return res.status(404).json({ message: 'Fayl topilmadi' })
    }

    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Faylni o\'chirishdagi xato:', err);
        return res.status(500).json({ message: 'Server xatosi' });
      }
      await File.findByIdAndDelete(deleteData._id);
      res.json({ message: 'Fayl o\'chirib yuborildi' });
    });

  } catch (err) {
    console.error('Faylni o\'chirishdagi xato:', err);
    return res.status(500).json({ message: 'Server xatosi' });
  }
}

const getFile = async (req, res) => {
  try {
    const { file } = req.params
    const fileData = await File.findOne({ file })

    return res.json(fileData)
  }catch(err) {
    console.log(err);
  }

}

const getAdminData = async (req, res) => {
  try {
    const admin = await Admin.findOne({ adminId: req.user.adminId })
    res.json({ departmentName: admin.departmentName })
  }catch(err) {
    console.log(err);
  }
}


module.exports = { addTeacher, generateRandomNumber, getAllTeacher, putTeacher, addFile, getAllFiles, deleteFile, getFile, getAdminData };
