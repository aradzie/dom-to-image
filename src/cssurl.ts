// https://www.w3.org/TR/css-syntax-3/

export type UrlMatch = {
  index: number;
  url: string;
};

export function* scanUrls(text: string): Generator<UrlMatch> {
  const enum CharCode {
    LParen = /* "(" */ 0x0028,
    RParen = /* ")" */ 0x0029,
    SQuote = /* `'` */ 0x0027,
    DQuote = /* `"` */ 0x0022,
  }

  const enum State {
    Initial,
    Url, // after "url"
    Paren, // after "("
    QBody, // after opening ' or "
    QBodyEnd, // after closing ' or "
    UBody, // unquoted body
  }

  let state = State.Initial;
  let index = 0;
  let start = 0;
  let end = 0;
  let quot = 0;
  const { length } = text;
  while (index < length) {
    if (state === State.Initial) {
      const i = text.indexOf("url", index);
      if (i === -1) {
        return;
      }
      index = i + 3;
      state = State.Url;
      continue;
    }

    const charCode = text.charCodeAt(index);
    const isWhitespace =
      charCode === 0x0020 ||
      charCode === 0x0009 ||
      charCode === 0x000a ||
      charCode === 0x000d;
    switch (state) {
      case State.Url:
        if (isWhitespace) {
          break;
        }
        if (charCode === CharCode.LParen) {
          state = State.Paren;
          break;
        }
        state = State.Initial;
        break;
      case State.Paren:
        if (isWhitespace) {
          break;
        }
        if (charCode === CharCode.RParen) {
          state = State.Initial;
          break;
        }
        if (charCode === CharCode.SQuote || charCode === CharCode.DQuote) {
          state = State.QBody;
          quot = charCode;
          start = index + 1;
          break;
        }
        state = State.UBody;
        quot = 0;
        start = index;
        break;
      case State.QBody:
        if (charCode === quot) {
          state = State.QBodyEnd;
          end = index;
          break;
        }
        break;
      case State.UBody:
        if (isWhitespace) {
          break;
        }
        if (charCode === CharCode.RParen) {
          state = State.Initial;
          if (end > start) {
            yield { index: start, url: text.substring(start, end) };
          }
          break;
        }
        end = index + 1;
        break;
      case State.QBodyEnd:
        if (isWhitespace) {
          break;
        }
        if (charCode === CharCode.RParen) {
          state = State.Initial;
          if (end > start) {
            yield { index: start, url: text.substring(start, end) };
          }
          break;
        }
        state = State.Initial;
        break;
    }
    index += 1;
  }
  return true;
}
