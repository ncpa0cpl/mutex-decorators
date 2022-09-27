import { MetadataKey } from "./metadata-keys";
import { OperationFunction } from "./operation-functions";

export const Lock = (prototype: object, key: string | symbol) => {
  Reflect.defineMetadata(MetadataKey.LOCKED_OPERATION, true, prototype, key);
  OperationFunction(prototype, key);
};

export const isLockedOperation = (prototype: object, key: string | symbol) => {
  return !!Reflect.getMetadata(MetadataKey.LOCKED_OPERATION, prototype, key);
};
