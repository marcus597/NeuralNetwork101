import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("dedupes tailwind conflicts", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});
