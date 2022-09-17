export type Uid = () => string;

export const makeUid: () => Uid = () => {
  let index = 0;

  const alphabet: number[] = [];
  for (let i = 0; i < 10; i++) {
    alphabet.push(/* '0' */ 0x0030 + i);
  }
  for (let i = 0; i < 26; i++) {
    alphabet.push(/* 'A' */ 0x0041 + i);
  }
  for (let i = 0; i < 26; i++) {
    alphabet.push(/* 'a' */ 0x0061 + i);
  }

  const randomId = (): string => {
    return String.fromCodePoint(
      ...new Array(8).map(
        () => alphabet[Math.floor(Math.random() * alphabet.length)],
      ),
    );
  };

  return (): string => {
    return `u-${randomId()}-${index++}`;
  };
};

export const uid: Uid = makeUid();
