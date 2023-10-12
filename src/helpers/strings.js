export function stringPrototypes() {
  /**
   * const template = 'Example text: ${text}';
   * const result = template.interpolate({
   *    text: 'Foo Boo'
   * });
   * result = "Example text: Foo Boo"
   * @param {*} params
   * @returns
   */
  String.prototype.interpolate = function (params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
  };
}
