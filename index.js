const express = require('express')
const app = express()
const port = 3500

app.get('/', (req, res) => {
    res.send('server is running fine ss')
})

app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})
