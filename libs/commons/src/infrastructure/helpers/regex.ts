export const regexHexObjectId = {
  opt1: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  opt2: /^[0-9a-f]{24}$/i,
  opt3: /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,
};
