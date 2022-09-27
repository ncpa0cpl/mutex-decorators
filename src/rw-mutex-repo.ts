import { getOperationFunctions } from "./metadata-decorators/operation-functions";
import { isReadOperation } from "./metadata-decorators/read-decorator";
import { getResourceIdIndex } from "./metadata-decorators/resource-id";
import { isWriteOperation } from "./metadata-decorators/write-decorator";
import { RWMutexStore } from "./rw-mutex-store";
import { removeDuplicates } from "./utilities/remove-duplicates";

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

    if ((isRead || isWrite) && resourceIdIndex !== undefined) {
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
        const resourceID:
          | string
          | number
          | symbol
          | Array<string | number | symbol> = args[resourceIdIndex];
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

      if (resourceIdIndex === undefined) {
        console.warn(
          `Method "${operationFunctionName.toString()}" is not decorated with @ResourceID despite bring marked as a subject to the RWMutex. This could be a mistake, make sure to add the appropriate decorators to this method.`
        );
      }
    }, 0);
  }

  if (!isStatic) {
    RWMutexRepo({ prototype: RepositoryClass }, a, b, true, mutexStore);
  }
  return RepositoryClass;
};
