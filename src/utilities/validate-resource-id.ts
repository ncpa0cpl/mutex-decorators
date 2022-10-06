type ResourceID = string | number | symbol | Array<string | number | symbol>;

export const validateResourceID = (resourceID: ResourceID): void => {
  if (Array.isArray(resourceID)) {
    if (
      resourceID.every(
        (id) =>
          typeof id === "string" ||
          typeof id === "number" ||
          typeof id === "symbol"
      )
    )
      return;

    throw new Error(
      "Invalid ResourceID, ResourceID must be a string, number, symbol, or an array of strings, numbers, or symbols"
    );
  } else if (
    typeof resourceID === "string" ||
    typeof resourceID === "number" ||
    typeof resourceID === "symbol"
  )
    return;

  throw new Error(
    "Invalid ResourceID, ResourceID must be a string, number, symbol, or an array of strings, numbers, or symbols"
  );
};
