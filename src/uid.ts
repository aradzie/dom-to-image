export type Uid = () => string;

export const makeUid: (length?: number) => Uid = (length = 8) => {
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
  const empty = new Array(length).fill(0);
  const fn = () => alphabet[Math.floor(Math.random() * alphabet.length)];
  return () => String.fromCodePoint(...empty.map(fn));
};

export const uid: Uid = makeUid();
