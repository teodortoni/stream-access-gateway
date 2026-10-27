import * as nodeUtil from "util"
import * as bufferModule from "buffer"

const utilAny = nodeUtil as any
if (typeof utilAny.isNullOrUndefined !== "function") {
  utilAny.isNullOrUndefined = (value: unknown): boolean => value === null || value === undefined
}

const bufferAny = bufferModule as any
if (typeof bufferAny.SlowBuffer === "undefined") {
  bufferAny.SlowBuffer = bufferAny.Buffer
}

const globalAny = global as any
if (typeof globalAny.Buffer === "undefined") {
  globalAny.Buffer = bufferAny.Buffer
}
if (typeof globalAny.SlowBuffer === "undefined") {
  globalAny.SlowBuffer = bufferAny.SlowBuffer
}
