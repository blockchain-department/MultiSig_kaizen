import React, { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
// import axios from "axios";
// Icons
// import { BiImageAdd, BiEdit, BiLoaderAlt } from "react-icons/bi";
// Contract
import { abi, tokenAbi } from "../contract/contractAbi";
import { address, tokenAddress } from "../contract/contractAddress";
// Popup
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Tab } from "@headlessui/react";

// import StepProgressBar from "react-step-progress";
// import the stylesheet
// import "react-step-progress/dist/index.css";
import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Create({ wallet }) {
  const ownersRef = useRef();
  const requiredRef = useRef();
  const [owners, setOwners] = useState([]);
  const [required, setRequired] = useState(0);
  // const [mintingStatus, setMintingStatus] = useState(false);
  const [subscription, setSubsctiption] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEth, setIsEth] = useState(true);
  const [priceEth, setPriceEth] = useState({
    s1: 0,
    s2: 0,
    s3: 0,
  });
  const [priceToken, setPriceToken] = useState({
    s1Token: 0,
    s2Token: 0,
    s3Token: 0,
  });
  console.log(subscription);
  // useEffect(() => {
  //   return () => {
  //     setSubsctiption(subscription);
  //   };
  // }, [subscription]);
  const getPrices = async () => {
    console.log("use", wallet?.contract);
    let s1 = ethers.BigNumber.from(await wallet?.contract?.s1()).toString();
    let s2 = ethers.BigNumber.from(await wallet?.contract?.s2()).toString();
    let s3 = ethers.BigNumber.from(await wallet?.contract?.s3()).toString();
    let s1Token = ethers.BigNumber.from(
      await wallet?.contract?.s1Token()
    ).toString();
    let s2Token = ethers.BigNumber.from(
      await wallet?.contract?.s2Token()
    ).toString();
    let s3Token = ethers.BigNumber.from(
      await wallet?.contract?.s3Token()
    ).toString();

    setPriceEth({
      s1: s1,
      s2: s2,
      s3: s3,
    });
    setPriceToken({
      s1Token: s1Token,
      s2Token: s2Token,
      s3Token: s3Token,
    });
  };
  console.log(priceEth, priceToken);
  useEffect(() => {
    getPrices();
  }, [wallet]);

  // Stepper

  // 3.Create MultiSig
  const create = async () => {
    // console.log("URL", metadataURI);

    let contract = new ethers.Contract(address, abi, wallet?.signer);
    let tokenContract = new ethers.Contract(
      tokenAddress,
      tokenAbi,
      wallet?.signer
    );
    console.log(contract);
    console.log(owners?.split(","));
    // let price;
    if (isEth) {
      // price= contract
      toast.promise(
        await contract
          .createMultiSig(
            owners.split(","),
            required,
            subscription.toString(),
            false,
            {
              value:
                subscription == 1
                  ? priceEth?.s1
                  : subscription == 2
                  ? priceEth?.s2
                  : subscription == 3
                  ? priceEth?.s3
                  : null,
            }
          )
          .then((transaction) => {
            toast.promise(
              transaction
                .wait()
                .then((tx) => {
                  toast.info(tx);
                  // setMintingStatus(false);
                })
                .catch((err) => {
                  toast.error("Error in Minting Token:", err);
                }),
              {
                pending: "Minting in Process...",
                success: "Mint Successfully 👌",
                error: "Promise rejected 🤯",
              }
            );
          }),
        {
          pending: "Waiting to Sign Transaction...",
          success: "Transaction Signed... 👌",
          error: "Transaction Rejected 🤯",
        }
      );
    } else {
      toast.promise(
        await tokenContract
          .approve(
            address,
            subscription == 1
              ? priceToken?.s1Token
              : subscription == 2
              ? priceToken?.s2Token
              : subscription == 3
              ? priceToken?.s3Token
              : null
          )
          .then((transaction) => {
            toast.promise(
              transaction
                .wait()
                .then(async () => {
                  await contract
                    .createMultiSig(
                      owners.split(","),
                      required,
                      subscription.toString(),
                      true
                    )
                    .then((transaction) => {
                      toast.promise(
                        transaction
                          .wait()
                          .then((tx) => {
                            toast.info(tx);
                            // setMintingStatus(false);
                          })
                          .catch((err) => {
                            toast.error("Error in Minting Token:", err);
                          }),
                        {
                          pending: "Creating Multisig...",
                          success: "Multisig created Successfully 👌",
                          error: "Promise rejected 🤯",
                        }
                      );
                    });

                  // toast.info(tx);
                  // setMintingStatus(false);
                })
                .catch((err) => {
                  toast.error("Error in Minting Token:", err);
                }),
              {
                pending: "Approval in Process...",
                success: "Approved Successfully 👌",
                error: "Promise rejected 🤯",
              }
            );
          })
      );
    }
  };
  // FromData
  console.log("FormData: ", isEth);
  return (
    <>
      <ToastContainer />
      <div className=" relative z-20 md:px-16 lg:px-24 py-8 h-[calc(h-screen - 12rem)] ">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Select Subsciption
            </Tab>

            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              MultiSig
            </Tab>

            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Delpoy
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel className={classNames("rounded-xl  mt-8 py-2")}>
              <div className=" flex flex-col  justify-center items-center lg:flex-row gap-5 my-10 min-h-[350px]">
                <div class="  min-w-[80vw]  lg:min-w-[400px] p-6 border border-gray-200 rounded-lg shadow bg-[#010824]">
                  <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Subscription 1
                    </h5>
                  </a>
                  <p class="mb-8 mt-4 font-normal text-gray-700 dark:text-gray-400">
                    Can Handle
                    <span className="text-[#B7E82E] text-lg"> 3</span> Owners
                    and
                    <span className="text-[#B7E82E]"> 5</span> Tokens and a
                    Native Coin
                    <br />
                    <br />
                    <span className="text-white font-bold  text-xl">Price</span>
                    <br />
                    Eth &nbsp; &nbsp; -{" "}
                    {ethers.utils.formatEther(priceEth?.s1).toString()}
                    Eth
                    <br />
                    Coin -{" "}
                    {ethers.utils
                      .formatEther(priceToken?.s1Token)
                      .toString()}{" "}
                    Token
                  </p>
                  <button
                    // href="#"
                    onClick={() => setSubsctiption(1)}
                    class={`inline-flex items-center px-8 py-2 border-gray-200 border-2 text-sm font-medium text-center text-white ${
                      subscription == 1
                        ? " bg-[#B7E82E] text-black "
                        : " bg-black "
                    } rounded-lg hover:bg-[#B7E82E] hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300  `}
                  >
                    {subscription == 1 ? "Selected" : "Select"}
                  </button>
                </div>
                <div class="  min-w-[80vw]  lg:min-w-[400px] p-6 border border-gray-200 rounded-lg shadow bg-[#010824]">
                  <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Subscription 2
                    </h5>
                  </a>
                  <p class="mb-8 mt-4 font-normal text-gray-700 dark:text-gray-400">
                    Can Handle
                    <span className="text-[#B7E82E] text-lg"> 5</span> Owners
                    and
                    <span className="text-[#B7E82E] "> 10</span> Tokens and a
                    Native Coin
                    <br />
                    <br />
                    <span className="text-white font-bold  text-xl">Price</span>
                    <br />
                    Eth &nbsp; &nbsp; -{" "}
                    {ethers.utils.formatEther(priceEth?.s2).toString()}
                    Eth
                    <br />
                    Coin -{" "}
                    {ethers.utils
                      .formatEther(priceToken?.s2Token)
                      .toString()}{" "}
                    Token
                  </p>
                  <button
                    // href="#"
                    onClick={() => setSubsctiption(2)}
                    class={`inline-flex items-center px-8 py-2 border-gray-200 border-2 text-sm font-medium text-center text-white ${
                      subscription == 2
                        ? " bg-[#B7E82E] text-black  "
                        : " bg-black "
                    } rounded-lg hover:bg-[#B7E82E] hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300  `}
                  >
                    {subscription == 2 ? "Selected" : "Select"}
                  </button>
                </div>
                <div class="  min-w-[80vw]  lg:min-w-[400px] p-6 border border-gray-200 rounded-lg shadow bg-[#010824]">
                  <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Subscription 3
                    </h5>
                  </a>
                  <p class="mb-8 mt-4 font-normal text-gray-700 dark:text-gray-400">
                    Can Handle{" "}
                    <span className="text-[#B7E82E] text-lg"> 10</span> Owners
                    and
                    <span className="text-[#B7E82E] text-lg"> 15</span> Tokens
                    and a Native Coin
                    <br />
                    <br />
                    <span className="text-white font-bold  text-xl">Price</span>
                    <br />
                    Eth &nbsp; &nbsp; -{" "}
                    {ethers.utils.formatEther(priceEth?.s3).toString()}
                    Eth
                    <br />
                    Coin -{" "}
                    {ethers.utils
                      .formatEther(priceToken?.s3Token)
                      .toString()}{" "}
                    Token
                  </p>
                  <button
                    // href="#"
                    onClick={() => setSubsctiption(3)}
                    class={`inline-flex items-center px-8 py-2 border-gray-200 border-2 text-sm font-medium text-center text-white ${
                      subscription == 3
                        ? " bg-[#B7E82E] text-black  "
                        : " bg-black "
                    } rounded-lg hover:bg-[#B7E82E] hover:text-black focus:ring-4 focus:outline-none focus:ring-blue-300  `}
                  >
                    {subscription == 3 ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="min-h-[350px]">
                <div className="w-full md:w-5/12 h-auto md:pr-3 mt-20 "></div>
                <div className="w-[90vw] sm:w-[70vw] mt-20 mx-auto">
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Owners Array
                  </label>
                  <input
                    // ref={ownersRef}
                    value={owners}
                    onChange={(e) => setOwners(e.target.value)}
                    type="text"
                    // id="owners"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="owner1,owner2,owner3"
                    required
                  />
                </div>
                <div className="w-[90vw] sm:w-[70vw] mt-8 mb-20 mx-auto">
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Required Amount
                  </label>
                  <input
                    value={required}
                    onChange={(e) => setRequired(e.target.value)}
                    type="text"
                    // id="owners"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Required Amount"
                    required
                  />
                </div>
                <div className="flex items-center justify-center gap-10">
                  <div class="flex items-center ">
                    <input
                      id="default-radio-1"
                      onClick={(e) => setIsEth(true)}
                      type="radio"
                      checked
                      value=""
                      name="default-radio"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      for="default-radio-1"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Eth
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      onClick={(e) => setIsEth(false)}
                      id="default-radio-2"
                      type="radio"
                      value=""
                      name="default-radio"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      for="default-radio-2"
                      class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Token
                    </label>
                  </div>
                </div>
                {/* <button
                onClick={create}
                className="text-[#B7E82E] border border-[#B7E82E] hover:bg-[#B7E82E] hover:text-black active:bg-[#ffffff] my-20 mx-auto block font-bold uppercase px-8 py-3 rounded outline-none focus:outline-none  ease-linear transition-all duration-150"
                type="button"
              >
                Create Safe
              </button> */}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              {/* <div
                href="#"
                class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Owners
                </h5>

                <li class="font-normal text-gray-700 dark:text-gray-400">
                  Here are the biggest enterprise technology acquisitions of
                  2021 so far, in reverse chronological order.
                </li>
              </div> */}
              <button
                onClick={create}
                className="text-[#B7E82E] border border-[#B7E82E] hover:bg-[#B7E82E] hover:text-black active:bg-[#ffffff] my-20 mx-auto block font-bold uppercase px-8 py-3 rounded outline-none focus:outline-none  ease-linear transition-all duration-150"
                type="button"
              >
                Deploy
              </button>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        <div class="flex flex-row justify-between mx-auto mt-auto relative">
          <button
            onClick={() => setSelectedIndex(selectedIndex - 1)}
            disabled={selectedIndex == 0 ? true : false}
            type="button"
            class="bg-[#B7E82E] text-black rounded-l-md border-r border-gray-100 py-2 hover:bg-[white]  px-3"
          >
            <div class="flex flex-row justify-between align-middle">
              <svg
                class="w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <p class="ml-2">Prev</p>
            </div>
          </button>
          <button
            onClick={() => setSelectedIndex(selectedIndex + 1)}
            disabled={selectedIndex == 2 ? true : false}
            type="button"
            class="bg-[#B7E82E] text-black rounded-r-md py-2 border-l border-gray-200 hover:bg-[white]  px-3"
          >
            <div class="flex flex-row align-middle">
              <span class="mr-2">Next</span>
              <svg
                class="w-5 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </button>
        </div>

        {/* <StepProgressBar
          className="stepper"
          startingStep={0}
          onSubmit={onFormSubmit}
          steps={[
            {
              label: "Subscription",
              // subtitle: '10%',
              name: "step 1",
              content: step1Content,
            },
            {
              label: "MultiSig",
              // subtitle: '50%',
              name: "step 2",
              content: step2Content,
              validator: step2Validator,
            },
            {
              label: "Deploy",
              // subtitle: '100%',
              name: "step 3",
              content: step3Content,
              validator: step3Validator,
            },
          ]}
        /> */}
        {/* <div className="text-center mt-[-60px] text-xl">
          Subscription {subscription}
        </div> */}
      </div>
    </>
  );
}

export default Create;
