import { MetadataKey } from "./metadata-keys";

/**
 * Method decorator used along with the `@RWMutexRepo` and
 * `@MutexRepo` decorators, marks the decorated method as the
 * Resource ID Getter, that will be used to determine the
 * Resource ID, that will be used to distinguish between
 * different resources, and acquire locks per each resource.
 *
 * The decorated getter method returned value must be a string,
 * number, symbol or an Array of those. The decorated getter
 * method will be invoked with a name of the method that attempts
 * to acquire the locks as the first argument, and that method
 * arguments.
 *
 * Example:
 *
 * ```ts
 * @RWMutexRepo
 * class MyRepo {
 *   private id: string;
 *
 *   @ResourceIDGetter
 *   getResourceID(
 *     fooName: string,
 *     fooArgs: [myArg: object]
 *   ) {
 *     return this.id;
 *   }
 *
 *   @Read foo(myArg: object) {
 *     // ...
 *   }
 * }
 * ```
 */
export const ResourceIDGetter = (prototype: object, key: string | symbol) => {
  Reflect.defineMetadata(MetadataKey.RESOURCE_ID_GETTER, key, prototype);
};

export const getResourceIDGetter = (
  prototype: object
): string | symbol | undefined => {
  return Reflect.getMetadata(MetadataKey.RESOURCE_ID_GETTER, prototype);
};
