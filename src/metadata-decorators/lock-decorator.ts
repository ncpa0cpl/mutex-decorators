import { MetadataKey } from "./metadata-keys";
import { OperationFunction } from "./operation-functions";

/**
 * Method decorator used along with the `@MutexRepo`, marks the
 * decorated function as a subject to the Mutex, before each
 * invocation of the decorated function, the Mutex will acquire a
 * lock, and release it after the decorated function finishes.
 *
 * Locks are acquired per each Resource individually, and
 * resources are identified by the ID which are determined via
 * the `@ResourceID` or `@ResourceIDGetter` decorator.
 *
 * If the class doesn't have a ResourceIDGetter and the invoked
 * method doesn't have a ResourceID parameter, the Mutex will not
 * be able to acquire a lock, and the decorated function will
 * behave like a normal function.
 */
export const Lock = (prototype: object, key: string | symbol) => {
  Reflect.defineMetadata(MetadataKey.LOCKED_OPERATION, true, prototype, key);
  OperationFunction(prototype, key);
};

export const isLockedOperation = (prototype: object, key: string | symbol) => {
  return !!Reflect.getMetadata(MetadataKey.LOCKED_OPERATION, prototype, key);
};
