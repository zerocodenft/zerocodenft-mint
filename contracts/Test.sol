
/*
 /$$$$$$$$                                /$$$$$$                  /$$           /$$   /$$ /$$$$$$$$ /$$$$$$$$
|_____ $$                                /$$__  $$                | $$          | $$$ | $$| $$_____/|__  $$__/
     /$$/   /$$$$$$   /$$$$$$   /$$$$$$ | $$  \__/  /$$$$$$   /$$$$$$$  /$$$$$$ | $$$$| $$| $$         | $$
    /$$/   /$$__  $$ /$$__  $$ /$$__  $$| $$       /$$__  $$ /$$__  $$ /$$__  $$| $$ $$ $$| $$$$$      | $$
   /$$/   | $$$$$$$$| $$  \__/| $$  \ $$| $$      | $$  \ $$| $$  | $$| $$$$$$$$| $$  $$$$| $$__/      | $$
  /$$/    | $$_____/| $$      | $$  | $$| $$    $$| $$  | $$| $$  | $$| $$_____/| $$\  $$$| $$         | $$
 /$$$$$$$$|  $$$$$$$| $$      |  $$$$$$/|  $$$$$$/|  $$$$$$/|  $$$$$$$|  $$$$$$$| $$ \  $$| $$         | $$
|________/ \_______/|__/       \______/  \______/  \______/  \_______/ \_______/|__/  \__/|__/         |__/

Drop Your NFT Collection With ZERO Coding Skills at https://zerocodenft.com
*/

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Test is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint;
    enum SaleStatus{ PAUSED, PRESALE, PUBLIC }

    Counters.Counter private _tokenIds;

    uint public constant COLLECTION_SIZE = 5000;
    uint public constant TOKENS_PER_TRAN_LIMIT = 10;
    uint public constant TOKENS_PER_PERSON_PUB_LIMIT = 10;
    uint public constant TOKENS_PER_PERSON_WL_LIMIT = 4;
    uint public constant PRESALE_MINT_PRICE = 0 ether;
    uint public MINT_PRICE = 0.4 ether;
    SaleStatus public saleStatus = SaleStatus.PAUSED;
    bool public canReveal = false;
    string private _baseURL;
    string private _hiddenURI;
    bytes32 public merkleRoot;
    mapping(address => uint) private _mintedCount;
    mapping(address => uint) private _whitelistMintedCount;

    constructor(string memory hiddenUri) 
    ERC721("Test", "TST"){
        _hiddenURI = hiddenUri;
    }
    
    /// @notice Update the merkle tree root
    function setMerkleRoot(bytes32 root) onlyOwner external {
        merkleRoot = root;
    }

    /// @notice Reveal metadata for all the tokens
    function reveal(string memory uri) external onlyOwner {
        require(!canReveal, "ZeroCodeNFT: Already revealed");
        canReveal = true;
        _baseURL = uri;
    }

    function totalSupply() external view returns (uint) {
        return _tokenIds.current();
    }

    /// @notice Set base URI
    function setBaseUri(string memory uri) onlyOwner external {
        _baseURL = uri;
    }

    /// @dev override base uri. It will be combined with token ID
    function _baseURI() internal view override returns (string memory) {
        return _baseURL;
    }

    /// @notice Update current sale stage
    function setSaleStatus(SaleStatus status) external onlyOwner {
        saleStatus = status;
    }

    /// @notice Update public mint price
    function setPublicMintPrice(uint price) external onlyOwner {
        MINT_PRICE = price;
    }

    /// @notice Withdraw contract's balance
    function withdraw() external onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "ZeroCodeNFT: No balance");
        
        payable(owner()).transfer(balance);
    }

    /// @notice Allows owner to mint tokens to a specified address
    function airdrop(address to, uint count) external onlyOwner {
        require(_tokenIds.current() + count <= COLLECTION_SIZE, "ZeroCodeNFT: Request exceeds collection size");
        _mintTokens(to, count);
    }

    /// @notice Get token's URI. In case of delayed reveal we give user the json of the placeholer metadata.
    /// @param tokenId token ID
    function tokenURI(uint tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        
        if(!canReveal) {
            return _hiddenURI;
        }
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json")) : "";
    }

    
    function redeem(bytes32[] calldata merkleProof, uint count) external payable {
        require(saleStatus != SaleStatus.PAUSED, "ZeroCodeNFT: Sales are off");
        require(_tokenIds.current() + count <= COLLECTION_SIZE, "ZeroCodeNFT: Number of requested tokens will exceed collection size");
        require(count <= TOKENS_PER_TRAN_LIMIT, "ZeroCodeNFT: Requested token count exceeds allowance (10)");
        if(saleStatus == SaleStatus.PRESALE) {
            require(msg.value >= count * PRESALE_MINT_PRICE, "ZeroCodeNFT: Ether value sent is not sufficient");
            require(_whitelistMintedCount[msg.sender] + count <= TOKENS_PER_PERSON_WL_LIMIT, "ZeroCodeNFT: Requested token count exceeds allowance (4)");
            bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
            require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "ZeroCodeNFT: You are not whitelisted");
            _whitelistMintedCount[msg.sender] += count;
        }
        else {
            require(msg.value >= count * MINT_PRICE, "ZeroCodeNFT: Ether value sent is not sufficient");
            require(_mintedCount[msg.sender] + count <= TOKENS_PER_PERSON_PUB_LIMIT, "ZeroCodeNFT: Requested token count exceeds allowance (10)");
            _mintedCount[msg.sender] += count;
        }
        _mintTokens(msg.sender, count);
    }

    /// @dev Perform actual minting of the tokens
    function _mintTokens(address to, uint count) internal {
        for(uint index = 0; index < count; index++) {

            _tokenIds.increment();
            uint newItemId = _tokenIds.current();

            _safeMint(to, newItemId);
        }
    }

}
