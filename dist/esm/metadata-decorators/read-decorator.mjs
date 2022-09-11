// src/metadata-decorators/read-decorator.ts
import { MetadataKey } from "./metadata-keys.mjs";
import { OperationFunction } from "./operation-functions.mjs";
var Read = (prototype, key) => {
  Reflect.defineMetadata(MetadataKey.READ_OPERATION, true, prototype, key);
  OperationFunction(prototype, key);
};
var isReadOperation = (prototype, key) => {
  return !!Reflect.getMetadata(MetadataKey.READ_OPERATION, prototype, key);
};
export {
  Read,
  isReadOperation
};
