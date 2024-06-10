import { Flex } from "@chakra-ui/react";
import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import { JsonRpcSigner, Contract } from "ethers";
import Header from "./Header";

export interface OutletContext {
  mintContract: Contract | null;
  saleContract: Contract | null;
  signer: JsonRpcSigner | null;
}

const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [mintContract, setMintContract] = useState<Contract | null>(null);
  const [saleContract, setSaleContract] = useState<Contract | null>(null);

  return (
    <Flex maxW={768} mx="auto" minH="100vh" flexDir="column">
      <Header
        signer={signer}
        setSigner={setSigner}
        setMintContract={setMintContract}
        setSaleContract={setSaleContract}
      />
      <Flex flexGrow={1}>
        <Outlet context={{ mintContract, saleContract, signer }} />
      </Flex>
    </Flex>
  );
};

export default Layout;
