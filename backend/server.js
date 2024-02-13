require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const jobRoutes = require('./routes/jobs')

const app = express()
app.use(helmet())
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// Routes
app.use('/api/jobs', jobRoutes)

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for requests
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB & Listening on port 4000")
    })
  })
  .catch((error) => {
    console.log(error)
})

process.env