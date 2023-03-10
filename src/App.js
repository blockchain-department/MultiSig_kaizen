import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import Create from "./components/CreateWallet";
import { abi } from "./contract/contractAbi";
import { address } from "./contract/contractAddress";
import MultiSigs from "./components/MultiSigs";
import MultiSigDetails from "./components/MultiSigDetails";

function App() {
  const [wallet, setWallet] = useState({});
  // Connect Wallet
  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.enable();
        const accounts = await window.ethereum.send("eth_requestAccounts");
        const _signer = new ethers.providers.Web3Provider(window.ethereum);
        let contract = new ethers.Contract(address, abi, _signer.getSigner());
        // console.log("useee", contract);
        if (
          accounts?.result[0]?.toLowerCase() != wallet?.address?.toLowerCase()
        ) {
          setWallet({
            ...wallet,
            contract: contract,
            address: accounts?.result[0],
            provider: _signer,
            signer: _signer.getSigner(),
            network: await _signer.getNetwork(),
          });
        }
      } catch (error) {
        console.log("Error:", error.message);
      }
    }
    // else
    //  alert("Please install MetaMask");
  };
  // Switch Network
  const handleSwitchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x80001" }],
        });
      } catch (error) {
        if (error.code === 4902) {
          // alert("Please add this network to metamask!");
        }
      }
    }
  };
  // Disconnect Wallet
  const handleDisconnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("to be coded...");
      } catch (error) {
        console.log("Error:", error.message);
      }
    }
    // else alert("Please install MetaMask");
  };
  // Detect change in Metamask accounts
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => handleSwitchNetwork());
      window.ethereum.on("accountsChanged", () => handleConnectWallet());
    }
  });
  // Connect wallet on Refresh Page
  useEffect(() => {
    handleConnectWallet();
    // eslint-disable-next-line
  }, [wallet]);
  console.log("Wallet:", wallet);
  return (
    <>
      <div className="layer z-10">
        <Navbar
          className="relative z-20"
          wallet={wallet}
          connectWallet={handleConnectWallet}
          disconnectWallet={handleDisconnectWallet}
        />
        <Routes>
          <Route path="/" element={<Create wallet={wallet} />} />
          <Route path="multiSigs" element={<MultiSigs wallet={wallet} />} />
          <Route
            path="multiSigDetail"
            element={<MultiSigDetails wallet={wallet} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
