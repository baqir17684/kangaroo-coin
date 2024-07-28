import React, { useState } from 'react';
import Web3 from 'web3';

function App() {
  const [account, setAccount] = useState('');
  const [pdfHash, setPdfHash] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.error("No wallet found");
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file); // 确认字段名为 'file'

      try {
        const response = await fetch('http://localhost:5000/upload_pdf', { // 修改为 5000 端口
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`File upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Upload success:', data);
        setPdfHash(data.ipfs_hash);
      } catch (error) {
        console.error('Upload error:', error);
        setPdfHash('Upload failed');
      }
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      <div>Connected account: {account}</div>
      <input type="file" onChange={handleUpload} />
      <div>Uploaded PDF hash: {pdfHash}</div>
    </div>
  );
}

export default App;
