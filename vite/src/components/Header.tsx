import { Button, Flex, Image } from "@chakra-ui/react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const Header: FC = () => {
  const navigate = useNavigate();

  return (
    <Flex bgColor="blue.100" h={24} justifyContent="space-between">
      <Flex
        bgColor="red.100"
        w={40}
        fontSize={20}
        fontWeight="semibold"
        alignItems="center"
      >
        <Image w={16} src="/images/logo.svg" alt="슬라임 월드" /> 슬라임 월드
      </Flex>
      <Flex bgColor="red.100" alignItems="center" gap={4}>
        <Button
          variant="link"
          colorScheme="green"
          onClick={() => navigate("/")}
          w={20}
        >
          홈
        </Button>
        <Button
          variant="link"
          colorScheme="green"
          onClick={() => navigate("/mint-nft")}
          w={20}
        >
          민팅
        </Button>
        <Button
          variant="link"
          colorScheme="green"
          onClick={() => navigate("/my-nft")}
          w={20}
        >
          내 NFT
        </Button>
        <Button
          variant="link"
          colorScheme="green"
          onClick={() => navigate("/sale-nft")}
          w={20}
        >
          마켓
        </Button>
      </Flex>
      <Flex bgColor="red.100" w={40} justifyContent="end" alignItems="center">
        <Button>🦊 메타마스크</Button>
      </Flex>
    </Flex>
  );
};

export default Header;
