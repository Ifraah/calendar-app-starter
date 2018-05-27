// Ideas borrowed from:
// http://graphql.org/blog/mocking-with-graphql/

const express = require("express")
const bodyParser = require("body-parser")
const mockServer = require("graphql-tools").mockServer
const cors = require("cors")
const mocks = require("./mocks")
const schema = require("../graphqlSchema")

const myMockServer = mockServer(schema, mocks)
const app = express()
app.use(bodyParser.json())
app.use(cors({ origin: true, credentials: true }))

app.post("/graphql", function(req, res, next) {
  myMockServer
    .query(req.body.query, req.body.variables)
    .then(function(response) {
      res.send(response)
    })
})

module.exports = app
