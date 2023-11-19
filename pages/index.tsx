import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useWallet } from "@meshsdk/react";
import { CardanoWallet } from "@meshsdk/react";

const Home: NextPage = () => {
  const router = useRouter();
  const { connected, wallet } = useWallet();
  const [message, setMessage] = useState<null | any>(null);
  const [colorMessage, setColorMessage] = useState<boolean>(true);
  const [buttonState, setButtonState] = useState<boolean>(true);
  const [assetsList, setAssetsList] = useState([
    { assetName: "", fingerPrint: "", policyId: "", quantity: "", unit: "" },
  ]);

  const token1 = "platinumRelic";
  const token2 = "goldRelic";
  const token3 = "silverRelic";
  const policyID = "e0deef4b2d60183ffc44ed4487bda40d2e55862ac46f1811c861d09d";

  useEffect(() => {
    async function searchAssets() {
      if (connected) {
        try {
          const _assets = await wallet.getAssets();

          const filteredAsset = _assets.filter(
            (asset: { assetName: string; policyId: string }) =>
              (asset.assetName === token1 ||
                asset.assetName === token2 ||
                asset.assetName === token3) &&
              asset.policyId === policyID
          );
          console.log(filteredAsset);

          setAssetsList(filteredAsset);

          if (filteredAsset.length === 0) {
            setMessage("Cannot login, token doesn't exist!");
            setColorMessage(false);
            return;
          }
          if (filteredAsset.length === 1) {
            const text = `Welcome ${filteredAsset[0].assetName.substring(
              0,
              filteredAsset[0].assetName.length - 5
            )} member`;
            setMessage(text);
            setColorMessage(true);
            setButtonState(true);
          } else {
            setMessage("Welcome, choose your membership");
            setColorMessage(true);
            setButtonState(false);
          }
        } catch (error) {
          console.error("Error fetching assets:", error);
          setMessage("Error when connect wallet!");
          setColorMessage(false);
        }
      }
    }
    setMessage(null);
    setButtonState(true);
    setAssetsList([
      { assetName: "", fingerPrint: "", policyId: "", quantity: "", unit: "" },
    ]);
    searchAssets();
  }, [connected]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border border-white rounded-2xl w-96 p-4">
        <h1 className="text-center font-bold text-3xl mt-4">
          Web3 Login System
        </h1>
        {connected ? (
          <p className="text-center h-10 mt-2 text-green-500">
            Wallet connected
          </p>
        ) : (
          <p className="text-center h-10 mt-2 text-red-500">
            Please connect your wallet
          </p>
        )}
        {colorMessage ? (
          <p className="text-center h-10 text-green-500">{message}</p>
        ) : (
          <p className="text-center h-10 text-red-500">{message}</p>
        )}
        <div className="flex justify-center item-center mb-8">
          <CardanoWallet />
        </div>
        {buttonState ? (
          <div className="flex justify-center items-center mb-6">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-xl w-64 h-10"
              onClick={async () => {
                try {
                  if (!colorMessage) {
                    return;
                  } else {
                    const memberToken = assetsList[0].assetName;
                    if (memberToken === token1) {
                      router.push("/membership/platinum");
                    } else if (memberToken === token2) {
                      router.push("/membership/gold");
                    } else if (memberToken === token3) {
                      router.push("/membership/silver");
                    }
                  }
                } catch (error) {
                  console.error("Error:", error);
                  setMessage("Error when login process!");
                  setColorMessage(false);
                }
              }}
            >
              Login
            </button>
          </div>
        ) : (
          <div>
            {assetsList.map((asset, index) => (
              <div key={index} className="flex justify-center items-center">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-xl w-64 h-10 mb-4"
                  onClick={async () => {
                    try {
                      const memberToken = asset.assetName;
                      if (memberToken === token1) {
                        router.push("/membership/platinum");
                      } else if (memberToken === token2) {
                        router.push("/membership/gold");
                      } else {
                        router.push("/membership/silver");
                      }
                    } catch (error) {
                      console.error("Error:", error);
                      setMessage("Error when login process!");
                      setColorMessage(false);
                    }
                  }}
                >
                  Login
                  {` as ${assetsList[index].assetName.substring(
                    0,
                    assetsList[index].assetName.length - 5
                  )} member`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
