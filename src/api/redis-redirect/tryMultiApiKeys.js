import axios from 'axios';
import { redisClient } from '../../databases/redis.js';
import { shuffleArray } from '../../helpers/arrays.js';

export default async function tryMultiApiKeys({
  reqParams = {},
  apiUrl = '',
  apiKeys = [],
  responseAllowedFields = [],
  apiKeyFieldName,
  method = 'get',
}) {
  let responseFields;
  let currentArr = [...apiKeys];
  shuffleArray(currentArr);

  for (const apiKey of currentArr) {
    if (!apiKey) continue;

    const ans = await axios({
      method,
      params: { ...reqParams, [apiKeyFieldName]: apiKey },
      url: apiUrl,
    });

    if (ans.status === 200) {
      responseFields = Object.keys(ans.data)
        .filter((key) => responseAllowedFields.includes(key))
        .reduce((obj, key) => ({ ...obj, [key]: ans.data[key] }), {});
      break;
    }
  }

  if (!responseFields)
    throw new Error(`Cannot get responseFields of ${urlTemplate}`);

  return responseFields;
}
