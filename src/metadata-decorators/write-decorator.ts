import { MetadataKey } from "./metadata-keys";
import { OperationFunction } from "./operation-functions";

export const Write = (prototype: object, key: string | symbol) => {
  Reflect.defineMetadata(MetadataKey.WRITE_OPERATION, true, prototype, key);
  OperationFunction(prototype, key);
};

export const isWriteOperation = (prototype: object, key: string | symbol) => {
  return !!Reflect.getMetadata(MetadataKey.WRITE_OPERATION, prototype, key);
};
