import {
  Box,
  Button,
  Flex,
  GridItem,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { Contract, formatEther, parseEther } from "ethers";
import { FC, useEffect, useState } from "react";

interface NftCardProps {
  nftMetadata: NftMetadata;
  tokenId: number;
  saleContract: Contract | null;
  isApprovedForAll: boolean;
}

const NftCard: FC<NftCardProps> = ({
  nftMetadata,
  tokenId,
  saleContract,
  isApprovedForAll,
}) => {
  const [currentPrice, setCurrentPrice] = useState<bigint>();
  const [salePrice, setSalePrice] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTokenPrice = async () => {
    try {
      const response = await saleContract?.getTokenPrice(tokenId);

      setCurrentPrice(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickSetForSaleNft = async () => {
    try {
      setIsLoading(true);
      if (!salePrice || isNaN(Number(salePrice))) return;

      const response = await saleContract?.setForSaleNft(
        tokenId,
        parseEther(salePrice)
      );
      await response.wait();

      setCurrentPrice(parseEther(salePrice));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!saleContract || !tokenId) return;

    getTokenPrice();
  }, [saleContract, tokenId]);

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
      <Flex mt={4}>
        {currentPrice ? (
          <Text>{formatEther(currentPrice)} ETH</Text>
        ) : isApprovedForAll ? (
          <>
            <InputGroup>
              <Input
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                textAlign="right"
                isDisabled={isLoading}
              />
              <InputRightAddon>ETH</InputRightAddon>
            </InputGroup>
            <Button
              ml={2}
              onClick={onClickSetForSaleNft}
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              등록
            </Button>
          </>
        ) : (
          ""
        )}
      </Flex>
    </GridItem>
  );
};

export default NftCard;
