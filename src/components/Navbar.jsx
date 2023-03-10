import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CgMenuLeftAlt } from "react-icons/cg";
import { FaPills } from "react-icons/fa";
import { MdCoffeeMaker } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import logo from "./../assets/logo.png";

function Navbar({ wallet, connectWallet, disconnectWallet }) {
  const [isOpen, setIsOpen] = useState(false);
  console.log("Is Open:", isOpen);
  return (
    <>
      <div className="flex justify-between items-center px-4 md:px-24 py-4 p-3 pt-12 rounded-xl">
        <div className="w-1/3 hidden md:block">
          <img
            src={logo}
            width="200rem"
            alt="logo"
            // className="animate-spin-slow"
          />
        </div>
        <div className="w-1/3 hidden md:flex md:justify-center">
          <ul>
            <li className="inline mr-4 cursor-pointer hover:text-[#B7E82E]">
              <Link to="/">Create</Link>
            </li>
            <li className="inline mr-4 cursor-pointer hover:text-[#B7E82E]">
              <Link to="/multisigs">MultiSigs</Link>
            </li>
            <li className="inline mr-4 cursor-pointer hover:text-[#B7E82E]">
              <Link to="/">Transactions</Link>
            </li>
          </ul>
        </div>
        <div className="w-1/3 block md:hidden">
          <CgMenuLeftAlt
            className="text-2xl cursor-pointer hover:text-[#B7E82E]"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        <div className="w-1/3 flex justify-end text-black">
          {typeof window.ethereum !== "undefined" ? (
            wallet?.address ? (
              <button
                onClick={disconnectWallet}
                className="bg-[#B7E82E] border-l-4 border-b-2 md:px-12 px-4 py-2 mr-3 rounded-xl font-semibold"
              >
                {wallet?.address?.slice(0, 5)}...{wallet?.address?.slice(-4)}
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-[#B7E82E] border-l-4 border-b-2 md:px-12 px-4 py-2 mr-3 rounded-xl"
              >
                Connect
              </button>
            )
          ) : (
            <a
              target="_blank"
              href="https://metamask.io/download/"
              className="bg-[#B7E82E] border-l-4 border-b-2 md:px-12 px-4 py-2 mr-3 rounded-xl"
              rel="noreferrer"
            >
              Install Metamask
            </a>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="bg-primary_card px-4 py-2 m-3 rounded-xl">
          <ul>
            <li className="my-3 cursor-pointer hover:underline hover:text-secondary ">
              <Link to="/" className="flex items-center">
                <span>
                  <MdCoffeeMaker className="mr-2" />
                </span>
                Create MultiSig
              </Link>
              <Link to="/multisigs" className="flex items-center">
                <span>
                  <MdCoffeeMaker className="mr-2" />
                </span>
                MultiSigs
              </Link>
              <Link to="/" className="flex items-center">
                <span>
                  <MdCoffeeMaker className="mr-2" />
                </span>
                Transactions
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
