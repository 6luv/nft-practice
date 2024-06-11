import {
  Box,
  Button,
  Flex,
  GridItem,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Contract, JsonRpcSigner, formatEther } from "ethers";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

interface SaleNftCardProps {
  tokenId: number;
  tokenIds: number[];
  setTokenIds: Dispatch<SetStateAction<number[]>>;
  saleContract: Contract | null;
  mintContract: Contract | null;
  signer: JsonRpcSigner | null;
}

const SaleNftCard: FC<SaleNftCardProps> = ({
  tokenId,
  tokenIds,
  setTokenIds,
  saleContract,
  mintContract,
  signer,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nftMetadata, setNftMetadata] = useState<ISaleNftMetadata>();

  const getNftMetadata = async () => {
    try {
      const tokenURI = await mintContract?.tokenURI(tokenId);
      const metadataResponse = await axios.get<INftMetadata>(tokenURI);
      const priceResponse = await saleContract?.getTokenPrice(tokenId);
      const ownerResponse = await mintContract?.ownerOf(tokenId);

      setNftMetadata({
        ...metadataResponse.data,
        price: priceResponse,
        tokenOwner: ownerResponse,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onClickPurchaseNft = async () => {
    try {
      setIsLoading(true);
      const response = await saleContract?.purchaseNft(tokenId, {
        value: nftMetadata?.price,
      });

      await response.wait();
      const temp = tokenIds.filter((v) => {
        if (v !== tokenId) {
          return v;
        }
      });

      setTokenIds(temp);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!mintContract || !saleContract || !tokenId) return;

    getNftMetadata();
  }, [mintContract, saleContract, tokenId]);

  useEffect(() => console.log(nftMetadata), [nftMetadata]);

  return (
    <GridItem display="flex" flexDir="column" alignItems="center">
      {nftMetadata ? (
        <>
          <Image src={nftMetadata.image} alt={nftMetadata.name} />
          <Popover>
            <PopoverTrigger>
              <Button mt={4} fontSize={24} fontWeight="semibold" variant="link">
                {nftMetadata.name}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>{nftMetadata.description}</PopoverBody>
            </PopoverContent>
          </Popover>
          <Text fontWeight="semibold" fontSize={20} mt={2}>
            Traits
          </Text>
          <Flex flexWrap="wrap" mt={4} gap={2} justifyContent="center">
            {nftMetadata.attributes?.map((attribute, i) => (
              <Box key={i} border="1px solid green" p={1} rounded="md">
                <Text borderBottom="1px solid green">
                  {attribute.trait_type}
                </Text>
                <Text>{attribute.value}</Text>
              </Box>
            ))}
          </Flex>
          <Flex mt={4} alignItems="center">
            {nftMetadata.price ? (
              <>
                <Text>{formatEther(nftMetadata.price)} ETH</Text>
                <Button
                  ml={2}
                  colorScheme="pink"
                  onClick={onClickPurchaseNft}
                  isDisabled={
                    isLoading || nftMetadata.tokenOwner === signer?.address
                  }
                  isLoading={isLoading}
                  loadingText="구매중"
                >
                  구매
                </Button>
              </>
            ) : (
              ""
            )}
          </Flex>
        </>
      ) : (
        <></>
      )}
    </GridItem>
  );
};

export default SaleNftCard;
