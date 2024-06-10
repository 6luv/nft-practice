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
import { FC } from "react";

interface NftCardProps {
  nftMetadata: NftMetadata;
}

const NftCard: FC<NftCardProps> = ({ nftMetadata }) => {
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
    </GridItem>
  );
};

export default NftCard;
