import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import FractionalizeNFTABI from "./contracts/FractionalizeNFTABI.json";
import NftGenerateABI from "./contracts/NftGenerateABI.json";

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
  const [subNftTokenId, setSubNftTokenId] = useState(""); // 用于分割的S-NFT Token ID
  const [fragmentCount, setFragmentCount] = useState(1); // 分割成的碎片数量
  const [fractionalizedIds, setFractionalizedIds] = useState([]); // 存储碎片化生成的ID
  const [ethUsdPrice, setEthUsdPrice] = useState(""); // 用于存储ETH/USD的实时汇率

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setProvider(provider);
        await provider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        fetchEthUsdPrice(web3); // 加载时获取ETH/USD汇率
      } else {
        console.error("Please install MetaMask!");
      }
    };
    loadProvider();
  }, []);

  const fetchEthUsdPrice = async (web3) => {
    try {
      const contractAddress = "0x8AFCFdB80243D43bA940aD95B023EeE52DcA9E3F"; // NftGenerate 合约地址
      const contract = new web3.eth.Contract(NftGenerateABI, contractAddress);
      const price = await contract.methods.getLatestEthUsdPrice().call();
      setEthUsdPrice(Number(price)); // 确保价格是一个数字
      console.log("Fetched ETH/USD Price:", price); // 调试输出
    } catch (error) {
      console.error("Error fetching ETH/USD price:", error);
    }
  };

  const mintNFT = async () => {
    if (provider) {
      try {
        const web3 = new Web3(provider);
        const contractAddress = "0x8AFCFdB80243D43bA940aD95B023EeE52DcA9E3F"; // NftGenerate 合约地址
        const contract = new web3.eth.Contract(NftGenerateABI, contractAddress);

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
        const contractAddress = "0x8AFCFdB80243D43bA940aD95B023EeE52DcA9E3F"; // NftGenerate 合约地址
        const contract = new web3.eth.Contract(NftGenerateABI, contractAddress);

        const receipt = await contract.methods
          .SubNftGenerate(tokenId, duration, sNftType, toAddress)
          .send({ from: account });

        // 从事件中提取生成的S-NFT的Token ID
        const subNftMintedEvent = receipt.events.SubNftMinted;
        if (subNftMintedEvent) {
          const generatedTokenId = subNftMintedEvent.returnValues.tokenId;
          setSubNftTokenId(generatedTokenId); // 设置S-NFT的Token ID
          console.log("S-NFT generated with Token ID:", generatedTokenId);
        }
      } catch (error) {
        console.error("Error staking NFT:", error);
      }
    } else {
      console.error("No Ethereum provider found. Please install MetaMask.");
    }
  };

  const fractionalizeNFT = async () => {
    if (provider) {
      try {
        const web3 = new Web3(provider);
        const contractAddress = "0x1E6A5dEF0BD93bC3f4842c39bB43845a11A16428"; // FractionalizeNFT 合约地址
        const contract = new web3.eth.Contract(
          FractionalizeNFTABI,
          contractAddress
        );

        const receipt = await contract.methods
          .fractionalize(subNftTokenId, fragmentCount, toAddress)
          .send({ from: account });

        // 从事件中提取生成的碎片ID
        const fractionalizedEvent = receipt.events.Fractionalized;
        if (fractionalizedEvent) {
          const fragmentIds = fractionalizedEvent.returnValues.fragmentIds;
          setFractionalizedIds(fragmentIds); // 存储生成的碎片ID
          console.log("NFT fractionalized successfully", fragmentIds);
        }
      } catch (error) {
        console.error("Error fractionalizing NFT:", error);
      }
    } else {
      console.error("No Ethereum provider found. Please install MetaMask.");
    }
  };

  return (
    <div>
      <h1>Mint and Stake NFT</h1>
      <h2>Current ETH/USD Price: {ethUsdPrice}</h2> {/* 显示ETH/USD汇率 */}
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
      {subNftTokenId && (
        <div>
          <h3>Generated Sub-NFT Token ID: {subNftTokenId}</h3>
        </div>
      )}
      <div>
        <h2>Fractionalize Sub-NFT</h2>
        <input
          type="text"
          placeholder="Sub-NFT Token ID"
          value={subNftTokenId}
          onChange={(e) => setSubNftTokenId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Fragment Count"
          value={fragmentCount}
          onChange={(e) => setFragmentCount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Recipient Address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
        <button onClick={fractionalizeNFT}>Fractionalize</button>
      </div>
      {fractionalizedIds.length > 0 && (
        <div>
          <h3>Fractionalized Token IDs:</h3>
          <ul>
            {fractionalizedIds.map((id, index) => (
              <li key={index}>{id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MintNFT;
