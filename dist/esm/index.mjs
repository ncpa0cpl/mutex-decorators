// src/index.ts
import "reflect-metadata";
import { Read } from "./metadata-decorators/read-decorator.mjs";
import { ResourceID } from "./metadata-decorators/resource-id.mjs";
import { Write } from "./metadata-decorators/write-decorator.mjs";
import { RWLockRepository } from "./repository-decorator.mjs";
export {
  RWLockRepository,
  Read,
  ResourceID,
  Write
};
