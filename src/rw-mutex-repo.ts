import { getOperationFunctions } from "./metadata-decorators/operation-functions";
import { isReadOperation } from "./metadata-decorators/read-decorator";
import { getResourceIdIndex } from "./metadata-decorators/resource-id";
import { getResourceIDGetter } from "./metadata-decorators/resource-id-getter";
import { isWriteOperation } from "./metadata-decorators/write-decorator";
import { RWMutexStore } from "./rw-mutex-store";
import { removeDuplicates } from "./utilities/remove-duplicates";
import { validateResourceID } from "./utilities/validate-resource-id";

type ResourceID = string | number | symbol | Array<string | number | symbol>;
type ResourceGetter = (methodName: string | symbol, args: any[]) => ResourceID;

/**
 * Adds mutual exclusion mechanism with read and write lock types
 * to the decorated class. Each method of the decorated class
 * that has the `Read` decorator and a `ResourceID` decorator
 * will be ran after acquiring a read mutex lock, and each method
 * of the decorated class that has the `Write` decorator and a
 * `ResourceID` decorator will be ran after acquiring a write
 * mutex lock.
 */
export const RWMutexRepo = (
  RepositoryClass: any,
  a?: any,
  b?: any,
  isStatic = false,
  mutexStore?: RWMutexStore
): any => {
  const operationFunctionNames = getOperationFunctions(
    RepositoryClass.prototype
  );
  mutexStore = mutexStore ?? new RWMutexStore();

  const classResourceIDGetterName = getResourceIDGetter(
    RepositoryClass.prototype
  );

  const classResourceIDGetter = classResourceIDGetterName
    ? (RepositoryClass.prototype[classResourceIDGetterName] as ResourceGetter)
    : undefined;

  for (const operationFunctionName of operationFunctionNames) {
    if (!(operationFunctionName in RepositoryClass.prototype)) continue;

    const operationFunction = RepositoryClass.prototype[operationFunctionName];

    const isRead = isReadOperation(
      RepositoryClass.prototype,
      operationFunctionName
    );
    const isWrite = isWriteOperation(
      RepositoryClass.prototype,
      operationFunctionName
    );
    const resourceIdIndex = getResourceIdIndex(
      RepositoryClass.prototype,
      operationFunctionName
    );

    const idGetter =
      resourceIdIndex !== undefined
        ? function (_: any, args: any[]) {
            return args[resourceIdIndex] as ResourceID;
          }
        : classResourceIDGetter;

    if ((isRead || isWrite) && idGetter !== undefined) {
      const acquireWriteLocks = async (
        resourceIds: Array<string | number | symbol>
      ) => {
        const mutexes = resourceIds.map((id) => mutexStore!.getMutex(id));
        await Promise.all(mutexes.map((mutex) => mutex.acquireWrite()));

        return {
          release() {
            mutexes.forEach((mutex) => mutex.releaseWrite());
          },
        };
      };

      const acquireReadLocks = async (
        resourceIds: Array<string | number | symbol>
      ) => {
        const mutexes = resourceIds.map((id) => mutexStore!.getMutex(id));
        await Promise.all(mutexes.map((mutex) => mutex.acquireRead()));

        return {
          release() {
            mutexes.forEach((mutex) => mutex.releaseRead());
          },
        };
      };

      const acquireLocks = isWrite ? acquireWriteLocks : acquireReadLocks;

      RepositoryClass.prototype[operationFunctionName] = async function (
        ...args: any[]
      ) {
        const resourceID = idGetter.apply(this, [operationFunctionName, args]);
        validateResourceID(resourceID);
        const resourceIDList = removeDuplicates(
          Array.isArray(resourceID) ? resourceID : [resourceID]
        );

        const locks = await acquireLocks(resourceIDList);

        try {
          return await operationFunction.apply(this, args);
        } finally {
          locks.release();
        }
      };

      Object.assign(RepositoryClass.prototype[operationFunctionName], {
        _RWRepository_isDecorated: true,
        _RWRepository_lockType: isWrite ? "write" : "read",
        _RWRepository_resourceIdIndex: resourceIdIndex,
        _RWRepository_mutexStore: mutexStore,
      });
    }

    setTimeout(() => {
      if (!isRead && !isWrite) {
        console.warn(
          `Method "${operationFunctionName.toString()}" is not decorated with @Read or @Write despite bring marked as a subject to the RWMutex. This could be a mistake, make sure to add the appropriate decorators to this method.`
        );
      }

      if (idGetter === undefined) {
        console.warn(
          `Method "${operationFunctionName.toString()}" is not decorated with @ResourceID nor @ResourceIDGetter despite bring marked as a subject to the RWMutex. This could be a mistake, make sure to add the appropriate decorators to this method.`
        );
      }
    }, 0);
  }

  if (!isStatic) {
    RWMutexRepo({ prototype: RepositoryClass }, a, b, true, mutexStore);
  }
  return RepositoryClass;
};
