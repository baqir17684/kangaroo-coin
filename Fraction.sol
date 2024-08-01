// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./NftGenerate.sol"; // 导入 NftGenerate 合约

contract FractionalizeNFT is ERC721, Ownable {
    NftGenerate public subNft; // 子NFT合约的实例
    uint256 internal nextFragmentNonce; // 用于生成碎片的随机数
    mapping(bytes32 => uint256) public subNftToFragments; // 映射子Token ID到其碎片的数量
    mapping(bytes32 => bytes32) public fragmentToSubNft; // 映射碎片ID到子Token ID

    event Fractionalized(bytes32 indexed subNftId, bytes32[] fragmentIds); // 定义碎片化事件

    constructor(address NftGenerateAddress) ERC721("IPNFT Fragment", "C-NFT")Ownable(msg.sender) {
        subNft = NftGenerate(NftGenerateAddress); // 初始化子NFT合约实例
    }

    function fractionalize(bytes32 subNftId, uint256 fragmentCount, address recipient) public {
        require(subNft.ownerOf(uint256(subNftId)) == msg.sender, "You are not the owner of this NFT"); // 确认调用者是NFT的所有者
        subNft.transferFrom(msg.sender, address(this), uint256(subNftId)); // 将子NFT转移到该合约

        bytes32[] memory fragmentIds = new bytes32[](fragmentCount); // 创建存储碎片ID的数组
        for (uint256 i = 0; i < fragmentCount; i++) {
            bytes32 fragmentId = generateFragmentId(subNftId, i); // 生成碎片ID
            _safeMint(recipient, uint256(fragmentId)); // 安全铸造碎片到指定地址
            subNftToFragments[subNftId]++; // 更新子Token的碎片数量
            fragmentToSubNft[fragmentId] = subNftId; // 设置碎片到子Token的映射
            fragmentIds[i] = fragmentId; // 存储碎片ID到数组
            nextFragmentNonce++; // 增加随机数以确保唯一性
        }
        subNft.transferFrom(address(this), msg.sender, uint256(subNftId)); // 将子NFT转回给所有者

        emit Fractionalized(subNftId, fragmentIds); // 触发碎片化事件
    }

    function getSubNftId(bytes32 fragmentId) public view returns (bytes32) {
        return fragmentToSubNft[fragmentId]; // 返回碎片对应的子Token ID
    }

    function generateFragmentId(bytes32 subNftId, uint256 index) private view returns (bytes32) {
        return keccak256(abi.encodePacked(subNftId, index, block.timestamp, block.difficulty, msg.sender, nextFragmentNonce));
    }
}
