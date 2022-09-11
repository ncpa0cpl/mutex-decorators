// src/metadata-decorators/operation-functions.ts
import { MetadataKey } from "./metadata-keys.mjs";
var OperationFunction = (prototype, key) => {
  let operationsList = Reflect.getMetadata(
    MetadataKey.OPERATION_FUNCTIONS,
    prototype
  );
  if (!operationsList) {
    operationsList = /* @__PURE__ */ new Set();
    Reflect.defineMetadata(
      MetadataKey.OPERATION_FUNCTIONS,
      operationsList,
      prototype
    );
  }
  operationsList.add(key);
};
var getOperationFunctions = (prototype) => {
  return Reflect.getMetadata(MetadataKey.OPERATION_FUNCTIONS, prototype) ?? /* @__PURE__ */ new Set();
};
export {
  OperationFunction,
  getOperationFunctions
};
