// https://www.w3.org/TR/css-syntax-3/

export type UrlMatch = {
  index: number;
  length: number;
  url: string;
};

export function* scanCssUrls(cssText: string): Generator<UrlMatch> {
  const enum CharCode {
    LParen = /* "(" */ 0x0028,
    RParen = /* ")" */ 0x0029,
    SQuote = /* `'` */ 0x0027,
    DQuote = /* `"` */ 0x0022,
  }

  const enum State {
    Initial,
    Url,
    Paren,
    QBody,
    UBody,
    BodyEnd,
  }

  const { length } = cssText;

  let state = State.Initial;
  let index = 0;
  let start = 0;
  let bodyStart = 0;
  let bodyEnd = 0;
  let quot = 0;

  while (index < length) {
    if (state === State.Initial) {
      const i = cssText.indexOf("url", index);
      if (i === -1) {
        return;
      }
      state = State.Url;
      start = i;
      index = i + 3;
      continue;
    }

    const charCode = cssText.charCodeAt(index);

    const isLinebreak =
      charCode === 0x000a || charCode === 0x000d || charCode === 0x000c;
    const isWhitespace =
      charCode === 0x0020 || charCode === 0x0009 || isLinebreak;

    switch (state) {
      case State.Url:
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
          bodyStart = index + 1;
          break;
        }
        state = State.UBody;
        quot = 0;
        bodyStart = index;
        break;
      case State.QBody:
        if (isLinebreak) {
          state = State.Initial;
          break;
        }
        if (charCode === quot) {
          state = State.BodyEnd;
          bodyEnd = index;
          break;
        }
        break;
      case State.UBody:
        if (isWhitespace) {
          state = State.BodyEnd;
          bodyEnd = index;
          break;
        }
        if (charCode === CharCode.RParen) {
          state = State.Initial;
          bodyEnd = index;
          if (bodyEnd > bodyStart) {
            yield {
              index: start,
              length: index - start + 1,
              url: cssText.substring(bodyStart, bodyEnd),
            };
          }
          break;
        }
        break;
      case State.BodyEnd:
        if (isWhitespace) {
          break;
        }
        if (charCode === CharCode.RParen) {
          state = State.Initial;
          if (bodyEnd > bodyStart) {
            yield {
              index: start,
              length: index - start + 1,
              url: cssText.substring(bodyStart, bodyEnd),
            };
          }
          break;
        }
        state = State.Initial;
        break;
    }
    index += 1;
  }
}
