import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftMetadata: NftMetadata | undefined;
}

const MintModal: FC<MintModalProps> = ({ isOpen, onClose, nftMetadata }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>민팅 성공!</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column" alignItems="center">
          <Image
            w={60}
            h={60}
            src={nftMetadata?.image}
            alt={nftMetadata?.name}
          />
          <Text mt={4} fontSize={24} fontWeight="semibold">
            {nftMetadata?.name}
          </Text>
          <Text my={2}>{nftMetadata?.description}</Text>
          <Text fontWeight="semibold" fontSize={16}>
            Traits
          </Text>
          <Flex flexWrap="wrap" mt={4} gap={2} justifyContent="center">
            {nftMetadata?.attributes?.map((v) => (
              <Box border="1px solid green" p={1} rounded="md">
                <Text borderBottom="1px solid green">{v.trait_type}</Text>
                <Text>{v.value}</Text>
              </Box>
            ))}
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MintModal;
