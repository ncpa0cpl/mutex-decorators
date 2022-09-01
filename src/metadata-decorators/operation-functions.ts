import { MetadataKey } from "./metadata-keys";

export const OperationFunction = (prototype: object, key: string | symbol) => {
  let operationsList: Set<string | symbol> | undefined = Reflect.getMetadata(
    MetadataKey.OPERATION_FUNCTIONS,
    prototype
  );

  if (!operationsList) {
    operationsList = new Set<string | symbol>();
    Reflect.defineMetadata(
      MetadataKey.OPERATION_FUNCTIONS,
      operationsList,
      prototype
    );
  }

  operationsList.add(key);
};

export const getOperationFunctions = (
  prototype: object
): Set<string | symbol> => {
  return (
    Reflect.getMetadata(MetadataKey.OPERATION_FUNCTIONS, prototype) ??
    new Set<string | symbol>()
  );
};
