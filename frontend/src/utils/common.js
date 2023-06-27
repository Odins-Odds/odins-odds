import { ethers, Contract } from "ethers";
import OdinsOddsFactoryABI from "../ABIs/OdinsOddsFactory.json";
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

      const odinsOddsFactory = new Contract(
        ContractAddress.odinsOddsFactory,
        OdinsOddsFactoryABI.abi,
        signer
      );
      
      return { signerAddress, odinsOddsFactory };
    } catch (error) {
      console.error("Failed to connect to Metamask:", error);
      return { signerAddress: undefined, odinsOddsFactory: undefined };
    }
  }
  return { signerAddress: undefined, odinsOddsFactory: undefined };
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