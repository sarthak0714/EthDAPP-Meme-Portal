import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Create a varaible here that holds the contract address after you deploy!
   */
  const [allMemes, setAllMemes] = useState([]);
  const contractAddress = "0xA8613704135CF3B28b83AAE11781CD9D22fFD474";
  const contractABI = abi.abi;
  
const getAllMemes = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const memes = await wavePortalContract.getAllMemes();

      const memesesCleaned = memes.map(meme => {
        return {
          address: meme.memer,
          timestamp: new Date(meme.timestamp * 1000),
          message: meme.message,
        };
      });

      setAllMemes(memesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewMeme = (from, timestamp, message) => {
    console.log("NewMeme", from, timestamp, message);
    setAllMemes(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewMeme", onNewMeme);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewMeme", onNewMeme);
    }
  };
}, []);
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  

 const meme = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waveTxn = await wavePortalContract.meme("Meme~~bingchiling什么意思🍧🍦");
        let count = await wavePortalContract.getTotalMemes();
        console.log("Retrieved total wave count...", count.toNumber());
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

    return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header"><b>
        Hello There!</b>
        </div>

        <div className="bio">
        I am sarthak and I love memes! Connect your Ethereum wallet and send me a meme! 
        </div>
        <div className="bio">Ironically it is just a test page you dont actually have to send me a Meme but, you can always do that on <a className="bio2" href ="https://twitter.com/sarthakt0714"><b>Twitter</b></a></div>
        

        <button className="glow-on-hover" onClick={meme}>
          Send me a Meme
        </button>

      <div className="bio3">People Who have sent me Memes! <hr className="deshr"/></div>

           {!currentAccount && (
          <button className="glow-on-hower" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {
         allMemes.map((meme, index) => {
          return (
            
            <div className="somememes" key={index}>
              
              <div><b><em className="empclr">BY</em></b> {meme.address}<b><em className="empclr">  ON  </em>  </b>
  {meme.timestamp.toDateString()}<br/><b className="mem">{meme.message}</b><hr className="deshr"/></div>
            </div>)
           
        })}
        <div className="links">
      <b>Also don't forget to send me a Meme here -> </b>
    </div>
        
      </div>
      
    </div>
      
  );
};

export default App;



// export default function App() {

//   const meme = () => {
    
//   }
  
//   return (
//     <div className="mainContainer">

//       <div className="dataContainer">
//         <div className="header"><b>
//         Hello There!</b>
//         </div>

//         <div className="bio">
//         I am sarthak and I love memes! Connect your Ethereum wallet and send me a meme!
//         </div>

//         <button className="glow-on-hover" onClick={meme}>
//           Send me a Meme
//         </button>
//       </div>
//     </div>
//   );
// }
