const Admin = require('../model/admin')
const jwt = require('jsonwebtoken')
const { generateRandomNumber } = require('./teacher')
const bcrypt = require('bcrypt')
const Teacher = require('../model/teacher')
const File = require('../model/file')
const path = require('path')
const fs = require('fs')
const secretKey = '72tilav51'

const generateToken = (data) => {
    const token = jwt.sign({ ...data }, secretKey, { expiresIn: '6h' })
    return token
}


const registration = async (req, res) => {
    try {
        let loginId = generateRandomNumber();
        let existingAdmin = await Admin.findOne({ loginId }).exec();

        while (existingAdmin) {
            loginId = generateRandomNumber();
            existingAdmin = await Admin.findOne({ loginId }).exec();
        }

        let existingTeacher = await Teacher.findOne({ loginId }).exec();

        while (existingTeacher) {
            loginId = generateRandomNumber();
            existingTeacher = await Teacher.findOne({ loginId }).exec();
        }

        
        const admin = new Admin({
            ...req.body,
            loginId,
        });

        const errors = admin.validateSync();

        if (errors) {
            const errorMessages = Object.values(errors.errors).map((error) => error.message);
            return res.status(422).json({ errors: errorMessages });
        }

        const token = generateToken({
            name: admin.name,
            departmentName: admin.departmentName,
            loginId: admin.loginId,
            role: admin.role
        })
        await admin.save();
        res.cookie('accessToken', token, { maxAge: 21600000, httpOnly: true });
        res.status(201).json({ message: 'Teacher qo\'shildi', token});

    }catch(err) {
        console.log(err);
    }
}


const login = async (req, res) => {
    try {
        const admin = await Admin.findOne({ loginId: req.body.loginId }).lean();
        if (!admin) {
            const teacher = await Teacher.findOne({ loginId: req.body.loginId }).lean();
            if (!teacher) {
                return res.status(404).json({ message: 'Bunday foydalanuvchi mavjud emas!' });
            }

            const result = await bcrypt.compare(req.body.password, teacher.password);
            if (result) {
                const token = generateToken({
                    name: teacher.name,
                    loginId: teacher.loginId,
                    role: teacher.role
                });
                res.cookie('accessToken', token, { maxAge: 3600000, httpOnly: true });
                return res.status(200).json({ message: 'Parol to\'g\'ri', token })
            } else {
                return res.status(401).json({ message: 'Parol noto\'g\'ri' });
            }
        } else {
            const result = await bcrypt.compare(req.body.password, admin.password);
            if (result) {
                const token = generateToken({
                    name: admin.name,
                    departmentName: admin.departmentName,
                    loginId: admin.loginId,
                    role: admin.role
                });

                res.cookie('accessToken', token, { maxAge: 3600000, httpOnly: true });
                return res.status(200).json({ message: 'Parol to\'g\'ri', token })
            } else {
                return res.status(401).json({ message: 'Parol noto\'g\'ri' });
            }
        }
    } catch (err) {
        console.error('Xatolik:', err);
        return res.status(500).send('Server xatosi');
    }
};

const getAllFiles = async (req, res) => {
    try{
        const files = await File.find({})
        const datas = files.reverse()
        res.json(datas)
    }catch(err){
        console.log(err);
    }
}

const replyFile = async (req, res) => {
    try {
        const editFile = {
            loginId: req.body.loginId,
            title: req.body.title,
            desc: req.body.desc,
            pending: req.body.pending,
            answer: req.body.answer
        }
        const file = await File.findByIdAndUpdate(req.body._id, editFile)
        return res.json({ message: 'So\'rov bajarildi', file })

    }catch(err) {
        console.log(err);
    }
}

const getChangeFile = async (req, res) => {
    try{
        const { file } = req.params
        const fileData = await File.findOne({ file })
        res.json({
            file: fileData,
        })
    }catch(err) {
        console.log(err);
    }


}

const deleteTeacher = async (req, res) => {
    try {
        const { teach } = req.params;
        const teacher = await Teacher.findOneAndDelete({ loginId: teach });
        if (!teacher) {
            return res.status(404).json({ message: 'Ustoz topilmadi' });
        }

        const files = await File.find({ loginId: teacher.loginId });
        for (const file of files) {
            const filePath = path.join('uploads', file.file);
            fs.unlink(filePath, async (err) => {
                if (err) {
                    console.error('Faylni o\'chirishdagi xato:', err);
                    return res.status(500).json({ message: 'Server xatosi' });
                }
                await File.findByIdAndDelete(file._id);
            });
        }

        return res.json({ message: 'Ustoz va ustozning barcha fayllari o\'chib ketdi' });
    } catch (err) {
        console.error('Xatolik:', err);
        return res.status(500).json({ message: 'Server xatosi' });
    }
};

const putAdmin = async (req, res) => {
    try {
        const admin = await Admin.findOne({ loginId: req.body.loginId });
        if (!admin) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }
        
        admin.name = req.body.name ? req.body.name : admin.name 
        admin.departmentName = req.body.departmentName ? req.body.departmentName : admin.name
        req.body.password && (admin.password = req.body.password)

        const token = generateToken({
            name: admin.name,
            departmentName: admin.departmentName,
            password: admin.password,
            role: admin.role,
            loginId: admin.loginId
        })

        await admin.save()

        return res.json({ message: 'Amal bajarildi', token });
    } catch (err) {
        console.error('O\'zgarishda xatolik:', err);
        return res.status(500).json({ message: 'Server xatosi' });
    }
}

module.exports = { registration, login, getAllFiles, replyFile, getChangeFile, deleteTeacher, putAdmin }