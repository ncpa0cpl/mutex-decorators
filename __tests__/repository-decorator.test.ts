import { Read, ResourceID, RWLockRepository, Write } from "../src/index";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isResolved = async (promise: Promise<any>) => {
  let resolved = false;
  promise.finally(() => (resolved = true));
  await sleep(25);
  return resolved;
};

describe("RWLockRepository", () => {
  it("correctly wraps method decorated with Write", () => {
    @RWLockRepository
    class TestRepository {
      @Write
      async writeMethod(@ResourceID resourceId: string) {
        return "write";
      }
    }

    expect(
      "_RWRepository_isDecorated" in TestRepository.prototype.writeMethod
    ).toBe(true);
    expect(
      (TestRepository.prototype.writeMethod as any)._RWRepository_lockType
    ).toBe("write");
  });

  it("correctly wraps method decorated with Read", () => {
    @RWLockRepository
    class TestRepository {
      @Read
      async readMethod(@ResourceID resourceId: string) {
        return "read";
      }
    }

    expect(
      "_RWRepository_isDecorated" in TestRepository.prototype.readMethod
    ).toBe(true);
    expect(
      (TestRepository.prototype.readMethod as any)._RWRepository_lockType
    ).toBe("read");
  });

  it("correctly wraps method decorated with Read and Write", () => {
    @RWLockRepository
    class TestRepository {
      @Read
      @Write
      async readWriteMethod(@ResourceID resourceId: string) {
        return "read/write";
      }
    }

    expect(
      "_RWRepository_isDecorated" in TestRepository.prototype.readWriteMethod
    ).toBe(true);
    expect(
      (TestRepository.prototype.readWriteMethod as any)._RWRepository_lockType
    ).toBe("write");
  });

  it("correctly mutually excludes write operations", async () => {
    const operations: Array<{ finish(): void }> = [];

    @RWLockRepository
    class TestRepository {
      @Write
      async writeMethod(@ResourceID resourceId: string) {
        await new Promise<void>((resolve) => {
          operations.push({ finish: () => resolve() });
        });
      }
    }

    const testRepository = new TestRepository();

    const write1R1 = testRepository.writeMethod("1");
    const write2R1 = testRepository.writeMethod("1");
    const write3R1 = testRepository.writeMethod("1");

    const write1R2 = testRepository.writeMethod("2");
    const write2R2 = testRepository.writeMethod("2");
    const write3R2 = testRepository.writeMethod("2");

    expect(await isResolved(write1R1)).toBe(false);
    expect(await isResolved(write2R1)).toBe(false);
    expect(await isResolved(write3R1)).toBe(false);
    expect(await isResolved(write1R2)).toBe(false);
    expect(await isResolved(write2R2)).toBe(false);
    expect(await isResolved(write3R2)).toBe(false);

    expect(operations.length).toBe(2);

    operations[0]!.finish();

    expect(await isResolved(write1R1)).toBe(true);
    expect(await isResolved(write2R1)).toBe(false);
    expect(await isResolved(write3R1)).toBe(false);
    expect(await isResolved(write1R2)).toBe(false);
    expect(await isResolved(write2R2)).toBe(false);
    expect(await isResolved(write3R2)).toBe(false);

    operations[2]!.finish();

    expect(await isResolved(write1R1)).toBe(true);
    expect(await isResolved(write2R1)).toBe(true);
    expect(await isResolved(write3R1)).toBe(false);
    expect(await isResolved(write1R2)).toBe(false);
    expect(await isResolved(write2R2)).toBe(false);
    expect(await isResolved(write3R2)).toBe(false);

    operations[1]!.finish();

    expect(await isResolved(write1R1)).toBe(true);
    expect(await isResolved(write2R1)).toBe(true);
    expect(await isResolved(write3R1)).toBe(false);
    expect(await isResolved(write1R2)).toBe(true);
    expect(await isResolved(write2R2)).toBe(false);
    expect(await isResolved(write3R2)).toBe(false);

    operations[3]!.finish();

    expect(await isResolved(write1R1)).toBe(true);
    expect(await isResolved(write2R1)).toBe(true);
    expect(await isResolved(write3R1)).toBe(true);
    expect(await isResolved(write1R2)).toBe(true);
    expect(await isResolved(write2R2)).toBe(false);
    expect(await isResolved(write3R2)).toBe(false);

    operations[4]!.finish();

    expect(await isResolved(write1R1)).toBe(true);
    expect(await isResolved(write2R1)).toBe(true);
    expect(await isResolved(write3R1)).toBe(true);
    expect(await isResolved(write1R2)).toBe(true);
    expect(await isResolved(write2R2)).toBe(true);
    expect(await isResolved(write3R2)).toBe(false);

    operations[5]!.finish();

    expect(await isResolved(write1R1)).toBe(true);
    expect(await isResolved(write2R1)).toBe(true);
    expect(await isResolved(write3R1)).toBe(true);
    expect(await isResolved(write1R2)).toBe(true);
    expect(await isResolved(write2R2)).toBe(true);
    expect(await isResolved(write3R2)).toBe(true);
  });

  it("should allow for multiple parallel reads", async () => {
    const operations: Array<{ finish(): void }> = [];

    @RWLockRepository
    class TestRepository {
      @Read
      async readMethod(@ResourceID resourceId: string) {
        await new Promise<void>((resolve) => {
          operations.push({ finish: () => resolve() });
        });
      }
    }

    const testRepository = new TestRepository();

    const read1R1 = testRepository.readMethod("1");
    const read2R1 = testRepository.readMethod("1");
    const read3R1 = testRepository.readMethod("1");

    await sleep(10);

    expect(operations.length).toBe(3);

    operations[2]?.finish();

    expect(await isResolved(read1R1)).toBe(false);
    expect(await isResolved(read2R1)).toBe(false);
    expect(await isResolved(read3R1)).toBe(true);
  });

  it("pending read operations should prevent writes", async () => {
    const writeOperations: Array<{ finish(): void }> = [];
    const readOperations: Array<{ finish(): void }> = [];

    @RWLockRepository
    class TestRepository {
      @Write
      async writeMethod(@ResourceID resourceId: string) {
        await new Promise<void>((resolve) => {
          writeOperations.push({ finish: () => resolve() });
        });
      }

      @Read
      async readMethod(@ResourceID resourceId: string) {
        await new Promise<void>((resolve) => {
          readOperations.push({ finish: () => resolve() });
        });
      }
    }

    const testRepository = new TestRepository();

    const read1R1 = testRepository.readMethod("1");
    const read2R1 = testRepository.readMethod("1");

    const write1R1 = testRepository.writeMethod("1");

    expect(await isResolved(read1R1)).toBe(false);
    expect(await isResolved(read2R1)).toBe(false);
    expect(await isResolved(write1R1)).toBe(false);

    expect(readOperations.length).toBe(2);
    expect(writeOperations.length).toBe(0);

    readOperations[0]!.finish();
    readOperations[1]!.finish();

    expect(await isResolved(read1R1)).toBe(true);
    expect(await isResolved(read2R1)).toBe(true);
    expect(await isResolved(write1R1)).toBe(false);

    expect(writeOperations.length).toBe(1);

    writeOperations[0]!.finish();

    expect(await isResolved(read1R1)).toBe(true);
    expect(await isResolved(read2R1)).toBe(true);
    expect(await isResolved(write1R1)).toBe(true);
  });

  it("pending write operation should prevent reads", async () => {
    const writeOperations: Array<{ finish(): void }> = [];
    const readOperations: Array<{ finish(): void }> = [];

    @RWLockRepository
    class TestRepository {
      @Write
      async writeMethod(@ResourceID resourceId: string) {
        await new Promise<void>((resolve) => {
          writeOperations.push({ finish: () => resolve() });
        });
      }

      @Read
      async readMethod(@ResourceID resourceId: string) {
        await new Promise<void>((resolve) => {
          readOperations.push({ finish: () => resolve() });
        });
      }
    }

    const testRepository = new TestRepository();

    const write1R1 = testRepository.writeMethod("1");

    const read1R1 = testRepository.readMethod("1");
    const read2R1 = testRepository.readMethod("1");

    expect(await isResolved(write1R1)).toBe(false);
    expect(await isResolved(read1R1)).toBe(false);
    expect(await isResolved(read2R1)).toBe(false);

    expect(readOperations.length).toBe(0);
    expect(writeOperations.length).toBe(1);

    writeOperations[0]!.finish();

    expect(await isResolved(write1R1)).toBe(true);
    expect(await isResolved(read1R1)).toBe(false);
    expect(await isResolved(read2R1)).toBe(false);

    expect(readOperations.length).toBe(2);

    readOperations[0]!.finish();
    readOperations[1]!.finish();

    expect(await isResolved(write1R1)).toBe(true);
    expect(await isResolved(read1R1)).toBe(true);
    expect(await isResolved(read2R1)).toBe(true);
  });
});
