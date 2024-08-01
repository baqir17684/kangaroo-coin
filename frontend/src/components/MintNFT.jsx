import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractABI from "./contracts/YourContractABI.json";

const MintNFT = () => {
  const [account, setAccount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [parentNftName, setParentNftName] = useState("");
  const [tokenType, setTokenType] = useState("CopyRight");
  const [quantity, setQuantity] = useState(1);
  const [tokenId, setTokenId] = useState(""); // 用于质押的P-NFT Token ID
  const [duration, setDuration] = useState(1); // S-NFT的持续时间（天数）
  const [sNftType, setSNftType] = useState(""); // S-NFT的类型

  useEffect(() => {
    const loadWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } else {
        console.error("Please install MetaMask!");
      }
    };
    loadWeb3();
  }, []);

  const mintNFT = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const web3 = new Web3(provider);
      const contractAddress = "0xA7fBA89310dc3BA4d81fE22aDb297d404e36eb4C"; // 你的合约地址
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      try {
        await contract.methods
          .mintToken(parentNftName, tokenType) // 使用父NFT名称和类型
          .send({ from: account });
        console.log("NFT minted successfully");
      } catch (error) {
        console.error("Error minting NFT:", error);
      }
    }
  };

  const stakeNFT = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      const web3 = new Web3(provider);
      const contractAddress = "0xA7fBA89310dc3BA4d81fE22aDb297d404e36eb4C"; // 你的合约地址
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      try {
        await contract.methods
          .SubNftGenerate(tokenId, duration, sNftType, toAddress) // 使用质押的Token ID和其他参数
          .send({ from: account });
        console.log("S-NFT staked and generated successfully");
      } catch (error) {
        console.error("Error staking NFT:", error);
      }
    }
  };

  return (
    <div>
      <h1>Mint and Stake NFT</h1>
      <div>
        <h2>Mint Parent NFT</h2>
        <input
          type="text"
          placeholder="Parent NFT Name"
          value={parentNftName}
          onChange={(e) => setParentNftName(e.target.value)}
        />
        <select
          value={tokenType}
          onChange={(e) => setTokenType(e.target.value)}
        >
          <option value="CopyRight">CopyRight</option>
          <option value="TradeMark">TradeMark</option>
        </select>
        <button onClick={mintNFT}>Mint</button>
      </div>
      <div>
        <h2>Stake Parent NFT to Generate Sub-NFT</h2>
        <input
          type="text"
          placeholder="Token ID to Stake"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <input
          type="text"
          placeholder="Sub-NFT Type"
          value={sNftType}
          onChange={(e) => setSNftType(e.target.value)}
        />
        <input
          type="text"
          placeholder="To Address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
        <button onClick={stakeNFT}>Stake & Generate Sub-NFT</button>
      </div>
    </div>
  );
};

export default MintNFT;
