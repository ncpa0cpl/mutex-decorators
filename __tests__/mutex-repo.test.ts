import { Lock, MutexRepo, ResourceID } from "../src/index";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isResolved = async (promise: Promise<any>) => {
  let resolved = false;
  promise.finally(() => (resolved = true));
  await sleep(25);
  return resolved;
};

describe("MutexRepo", () => {
  describe("on regular class", () => {
    it("correctly wraps method decorated with Lock", () => {
      @MutexRepo
      class TestRepository {
        @Lock
        async writeMethod(@ResourceID resourceId: string) {
          return "write";
        }
      }

      expect(
        "_RWRepository_isDecorated" in TestRepository.prototype.writeMethod
      ).toBe(true);
      expect(
        (TestRepository.prototype.writeMethod as any)._RWRepository_lockType
      ).toBe("locked");
    });

    it("correctly queues methods decorated with Lock", async () => {
      const operations: Array<{ finish(): void }> = [];

      @MutexRepo
      class TestRepository {
        public counter = 0;
        @Lock
        public async foo(@ResourceID id: string) {
          await new Promise<void>((resolve) => {
            operations.push({ finish: () => resolve() });
          });
        }

        @Lock
        public async bar(@ResourceID id: string) {
          await new Promise<void>((resolve) => {
            operations.push({ finish: () => resolve() });
          });
        }
      }

      const testRepository = new TestRepository();

      const op1 = testRepository.foo("1");
      const op2 = testRepository.foo("1");
      const op3 = testRepository.bar("1");
      const op4 = testRepository.bar("1");

      await sleep(20);

      expect(await isResolved(op1)).toBe(false);
      expect(await isResolved(op2)).toBe(false);
      expect(await isResolved(op3)).toBe(false);
      expect(await isResolved(op4)).toBe(false);

      expect(operations.length).toBe(1);

      operations[0]!.finish();

      expect(await isResolved(op1)).toBe(true);
      expect(await isResolved(op2)).toBe(false);
      expect(await isResolved(op3)).toBe(false);
      expect(await isResolved(op4)).toBe(false);

      expect(operations.length).toBe(2);

      operations[1]!.finish();

      expect(await isResolved(op1)).toBe(true);
      expect(await isResolved(op2)).toBe(true);
      expect(await isResolved(op3)).toBe(false);
      expect(await isResolved(op4)).toBe(false);

      expect(operations.length).toBe(3);

      operations[2]!.finish();

      expect(await isResolved(op1)).toBe(true);
      expect(await isResolved(op2)).toBe(true);
      expect(await isResolved(op3)).toBe(true);
      expect(await isResolved(op4)).toBe(false);

      expect(operations.length).toBe(4);

      operations[3]!.finish();

      expect(await isResolved(op1)).toBe(true);
      expect(await isResolved(op2)).toBe(true);
      expect(await isResolved(op3)).toBe(true);
      expect(await isResolved(op4)).toBe(true);
    });
  });

  describe("on static class", () => {
    it("correctly wraps method decorated with Lock", () => {
      @MutexRepo
      class TestRepository {
        @Lock
        static async writeMethod(@ResourceID resourceId: string) {
          return "write";
        }
      }

      expect("_RWRepository_isDecorated" in TestRepository.writeMethod).toBe(
        true
      );
      expect((TestRepository.writeMethod as any)._RWRepository_lockType).toBe(
        "locked"
      );
    });

    it("correctly queues methods decorated with Lock", async () => {
      const operations: Array<{ finish(): void }> = [];

      @MutexRepo
      class TestRepository {
        public counter = 0;
        @Lock
        public static async foo(@ResourceID id: string) {
          await new Promise<void>((resolve) => {
            operations.push({ finish: () => resolve() });
          });
        }

        @Lock
        public static async bar(@ResourceID id: string) {
          await new Promise<void>((resolve) => {
            operations.push({ finish: () => resolve() });
          });
        }
      }

      const testRepository = TestRepository;

      const op1 = testRepository.foo("1");
      const op2 = testRepository.foo("1");
      const op3 = testRepository.bar("1");
      const op4 = testRepository.bar("1");

      await sleep(20);

      expect(await isResolved(op1)).toBe(false);
      expect(await isResolved(op2)).toBe(false);
      expect(await isResolved(op3)).toBe(false);
      expect(await isResolved(op4)).toBe(false);

      expect(operations.length).toBe(1);

      operations[0]!.finish();

      expect(await isResolved(op1)).toBe(true);
      expect(await isResolved(op2)).toBe(false);
      expect(await isResolved(op3)).toBe(false);
      expect(await isResolved(op4)).toBe(false);

      expect(operations.length).toBe(2);

      operations[1]!.finish();

      expect(await isResolved(op1)).toBe(true);
      expect(await isResolved(op2)).toBe(true);
      expect(await isResolved(op3)).toBe(false);
      expect(await isResolved(op4)).toBe(false);

      expect(operations.length).toBe(3);

      operations[2]!.finish();

      expect(await isResolved(op1)).toBe(true);
      expect(await isResolved(op2)).toBe(true);
      expect(await isResolved(op3)).toBe(true);
      expect(await isResolved(op4)).toBe(false);

      expect(operations.length).toBe(4);

      operations[3]!.finish();

      expect(await isResolved(op1)).toBe(true);
      expect(await isResolved(op2)).toBe(true);
      expect(await isResolved(op3)).toBe(true);
      expect(await isResolved(op4)).toBe(true);
    });
  });
});
