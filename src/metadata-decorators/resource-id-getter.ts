import { MetadataKey } from "./metadata-keys";

export const ResourceIDGetter = (prototype: object, key: string | symbol) => {
  Reflect.defineMetadata(MetadataKey.RESOURCE_ID_GETTER, key, prototype);
};

export const getResourceIDGetter = (
  prototype: object
): string | symbol | undefined => {
  return Reflect.getMetadata(MetadataKey.RESOURCE_ID_GETTER, prototype);
};
