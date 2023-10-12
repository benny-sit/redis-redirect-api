export default function (params = []) {
  if (!(params instanceof Array) || params.length === 0) return {};

  return {
    type: 'object',
    required: params,
    properties: params
      .map((p) => ({ [p]: { type: 'string' } }))
      .reduce((acc, p) => ({ ...acc, ...p }), {}),
  };
}
