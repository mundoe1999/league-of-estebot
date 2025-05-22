const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const port = 3000

app.get('/', (req, res) => {
  fs.readFile('./public/index.html', 'utf-8', (err, text) => {
    res.send(text)
  })
})

app.use('/public', express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
  console.log("Server is now live on port: "+port)
})
