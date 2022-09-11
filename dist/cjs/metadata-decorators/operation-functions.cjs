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

// src/metadata-decorators/operation-functions.ts
var operation_functions_exports = {};
__export(operation_functions_exports, {
  OperationFunction: () => OperationFunction,
  getOperationFunctions: () => getOperationFunctions
});
module.exports = __toCommonJS(operation_functions_exports);
var import_metadata_keys = require("./metadata-keys.cjs");
var OperationFunction = (prototype, key) => {
  let operationsList = Reflect.getMetadata(
    import_metadata_keys.MetadataKey.OPERATION_FUNCTIONS,
    prototype
  );
  if (!operationsList) {
    operationsList = /* @__PURE__ */ new Set();
    Reflect.defineMetadata(
      import_metadata_keys.MetadataKey.OPERATION_FUNCTIONS,
      operationsList,
      prototype
    );
  }
  operationsList.add(key);
};
var getOperationFunctions = (prototype) => {
  return Reflect.getMetadata(import_metadata_keys.MetadataKey.OPERATION_FUNCTIONS, prototype) ?? /* @__PURE__ */ new Set();
};
