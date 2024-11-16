export type Pattern = Spirit | string;

/**
 * Spirit patterns support three special characters:
 * - `*` matches any number (including zero) of any variety of characters
 * - `.` matches any single character
 * - `?` matches any single character, and is optional when at the end of a pattern
 *
 * These characters can be escaped by prefixing them with a backslash.
 * All other characters are safe to be included anywhere in the string.
 */
export class Spirit {
	/** The string used to create the Spirit. */
	readonly pattern: string;
	/**
	 * Represents how specific the pattern is. For example, a wildcard (`*`) is
	 * not very specific, a single-character wildcard (`.`) is a little more
	 * specific, but neither is as specific as an exact character.
	 * */
	readonly strength: number;

	/**
	 * @param pattern The string to use as the pattern.
	 */
	constructor(pattern: string) {
		this.pattern = pattern;
		this.strength = pattern.length;

		for (let i = 0; i < pattern.length; i++) {
			// Wildcards aren't very specific at all.
			if (pattern.charAt(i) === "*") this.strength--;
			// A single-character wildcard is a little more specific.
			if (pattern.charAt(i) === ".") this.strength -= 0.5;
			// An escape backslash doesn't count, but the character after it does.
			if (pattern.charAt(i) === "\\") i++;
		}

		// Question marks at the end are optional, so they are very specific
		if (pattern.endsWith("?")) this.strength--;
	}

	/**
	 * Can be used as an alternate way to construct a {@link Spirit}.
	 * It can be useful for cases where you might have a string or a Spirit.
	 * @param pattern The string to use as the pattern.
	 */
	static from(pattern: Pattern): Spirit {
		return pattern instanceof Spirit ? pattern : new Spirit(pattern);
	}

	/**
	 * Checks if a string matches the spirit.
	 * @param match The string to compare to the pattern.
	 */
	match(match: string): boolean {
		const pattern = this.pattern;
		let patternPosition = 0;
		let matchPosition = 0;
		let resumeWildcardAt: [number, number] | null = null; // [patternPosition, matchPosition]

		// If no match was passed or the string is empty, return false
		if (!match) return false;

		for (
			;
			// Needs to be initialized above so that it doesn't exit scope
			patternPosition < pattern.length && matchPosition < match.length;
			matchPosition++
		) {
			const [current, next] = this.pattern.substring(patternPosition);

			switch (current) {
				case "*":
					if (next == undefined) return true;
					else if (next === match.charAt(matchPosition)) {
						resumeWildcardAt = [patternPosition, matchPosition];
						patternPosition += 2;
					}
					break;
				case "?":
				case ".":
					patternPosition++;
					break;
				case "\\":
					if (next === match.charAt(matchPosition)) patternPosition += 2;
					break;
				default:
					if (current === match.charAt(matchPosition)) patternPosition++;
					else if (resumeWildcardAt)
						[patternPosition, matchPosition] = resumeWildcardAt;
					else return false;
			}
		}

		if (
			patternPosition === pattern.length - 1 &&
			pattern.charAt(patternPosition) === "?"
		) {
			patternPosition++;
		}

		return patternPosition === pattern.length && matchPosition === match.length;
	}

	/**
	 * Checks that all strings match the spirit.
	 * @param matches The strings to compare to the pattern.
	 */
	allMatch(...matches: string[]): boolean {
		return matches.every((each) => this.match(each));
	}

	/**
	 * Allows you to quickly check many strings at once, and returns all of the
	 * strings that match the spirit.
	 * @param match The strings to compare to test.
	 * @returns all of the strings that matched.
	 */
	findMatches(...matches: string[]): string[] {
		return matches.filter((each) => this.match(each));
	}

	/**
	 * @returns the pattern string that was used to construct the {@link Spirit}.
	 */
	toString(): string {
		return this.pattern;
	}

	/**
	 * Checks if a string matches the spirit.
	 * @param pattern The pattern to compare the string against.
	 * @param match The string to compare to the pattern.
	 */
	static match(pattern: Pattern, match: string): boolean {
		return Spirit.from(pattern).match(match);
	}

	/**
	 * Checks that all strings match the spirit.
	 * @param pattern The pattern to compare the strings against.
	 * @param matches The strings to compare to the pattern.
	 */
	static allMatch(pattern: Pattern, ...matches: string[]): boolean {
		return Spirit.from(pattern).allMatch(...matches);
	}

	/**
	 * Allows you to quickly check many strings at once.
	 * @param pattern The pattern to compare the strings against.
	 * @param matches The strings to compare to the pattern.
	 * @returns all of the strings that match the spirit.
	 */
	static findMatches(pattern: Pattern, ...matches: string[]): string[] {
		return Spirit.from(pattern).findMatches(...matches);
	}

	/**
	 * Finds the spirit that most specifically matches the given string, and
	 * returns it. In the case of a tie, the spirit that was passed to the
	 * function first will be returned.
	 * @param match The string to test against the patterns.
	 * @param patterns The patterns that will be tested against the string.
	 * @returns the pattern string that best matches. To make comparisions easier,
	 * it does _not_ return a {@link Spirit} object.
	 */
	static bestMatch(match: string, ...patterns: Pattern[]): string | undefined {
		// We have these as seperate variables, because we return the pattern
		// that was given to us, which could be a Spirit or just a string.
		let best: Spirit | undefined = undefined;

		for (const pattern of patterns) {
			const spirit = Spirit.from(pattern);
			if (!best || (spirit.strength > best.strength && spirit.match(match))) {
				best = spirit;
			}
		}

		return best?.toString();
	}

	/**
	 * @param patterns Pattern strings or Spirits to check against
	 * @param matches Strings that will be checked against the patterns
	 * @returns a map using the pattern string as the key and an array of matches
	 * as the value. To avoid equality issues when trying to get matches from the
	 * result, it does _not_ use any {@link Spirit} objects as keys.
	 */
	static map(
		patterns: Pattern[],
		matches: Iterable<string>,
	): Map<string, string[]> {
		return new Map(
			patterns.map((pattern) => [
				pattern.toString(),
				Spirit.from(pattern).findMatches(...matches),
			]),
		);
	}
}
