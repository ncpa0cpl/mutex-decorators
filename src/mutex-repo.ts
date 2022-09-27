import { isLockedOperation } from "./metadata-decorators/lock-decorator";
import { getOperationFunctions } from "./metadata-decorators/operation-functions";
import { getResourceIdIndex } from "./metadata-decorators/resource-id";
import { MutexStore } from "./mutex-store";
import { removeDuplicates } from "./utilities/remove-duplicates";

/**
 * Adds mutual exclusion mechanism to the decorated class. Each
 * method of the decorated class that has the `Lock` decorator
 * and a `ResourceID` decorator will be ran after acquiring a
 * mutex lock.
 */
export const MutexRepo = (
  RepositoryClass: any,
  a?: any,
  b?: any,
  isStatic = false,
  mutexStore?: MutexStore
): any => {
  const operationFunctionNames = getOperationFunctions(
    RepositoryClass.prototype
  );
  mutexStore = mutexStore ?? new MutexStore();

  for (const operationFunctionName of operationFunctionNames) {
    if (!(operationFunctionName in RepositoryClass.prototype)) continue;

    const operationFunction = RepositoryClass.prototype[operationFunctionName];

    const isLocked = isLockedOperation(
      RepositoryClass.prototype,
      operationFunctionName
    );

    const resourceIdIndex = getResourceIdIndex(
      RepositoryClass.prototype,
      operationFunctionName
    );

    if (isLocked && resourceIdIndex !== undefined) {
      const acquireLocks = async (
        resourceIds: Array<string | number | symbol>
      ) => {
        const mutexes = resourceIds.map((id) => mutexStore!.getMutex(id));
        await Promise.all(mutexes.map((mutex) => mutex.acquire()));

        return {
          release() {
            mutexes.forEach((mutex) => mutex.release());
          },
        };
      };

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
        _RWRepository_lockType: "locked",
        _RWRepository_resourceIdIndex: resourceIdIndex,
        _RWRepository_mutexStore: mutexStore,
      });
    }

    setTimeout(() => {
      if (!isLocked) {
        console.warn(
          `Method "${operationFunctionName.toString()}" is not decorated with @Lock despite bring marked as a subject to the Mutex. This could be a mistake, make sure to add the appropriate decorators to this method.`
        );
      }

      if (resourceIdIndex === undefined) {
        console.warn(
          `Method "${operationFunctionName.toString()}" is not decorated with @ResourceID despite bring marked as a subject to the Mutex. This could be a mistake, make sure to add the appropriate decorators to this method.`
        );
      }
    }, 0);
  }

  if (!isStatic) {
    MutexRepo({ prototype: RepositoryClass }, a, b, true, mutexStore);
  }
  return RepositoryClass;
};
