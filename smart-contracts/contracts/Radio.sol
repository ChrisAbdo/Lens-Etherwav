// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Radio is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _nftsSold;
    Counters.Counter private _nftCount;

    address payable private _marketOwner;
    mapping(uint256 => NFT) private _idToNFT;
    struct NFT {
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        bool listed;
    }
    event NFTListed(
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner
    );
    event NFTSold(
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner
    );
    event NFTDeleted(
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner
    );

    constructor() {
        _marketOwner = payable(msg.sender);
    }

    function deleteNft(uint256 _tokenId) public nonReentrant {
        // Ensure that the NFT exists and is listed
        NFT storage nft = _idToNFT[_tokenId];
        require(nft.listed, "NFT is not listed");

        // Ensure that the seller of the NFT is the one calling this function
        require(nft.seller == msg.sender, "Only the seller can delete the NFT");

        // Remove the NFT from the marketplace
        delete _idToNFT[_tokenId];

        emit NFTDeleted(nft.nftContract, nft.tokenId, nft.seller, nft.owner);
    }

    // List the NFT on the marketplace
    function listNft(address _nftContract, uint256 _tokenId)
        public
        payable
        nonReentrant
    {
        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        _nftCount.increment();

        _idToNFT[_tokenId] = NFT(
            _nftContract,
            _tokenId,
            payable(msg.sender),
            payable(address(this)),
            true
        );

        emit NFTListed(_nftContract, _tokenId, msg.sender, address(this));
    }

    function getListedNfts() public view returns (NFT[] memory) {
        uint256 nftCount = _nftCount.current();
        uint256 unsoldNftsCount = nftCount - _nftsSold.current();

        NFT[] memory nfts = new NFT[](unsoldNftsCount);
        uint256 nftsIndex = 0;
        for (uint256 i = 0; i < nftCount; i++) {
            if (_idToNFT[i + 1].listed) {
                nfts[nftsIndex] = _idToNFT[i + 1];
                nftsIndex++;
            }
        }
        return nfts;
    }

    function getMyNfts() public view returns (NFT[] memory) {
        uint256 nftCount = _nftCount.current();
        uint256 myNftCount = 0;
        for (uint256 i = 0; i < nftCount; i++) {
            if (_idToNFT[i + 1].owner == msg.sender) {
                myNftCount++;
            }
        }

        NFT[] memory nfts = new NFT[](myNftCount);
        uint256 nftsIndex = 0;
        for (uint256 i = 0; i < nftCount; i++) {
            if (_idToNFT[i + 1].owner == msg.sender) {
                nfts[nftsIndex] = _idToNFT[i + 1];
                nftsIndex++;
            }
        }
        return nfts;
    }

    function getMyListedNfts() public view returns (NFT[] memory) {
        uint256 nftCount = _nftCount.current();
        uint256 myListedNftCount = 0;
        for (uint256 i = 0; i < nftCount; i++) {
            if (
                _idToNFT[i + 1].seller == msg.sender && _idToNFT[i + 1].listed
            ) {
                myListedNftCount++;
            }
        }

        NFT[] memory nfts = new NFT[](myListedNftCount);
        uint256 nftsIndex = 0;
        for (uint256 i = 0; i < nftCount; i++) {
            if (
                _idToNFT[i + 1].seller == msg.sender && _idToNFT[i + 1].listed
            ) {
                nfts[nftsIndex] = _idToNFT[i + 1];
                nftsIndex++;
            }
        }
        return nfts;
    }
}
