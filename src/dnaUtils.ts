import Gene from './models/Gene';
import Trait from './models/Trait';
import { fill } from 'lodash';
import BN from 'bn.js';

const genes = require('../genes/genes.json');

type CreateDNASig = (d: BN[]) => CreateDNAResult;
export type CreateDNAResult = {
  allDna: BN[];
  pickedTraits: Trait[];
};

const slotMultiplier = new BN(256, 10);
const dnaMask = new BN(255, 10);

const createDna: CreateDNASig = (allDna: BN[]) => {
  let dnaHash = new BN(0, 10);

  const pickedTraits = genes.map((gene: Gene) => {
    const trait = pickTrait(gene.traits);
    const traitHash = createTraitHash(gene.id, trait.id);
    dnaHash = dnaHash.add(traitHash);
    return trait;
  });

  const dnaUnique = !allDna.find((dna) => dna.eq(dnaHash));
  
  return dnaUnique
    ? { allDna: [...allDna, dnaHash], pickedTraits }
    : createDna(allDna);
};

const pickTrait = (traits: Trait[]) => {
  const adjustedTraits = traits.flatMap((trait) =>
    fill(Array(trait.weight), trait)
  );
  const picker = Math.floor(Math.random() * adjustedTraits.length);
  console.log({ picker, pickedTrait: adjustedTraits[picker] });
  return adjustedTraits[picker];
};

const createTraitHash = (geneId: number, traitId: number) => {
  const slot = slotMultiplier.pow(new BN(geneId - 1, 10));
  return slot.mul(new BN(traitId, 10));
};

const extraitTraitFromHash = (geneId: number, dnaHash: BN) => {
  const slot = slotMultiplier.pow(new BN(geneId - 1, 10));
  const mask = dnaMask.mul(slot);
  const extractedSlot = dnaHash.and(mask);

  return extractedSlot.div(slot).toNumber();
};

export { createDna, extraitTraitFromHash };
