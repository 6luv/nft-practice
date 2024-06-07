// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MintNFT.sol";

contract SaleNft {
    MintNft mintNFTContract;

    mapping (uint => uint) tokenPrice;
    uint[] onSaleTokens;

    constructor(address _mintNftAddress) {
        mintNFTContract = MintNft(_mintNftAddress);
    }

    function setForSaleNft(uint _tokenId, uint _price) public {
        require(msg.sender == mintNFTContract.ownerOf(_tokenId), "Caller is not token owner.");
        require(_price > 0, "Price is zero.");
        require(mintNFTContract.isApprovedForAll(msg.sender, address(this)), "Token owner did not approve token.");
        require(tokenPrice[_tokenId] == 0, "This token is already on sale");

        tokenPrice[_tokenId] = _price;
        onSaleTokens.push(_tokenId);
    }

    function purchaseNft(uint _tokenId) public payable {
        require(msg.sender != mintNFTContract.ownerOf(_tokenId), "Caller is token owner.");
        require(msg.value >= tokenPrice[_tokenId], "Caller sent lower than price.");
        require(tokenPrice[_tokenId] != 0, "Token is not sale");

        payable(mintNFTContract.ownerOf(_tokenId)).transfer(msg.value);
        mintNFTContract.transferFrom(mintNFTContract.ownerOf(_tokenId), msg.sender, _tokenId);

        tokenPrice[_tokenId] = 0;
        for (uint i = 0; i < onSaleTokens.length; i ++) {
            if (onSaleTokens[i] == _tokenId) {
                onSaleTokens[i] = onSaleTokens[onSaleTokens.length - 1];
                onSaleTokens.pop();
            }
        }
    }
}