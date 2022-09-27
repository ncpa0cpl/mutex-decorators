import { RWMutex } from "@ncpa0cpl/mutex.js";

export class RWMutexStore {
  private readonly mutexMap = new Map<string | number | symbol, RWMutex>();

  private createMutex(id: string | number | symbol): RWMutex {
    const mutex = new RWMutex();

    this.mutexMap.set(id, mutex);

    return mutex;
  }

  getMutex(id: string | number | symbol): RWMutex {
    const mutex = this.mutexMap.get(id);

    if (mutex) return mutex;

    return this.createMutex(id);
  }
}
