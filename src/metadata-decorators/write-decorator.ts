import { MetadataKey } from "./metadata-keys";
import { OperationFunction } from "./operation-functions";

/**
 * Method decorator used along with the `@RWMutexRepo`, marks the
 * decorated function as a subject to the RWMutex, before each
 * invocation of the decorated function, the Mutex will acquire a
 * write lock, and release it after the decorated function
 * finishes.
 *
 * Write locks are mutually exclusive to both Read and Write
 * locks. Which means that only one Write lock can be acquired at
 * the same time as other Reads and Writes.
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
export const Write = (prototype: object, key: string | symbol) => {
  Reflect.defineMetadata(MetadataKey.WRITE_OPERATION, true, prototype, key);
  OperationFunction(prototype, key);
};

export const isWriteOperation = (prototype: object, key: string | symbol) => {
  return !!Reflect.getMetadata(MetadataKey.WRITE_OPERATION, prototype, key);
};
