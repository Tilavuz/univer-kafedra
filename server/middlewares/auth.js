const jwt = require('jsonwebtoken')
const jwtDecoded = '72tilav51'

const auth = async (req, res, next) => {
    const token = req.header('x-auth-token')

    if(!token) 
        return res.status(401).json({message: 'Syatdan to\'liq foydalanish uchun ro\'yhatdan o\'ting'})
    try {
        const decoded = jwt.verify(token, jwtDecoded)
        if(decoded.role === 'admin') {
            req.user = decoded
            return next()
        }
        return res.status(400).json({message: 'Yaroqsiz foydalanuvchi'})
    }catch (err) {
        return res.status(400).json({message: 'Yaroqsiz foydalanuvchi', error: err})
    }
}


module.exports = { auth }