import { MetadataKey } from "./metadata-keys";

export const ResourceID = (
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number
) => {
  Reflect.defineMetadata(
    MetadataKey.RESOURCE_ID,
    parameterIndex,
    target,
    propertyKey
  );
};

export const getResourceIdIndex = (
  target: object,
  propertyKey: string | symbol
): number | undefined => {
  return Reflect.getMetadata(MetadataKey.RESOURCE_ID, target, propertyKey);
};
