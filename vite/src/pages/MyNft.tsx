import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import axios from "axios";

const MyNft: FC = () => {
  const [nftMetadataArray, setNftMetadataArray] = useState<NftMetadata[]>([]);
  const [balanceOf, setBalanceOf] = useState<number>(0);
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
      const temp: NftMetadata[] = [];

      for (let i = 0; i < balanceOf; i++) {
        const tokenOfOwnerByIndex = await mintContract?.tokenOfOwnerByIndex(
          signer?.address,
          i
        );

        const tokenURI = await mintContract?.tokenURI(tokenOfOwnerByIndex);
        const axiosResponse = await axios.get<NftMetadata>(tokenURI);
        temp.push(axiosResponse.data);
      }

      setNftMetadataArray(temp);
    } catch (error) {
      console.error(error);
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
      <Flex>
        {nftMetadataArray.map((nftMetadata, i) => (
          <Flex key={i} flexDir="column" alignItems="center">
            <Image
              w={60}
              h={60}
              src={nftMetadata.image}
              alt={nftMetadata.name}
            />
            <Text mt={4} fontSize={24} fontWeight="semibold">
              {nftMetadata.name}
            </Text>
            <Text my={2}>{nftMetadata.description}</Text>
            <Text fontWeight="semibold" fontSize={16}>
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
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default MyNft;
