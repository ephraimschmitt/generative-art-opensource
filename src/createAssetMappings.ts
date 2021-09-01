import { readdirSync } from 'fs';
import path from 'path';
import { upperFirst } from 'lodash';
import fs from 'fs';

(function main() {
  const result = readdirSync(path.join(__dirname, '../assets'), {
    withFileTypes: true,
  })
    .filter((d) => d.isDirectory())
    .map((directory, index) => {
      return {
        gene: directory.name,
        id: index + 1,
        images: readdirSync(
          path.join(__dirname, `../assets/${directory.name}`)
        ),
      };
    })
    .map((geneData) => {
      const geneName = formatName(geneData.gene.split('_')[0]);
      const geneOrder = Number(geneData.gene.split('_')[1]);
      const traits = geneData.images.map((imageInfo, index) => ({
        ...extractTraitInfo(imageInfo, geneData.gene),
        id: index + 1,
        gene: geneName
      }));
      return {
        id: geneData.id,
        name: geneName,
        order: geneOrder,
        traits: traits,
      };
    });

  fs.writeFileSync('./genes/genes.json', JSON.stringify(result));
})();

function extractTraitInfo(imageInfo: string, geneName: string) {
  const name = formatName(imageInfo.split('_')[0]);
  const weight = Number(imageInfo.split('_')[1].slice(0, -4));
  return { name, weight, path: `${geneName}/${imageInfo}` };
}

function formatName(name: string): string {
  return name
    .replace('-', ' ')
    .split(' ')
    .map((word) => upperFirst(word))
    .join(' ');
}
