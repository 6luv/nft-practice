interface Window {
  ethereum: any;
}

interface INftMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

interface ISaleNftMetadata extends INftMetadata {
  price: bigint;
  tokenOwner: string;
}
