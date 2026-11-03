import { describe, expect, it } from "vitest";
import { InstagramFormatConverter } from "./markdown";

const converter = new InstagramFormatConverter();

describe("InstagramFormatConverter", () => {
  it("round-trips text and markdown through mdast", () => {
    const ast = converter.toAst("**Available** today");
    expect(ast.type).toBe("root");
    expect(converter.fromAst(ast)).toBe("Available today");
  });

  it("renders supported postable shapes", () => {
    expect(converter.renderPostable("hello")).toBe("hello");
    expect(converter.renderPostable({ raw: "raw" })).toBe("raw");
    expect(converter.renderPostable({ markdown: "**bold**" })).toBe("bold");
    expect(
      converter.renderPostable({ ast: converter.toAst("from ast") })
    ).toContain("from ast");
  });

  it("extracts plain text", () => {
    expect(converter.extractPlainText("**bold** text")).toContain("bold text");
  });

  it.each([
    [
      "See [the docs](https://example.com/docs) for details.",
      "See the docs (https://example.com/docs) for details.",
    ],
    [
      "[**Pricing**](https://example.com/pricing)",
      "Pricing (https://example.com/pricing)",
    ],
    ["[example.com](http://example.com)", "example.com (http://example.com)"],
    ["[](https://example.com)", "https://example.com"],
  ])("keeps the link URL in %s", (markdown, expected) => {
    expect(converter.renderPostable({ markdown })).toBe(expected);
  });

  it.each([
    [
      "Track it at https://example.com/track",
      "Track it at https://example.com/track",
    ],
    ["Email help@example.com", "Email help@example.com"],
    ["Go to www.example.com", "Go to www.example.com"],
  ])("sends the bare address in %s as written", (markdown, expected) => {
    expect(converter.renderPostable({ markdown })).toBe(expected);
  });
});
