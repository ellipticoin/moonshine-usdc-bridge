import React, { forwardRef } from "react";

import { ethers } from "ethers";
import Cleave from "cleave.js/react";

const {
  utils: { parseUnits },
} = ethers;

export default forwardRef((props, ref) => {
  const {
    onChange, options, label,
  } = props;

  return (
    <div className="form-floating mb-3">
      <Cleave
        className="form-control"
        ref={ref}
        placeholder="0.0"
        options={{
          ...options,
          numeral: true,
          numeralDecimalScale: 18,
          numeralThousandsGroupStyle: "thousand",
        }}
        onChange={(event) => {
          onChange(
            event.target.rawValue === ""
              ? null
              : parseUnits(
                event.target.rawValue.replace(/^\./g, "0."),
                6,
              ).toBigInt(),
          );
        }}
      />
      <label htmlFor="inputAmount">{label}</label>
    </div>
  );
});
// };
