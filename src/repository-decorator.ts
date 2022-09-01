import { getOperationFunctions } from "./metadata-decorators/operation-functions";
import { isReadOperation } from "./metadata-decorators/read-decorator";
import { getResourceIdIndex } from "./metadata-decorators/resource-id";
import { isWriteOperation } from "./metadata-decorators/write-decorator";
import { MutexStore } from "./mutex-store";
import { removeDuplicates } from "./utilities/remove-duplicates";

export const RWLockRepository = (
  RepositoryClass: new (...args: any) => any
) => {
  const operationFunctionNames = getOperationFunctions(
    RepositoryClass.prototype
  );
  const mutexStore = new MutexStore();

  for (const operationFunctionName of operationFunctionNames) {
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
        const mutexes = resourceIds.map((id) => mutexStore.getMutex(id));
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
        const mutexes = resourceIds.map((id) => mutexStore.getMutex(id));
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
  }

  return RepositoryClass;
};
