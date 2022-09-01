import { MetadataKey } from "./metadata-keys";
import { OperationFunction } from "./operation-functions";

export const Read = (prototype: object, key: string | symbol) => {
  Reflect.defineMetadata(MetadataKey.READ_OPERATION, true, prototype, key);
  OperationFunction(prototype, key);
};

export const isReadOperation = (prototype: object, key: string | symbol) => {
  return !!Reflect.getMetadata(MetadataKey.READ_OPERATION, prototype, key);
};
