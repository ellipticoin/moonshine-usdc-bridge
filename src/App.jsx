import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./App.css";
import {
  TREASURY,
  BRIDGE,
  PROVIDER,
  FORIEGN_PROVIDER,
  SNOWPACK_PUBLIC_BRIDGE_CONTRACT_ADDRESS,
  SNOWPACK_PUBLIC_TREASURY_CONTRACT_ADDRESS,

} from "./contracts";
import TokenAmount from "./TokenAmount";
import {
  useEthereumAddress,
  useQueryEth,
  useBlockNumber,
  ethRequestAccounts,
} from "./ethereum";
import DepositModal from "./DepositModal";

export default function App() {
  const address = useEthereumAddress();
  const foreignBlockNumber = useBlockNumber(FORIEGN_PROVIDER);
  const blockNumber = useBlockNumber(PROVIDER);

  console.log(address);
  const foriegnBalance = useQueryEth(
    async () => address
        && (BRIDGE.foreignBalanceOf(address)),
    [address, blockNumber],
  );

  const treasuryBalance = useQueryEth(
    async () => address
        && (TREASURY.balanceOf(address)),
    [address, foreignBlockNumber],
  );
  console.log([foriegnBalance, treasuryBalance]);
  return (
    <div>
      <div className="container">
        <main>
          <div className="py-5 text-center">
            <h2>Moonshine USDc Bridge Node Manager</h2>
          </div>

          <div className="row g-5 mb-3">
            <div className="col-md-8 offset-md-2">
              {address ? (
                <ul className="list-group mb-3">
                  <li className="list-group-item d-flex justify-content-between lh-sm">
                    <h6 className="mt-2">Manager Address</h6>
                    <div className="mt-1">{address}</div>
                  </li>
                  <li className="list-group-item d-flex justify-content-between lh-sm">
                    <h6 className="mt-2">Node Address</h6>
                    <div className="mt-1" />
                  </li>
                  <li className="list-group-item d-flex justify-content-between lh-sm">
                    <h6 className="mt-2">Bridge Contract Address</h6>
                    <div className="mt-1">{SNOWPACK_PUBLIC_BRIDGE_CONTRACT_ADDRESS}</div>
                  </li>
                  <li className="list-group-item d-flex justify-content-between lh-sm">
                    <h6 className="mt-2">Treasury Contract Address</h6>
                    <div className="mt-1">{SNOWPACK_PUBLIC_TREASURY_CONTRACT_ADDRESS}</div>
                  </li>
                  <li className="list-group-item d-flex justify-content-between lh-sm">
                    <h6 className="mt-2">Status</h6>
                    <h5 className="mt-1">
                      <div className="badge bg-secondary">Needs Setup</div>
                    </h5>
                  </li>
                  <li className="list-group-item d-flex justify-content-between lh-sm">
                    <h6 className="mt-2">Amount in Ethereum Treasury</h6>
                    <div>
                      {
  treasuryBalance && foriegnBalance
                      && (
                      <span className="mx-2">
                        {foriegnBalance !== treasuryBalance
  && <div className="badge bg-light text-dark">Pending Confirmations</div>}
                        <TokenAmount>{treasuryBalance}</TokenAmount>
                      </span>
                      )
                    }
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#depositModal"
                      >
                        Deposit
                      </button>
                    </div>
                  </li>
                </ul>
              ) : (
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    onClick={() => ethRequestAccounts()}
                    className="btn btn-primary"
                  >
                    Connect Metamask
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <DepositModal />
    </div>
  );
}
