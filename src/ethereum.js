import { useState, useEffect } from "react";
import { ethers } from "ethers";

const { BigNumber } = ethers;

function convertToNative(value) {
  if (BigNumber.isBigNumber(value)) {
    return value.toBigInt();
  }
  return value;
}

export function useQueryEth(f, dependencies = []) {
  const [returnValue, setReturnValue] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    f().then((returnValue) => {
      if (!isCancelled) {
        setReturnValue(convertToNative(returnValue));
      }
    });
    return () => {
      isCancelled = true;
    };
  }, dependencies);
  return returnValue;
}

export function useEthereumAddress() {
  const [ethereumAddress, setEthereumAddress] = useState(null);
  useEffect(() => {
    async function fetchEthereumAddress() {
      if (window.ethereum) {
        setEthereumAddress(
          (await window.ethereum.request({ method: "eth_accounts" }))[0],
        );
      }
    }
    fetchEthereumAddress();
    window.ethereum.on("accountsChanged", fetchEthereumAddress);
  }, []);
  return ethereumAddress;
}

export function useBlockNumber(provider) {
  const [blockNumber, setBlockNumber] = useState(null);
  useEffect(() => {
    const listener = provider.on("block", (blockNumber) => {
      setBlockNumber(blockNumber);
    });
    return () => {
      provider.off("block", listener);
    };
  }, []);
  return blockNumber;
}

export function useBlockNumber2() {
  const [blockNumber, setBlockNumber] = useState();
  useEffect(() => {
    let isCancelled = false;
    let subscriptionId;
    window.ethereum
      .request({ method: "eth_blockNumber", params: [] })
      .then((blockNumber) => {
        if (!isCancelled) {
          setBlockNumber(convertToNative(BigNumber.from(blockNumber)));
        }
      });
    window.ethereum
      .request({ method: "eth_subscribe", params: ["newHeads", {}] })
      .then((newSubscriptionId) => {
        subscriptionId = newSubscriptionId;
      });
    window.ethereum.on("message", ({ data }) => {
      setBlockNumber(convertToNative(BigNumber.from(data.result.number)));
    });
    return () => {
      window.ethereum.request({
        method: "eth_unsubscribe",
        params: [subscriptionId],
      });
      isCancelled = true;
    };
  }, []);
  return blockNumber;
}

export async function ethRequestAccounts() {
  return window.ethereum.request({ method: "eth_requestAccounts" });
}
