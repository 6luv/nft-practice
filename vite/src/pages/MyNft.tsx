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
import { saleContractAddress } from "../abis/contractAddress";

const Count = 4;

const MyNft: FC = () => {
  const [nftMetadataArray, setNftMetadataArray] = useState<NftMetadata[]>([]);
  const [balanceOf, setBalanceOf] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApprovedForAll, setIsApprovedForAll] = useState<boolean>(false);
  const { mintContract, signer } = useOutletContext<OutletContext>();
  const [isApproveLoading, setIsApproveLoading] = useState<boolean>(false);

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

  const getIsApprovedForAll = async () => {
    try {
      const response = await mintContract?.isApprovedForAll(
        signer?.address,
        saleContractAddress
      );

      setIsApprovedForAll(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickSetApprovalForAll = async () => {
    try {
      setIsApproveLoading(true);
      const response = await mintContract?.setApprovalForAll(
        saleContractAddress,
        !isApprovedForAll
      );
      await response.wait();

      setIsApprovedForAll(!isApprovedForAll);
      setIsApproveLoading(false);
    } catch (error) {
      console.error(error);
      setIsApproveLoading(false);
    }
  };

  useEffect(() => {
    if (!mintContract || !signer) return;

    getBalanceof();
    getIsApprovedForAll();
  }, [mintContract, signer]);

  useEffect(() => {
    if (signer) return;

    setBalanceOf(0);
  }, [signer]);

  useEffect(() => {
    if (!balanceOf) return;

    getNftMetadata();
  }, [balanceOf]);

  return (
    <Flex w="100%" alignItems="center" flexDir="column" gap={2} mt={8} mb={20}>
      {signer ? (
        <>
          <Flex alignItems="center" gap={2}>
            <Text>판매 권한 : {isApprovedForAll ? "승인" : "거부"}</Text>
            <Button
              colorScheme={isApprovedForAll ? "red" : "green"}
              onClick={onClickSetApprovalForAll}
              isDisabled={isApproveLoading}
              isLoading={isApproveLoading}
              loadingText="로딩중"
            >
              {isApprovedForAll ? "취소" : "승인"}
            </Button>
          </Flex>
          {balanceOf !== 0 && <Text>보유 NFT 개수: {balanceOf}</Text>}
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
            ]}
            gap={6}
          >
            {nftMetadataArray.map((nftMetadata, i) => (
              <GridItem
                display="flex"
                key={i}
                flexDir="column"
                alignItems="center"
              >
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
          {!isEnd && (
            <Button
              onClick={() => getNftMetadata()}
              isDisabled={isLoading}
              isLoading={isLoading}
              loadingText="로딩중"
              mt={8}
            >
              더 보기
            </Button>
          )}
        </>
      ) : (
        <Text>🦊 메타마스크 로그인이 필요합니다.</Text>
      )}
    </Flex>
  );
};

export default MyNft;
