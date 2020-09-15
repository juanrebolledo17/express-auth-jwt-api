const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const dotenv = require("dotenv")

dotenv.config()

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(error => console.log(error))

const authRoutes = require('./routes/auth')
const dashboardRoutes = require("./routes/dashboard")
const verifyToken = require("./routes/validate-token")

app.use(cors())
app.use(express.json())
app.use('/api/user/', authRoutes)
app.use("/api/dashboard", verifyToken, dashboardRoutes)

app.listen(3000, () => console.log('server running on port 3000'))
