import {
  Box,
  Button,
  Flex,
  Grid,
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
import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import axios from "axios";

const Count = 4;

const MyNft: FC = () => {
  const [nftMetadataArray, setNftMetadataArray] = useState<NftMetadata[]>([]);
  const [balanceOf, setBalanceOf] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mintContract, signer } = useOutletContext<OutletContext>();

  const getBalanceof = async () => {
    try {
      const response = await mintContract?.balanceOf(signer?.address);
      setBalanceOf(Number(response));
    } catch (error) {
      console.error(error);
    }
  };

  const getNftMetadata = async () => {
    try {
      setIsLoading(true);
      const temp: NftMetadata[] = [];

      for (let i = 0; i < Count; i++) {
        if (i + currentPage * Count >= balanceOf) {
          setIsEnd(true);
          break;
        }

        const tokenOfOwnerByIndex = await mintContract?.tokenOfOwnerByIndex(
          signer?.address,
          i + currentPage * Count
        );

        const tokenURI = await mintContract?.tokenURI(tokenOfOwnerByIndex);
        const axiosResponse = await axios.get<NftMetadata>(tokenURI);
        temp.push(axiosResponse.data);
      }

      setNftMetadataArray([...nftMetadataArray, ...temp]);
      setCurrentPage(currentPage + 1);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!mintContract || !signer) return;

    getBalanceof();
  }, [mintContract, signer]);

  useEffect(() => {
    if (signer) return;

    setBalanceOf(0);
  }, [signer]);

  useEffect(() => {
    if (!balanceOf) return;

    getNftMetadata();
  }, [balanceOf]);

  useEffect(() => {
    console.log(nftMetadataArray);
  }, [nftMetadataArray]);

  return (
    <Flex
      bgColor="red.100"
      w="100%"
      alignItems="center"
      flexDir="column"
      gap={2}
      mt={8}
    >
      {!signer && <Text>🦊 메타마스크 로그인이 필요합니다.</Text>}
      {balanceOf !== 0 && <Text>보유 NFT 개수: {balanceOf}</Text>}
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)"]}
        gap={6}
      >
        {nftMetadataArray.map((nftMetadata, i) => (
          <GridItem display="flex" key={i} flexDir="column" alignItems="center">
            <Image src={nftMetadata.image} alt={nftMetadata.name} />
            <Popover>
              <PopoverTrigger>
                <Button
                  mt={4}
                  fontSize={24}
                  fontWeight="semibold"
                  variant="link"
                >
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
              {nftMetadata.attributes?.map((attribute, j) => (
                <Box key={j} border="1px solid green" p={1} rounded="md">
                  <Text borderBottom="1px solid green">
                    {attribute.trait_type}
                  </Text>
                  <Text>{attribute.value}</Text>
                </Box>
              ))}
            </Flex>
          </GridItem>
        ))}
      </Grid>
      {!isEnd && signer && (
        <Button
          onClick={() => getNftMetadata()}
          isDisabled={isLoading}
          isLoading={isLoading}
          loadingText="로딩중"
        >
          더 보기
        </Button>
      )}
    </Flex>
  );
};

export default MyNft;
