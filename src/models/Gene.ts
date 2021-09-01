import Trait from './Trait';

interface Gene {
  id: number;
  name: string;
  order: number;
  traits: Trait[];
}

export default Gene;
