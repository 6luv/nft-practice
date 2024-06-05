import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import axios from "axios";
import MintModal from "../components/MintModal";

const MintNft: FC = () => {
  const [nftMetadata, setNftMetadata] = useState<NftMetadata>();
  const { mintContract } = useOutletContext<OutletContext>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onClickMint = async () => {
    try {
      const response = await mintContract?.mintNft();
      await response.wait();

      const totalSupply = await mintContract?.totalSupply();
      const tokenURI = await mintContract?.tokenURI(totalSupply);
      console.log(tokenURI);

      const axiosResponse = await axios.get<NftMetadata>(tokenURI);
      setNftMetadata(axiosResponse.data);
      onOpen();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => console.log(nftMetadata), [nftMetadata]);

  return (
    <>
      <Flex
        bgColor="red.100"
        w="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Button onClick={onClickMint}>민팅하기</Button>
      </Flex>
      <MintModal isOpen={isOpen} onClose={onClose} nftMetadata={nftMetadata} />
    </>
  );
};

export default MintNft;
