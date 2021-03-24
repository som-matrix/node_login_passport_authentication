// require('dotenv').config()
require('dotenv').config()

module.exports = {
    mongoURI: `mongodb+srv://satya:${process.env.DB_PASSWORD}@cluster1.axlso.mongodb.net/Cluster1?retryWrites=true&w=majority`
}