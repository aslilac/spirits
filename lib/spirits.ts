/**
 * Spirit patterns support three special characters:
 * - `*` matches any number (including zero) of any variety of characters
 * - `.` matches any single character
 * - `?` matches any single character, and is optional when at the end of a pattern
 *
 * These characters can be escaped by prefixing them with a backslash.
 * All other characters are safe to be included anywhere in the string.
 */
type Pattern =
  | Spirit
  | string;

export default class Spirit {
  /** The string used to create the Spirit. */
  private readonly pattern: string;
  /** Represents how specific the pattern is. Similar to length, but not quite the same. */
  readonly strength: number;

  /**
   * @param pattern The string to use as the pattern.
   */
  constructor( pattern: string ) {
    this.pattern = pattern;
    this.strength = pattern.length;

    // Wildcards aren't very specific at all
    for ( let i = 0; i < pattern.length; i++ ) {
      if ( pattern.charAt( i ) === '*' ) this.strength--;
    }

    // Question marks at the end are optional, so they are very specific
    if ( pattern.endsWith( '?' ) ) this.strength--;
  }

  /**
   * Can be used as an alternate way to construct a [[Spirit]].
   * It can be useful for cases where you might have a string or a Spirit.
   * @param pattern The string to use as the pattern.
   */
  static createSpirit( pattern: Pattern ): Spirit {
    return pattern instanceof Spirit
      ? pattern
      : new Spirit( pattern );
  }

  /**
   * Checks if a string matches against the pattern.
   * @param match The string to compare to the pattern.
   */
  match( match: string ): boolean {
    const pattern = this.pattern;
    let patternPosition = 0;
    let matchPosition = 0;
    let resumeWildcardAt = null;
    // let resumeWildcardAt = [
    //   patternPosition,
    //   matchPosition
    // ];

    // If no match was passed or the string is empty, return false
    if ( !match ) return false;

    for (
      ; // Needs to be initialized above so that it doesn't exit scope
      patternPosition < pattern.length && matchPosition < match.length;
      matchPosition++
    ) {
      const [ current, next ] = this.pattern.substr( patternPosition );

      switch ( current ) {
        case '*':
          if ( next == null ) return true;
          else if ( next === match.charAt( matchPosition ) ) {
            resumeWildcardAt = [ patternPosition, matchPosition ];
            patternPosition += 2;
          }
          break;
        case '?':
        case '.':
          patternPosition++;
          break;
        case '\\':
          if ( next === match.charAt( matchPosition ) )
            patternPosition += 2;
          break;
        default:
          if ( current === match.charAt( matchPosition ) )
            patternPosition++;
          else if ( resumeWildcardAt )
            [ patternPosition, matchPosition ] = resumeWildcardAt;
          else return false;
      }
    }

    if ( patternPosition === pattern.length - 1 && pattern.charAt( patternPosition ) === '?' ) {
      patternPosition++;
    }

    return patternPosition === pattern.length && matchPosition === match.length;
  }

  /**
   * Checks if multiple strings match against the pattern. Only returns true
   * if all strings match.
   * @param matches The strings to compare to the pattern.
   */
  allMatch( ...matches: string[] ): boolean {
    return matches.every( each => this.match( each ) );
  }

  /**
   * Allows you to quickly test many strings against the pattern, and
   * see which ones match it.
   * @param match The strings to compare to the pattern.
   * @returns All of the strings that matched against the pattern.
   */
  findMatches( ...matches: string[] ): string[] {
    return matches.filter( each => this.match( each ) );
  }

  /**
   * Returns the pattern string that was used to construct the [[Spirit]].
   */
  toString(): string {
    return this.pattern;
  }

  /**
   * Provides a way to check if a string matches a pattern without
   * constructing a [[Spirit]].
   * @param pattern The pattern to compare the string against.
   * @param match The string to compare to the pattern.
   */
  static match( pattern: Pattern, match: string ): boolean {
    return pattern instanceof Spirit
      ? pattern.match( match )
      : new Spirit( pattern ).match( match );
  }

  /**
   * Provides a way to check if multiple string match a pattern without
   * constructing a [[Spirit]].
   * @param pattern The pattern to compare the strings against.
   * @param matches The strings to compare to the pattern.
   */
  static allMatch( pattern: Pattern, ...matches: string[] ): boolean {
    return Spirit.createSpirit( pattern ).allMatch( ...matches );
  }

  /**
   * Provides a way to check which strings match a pattern without
   * constructing a [[Spirit]].
   * @param pattern The pattern to compare the strings against.
   * @param matches The strings to compare to the pattern.
   */
  static findMatches( pattern: Pattern, ...matches: string[] ): string[] {
    return Spirit.createSpirit( pattern ).findMatches( ...matches );
  }

  /**
   * Returns the [[Spirit]] or pattern string that best matches the target string.
   * In the case of a tie, the spirit that was passed to the function first
   * will be returned.
   * @param target The string the test against the patterns.
   * @param match The patterns that will be tested against the string.
   */
  static bestMatch( match: string, ...patterns: Array<Pattern> ): Pattern {
    // We have these as seperate variables, because we return the pattern
    // that was given to us, which could be a Spirit or just a string.
    let best = null;
    let strength = 0;

    for ( const pattern of patterns ) {
      const spirit = Spirit.createSpirit( pattern );
      if ( !best || spirit.strength > strength && spirit.match( match ) ) {
        best = pattern;
        strength = spirit.strength;
      }
    }

    return best;
  }

  /**
   * Returns a map using the pattern as the key and an array of matches
   * as the value. If the pattern given was a string, the key will be a string.
   * If the pattern was a spirit, then that same spirit will be the key.
   * @param patterns An array of pattern strings or Spirits to check against
   * @param matches An array of strings that will be checked against the patterns
   */
  static map( patterns: Array<Pattern>, matches: string[] ): Map<Pattern, string[]> {
    return new Map(
      patterns.map( pattern =>
        [ pattern, Spirit.createSpirit( pattern ).findMatches( ...matches ) ]
      )
    );
  }
}

