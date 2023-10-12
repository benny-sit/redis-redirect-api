import createParams from './createParams.js';
import getSetRedisKey from './getSetRedisKey.js';

export default function (name, settings) {
  return function (app, opts, done) {
    app.addHook('preHandler', async (req, res) => {
      console.log('PRE HANDLER', name);
    });

    const params = createParams(settings.params);
    const method = ['POST', 'PUT', 'GET'].includes(
      settings?.method.toUpperCase()
    )
      ? settings.method.toUpperCase()
      : 'GET';
    settings.method = method;
    const url = settings.params.map((p) => `/:${p}`).join();

    app.route({
      method,
      url,
      schema: {
        params,
      },
      handler: async (req, res) => {
        let externalApiAnswer = {};
        // try {
        // } catch (e) {
        //   return res.code(400).send({ error: e });
        // }
        externalApiAnswer = await getSetRedisKey({
          name,
          settings,
          reqParams: req.params,
        });

        return { ...externalApiAnswer };
      },
    });
    done();
  };
}
