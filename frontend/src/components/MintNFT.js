import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractABI from "./contracts/YourContractABI.json";

const MintNFT = () => {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [toAddress, setToAddress] = useState("");
  const [parentNftName, setParentNftName] = useState("");
  const [tokenType, setTokenType] = useState("CopyRight");
  const [tokenId, setTokenId] = useState(""); // 用于质押的P-NFT Token ID
  const [duration, setDuration] = useState(1); // S-NFT的持续时间（天数）
  const [sNftType, setSNftType] = useState(""); // S-NFT的类型
  const [mintedTokenId, setMintedTokenId] = useState(""); // 存储铸造的Token ID

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setProvider(provider);
        await provider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } else {
        console.error("Please install MetaMask!");
      }
    };
    loadProvider();
  }, []);

  const mintNFT = async () => {
    if (provider) {
      try {
        const web3 = new Web3(provider);
        const contractAddress = "0xA7fBA89310dc3BA4d81fE22aDb297d404e36eb4C";
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        const receipt = await contract.methods
          .mintToken(parentNftName, tokenType)
          .send({ from: account });

        // 获取事件日志中Token ID
        const tokenIdEvent = receipt.events.Minted.returnValues.tokenId;
        setMintedTokenId(tokenIdEvent);
        console.log("NFT minted successfully with Token ID:", tokenIdEvent);
      } catch (error) {
        console.error("Error minting NFT:", error);
      }
    } else {
      console.error("No Ethereum provider found. Please install MetaMask.");
    }
  };

  const stakeNFT = async () => {
    if (provider) {
      try {
        const web3 = new Web3(provider);
        const contractAddress = "0xA7fBA89310dc3BA4d81fE22aDb297d404e36eb4C";
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        const receipt = await contract.methods
          .SubNftGenerate(tokenId, duration, sNftType, toAddress)
          .send({ from: account });

        // 从事件中提取生成的S-NFT的Token ID
        const subNftMintedEvent = receipt.events.SubNftMinted;
        if (subNftMintedEvent) {
          const generatedTokenId = subNftMintedEvent.returnValues.tokenId;
          console.log("S-NFT generated with Token ID:", generatedTokenId);
        }
      } catch (error) {
        console.error("Error staking NFT:", error);
      }
    } else {
      console.error("No Ethereum provider found. Please install MetaMask.");
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
      {mintedTokenId && (
        <div>
          <h3>Minted Token ID: {mintedTokenId}</h3>
        </div>
      )}
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
