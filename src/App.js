import { useState, useEffect } from "react";
import Web3 from "web3";
import { getInitializeAbiOfImplementation, newKitFromWeb3 } from "@celo/contractkit";
import Navigation from "./components/Navigation/Navigation";
import Home from "./components/Home/Home";
import Create from "./components/Create/Create";
import Dashboard from "./components/Dashboard/Dashboard";
import { HashRouter  as Router, Routes, Route } from "react-router-dom";
import BigNumber from "bignumber.js";

import gainerAbi from "./contracts/gainer.abi.json";
import erc20abi from "./contracts/erc20.abi.json";
import "./App.css";

const ERC20_DECIMALS = 18;
const gainerAddress = "0x3B8eD3703bD1A2EF87BDc57082Bc13e76c765Db4";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

const truncateAddress = (address) => {
  if (!address) return
  return address.slice(0, 5) + "..." + address.slice(address.length - 4, address.length);
}

function App() {
  const [kit, setKit] = useState();
  const [balance, setBalance] = useState(0);
  const [goods, setGoods] = useState();
  const [address, setAddress] = useState();
  const [gainerContract, setGainerContract] = useState();
  const [topBuyerAddress, setTopBuyerAddress] = useState();
  const [topBuyerNumber, setTopBuyerNumber] = useState();
  const [topSpenderAddress, setTopSpenderAddress] = useState();
  const [topSpenderNumber, setTopSpenderNumber] = useState();

  const approvePayment = async (_amount) => {
    const cUSDContract = new kit.web3.eth.Contract(
      erc20abi,
      cUSDContractAddress
    );
    await cUSDContract.methods
      .approve(gainerAddress, _amount)
      .send({ from: kit.defaultAccount });
  };

  // connect CeloExtensionWallet to dApp
  const connectWallet = async () => {
    if (window.celo) {
      // alert("⚠️ Please approve this DApp to use it.");
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const defaultAccount = accounts[0];
        kit.defaultAccount = defaultAccount;

        setKit(kit);
        setAddress(defaultAccount);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert(
        "You need to install the celo wallet extension in order to use this app"
      );
    }
  };

  // get balance of connected wallet
  const getBalance = async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const cUsdBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
      const myContract = new kit.web3.eth.Contract(gainerAbi, gainerAddress);

      setBalance(cUsdBalance);
      setGainerContract(myContract);
    } catch (error) {
      console.log(error);
    }
  };


  // get all goods from contract
  const getGoods = async () => {
    try {
      const goodsCount = await gainerContract.methods.getCounter().call();
      const _goods = [];
      for (let i = 0; i < goodsCount; i++) {
        let good = await new Promise(async (resolve) => {
          let _good = await gainerContract.methods.checkGood(i).call();
          resolve({
            id: _good[0],
            owner: _good[1],
            name: _good[2],
            description: _good[3],
            image: _good[4],
            price: _good[5],
            sales: _good[6],
          });
        });
        _goods.push(good);
      }
      const goods_ = await Promise.all(_goods);
      setGoods(goods_);
    } catch (e) {
      console.log(e);
    }
  };

  // get the top buyer in market
  const getTopBuyer = async () => {
    try {
      const buyer = await gainerContract.methods.getTopBuyer().call();
      const num = await gainerContract.methods.getTopBuyerNumber(buyer).call();
      setTopBuyerAddress(buyer);
      setTopBuyerNumber(num);
    } catch (e) {
      console.log(e);
    }
  };

  // get top spender in market
  const getTopSpender = async () => {
    try {
      const spender = await gainerContract.methods.getTopSpender().call();
      const num = await gainerContract.methods.getTopSpenderNumber(spender).call();
      setTopSpenderAddress(spender);
      setTopSpenderNumber(num);
    } catch (e) {
      console.log(e);
    }
  };

  // create new good and upload to the market
  const createGood = async (_name, _description, _image, _price) => {
    try {
      const __price = new BigNumber(_price)
        .shiftedBy(ERC20_DECIMALS)
        .toString();
      await gainerContract.methods
        .createGood(_name, _description, _image, __price)
        .send({ from: address });
        alert("Created goods successfully. Please refresh page");
    } catch (e) {
      console.log("Error creating good: " + e);
    }
  };

  // buy good from market
  const buyGood = async (_index, _price) => {
    try {
      await approvePayment(_price);
    } catch (e) {
      console.log(e);
    }

    try {
      await gainerContract.methods.buyGood(_index).send({ from: address });
      alert("purchase successful. Please refresh page");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address]);

  useEffect(() => {
    if (gainerContract) {
      getGoods();
      getTopBuyer();
      getTopSpender();
    }
  }, [gainerContract]);

  return (
    <div className="app">
      <Router>
        <Navigation balance={balance} />
        <Routes>
          <Route
            path="/"
            element={<Home goods={goods} buyGood={buyGood} wallet={address} />}
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                topBuyer={topBuyerAddress}
                topBuyerNumber={topBuyerNumber}
                topSpender={topSpenderAddress}
                topSpenderNumber={topSpenderNumber}
              />
            }
          />
          <Route path="/create" element={<Create createGood={createGood} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
