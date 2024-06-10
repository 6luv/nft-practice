import { Flex, Image, Text } from "@chakra-ui/react";
import { FC } from "react";

const Home: FC = () => {
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      bgImage="url(/images/slime_bg.jpg)"
      w="100%"
    >
      <Flex border="4px solid green" p={10} rounded="3xl" bgColor="white">
        <Image
          w={[20, 40, 60]}
          h={[20, 40, 60]}
          src="/images/unreveal.jpg"
          alt="unreveal"
        />
      </Flex>
      <Text
        fontSize={24}
        fontWeight="bold"
        mt={8}
        bgColor="white"
        p={1}
        rounded="lg"
      >
        어떤 슬라임이 나올까요?
      </Text>
      <Flex alignItems="center">
        <Text
          fontSize={[16, 16, 20]}
          fontWeight="bold"
          textColor="green"
          bgColor="white"
          ml={2}
          p={1}
          rounded="lg"
        >
          슬라임 월드
        </Text>
        <Text fontSize={[16, 16, 20]} mr={2} bgColor="white" p={1} rounded="lg">
          에서 특별한 슬라임을 뽑아보세요!
        </Text>
      </Flex>
    </Flex>
  );
};

export default Home;
