export default function getMixArray(arr:Array<string>) :Array<string> {
  const max = arr.length;
  const newArr = arr;
  for (let i = 0; i < max; i += 1) {
    const newIndex = Math.floor(Math.random() * max);
    const newItem = newArr[newIndex];
    newArr[newIndex] = newArr[i];
    newArr[i] = newItem;
  }
  return newArr;
}
