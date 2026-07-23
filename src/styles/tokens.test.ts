import resolveConfig from "tailwindcss/resolveConfig";
import { describe, expect, it } from "vitest";

import config from "../../tailwind.config";

const theme = resolveConfig(config).theme;

function lookup(record: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (typeof value !== "object" || value === null) return undefined;
    return (value as Record<string, unknown>)[key];
  }, record);
}

describe("legacy design tokens", () => {
  it.each([
    ["navy.DEFAULT", "#142719"],
    ["navy.mid", "#1E3A26"],
    ["navy.soft", "#306339"],
    ["navy.deep", "#0E1C12"],
    ["gold.DEFAULT", "#E9A23B"],
    ["gold.deep", "#D8932F"],
    ["gold.soft", "#B8F1D2"],
    ["paper.DEFAULT", "#F6F3EC"],
    ["paper.dim", "#ECE7DA"],
    ["paper.card", "#FBF9F4"],
    ["slate", "#8FA596"],
    ["ink", "#0F1E13"],
    ["muted", "#3f5446"],
    ["green", "#7BD3A0"],
    ["line", "rgba(233,162,59,.28)"],
  ])("colour %s resolves to %s", (path, expected) => {
    expect(String(lookup(theme?.colors, path)).toLowerCase()).toBe(
      expected.toLowerCase(),
    );
  });

  it.each([
    ["content", "1180px"],
    ["narrow", "820px"],
  ])("maxWidth %s is %s", (key, expected) => {
    expect(lookup(theme?.maxWidth, key)).toBe(expected);
  });
});
