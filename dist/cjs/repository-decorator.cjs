"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/repository-decorator.ts
var repository_decorator_exports = {};
__export(repository_decorator_exports, {
  RWLockRepository: () => RWLockRepository
});
module.exports = __toCommonJS(repository_decorator_exports);
var import_operation_functions = require("./metadata-decorators/operation-functions.cjs");
var import_read_decorator = require("./metadata-decorators/read-decorator.cjs");
var import_resource_id = require("./metadata-decorators/resource-id.cjs");
var import_write_decorator = require("./metadata-decorators/write-decorator.cjs");
var import_mutex_store = require("./mutex-store.cjs");
var import_remove_duplicates = require("./utilities/remove-duplicates.cjs");
var RWLockRepository = (RepositoryClass, a, b, isStatic = false, mutexStore) => {
  const operationFunctionNames = (0, import_operation_functions.getOperationFunctions)(
    RepositoryClass.prototype
  );
  mutexStore = mutexStore ?? new import_mutex_store.MutexStore();
  for (const operationFunctionName of operationFunctionNames) {
    if (!(operationFunctionName in RepositoryClass.prototype))
      continue;
    const operationFunction = RepositoryClass.prototype[operationFunctionName];
    const isRead = (0, import_read_decorator.isReadOperation)(
      RepositoryClass.prototype,
      operationFunctionName
    );
    const isWrite = (0, import_write_decorator.isWriteOperation)(
      RepositoryClass.prototype,
      operationFunctionName
    );
    const resourceIdIndex = (0, import_resource_id.getResourceIdIndex)(
      RepositoryClass.prototype,
      operationFunctionName
    );
    if ((isRead || isWrite) && resourceIdIndex !== void 0) {
      const acquireWriteLocks = async (resourceIds) => {
        const mutexes = resourceIds.map((id) => mutexStore.getMutex(id));
        await Promise.all(mutexes.map((mutex) => mutex.acquireWrite()));
        return {
          release() {
            mutexes.forEach((mutex) => mutex.releaseWrite());
          }
        };
      };
      const acquireReadLocks = async (resourceIds) => {
        const mutexes = resourceIds.map((id) => mutexStore.getMutex(id));
        await Promise.all(mutexes.map((mutex) => mutex.acquireRead()));
        return {
          release() {
            mutexes.forEach((mutex) => mutex.releaseRead());
          }
        };
      };
      const acquireLocks = isWrite ? acquireWriteLocks : acquireReadLocks;
      RepositoryClass.prototype[operationFunctionName] = async function(...args) {
        const resourceID = args[resourceIdIndex];
        const resourceIDList = (0, import_remove_duplicates.removeDuplicates)(
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
        _RWRepository_mutexStore: mutexStore
      });
    }
  }
  if (!isStatic) {
    RWLockRepository({ prototype: RepositoryClass }, a, b, true, mutexStore);
  }
  return RepositoryClass;
};
