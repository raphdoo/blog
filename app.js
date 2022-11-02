const app = require('./index')
const Database = require("./database")
const config = require('./config')

const PORT = config.port

Database.connect();

app.listen(PORT, () => {
  console.log('Listening on port, ', PORT)
})
