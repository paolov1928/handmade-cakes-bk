require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const cors = require("cors")

const app = express()

const port = process.env.PORT || 1337

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

app.listen(port, () => {
  console.log("We are live on port 1337")
})

app.get("/", (req, res) => {
  res.send("Welcome to my api")
})

app.post("/cakes", (req, res) => {
  var data = req.body

  var smtpTransport = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  var mailOptions = {
    from: data.email,
    to: process.env.EMAIL_USER + "@gmail.com",
    subject: "New cake alert",
    html: `<p>name: ${data.name}</p>
          <p>email: ${data.email}</p>
          <p>pass: ${data.message}</p>`
  }

  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.send(error)
    } else {
      res.send("Success")
    }
    smtpTransport.close()
  })
})
