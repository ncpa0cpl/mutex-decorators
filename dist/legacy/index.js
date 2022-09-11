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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  RWLockRepository: () => import_repository_decorator.RWLockRepository,
  Read: () => import_read_decorator.Read,
  ResourceID: () => import_resource_id.ResourceID,
  Write: () => import_write_decorator.Write
});
module.exports = __toCommonJS(src_exports);
var import_reflect_metadata = require("reflect-metadata");
var import_read_decorator = require("./metadata-decorators/read-decorator.js");
var import_resource_id = require("./metadata-decorators/resource-id.js");
var import_write_decorator = require("./metadata-decorators/write-decorator.js");
var import_repository_decorator = require("./repository-decorator.js");
