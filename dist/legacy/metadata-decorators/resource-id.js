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

// src/metadata-decorators/resource-id.ts
var resource_id_exports = {};
__export(resource_id_exports, {
  ResourceID: () => ResourceID,
  getResourceIdIndex: () => getResourceIdIndex
});
module.exports = __toCommonJS(resource_id_exports);
var import_metadata_keys = require("./metadata-keys.js");
var ResourceID = (target, propertyKey, parameterIndex) => {
  Reflect.defineMetadata(
    import_metadata_keys.MetadataKey.RESOURCE_ID,
    parameterIndex,
    target,
    propertyKey
  );
};
var getResourceIdIndex = (target, propertyKey) => {
  return Reflect.getMetadata(import_metadata_keys.MetadataKey.RESOURCE_ID, target, propertyKey);
};
