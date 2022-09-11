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

// src/metadata-decorators/read-decorator.ts
var read_decorator_exports = {};
__export(read_decorator_exports, {
  Read: () => Read,
  isReadOperation: () => isReadOperation
});
module.exports = __toCommonJS(read_decorator_exports);
var import_metadata_keys = require("./metadata-keys.cjs");
var import_operation_functions = require("./operation-functions.cjs");
var Read = (prototype, key) => {
  Reflect.defineMetadata(import_metadata_keys.MetadataKey.READ_OPERATION, true, prototype, key);
  (0, import_operation_functions.OperationFunction)(prototype, key);
};
var isReadOperation = (prototype, key) => {
  return !!Reflect.getMetadata(import_metadata_keys.MetadataKey.READ_OPERATION, prototype, key);
};
