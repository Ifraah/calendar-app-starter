// https://github.com/boo1ean/casual#embedded-generators

const casual = require("casual")
const MockList = require("graphql-tools").MockList

const page = (minSize, maxSize) => () => new MockList([minSize, maxSize])

const entityWithName = () => ({
  id: casual.integer(1, 1000000),
  name: casual.title,
})
