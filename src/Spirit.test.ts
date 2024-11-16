import { expect, test } from "vitest";
import { Spirit } from "./Spirit.js";

const hey = "hey";
const hi = "hi";
const hello = "hello";

test("strength", () => {
	const weak = new Spirit("12");
	const medium = new Spirit("1234**");
	const strong = new Spirit("123456***");

	expect(weak.strength).toBe(2);
	expect(medium.strength).toBe(4);
	expect(strong.strength).toBe(6);
});

test("should match source string", () => {
	const spirit = new Spirit(hi);

	expect(spirit.match(hi)).toBe(true);
	expect(spirit.allMatch(hi, hi)).toBe(true);
});

test("should not match incorrectly", () => {
	const spirit = new Spirit(hi);

	expect(spirit.match(hey)).toBe(false);
	expect(spirit.allMatch(hi, hey)).toBe(false);
});

test("nothing matches empty strings", () => {
	const wildcard = new Spirit("*");
	const question = new Spirit("?");

	expect(wildcard.match("")).toBe(false);
	expect(question.match("")).toBe(false);
});

test("wildcard matches everything", () => {
	const spirit = new Spirit("*");

	expect(spirit.allMatch(hey, hi, hello)).toBe(true);
});

test("allMatch works correctly", () => {
	const spirit = new Spirit("ab*cd");

	expect(spirit.allMatch("abbcd", "abccd", "abcd")).toBe(true);

	expect(spirit.allMatch("abbcd", "abccd", "acbd")).toBe(false);
});

test("only matches are returned from findMatches", () => {
	const spirit = new Spirit("ab*cd");

	expect(
		spirit.findMatches("abbcd", "abccd", "abcd", "acbd", "abbcde"),
	).toEqual(["abbcd", "abccd", "abcd"]);
});

test(". matches a single character", () => {
	const h_ = new Spirit("h.");
	const h_y = new Spirit("h.y");
	const _ello = new Spirit(".ello");

	expect(h_.match("h")).toBe(false);
	expect(h_.match(hi)).toBe(true);
	expect(h_.match(hey)).toBe(false);
	expect(h_y.match(hey)).toBe(true);
	expect(_ello.match(hello)).toBe(true);
});

test("question marks are optional, but only at the end", () => {
	const required = new Spirit("ab?de");
	const optional = new Spirit("abcd?");

	expect(required.match("abde")).toBe(false);
	expect(required.match("abcde")).toBe(true);
	expect(required.match("abcdef")).toBe(false);
	expect(optional.match("abcd")).toBe(true);
	expect(optional.match("abcde")).toBe(true);
	expect(optional.match("abcdef")).toBe(false);
});

test("escaped wildcards are treated properly", () => {
	const escaped = new Spirit("a \\* \\.");

	expect(escaped.match("a * .")).toBe(true);
	expect(escaped.match("a xx x")).toBe(false);
});

test("matches are handled correctly", () => {
	const spirit = new Spirit("abc*xyz");

	expect(spirit.match("abcdefghi")).toBe(false);
	expect(spirit.match("abcxxxxxxxxyz")).toBe(true);
	expect(spirit.match("abcxyxyxyxyxyz")).toBe(true);
});

test("bestMatch", () => {
	const patterns = ["*", "az", "ab?", "ab.", "."];

	expect(Spirit.bestMatch("a", ...patterns)).toBe(".");
	expect(Spirit.bestMatch("az", ...patterns)).toBe("az");
	expect(Spirit.bestMatch("ab", ...patterns)).toBe("ab?");
	expect(Spirit.bestMatch("abc", ...patterns)).toBe("ab.");
	expect(Spirit.bestMatch("baxyz", ...patterns)).toBe("*");
});

test("map", () => {
	const patterns = ["*", "az", "ab?", "ab.", "."];
	const matches = ["a", "az", "ab", "abc", "baxyz"];

	const map = Spirit.map(patterns, matches);

	expect(map.get("*")).toEqual(matches);
	expect(map.get("az")).toEqual(["az"]);
	expect(map.get("ab?")).toEqual(["ab", "abc"]);
	expect(map.get("ab.")).toEqual(["abc"]);
	expect(map.get(".")).toEqual(["a"]);
});
