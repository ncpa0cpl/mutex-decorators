// src/metadata-decorators/resource-id.ts
import { MetadataKey } from "./metadata-keys.mjs";
var ResourceID = (target, propertyKey, parameterIndex) => {
  Reflect.defineMetadata(
    MetadataKey.RESOURCE_ID,
    parameterIndex,
    target,
    propertyKey
  );
};
var getResourceIdIndex = (target, propertyKey) => {
  return Reflect.getMetadata(MetadataKey.RESOURCE_ID, target, propertyKey);
};
export {
  ResourceID,
  getResourceIdIndex
};
