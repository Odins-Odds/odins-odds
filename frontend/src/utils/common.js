import { ethers, Contract } from "ethers";
import AggregatorABI from "../ABIs/Aggregator.json";
import ContractAddress from "../ABIs/contract-address.json";
import Swal from "sweetalert2";

// connect ethers to metamask
const getBlockchain = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      const aggregator = new Contract(
        ContractAddress.Aggregator,
        AggregatorABI.abi,
        signer
      );

      return { signerAddress, aggregator };
    } catch (error) {
      console.error("Failed to connect to Metamask:", error);
      return { signerAddress: undefined, aggregator: undefined };
    }
  }
  return { signerAddress: undefined, aggregator: undefined };
};

function showError(error) {
  Swal.fire({
    icon: "error",
    title: "Transaction Failed",
    text: error.toString(),
  });
}

export { getBlockchain, showError };
export default getBlockchain;