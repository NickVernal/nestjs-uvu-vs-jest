import uvu from 'uvu';
import { equal } from 'uvu/assert';

export type UvuSuite = uvu.Test<uvu.Context>;
export type PrepareContext = () => Promise<void>;
export interface DescribeOptions {
  beforeAll?: PrepareContext;
  afterAll?: PrepareContext;
  beforeEach?: PrepareContext;
  afterEach?: PrepareContext;
}
export type DescribeContent = (suite: UvuSuite) => void;

export function buildDescribe(options: DescribeOptions) {
  return function (name: string, fn?: DescribeContent) {
    const suite = uvu.suite(name);
    setupHooks(suite, options);
    fn(suite);
    suite.run();
  };
}

function setupHooks(suite: UvuSuite, options: DescribeOptions) {
  if (options.beforeAll) {
    suite.before(options.beforeAll);
  }
  if (options.beforeEach) {
    suite.before.each(options.beforeEach);
  }
  if (options.afterEach) {
    suite.after.each(options.afterEach);
  }
  if (options.afterAll) {
    suite.after(options.afterAll);
  }
}

const toMatchObject = (value: any, expected: any) => {
  Object.keys(expected).forEach((key) => {
    if (typeof expected[key] !== 'object') {
      equal(expected[key], value[key]);
    } else {
      toMatchObject(value[key], expected[key]);
    }
  });
};

export function expect(value: any) {
  return {
    toEqual: (expected: any) => equal(value, expected),
    toMatchSnapshot: (expected: any) => {
      return toMatchObject(value, expected);
    },
    toMatchObject: (expected: any) => toMatchObject(value, expected),
    toStrictEqual: (expected: any) => value === expected,
  };
}
