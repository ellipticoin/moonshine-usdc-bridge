import React, { useState } from "react";

import TokenAmountInput from "./TokenAmountInput";
import { TREASURY, SIGNER } from "./contracts";

export default function DepositModal() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState();
  const deposit = async (e, amount) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tx = await TREASURY.connect(SIGNER).deposit(amount);
      await tx.wait();
      e.target.closest(".modal").classList.remove("show");
      document.querySelector(".modal-backdrop").classList.remove("show");
      setLoading(false);
    } catch (err) {
      if (err.data && err.data.message) alert(err.data.message);
      setLoading(false);
    }
  };
  return (
    <div
      className="modal fade"
      id="depositModal"
      tabIndex="-1"
      aria-labelledby="depositModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="depositModalLabel">
              Deposit
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <form className="needs-validation" noValidate>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <TokenAmountInput label="Amount" onChange={setAmount} />
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              disabled={loading}
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={(e) => deposit(e, amount)}
              type="button"
              className="btn btn-primary"
            >
              Deposit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
