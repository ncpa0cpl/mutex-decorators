// src/metadata-decorators/write-decorator.ts
import { MetadataKey } from "./metadata-keys.mjs";
import { OperationFunction } from "./operation-functions.mjs";
var Write = (prototype, key) => {
  Reflect.defineMetadata(MetadataKey.WRITE_OPERATION, true, prototype, key);
  OperationFunction(prototype, key);
};
var isWriteOperation = (prototype, key) => {
  return !!Reflect.getMetadata(MetadataKey.WRITE_OPERATION, prototype, key);
};
export {
  Write,
  isWriteOperation
};
