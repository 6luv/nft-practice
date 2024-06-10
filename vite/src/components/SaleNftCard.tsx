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
import { Contract, JsonRpcSigner, formatEther } from "ethers";
import { FC, useEffect, useState } from "react";

interface SaleNftCardProps {
  nftMetadata: NftMetadata;
  tokenId: number;
  saleContract: Contract | null;
  mintContract: Contract | null;
  signer: JsonRpcSigner | null;
  getOnSaleTokens: () => Promise<void>;
  getNftMetadata: () => Promise<void>;
}

const SaleNftCard: FC<SaleNftCardProps> = ({
  nftMetadata,
  tokenId,
  saleContract,
  mintContract,
  signer,
  getOnSaleTokens,
  getNftMetadata,
}) => {
  const [currentPrice, setCurrentPrice] = useState<bigint>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const getTokenPrice = async () => {
    try {
      const response = await saleContract?.getTokenPrice(tokenId);

      setCurrentPrice(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getOwnerOf = async () => {
    try {
      const response = await mintContract?.ownerOf(tokenId);

      setIsOwner(signer?.address === response);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickPurchaseNft = async () => {
    try {
      setIsLoading(true);
      const response = await saleContract?.purchaseNft(tokenId, {
        value: currentPrice,
      });

      await response.wait();
      await getOnSaleTokens();
      await getNftMetadata();

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!saleContract || !tokenId) return;

    getTokenPrice();
  }, [saleContract, tokenId]);

  useEffect(() => {
    if (!mintContract || !tokenId) return;

    getOwnerOf();
  }, [mintContract, tokenId]);

  return (
    <GridItem display="flex" flexDir="column" alignItems="center">
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
            <Text borderBottom="1px solid green">{attribute.trait_type}</Text>
            <Text>{attribute.value}</Text>
          </Box>
        ))}
      </Flex>
      <Flex mt={4} alignItems="center">
        {currentPrice ? (
          <>
            <Text>{formatEther(currentPrice)} ETH</Text>
            <Button
              ml={2}
              colorScheme="pink"
              onClick={onClickPurchaseNft}
              isDisabled={isLoading || isOwner}
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
    </GridItem>
  );
};

export default SaleNftCard;
