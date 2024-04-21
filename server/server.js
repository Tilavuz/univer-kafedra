const express = require('express')

const app = express()

app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use('/uploads', express.static('uploads'))

require('./db/db')()


// Routes
const teacherRouter = require('./routes/teacher')
app.use('/api', teacherRouter)

const adminRouter = require('./routes/admin')
app.use('/api', adminRouter)

const port = 3000

app.listen(port, () => {
    console.log('Server ishga tushdi');
})