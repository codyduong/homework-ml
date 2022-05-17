export type ContentType = string;

export type Data = Array<
  | {
      type: 'info';
      content: ContentType;
    }
  | {
      type: 'prompt_frq';
      content: ContentType;
      answer: ContentType;
    }
  | {
      type: 'prompt_mc';
      content: string;
      answers: ContentType[];
      non_answers: ContentType[];
    }
>;

export type Result =
  | {
      generatedBy: string;
      data: Data[];
    }
  | {
      generatedBy: string;
      errors: unknown;
    };

export type AlphaStringSingularLower = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
export type AlphaStringSingularUpper = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'

export type AlphaStringSingular = AlphaStringSingularLower | AlphaStringSingularUpper