import { Flex } from "@chakra-ui/react";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout: FC = () => {
  return (
    <Flex bgColor="red.100" maxW={768} mx="auto" minH="100vh" flexDir="column">
      <Header />
      <Flex bgColor="green.100" flexGrow={1}>
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default Layout;
