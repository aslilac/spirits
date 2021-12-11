import Spirit from "./spirits";

const hey = "hey";
const hi = "hi";
const hello = "hello";

test("Spirit has a correctly calculated strength property", () => {
	const weak = new Spirit("12");
	const medium = new Spirit("1234**");
	const strong = new Spirit("123456***");

	expect(weak.strength).toBe(2);
	expect(medium.strength).toBe(4);
	expect(strong.strength).toBe(6);
});

test("Spirit should match source string", () => {
	const spirit = new Spirit(hi);

	expect(spirit.match(hi)).toBe(true);
	expect(spirit.allMatch(hi, hi, hi, hi, hi)).toBe(true);
});

test("Spirit should not match incorrectly", () => {
	const spirit = new Spirit(hi);

	expect(spirit.match(hey)).toBe(false);
	expect(spirit.allMatch(hi, hi, hi, hi, hey)).toBe(false);
});

test("Nothing matches empty strings", () => {
	const wildcard = new Spirit("*");
	const question = new Spirit("?");

	expect(wildcard.match("")).toBe(false);
	expect(question.match("")).toBe(false);
});

test("Wildcard matches everything", () => {
	const spirit = new Spirit("*");

	expect(spirit.allMatch(hey, hi, hello)).toBe(true);
});

test("allMatch works correctly", () => {
	const spirit = new Spirit("ab*cd");

	expect(spirit.allMatch("abbcd", "abccd", "abcd")).toBe(true);

	expect(spirit.allMatch("abbcd", "abccd", "acbd")).toBe(false);
});

test("Only matches are returned from findMatches", () => {
	const spirit = new Spirit("ab*cd");

	expect(spirit.findMatches("abbcd", "abccd", "abcd", "acbd", "abbcde")).toEqual([
		"abbcd",
		"abccd",
		"abcd",
	]);
});

test("Single characters are filled in (begin, middle, and end)", () => {
	const h_ = new Spirit("h.");
	const h_y = new Spirit("h.y");
	const _ello = new Spirit(".ello");

	expect(h_.match("h")).toBe(false);
	expect(h_.match(hi)).toBe(true);
	expect(h_y.match(hey)).toBe(true);
	expect(_ello.match(hello)).toBe(true);
});

test("Single characters only fill in one character", () => {
	const h_ = new Spirit("h.");

	expect(h_.match(hey)).toBe(false);
});

test("Question marks are optional, but only at the end", () => {
	const required = new Spirit("ab?de");
	const optional = new Spirit("abcd?");

	expect(required.match("abde")).toBe(false);
	expect(required.match("abcde")).toBe(true);
	expect(required.match("abcdef")).toBe(false);
	expect(optional.match("abcd")).toBe(true);
	expect(optional.match("abcde")).toBe(true);
	expect(optional.match("abcdef")).toBe(false);
});

test("Escaped wildcards are treated properly", () => {
	const escaped = new Spirit("a \\* \\.");

	expect(escaped.match("a * .")).toBe(true);
	expect(escaped.match("a xx x")).toBe(false);
});

test("Complex cases are handled correctly", () => {
	const spirit = new Spirit("abc*xyz");

	expect(spirit.match("abcdefghi")).toBe(false);
	expect(spirit.match("abcxxxxxxxxyz")).toBe(true);
});

test("Static match works correctly", () => {
	expect(Spirit.match("abc*xyz", "abcdefgxyz")).toBe(true);
});

test("Static allMatch works correctly", () => {
	expect(Spirit.allMatch("ab*cd", "abbcd", "abccd", "abcd")).toBe(true);
	expect(Spirit.allMatch("ab*cd", "abbcd", "abccd", "acbd")).toBe(false);
});

test("Static findMatches works correctly", () => {
	expect(
		Spirit.findMatches("ab*cd", "abbcd", "abccd", "abcd", "acbd", "abbcde"),
	).toEqual(["abbcd", "abccd", "abcd"]);
});

test("Static bestMatch should work correctly", () => {
	const patterns = ["*", "az", "ab?", "ab.", "."];

	expect(Spirit.bestMatch("a", ...patterns)).toBe(".");
	expect(Spirit.bestMatch("az", ...patterns)).toBe("az");
	expect(Spirit.bestMatch("ab", ...patterns)).toBe("ab?");
	expect(Spirit.bestMatch("abc", ...patterns)).toBe("ab.");
	expect(Spirit.bestMatch("baxyz", ...patterns)).toBe("*");
});

test("Static map should work correctly", () => {
	const patterns = ["*", "az", "ab?", "ab.", "."];
	const matches = ["a", "az", "ab", "abc", "baxyz"];

	const map = Spirit.map(patterns, matches);

	expect(map.get("*")).toEqual(matches);
	expect(map.get("az")).toEqual(["az"]);
	expect(map.get("ab?")).toEqual(["ab", "abc"]);
	expect(map.get("ab.")).toEqual(["abc"]);
	expect(map.get(".")).toEqual(["a"]);
});
