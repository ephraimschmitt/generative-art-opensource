const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const {
  width,
  height,
  description,
  baseImageUri,
  editionSize,
  startEditionFrom,
  endEditionAt,
  rarityWeights,
} = require('./input/config.js');
const console = require('console');
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `./output/${_editionCount}.png`,
    canvas.toBuffer('image/png')
  );
};

const signImage = (_sig) => {
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30pt Courier';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(_sig, 40, 40);
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, 85%)`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = genColor();
  ctx.fillRect(0, 0, width, height);
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  return {
    dna: _dna.join(''),
    name: `#${_edition}`,
    description: description,
    image: `${baseImageUri}/${_edition}`,
    edition: _edition,
    date: dateTime,
    attributes: [],
  };
};

const generateAttribute = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  return {
    name: selectedElement.name,
    rarity: selectedElement.rarity,
  };
};

const loadLayerImg = async (_layer) => {
  const image = await loadImage(`${_layer.selectedElement.path}`);
  return { layer: _layer, loadedImage: image };
};

const drawElement = (_element) => {
  ctx.drawImage(
    _element.loadedImage,
    _element.layer.position.x,
    _element.layer.position.y,
    _element.layer.size.width,
    _element.layer.size.height
  );
};

const constructLayerToDna = (_dna = [], _layers = [], _rarity) => {
  return _layers.map((layer, index) => ({
    position: layer.position,
    size: layer.size,
    selectedElement: layer.elements[_rarity][_dna[index]],
  }));
};

const getRarity = (_editionCount) => {
  return (
    rarityWeights.find(
      (rarityWeight) =>
        _editionCount >= rarityWeight.from && _editionCount <= rarityWeight.to
    )?.value ?? ''
  );
};

const isDnaUnique = (_dnaList = [], _dna = []) => {
  return !_dnaList.find((i) => i.join('') === _dna.join(''));
};

const createDna = (_layers, _rarity) => {
  return _layers.map((layer) =>
    Math.floor(Math.random() * layer.elements[_rarity].length)
  );
};

const startCreating = async (layers) => {
  const totalMetadata = [];
  const dnaList = [];
  let editionCount = startEditionFrom;
  while (editionCount <= endEditionAt) {
    console.log(editionCount);

    let rarity = getRarity(editionCount);
    console.log(rarity);

    let newDna = createDna(layers, rarity);
    console.log(dnaList);

    if (isDnaUnique(dnaList, newDna)) {
      let results = constructLayerToDna(newDna, layers, rarity);
      let loadedElements = results.map((layer) => loadLayerImg(layer));

      const elementArray = await Promise.all(loadedElements);

      ctx.clearRect(0, 0, width, height);
      drawBackground();
      const attributes = elementArray.map((element) => {
        drawElement(element);
        return generateAttribute(element);
      });
      signImage(`#${editionCount}`);
      saveImage(editionCount);

      const metadata = addMetadata(newDna, editionCount);
      metadata.attributes = attributes;
      totalMetadata.push(metadata);
      console.log(`Created edition: ${editionCount} with DNA: ${newDna}`);
      dnaList.push(newDna);

      editionCount++;
    } else {
      console.log('DNA exists!');
    }
  }
  return totalMetadata;
};

module.exports = {
  saveImage,
  signImage,
  genColor,
  drawBackground,
  loadLayerImg,
  constructLayerToDna,
  startCreating,
  getRarity,
  isDnaUnique,
  createDna,
};
