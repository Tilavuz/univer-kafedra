const router = require('express').Router()
const { registration, login, getAllFiles, replyFile, getChangeFile, deleteTeacher, putAdmin } = require('../controllers/admin')
const { auth } = require('../middlewares/auth')


router.post('/registration', registration)
router.post('/login', login)

router.get('/all-files', auth, getAllFiles)
router.get('/admin-file/:file', auth, getChangeFile)
router.put('/file', auth, replyFile)
router.delete('/teach/:teach', auth, deleteTeacher)
router.put('/admin', putAdmin)

module.exports = router