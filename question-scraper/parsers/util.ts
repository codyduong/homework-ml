// Helper functions for parsing down DOM

// Deeply navigates down a node until there are no children, then returning the text content
// export function returnTextStringsInChildNodesDeep(
//   nodes: NodeListOf<ChildNode>,
//   remover?: (_: ChildNode) => boolean
// ): string[] {
//   let texts: string[] = [];
//   for (const child of nodes) {
//     if (remover && remover(child)) {
//       continue;
//     }

//     if (child.childNodes.length > 0) {
//       texts = [
//         ...texts,
//         ...returnTextStringsInChildNodesDeep(child.childNodes, remover),
//       ];
//     } else {
//       child.textContent && texts.push(child.textContent);
//     }
//   }

//   return texts;
// }

// Taken from
// /*! https://mths.be/quoted-printable v<%= version %> by @mathias | MIT license */

// There are some problems with the decoder from quoted-printable,
// namely:
// =F0=9D=90=B0 should be 𝐰
// but instead we get ð°
// This is because we need to account for butted =XX=XX codes.
export function quotedPrintableDecode(input: string) {
  return (
    input
      // https://tools.ietf.org/html/rfc2045#section-6.7, rule 3:
      // “Therefore, when decoding a `Quoted-Printable` body, any trailing white
      // space on a line must be deleted, as it will necessarily have been added
      // by intermediate transport agents.”
      .replace(/[\t\x20]$/gm, '')
      // Remove hard line breaks preceded by `=`. Proper `Quoted-Printable`-
      // encoded data only contains CRLF line  endings, but for compatibility
      // reasons we support separate CR and LF too.
      .replace(/=(?:\r\n?|\n|$)/g, '')
      // Decode escape sequences of the form `=XX` where `XX` is any
      // combination of two hexidecimal digits. For optimal compatibility,
      // lowercase hexadecimal digits are supported as well. See
      // https://tools.ietf.org/html/rfc2045#section-6.7, note 1.
      .replace(/(=[a-fA-F0-9]{2})+/g, function ($0) {
        return Buffer.from($0.replace(/=/g, ''), 'hex').toString();
      })
  );
}

// Can provide custom transformer based on value
type rangeStep = number | ((v: number) => number);

export function range(start: number): number[];
export function range(end: number): number[];
export function range(start: number, end: number): number[];
export function range(start: number, end: number, step: number): number[];
export function range(
  options:
    | {
        start: number;
        end?: number;
        step?: rangeStep;
      }
    | {
        start?: number;
        end: number;
        step?: rangeStep;
      }
): number[];
export function range(
  start:
    | number
    | {
        start: number;
        end?: number;
        step?: rangeStep;
      }
    | {
        start?: number;
        end: number;
        step?: rangeStep;
      },
  end?: number,
  step: rangeStep = 1
): number[] {
  const startIsNumber = typeof start === 'number';

  const endActual = startIsNumber
    ? end ?? start
    : 'end' in start
    ? start.end ?? 0
    : 0;

  const startActual = startIsNumber ? (end ? start : 0) : start.start ?? 0;

  const startStep = startIsNumber
    ? typeof step === 'function'
      ? step
      : (x: number) => x * (endActual < startActual ? -Math.abs(step) : step)
    : start.step;

  const stepActual =
    typeof startStep === 'function'
      ? startStep
      : (x: number) =>
          x *
          (endActual < startActual
            ? -Math.abs(startStep ?? 1)
            : startStep ?? 1);

  console.log(startActual, endActual, stepActual(1));

  const returnArray: number[] = [];

  for (
    let i = 0;
    endActual < startActual
      ? stepActual(i) + startActual > endActual
      : stepActual(i) + startActual < endActual;
    i++
  ) {
    returnArray.push(stepActual(i) + startActual);
  }

  return returnArray;
}
