// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "./ILogAutomation.sol";

contract NftGenerate is ERC721, Ownable {
    uint256 internal totalMints; // Total number of NFTs minted
    mapping(address => uint256) internal walletMints; // Records the number of NFTs minted by each wallet address
    mapping(bytes32 => string) public parentNftNames; // Maps token ID to its name (Parent NFT name)
    mapping(bytes32 => string) public parentTokenTypes; // Maps token ID to its type (Trademark or Copyright)
    mapping(string => bytes32) public parentNameToTokenId; // Maps parent NFT name to token ID

    mapping(bytes32 => string) public subNftNames; // Maps token ID to its name (Sub NFT name)
    mapping(bytes32 => string) public subTokenTypes; // Maps token ID to its type (S-NFT type)
    mapping(bytes32 => uint256) internal subTokenExpirations; // Maps token ID to its expiration time
    mapping(bytes32 => bytes32[]) public parentToSubNfts; // Maps parent NFT ID to its generated Sub NFT IDs
    mapping(bytes32 => bytes32) public subToParentNft; // Maps Sub NFT ID to its parent NFT ID
    bytes32[] internal allSubNftIds; // Stores all generated S-NFT IDs

    event Minted(address indexed to, bytes32 tokenId, string parentNftName, string tokenType, uint256 expiration); // Defines the minting event to track NFT minting
    event SubNftMinted(address indexed to, bytes32 tokenId, string subNftName, string subTokenType, uint256 expiration); // Defines the minting event to track S-NFT minting

    constructor() ERC721("IP-NFT", "P-NFT") Ownable(msg.sender) {}

    // Internal function for safely minting NFTs
    function safeMint(string memory parentNftName, string memory tokenType) internal {
        require(
            keccak256(abi.encodePacked(tokenType)) == keccak256("CopyRight") ||
            keccak256(abi.encodePacked(tokenType)) == keccak256("TradeMark"),
            "Invalid token type"
        );
        require(parentNameToTokenId[parentNftName] == 0, "NFT with this name already exists");

        bytes32 currentTokenId = generateTokenId();
        totalMints++;
        parentNftNames[currentTokenId] = parentNftName;
        parentTokenTypes[currentTokenId] = tokenType;
        parentNameToTokenId[parentNftName] = currentTokenId;

        _safeMint(msg.sender, uint256(currentTokenId)); // Use msg.sender as the recipient address
        walletMints[msg.sender] += 1;

        emit Minted(msg.sender, currentTokenId, parentNftName, tokenType, 0); // Update event parameters
    }

    // External function for users to mint NFTs to a specified address
    function mintToken(string memory parentNftName, string memory tokenType) public payable {
        uint256 pricePerPnf = 0 ether;

        require(msg.value >= pricePerPnf, "Insufficient ETH sent");

        if (msg.value > pricePerPnf) {
            payable(msg.sender).transfer(msg.value - pricePerPnf);
        }

        safeMint(parentNftName, tokenType); // Call the internal function safeMint, defaulting to msg.sender
    }

    // Query the number of NFTs currently owned by the user
    function MyWallet() public view returns (uint256) {
        return walletMints[msg.sender];
    }

    // Check and burn expired S-NFTs
    function checkAndBurnExpiredTokens() public {
        for (uint256 i = 0; i < allSubNftIds.length; i++) {
            bytes32 tokenId = allSubNftIds[i];
            if (block.timestamp > subTokenExpirations[tokenId]) {
                _burn(uint256(tokenId)); // Burn expired token
                _removeExpiredToken(tokenId);
            }
        }
    }

    // Query the remaining time of the NFT (in seconds)
    function NftRemainingTime(bytes32 tokenId) public view returns (int256) {
        uint256 expirationTime =  subTokenExpirations[tokenId];
        int256 remainingTime = int256(expirationTime) - int256(block.timestamp);
        return remainingTime > 0 ? remainingTime : int256(0);
    }

    // Get the owner of the NFT by parentNftName
    function OwnerOfNft(string memory parentNftName) public view returns (address) {
        bytes32 tokenId = parentNameToTokenId[parentNftName];
        return ownerOf(uint256(tokenId));
    }

    // Generate a unique token ID based on block attributes and contract state
    function generateTokenId() private view returns (bytes32) {
        return keccak256(abi.encodePacked(block.timestamp, block.prevrandao, block.coinbase, block.number, msg.sender, totalMints));
    }

    // Function to stake P-NFT and generate a single S-NFT
    function SubNftGenerate(bytes32 tokenId, uint256 duration, string memory sNftType, address to) public payable {
        require(ownerOf(uint256(tokenId)) == msg.sender, "Only the owner can stake the NFT");

        // Transfer P-NFT to the contract address for staking
        _transfer(msg.sender, address(this), uint256(tokenId));

        // Check if P-NFT has been staked
        require(ownerOf(uint256(tokenId)) == address(this), "Token is not staked");

        // Calculate the required ETH amount based on the duration
        uint256 pricePerUnit = 0 ether; // Assume the base price for each S-NFT is 0.01 ETH
        require(msg.value >= pricePerUnit, "Insufficient ETH sent");

        // Handle excess payment
        if (msg.value > pricePerUnit) {
            payable(msg.sender).transfer(msg.value - pricePerUnit); // Refund excess ETH to the user
        }

        // Generate S-NFT
        bytes32 sNftId = generateTokenId(); // Generate a unique ID for the S-NFT
        string memory parentName = parentNftNames[tokenId];
        string memory sNftName = string(abi.encodePacked(parentName, "-", sNftType)); // Auto-generate S-NFT name based on P-NFT name and S-NFT type

        // Check if the sNftName already exists
        require(bytes(subNftNames[sNftId]).length == 0, "S-NFT with this name already exists");

        subNftNames[sNftId] = sNftName; // Set the name of the S-NFT
        subTokenTypes[sNftId] = sNftType; // Set the type of the S-NFT
        subTokenExpirations[sNftId] = block.timestamp + duration * 1 days; // Set the expiration time of the S-NFT
        allSubNftIds.push(sNftId); // Record the ID of the newly created S-NFT

        _safeMint(to, uint256(sNftId)); // Send the S-NFT to the specified address
        parentToSubNfts[tokenId].push(sNftId); // Add to the list of sub-NFTs under the parent NFT
        subToParentNft[sNftId] = tokenId; // Record the mapping from sub-NFT to parent NFT

        // Return the staked P-NFT to the original owner after generating the S-NFT
        _transfer(address(this), msg.sender, uint256(tokenId));
        
        emit SubNftMinted(to, sNftId, sNftName, sNftType, subTokenExpirations[sNftId]); // Trigger the S-NFT minting event
    }

    // Internal function to remove expired S-NFTs and their associated data
    function _removeExpiredToken(bytes32 tokenId) internal {
        // Remove from mappings
        delete subNftNames[tokenId];
        delete subTokenTypes[tokenId];
        delete subTokenExpirations[tokenId];

        // Remove the sub-NFT record from the parent-child relationship
        bytes32 parentId = subToParentNft[tokenId];
        bytes32[] storage subNfts = parentToSubNfts[parentId];
        for (uint256 j = 0; j < subNfts.length; j++) {
            if (subNfts[j] == tokenId) {
                subNfts[j] = subNfts[subNfts.length - 1];
                subNfts.pop();
                break;
            }
        }

        // Remove from the list of all S-NFT IDs
        for (uint256 k = 0; k < allSubNftIds.length; k++) {
            if (allSubNftIds[k] == tokenId) {
                allSubNftIds[k] = allSubNftIds[allSubNftIds.length - 1];
                allSubNftIds.pop();
                break;
            }
        }
        
        delete subToParentNft[tokenId]; // Delete the mapping from sub-NFT to parent NFT
    }

    // Helper function to convert bytes32 token ID to uint256
    function _bytes32ToUint256(bytes32 tokenId) internal pure returns (uint256) {
        return uint256(tokenId);
    }

    // Helper function to convert uint256 token ID to bytes32
    function _uint256ToBytes32(uint256 tokenId) internal pure returns (bytes32) {
        return bytes32(tokenId);
    }
}
