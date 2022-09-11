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

// src/metadata-decorators/metadata-keys.ts
var metadata_keys_exports = {};
__export(metadata_keys_exports, {
  MetadataKey: () => MetadataKey
});
module.exports = __toCommonJS(metadata_keys_exports);
var MetadataKey = /* @__PURE__ */ ((MetadataKey2) => {
  MetadataKey2["OPERATION_FUNCTIONS"] = "mutex:operation:functions";
  MetadataKey2["READ_OPERATION"] = "mutex:operation-type:read";
  MetadataKey2["WRITE_OPERATION"] = "mutex:operation-type:write";
  MetadataKey2["RESOURCE_ID"] = "mutex:operation:resource-id";
  return MetadataKey2;
})(MetadataKey || {});
