import fs from 'fs';
import { generate } from './generate';

export type Config = {
  imageWidth: number;
  imageHeight: number;
  totalTokens: number;
  imageBaseUrl: string;
};

export const CONFIG: Config = {
  imageHeight: 500,
  imageWidth: 500,
  totalTokens: 5,
  imageBaseUrl: 'https://tbd.io/',
};

(async function main() {
  try {
    fs.rmdirSync('output', { recursive: true });
  } catch {
    // ignore if folder doesn't exist
  }
  fs.mkdirSync('output');
  const data = await generate(
    CONFIG.totalTokens,
    CONFIG.imageBaseUrl
  );
  fs.writeFileSync('./output/metadata.json', JSON.stringify(data));

  // const result = createDna([]);
  // console.log({ result, traits: result.pickedTraits });
})();
