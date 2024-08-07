export const objectRemoveEmpty = (oldObj: Record<string, string>) => {
  const newObj: typeof oldObj = {};

  for (const propName in oldObj) {
    if (
      typeof oldObj[propName] !== "undefined" ||
      oldObj[propName] !== null ||
      oldObj[propName] !== ""
    ) {
      newObj[propName] = oldObj[propName];
    }
  }
  return newObj;
};
