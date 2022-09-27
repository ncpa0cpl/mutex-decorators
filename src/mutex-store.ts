import { Mutex } from "@ncpa0cpl/mutex.js";

export class MutexStore {
  private readonly mutexMap = new Map<string | number | symbol, Mutex>();

  private createMutex(id: string | number | symbol): Mutex {
    const mutex = new Mutex();

    this.mutexMap.set(id, mutex);

    return mutex;
  }

  getMutex(id: string | number | symbol): Mutex {
    const mutex = this.mutexMap.get(id);

    if (mutex) return mutex;

    return this.createMutex(id);
  }
}
