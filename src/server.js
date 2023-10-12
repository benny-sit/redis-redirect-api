import fastify from 'fastify';
import 'dotenv/config';
import cors from '@fastify/cors';
import { redisConnect } from './databases/redis.js';
import { configCollection, mongoClient } from './databases/mongodb.js';
import { ObjectId } from 'mongodb';
import autodeploy from './api/autodeploy.js';

import { stringPrototypes } from './helpers/strings.js';

const initPrototypes = function () {
  stringPrototypes();
};

initPrototypes();

const app = fastify({ logger: true });

// app.addHook('onClose', function () {
//   console.log('Successfully closed');
// });

app.register(cors, { origin: '*' });

app.get('/', function (req, res) {
  return { hello: 'world' };
});

const getConfigAndDeploy = async () => {
  if (!process.env.CONFIG_ID)
    throw new Error('(Mongodb in config collection) CONFIG_ID is required');

  const deployConfig = await configCollection.findOne({
    _id: new ObjectId(process.env.CONFIG_ID),
  });

  if (!deployConfig?.apis || Object.keys(deployConfig.apis).length === 0)
    throw new Error('Please provide apis object inside config object');

  app.register(autodeploy(deployConfig.apis), {
    prefix: deployConfig.prefix || '/api',
  });
};

const start = async () => {
  const port = process.env.PORT || 3000;
  console.log('NODE_ENV = ' + process.env.NODE_ENV);

  try {
    // Connect to DBs
    await mongoClient.connect();
    await redisConnect();

    // Deploy from config
    await getConfigAndDeploy();

    // Start App
    await app.listen({ port, host: '0.0.0.0' });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  } finally {
    await mongoClient.close();
  }
};

start();
