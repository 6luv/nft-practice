import { Flex } from "@chakra-ui/react";
import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { JsonRpcSigner } from "ethers";

const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  return (
    <Flex bgColor="red.100" maxW={768} mx="auto" minH="100vh" flexDir="column">
      <Header signer={signer} setSigner={setSigner} />
      <Flex bgColor="green.100" flexGrow={1}>
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default Layout;
