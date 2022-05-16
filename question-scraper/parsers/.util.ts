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
