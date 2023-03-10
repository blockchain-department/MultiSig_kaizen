import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MultiSigs({ wallet }) {
  const [vaults, setVaults] = useState([]);
  const a = async () => {
    await wallet?.contract
      ?.getInMultiSigs(wallet?.address)
      .then(async (res) => {
        setVaults(res);
      });
  };
  a();
  useEffect(() => {
    return () => {
      a();
    };
  }, [wallet?.address]);
  return (
    <>
      <ToastContainer />
      {/* <div className="flex flex-col md:flex-row px-3 pb-3 h-[calc(h-screen - 12rem)]"> */}
      <div className="w-full md:w-5/12 h-auto md:pr-3 mt-[10vh]"></div>

      {vaults.length > 0 ? (
        vaults.map((item, index) => (
          <Link key={index} to="/multiSigDetail" state={{ id: item }}>
            <div className="glass p-4 flex w-[90vw] md:w-[70vw] mx-auto mt-4 cursor-pointer">
              <div className="ml-8 mr-20 ">{index}</div>
              <div className="">{item}</div>
            </div>
          </Link>
        ))
      ) : (
        <div
          className=" border-t border-b border-[#079D6B] text-[#079D6B] px-4 py-3 mx-auto w-[50vh]"
          role="alert"
        >
          <p className="font-bold">Emptyy</p>
          <p className="text-sm">Please Create Some Vaults</p>
        </div>
      )}

      {/* </div> */}
    </>
  );
}

export default MultiSigs;
