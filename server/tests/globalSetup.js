const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function globalSetup() {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_TEST_URI = mongoServer.getUri();
  // Store the server instance for teardown
  globalThis.__MONGO_SERVER__ = mongoServer;
};
