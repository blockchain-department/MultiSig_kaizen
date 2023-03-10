import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { multiSigABI } from "../contract/contractAbi";

function MultiSigDetails({ wallet }) {
  const location = useLocation();
  const [contractMultisig, setContractMultisig] = useState();
  const [owners, setOwners] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [admin, setAdmin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [addTokenAddress, setAddTokenAddress] = useState("");
  const [removeTokenAddress, setRemoveTokenAddress] = useState("");
  const [newAdmin, setNewAdmin] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [balance, setBalance] = React.useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  // let contract = new ethers.Contract(
  //   location?.state?.id,
  //   multiSigABI,
  //   wallet?.signer
  // );

  // setOwners(await contract.getOwners());
  // setAdmin(await contract.admin());
  let a = async () => {
    let contract = new ethers.Contract(
      location?.state?.id,
      multiSigABI,
      wallet?.signer
    );
    setContractMultisig(contract);
    // console.log("abc", contract);

    setOwners(await contract?.getOwners());
    setTokens(await contract?.getTokens());
    let ad = await contract?.admin();
    if (ad.toLowerCase() == wallet?.address.toLowerCase()) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setAdmin(await contract?.admin());
    setTransactionCount(await contract?.getTransactionCount("true", "false"));

    // const provider = new ethers.providers.Web3Provider(
    //   window.ethereum,
    //   "any"
    // );
    wallet?.provider?.getBalance(wallet?.address).then((b) => {
      // convert a currency unit from wei to ether
      const balanceInEth = ethers.utils.formatEther(b);
      // console.log(`balance: ${balanceInEth} ETH`);
      setBalance(Number.parseFloat(balanceInEth).toFixed(3));
    });
    // console.log("abc", c);
  };
  // a();
  useEffect(() => {
    a();
  }, [wallet]);

  const addToken = async () => {
    console.log(contractMultisig);

    toast.promise(
      await await contractMultisig
        .addTokens(addTokenAddress)
        .then((transaction) => {
          toast.promise(
            transaction
              .wait()
              .then((tx) => {
                toast.info(tx);
                // setMintingStatus(false);
              })
              .catch((err) => {
                toast.error("Error in Adding Token:", err);
              }),
            {
              pending: "Adding in Process...",
              success: "Added Token Successfully 👌",
              error: "Promise rejected 🤯",
            }
          );
        })
        .catch((err) => {
          toast.error("Error in Adding Token:", err);
        })
      // {
      //   pending: "Waiting to Sign Transaction...",
      //   success: "Transaction Signed... 👌",
      //   error: "Transaction Rejected 🤯",
      // }
    );
  };
  const removeToken = async () => {
    toast.promise(
      await await contractMultisig
        .removeToken(removeTokenAddress)
        .then((transaction) => {
          toast.promise(
            transaction
              .wait()
              .then((tx) => {
                toast.info(tx);
                // setMintingStatus(false);
              })
              .catch((err) => {
                toast.error("Error in Adding Token:", err);
              }),
            {
              pending: "Removing in Process...",
              success: "Removed Token Successfully 👌",
              error: "Promise rejected 🤯",
            }
          );
        })
        .catch((err) => {
          toast.error("Error while removing Token:", err);
        })
    );
  };
  const updatedAdmin = async () => {
    toast.promise(
      await await contractMultisig
        .changeAdmin(newAdmin)
        .then((transaction) => {
          toast.promise(
            transaction
              .wait()
              .then((tx) => {
                toast.info(tx);
                // setMintingStatus(false);
              })
              .catch((err) => {
                toast.error("Error in Adding Token:", err);
              }),
            {
              pending: "Removing in Process...",
              success: "Removed Token Successfully 👌",
              error: "Promise rejected 🤯",
            }
          );
        })
        .catch((err) => {
          toast.error("Error while removing Token:", err);
        })
    );
  };
  const fundEth = async () => {};
  const fundToken = async () => {};
  return (
    <>
      <ToastContainer />

      <div className="container grid gap-6 mx-auto text-center lg:grid-cols-2 xl:grid-cols-7 lg:px-20 mt-10">
        {/* Balance Status */}
        <div className="w-full rounded-md xl:col-span-2 border border-primary_gray p-3">
          <div className="container grid gap-3 mx-auto text-center grid-cols-1 xl:grid-cols-2">
            <div className="w-full text-left p-3 rounded-md bg-gray-900 text-white h-24">
              <h3 className="text-primary_gray"> Wallet Balance</h3>
              <h3>{balance} ETH</h3>
            </div>
            <div className="w-full text-left p-3 rounded-md bg-gray-900 text-white h-24">
              <h3 className="text-primary_gray"> Pending</h3>
              <h3> 0</h3>
              {/* <h3>{user?.isBooked ? rideFee : 0}</h3> */}
            </div>
          </div>
        </div>
        {/* ROI / Date Status */}
        <div className="w-full rounded-md xl:col-span-5 border border-primary_gray p-3">
          <div className="container text-sm xl:text-base  gap-6 mx-auto text-center xl:flex items-center justify-between">
            <div className="w-full rounded-md bg-primary_light shadow-lg h-24 text-left xl:p-3">
              <div className="w-full flex justify-between px-3 pt-2">
                <div className="w-full text-left">
                  <h3 className="text-white drop-shadow-lg ">
                    MultiSig Address
                  </h3>
                  <h3 className="">{location?.state?.id}</h3>
                </div>
              </div>
            </div>
            <div className="w-full   xl:ml-[-120px] rounded-md bg-primary_light drop-shadow-lg h-24 text-left xl:p-3">
              {/* <h3 className="text-white">Time Left To Withdraw</h3> */}

              <div className="w-full flex justify-between px-3 pt-2">
                <div className="w-full text-left">
                  <h3 className="text-white drop-shadow-lg">Admin:</h3>
                  <h3>{admin}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-[90vw] mx-auto">
        {" "}
        {/* <h3 class="mt-6 text-xl">Owners</h3> */}
        <div className="container grid gap-8 border border-primary_gray text-center lg:grid-cols-2 xl:grid-cols-7 mx-auto mt-6 p-3 rounded-md">
          {/* Tab 1 */}
          <div className="w-full rounded-md xl:col-span-2 bg-gray-900 text-white p-3 shadow-lg">
            {/* Deposit */}
            {isAdmin ? (
              <>
                {" "}
                <div className="w-full text-left mb-2">
                  <h3 className="text-primary_gray">Update Admin</h3>
                  {/* <h3>--:--</h3> */}
                </div>
                {/* Withdraw */}
                <div className="flex justify-between w-full">
                  <input
                    type="text"
                    placeholder="Enter Address"
                    value={newAdmin}
                    onChange={(e) => setNewAdmin(e.target.value)}
                    className="w-2/3 mr-2 pl-4 rounded-sm text-primary border border-primary focus:ring focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={updatedAdmin}
                    // disabled={contractBalance > 0 ? false : true}
                    className={`w-1/3 py-2 font-semibold rounded-sm text-white bg-primary`}
                  >
                    Update
                  </button>
                </div>
                <hr className="my-5" />
                <div className="w-full text-left mb-2">
                  <h3 className="text-primary_gray">Add Token</h3>
                  {/* <h3>--:--</h3> */}
                </div>
                {/* Withdraw */}
                <div className="flex justify-between w-full">
                  <input
                    type="text"
                    placeholder="Enter Address"
                    value={addTokenAddress}
                    onChange={(e) => setAddTokenAddress(e.target.value)}
                    className="w-2/3 mr-2 pl-4 rounded-sm text-primary border border-primary focus:ring focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={addToken}
                    disabled={addTokenAddress ? false : true}
                    className={`w-1/3 py-2 font-semibold rounded-sm text-white bg-primary`}
                  >
                    Add
                  </button>
                </div>
                <hr className="my-5" />
                {/* Deposit */}
                <div className="w-full text-left mb-2">
                  <h3 className="text-primary_gray">Remove Token</h3>
                  {/* <h3>--:--</h3> */}
                </div>
                {/* Withdraw */}
                <div className="flex justify-between w-full">
                  <input
                    type="text"
                    placeholder="Enter Address"
                    value={removeTokenAddress}
                    onChange={(e) => setRemoveTokenAddress(e.target.value)}
                    className="w-2/3 mr-2 pl-4 rounded-sm text-primary border border-primary focus:ring focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={removeToken}
                    className={`w-1/3 py-2 font-semibold rounded-sm text-white bg-primary`}
                  >
                    Remove
                  </button>
                </div>
                <hr className="my-5" />
              </>
            ) : null}

            <div className="w-full text-left mb-2">
              <h3 className="text-primary_gray">Fund ETH</h3>
              {/* <h3>--:--</h3> */}
            </div>
            {/* Withdraw */}
            <div className="flex justify-between w-full">
              <input
                type="text"
                placeholder="Enter Address"
                value={removeTokenAddress}
                onChange={(e) => setRemoveTokenAddress(e.target.value)}
                className="w-2/3 mr-2 pl-4 rounded-sm text-primary border border-primary focus:ring focus:ring-primary"
              />
              <button
                type="button"
                // onClick={updateRideFee}
                className={`w-1/3 py-2 font-semibold rounded-sm text-white bg-primary`}
              >
                Fund
              </button>
            </div>
            <hr className="my-5" />
            <div className="w-full text-left mb-2">
              <h3 className="text-primary_gray">Fund Tokens</h3>
              {/* <h3>--:--</h3> */}
            </div>
            {/* Withdraw */}
            <div className="flex justify-between w-full">
              <div className="">
                <input
                  type="text"
                  placeholder="Enter Address"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  className=" pl-4 min-w-[80%] rounded-sm text-primary border border-primary focus:ring focus:ring-primary"
                />

                <input
                  type="text"
                  placeholder="Enter Address"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  className=" pl-4 min-w-[100%] rounded-sm text-primary border border-primary focus:ring focus:ring-primary"
                />
              </div>

              <button
                type="button"
                onClick={fundToken}
                className={`w-1/3 py-2 font-semibold rounded-sm text-white bg-primary`}
              >
                Fund
              </button>
            </div>
            <hr className="my-5" />
            {/* Deposit */}
          </div>
          {/* Tx Table ================================================================================================= */}
          <div className="w-full xl:col-span-5 overflow-x-auto">
            <h5 className="text-left mb-2 text-lg font-medium mt-2">
              Recent Transactions
            </h5>
            <div className="w-full rounded-md xl:col-span-5 overflow-auto shadow-md max-h-[500px]">
              <div className="inline-block min-w-full rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead class="bg-[#a27f7f80]">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase"
                      >
                        Index
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase"
                      >
                        Address
                      </th>

                      <th
                        scope="col"
                        class="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase"
                      >
                        Role
                      </th>
                      {/* <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Edit</span>
                      </th> */}
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    {owners?.map((item, index) => (
                      <tr
                        key={index}
                        class="transition-all hover:bg-gray-100 hover:shadow-lg"
                      >
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">
                                {index}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="ml-4">
                              <div class="text-sm md:hidden font-medium text-gray-900">
                                {item[0] +
                                  item[1] +
                                  item[2] +
                                  item[3] +
                                  "..." +
                                  item[item.length - 1] +
                                  item[item.length - 2] +
                                  item[item.length - 3]}
                                {/* {item} */}
                              </div>
                              <div class="text-sm hidden md:block font-medium text-gray-900">
                                {/* {item[0] +
                                  item[1] +
                                  item[2] +
                                  item[3] +
                                  "..." +
                                  item[item.length - 1] +
                                  item[item.length - 2] +
                                  item[item.length - 3]} */}
                                {item}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                            Active
                          </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {admin == item ? "Admin" : "Owner"}
                          {/* Owner */}
                        </td>
                        {/* <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <a
                            href="#"
                            class="text-indigo-600 hover:text-indigo-900"
                          >
                            Fund Contract
                          </a>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                  <span className="text-xs xs:text-sm text-gray-900">
                    {owners.length > 0
                      ? owners.length + " Owners"
                      : "No Owners Yet"}
                  </span>
                </div>
              </div>
            </div>
            <hr className="my-5" />

            <h5 className="text-left mb-2 text-lg font-medium mt-2">Tokens</h5>
            <div className="w-full rounded-md xl:col-span-5 overflow-auto shadow-md max-h-[500px]">
              <div className="inline-block min-w-full rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead class="bg-[#a27f7f80]">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase"
                      >
                        Index
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase"
                      >
                        Address
                      </th>

                      <th
                        scope="col"
                        class="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-xs font-bold tracking-wider text-left text-gray-900 uppercase"
                      >
                        Role
                      </th>
                      {/* <th scope="col" class="relative px-6 py-3">
                        <span class="sr-only">Edit</span>
                      </th> */}
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    {owners?.map((item, index) => (
                      <tr
                        key={index}
                        class="transition-all hover:bg-gray-100 hover:shadow-lg"
                      >
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">
                                {index}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="ml-4">
                              <div class="text-sm md:hidden font-medium text-gray-900">
                                {item[0] +
                                  item[1] +
                                  item[2] +
                                  item[3] +
                                  "..." +
                                  item[item.length - 1] +
                                  item[item.length - 2] +
                                  item[item.length - 3]}
                                {/* {item} */}
                              </div>
                              <div class="text-sm hidden md:block font-medium text-gray-900">
                                {/* {item[0] +
                                  item[1] +
                                  item[2] +
                                  item[3] +
                                  "..." +
                                  item[item.length - 1] +
                                  item[item.length - 2] +
                                  item[item.length - 3]} */}
                                {item}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                            Active
                          </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {admin == item ? "Admin" : "Owner"}
                          {/* Owner */}
                        </td>
                        {/* <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <a
                            href="#"
                            class="text-indigo-600 hover:text-indigo-900"
                          >
                            Fund Contract
                          </a>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                  <span className="text-xs xs:text-sm text-gray-900">
                    {owners.length > 0
                      ? owners.length + " Owners"
                      : "No Owners Yet"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MultiSigDetails;
