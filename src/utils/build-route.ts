export type RouteParams = Record<string, string | number>;

export function buildRoute(route: string, params: RouteParams): string {
  let result = route;
  Object.keys(params).forEach((param) => {
    const search = new RegExp(':' + param, 'g');
    const value = params[param].toString();
    result = result.replace(search, value);
  });
  return result;
}
