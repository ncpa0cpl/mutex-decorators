import { RWMutex } from "@ncpa0cpl/mutex.js";
export declare class MutexStore {
    private readonly mutexMap;
    private createMutex;
    getMutex(id: string | number | symbol): RWMutex;
}
