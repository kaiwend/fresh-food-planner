import { assertEquals } from "$std/assert/assert_equals.ts";
import { cleanObject, transformObjectForPrompt } from "../../graph/utils.ts";

Deno.test("cleanObject :: for an empty object", () => {
  const obj = {};
  const cleaned = cleanObject(obj);
  assertEquals(cleaned, {});
});

Deno.test("cleanObject :: for an object with all empty values", () => {
  const obj = {
    a: null,
    b: "",
    c: undefined,
    d: [],
    e: {},
  };
  const cleaned = cleanObject(obj);
  assertEquals(cleaned, {});
});
Deno.test("cleanObject :: for an object with some empty values", () => {
  const obj = {
    a: "a",
    b: null,
    c: "",
    d: undefined,
    e: [],
    f: {},
  };
  const cleaned = cleanObject(obj);
  assertEquals(cleaned, { a: "a" });
});

Deno.test("cleanObject :: for an object with all values", () => {
  const obj = {
    a: "a",
    b: null,
    c: "",
    d: undefined,
    e: [],
    f: ["f"],
  };
  const cleaned = cleanObject(obj);
  assertEquals(cleaned, { a: "a", f: ["f"] });
});

Deno.test("cleanObject :: for a nested object with all values", () => {
  const obj = {
    a: "a",
    b: null,
    c: "",
    d: undefined,
    e: [],
    f: {
      g: null,
      h: "",
      i: undefined,
      j: [],
      k: ["k"],
    },
  };
  const cleaned = cleanObject(obj);
  const expected = { a: "a", f: { k: ["k"] } };
  assertEquals(cleaned, expected);
});

Deno.test("transformObjectForPrompt :: for an empty object", () => {
  const obj = {};
  const transformed = transformObjectForPrompt(obj);
  assertEquals(transformed, "");
});

Deno.test(
  "transformObjectForPrompt :: for an object with string and array of strings",
  () => {
    const obj = {
      d: "someString",
      e: ["someMoreStrings", "andEvenMoreStrings"],
    };
    const transformed = transformObjectForPrompt(obj);
    assertEquals(
      transformed,
      "d: someString\ne: someMoreStrings, andEvenMoreStrings",
    );
  },
);
