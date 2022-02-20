interface ConnectOrCreate {
  where: { name: string };
  create: { name: string };
}

export const handleExtractHashtags = (caption: string): ConnectOrCreate[] | undefined => {
  let connectOrCreateArray: ConnectOrCreate[] | undefined = undefined;
  const matchedHashtags: RegExpMatchArray | null = caption?.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g);
  connectOrCreateArray = matchedHashtags?.map((hashtag: string) => ({ where: { name: hashtag }, create: { name: hashtag } }));
  return connectOrCreateArray;
};
