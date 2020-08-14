export function chunkify(array, itemsPerChunk) {
  const chunks = [];
  let currentChunk = [];
  array.forEach((item, i) => {
    if (i % itemsPerChunk === 0 && i > 0) {
      chunks.push(currentChunk);
      currentChunk = [item];
    } else {
      currentChunk.push(item);
    }
  });
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  return chunks;
}
