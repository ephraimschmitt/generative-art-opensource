import { createCanvas, Image, loadImage } from 'canvas';
import { writeFileSync, writeFile } from 'fs';
import path from 'path';
import { CONFIG } from '.';

// TODO: get rid of hard code
const canvas = createCanvas(500, 500);
const ctx = canvas.getContext('2d');

const createImageLayer = (imagePath: string) => {
  return loadImage(path.join(__dirname, `../assets/${imagePath}`));
};

const drawImage = (image: Image) => {
  ctx.drawImage(image, 0, 0, CONFIG.imageWidth, CONFIG.imageHeight);
};

const saveImage = (tokenId: number) => {
  writeFileSync(`./output/${tokenId}.png`, canvas.toBuffer('image/png'));
  ctx.clearRect(0, 0, 500, 500);
};

export { createImageLayer, drawImage, saveImage };
