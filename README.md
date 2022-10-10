# Mutex Decorators

_Add mutual exclusion to class methods by decorating them._

## Mutex Example

By specifying the ID of the resource in the method argument.

```ts
import { MutexRepo, Lock, ResourceID } from "mutex-decorators";

@MutexRepo
class MyResourceRepository {
  @Lock
  public updateResource(@ResourceID id: string, data: any) {
    // update the resource of the specified `id` with `data`
  }
}
```

By specifying the ID of the resource with a getter method.

```ts
import { MutexRepo, Lock, ResourceIDGetter } from "mutex-decorators";

@MutexRepo
class MyResource {
  readonly id: string;

  @ResourceIDGetter
  public getID(methodName: string, methodArguments: any[]) {
    // Method decorated with `ResourceIDGetter` will get called with the name of the `@Lock`ed method
    // and the arguments passed to the `@Lock`ed method. Before the `@Lock`ed method is executed.
    return this.id;
  }

  @Lock
  public updateResource(data: any) {
    // update the resource of this class instance `id` with `data`
  }
}
```

## RWMutex Example

By specifying the ID of the resource in the method argument.

```ts
import { RWMutexRepo, Read, Write, ResourceID } from "mutex-decorators";

@RWMutexRepo
class MyResourceRepository {
  @Write
  public updateResource(@ResourceID id: string, data: any) {
    // update the resource of the specified `id` with `data`
  }

  @Read
  public getResource(@ResourceID id: string) {
    // get the resource of the specified `id`
  }
}
```

By specifying the ID of the resource with a getter method.

```ts
import { RWMutexRepo, Read, Write, ResourceIDGetter } from "mutex-decorators";

@RWMutexRepo
class MyResource {
  readonly id: string;

  @ResourceIDGetter
  public getID(methodName: string, methodArguments: any[]) {
    // Method decorated with `ResourceIDGetter` will get called with the name of the `@Lock`ed method
    // and the arguments passed to the `@Lock`ed method. Before the `@Lock`ed method is executed.
    return this.id;
  }

  @Write
  public updateResource(data: any) {
    // update the resource of this class instance `id` with `data`
  }

  @Read
  public getResource() {
    // get the resource of this class instance `id`
  }
}
```
