import { redisClient } from '../../databases/redis.js';
import tryMultiApiKeys from './tryMultiApiKeys.js';

export default async function ({ name, settings, reqParams }) {
  const redisKey = `${name.toLowerCase()}${Object.values(reqParams)
    .map((p) => p.toUpperCase())
    .join('-')}`;

  const existingData = await redisClient.json.GET(redisKey, '$');

  if (existingData && Object.keys(existingData).length !== 0) {
    console.log('---- CACHE HIT ----');
    return existingData;
  }

  const responseFields = await tryMultiApiKeys({
    reqParams,
    apiUrl: settings.api_url,
    apiKeys: settings.api_keys,
    responseAllowedFields: settings.response_allowed_fields,
    apiKeyFieldName: settings.api_key_field_name,
  });

  const requestsToRedis = [redisClient.json.SET(redisKey, '$', responseFields)];

  if (settings.ttl_seconds > 0) {
    requestsToRedis.push(
      redisClient.expireAt(
        redisKey,
        parseInt(+new Date() / 1000) + settings.ttl_seconds
      )
    );
  }

  await Promise.all(requestsToRedis);

  return responseFields;
}
