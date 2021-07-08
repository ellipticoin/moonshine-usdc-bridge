import { ethers } from "ethers";

const {
  utils: { formatUnits },
} = ethers;

export default function TokenAmount(props) {
  const { children } = props;

  if ([undefined, null].includes(children)) return <></>;
  let formatedValue;
  if (children === 0n) {
    formatedValue = "0";
  } else {
    formatedValue = formatUnits(children, 6);
    formatedValue = formatedValue.padEnd(formatedValue.indexOf(".") + 3, "0");
  }
  return `$ ${formatUnits(children, 6).padEnd(
    formatedValue.indexOf(".") + 6,
    "0",
  )}`;
}
