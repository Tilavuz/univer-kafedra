const router = require('express').Router()
const { addTeacher, getAllTeacher, putTeacher, addFile, getAllFiles, deleteFile, getFile, getAdminData } = require('../controllers/teacher')
const { auth } = require('../middlewares/auth')
const { authTeach } = require('../middlewares/auth-teach')
const { upload } = require('../middlewares/file')

// Teacher
router.post('/teacher', auth, addTeacher)
router.get('/teachers', auth, getAllTeacher)
router.put('/teacher', auth, putTeacher)
router.get('/admin-teach', authTeach, getAdminData)

router.put('/teacher-teach', authTeach, putTeacher)


// Teacher file
router.post('/file', authTeach, upload.single('file'), addFile)
router.get('/file/:file', authTeach, getFile)
router.get('/files', authTeach, getAllFiles)
router.delete('/file/:file', authTeach, deleteFile)


module.exports = router