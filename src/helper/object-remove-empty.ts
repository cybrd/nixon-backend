export const objectRemoveEmpty = (oldObj: Record<string, string>) => {
  const newObj: typeof oldObj = {};

  for (const prop in oldObj) {
    if (
      typeof oldObj[prop] !== "undefined" &&
      oldObj[prop] !== null &&
      oldObj[prop] !== ""
    ) {
      newObj[prop] = oldObj[prop];
    }
  }
  return newObj;
};
