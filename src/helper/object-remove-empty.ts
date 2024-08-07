export const objectRemoveEmpty = (oldObj: Record<string, string>) => {
  const newObj: typeof oldObj = {};

  for (const propName in oldObj) {
    if (oldObj[propName] !== null || typeof oldObj[propName] !== "undefined") {
      newObj[propName] = oldObj[propName];
    }
  }
  return newObj;
};
