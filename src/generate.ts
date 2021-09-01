import BN from 'bn.js';
import { createDna } from './dnaUtils';
import { createImageLayer, drawImage, saveImage } from './imageUtils';

const generate = async (
  totalTokens: number,
  imageBaseUrl: string
) => {
  let allDna: BN[] = [];
  let editionCount = 0;
  const metadata: Metadata[] = [];

  while (editionCount <= totalTokens) {
    // get rarity and create dna

    const dnaResult = createDna(allDna);
    allDna = [...dnaResult.allDna];

    const layerPromises = dnaResult.pickedTraits.map((trait) =>
      createImageLayer(trait.path)
    );

    const images = await Promise.all(layerPromises);

    // render layers to image

    images.forEach((image) => drawImage(image));
    saveImage(editionCount);

    // create attributes
    const attributes: AttributeMeta[] = dnaResult.pickedTraits.map((trait) => {
      return { trait_type: trait.gene, value: trait.name };
    });

    metadata.push({ image: `${imageBaseUrl}${editionCount}`, attributes });

    editionCount++;
  }
  return metadata;
};

export { generate };
