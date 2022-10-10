import { MetadataKey } from "./metadata-keys";

/**
 * Argument decorator used along with the `@RWMutexRepo` and
 * `@MutexRepo` decorators, marks the decorated method argument
 * as the Resource ID, that will be used to distinguish between
 * different resources, and acquire locks per each resource.
 *
 * The decorated arguments must be a string, number, symbol or an
 * Array of those.
 */
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
