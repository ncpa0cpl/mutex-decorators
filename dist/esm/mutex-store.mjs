// src/mutex-store.ts
import { RWMutex } from "@ncpa0cpl/mutex.js";
var MutexStore = class {
  mutexMap = /* @__PURE__ */ new Map();
  createMutex(id) {
    const mutex = new RWMutex();
    this.mutexMap.set(id, mutex);
    return mutex;
  }
  getMutex(id) {
    const mutex = this.mutexMap.get(id);
    if (mutex)
      return mutex;
    return this.createMutex(id);
  }
};
export {
  MutexStore
};
