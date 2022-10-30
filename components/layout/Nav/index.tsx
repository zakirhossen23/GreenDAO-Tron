import React, { useState, useEffect } from "react";
import NavLink from "next/link";
import { Button } from "@heathmont/moon-core-tw";
import { SoftwareLogOut } from "@heathmont/moon-icons-tw";
import isServer from "../../../components/isServer";

declare let window: any;
let running = false;
export function Nav(): JSX.Element {
  const [acc, setAcc] = useState('');
  const [Balance, setBalance] = useState("");
  const [count, setCount] = useState(0);


  const [isSigned, setSigned] = useState(false);
  async function fetchInfo() {
    if (window.tronLink == undefined) {
      window.document.getElementById("withoutSign").style.display = "none";
      window.document.getElementById("withSign").style.display = "none";
      window.document.getElementById("installTronLink").style.display = "";
      running = false;
      return;
    }
    if (window.localStorage.getItem("login-type") === "TronLink") {
      if (window.accountId !== undefined && window.accountId !== "") {
        try {
        
          let Balance = await window.tronWeb.trx.getBalance(window.accountId);

          let subbing = 10;

          if (window.innerWidth > 500) {
            subbing = 20;
          }
          setAcc(window.accountId.toString().substring(0, subbing) + "...");
          setBalance(Balance / 1000000 + " TRX");
          if (!isSigned)
            setSigned(true);

          window.document.getElementById("withoutSign").style.display = "none";
          window.document.getElementById("withSign").style.display = "";
          running = false; 
           return;
        } catch (error) {
          console.error(error);
          running = false;
          return;
        }

      } else {
        running = false;
        return;
      }

    } else {
      setSigned(false);
      window.document.getElementById("withoutSign").style.display = "";
      window.document.getElementById("withSign").style.display = "none";
    }
  }
  useEffect(() => {
    if (!running) {
      if (!isSigned || acc === "") {
      
        running = true;
        fetchInfo();
      }
    }
    if ( acc !== ""){running = false;}           
  },[count]);


  setInterval(() => {
    if (!isServer()) {
     
   if (document.readyState === "complete" && !running ){
     setCount(count + 1); 

   }
    }
  }, 1000)


  async function onClickDisConnect() {
    window.localStorage.setItem("loggedin", "");
    window.localStorage.setItem('login-type', "");
    window.location.href = "/";
  }

  return (
    <nav className="main-nav w-full flex justify-between items-center">
      <ul className="flex justify-between items-center w-full">
        {isSigned ? (<>

          <li>
              <a  href="/daos" >
                <Button style={{ background: "none" }}> DAO</Button>
              </a>
          </li>
          <li>
              <a  href="/CreateDao">
                <Button style={{ background: "none" }}>Create DAO</Button>
              </a>
          </li>
        </>) : (<></>)}

        <li className="Nav walletstatus flex flex-1 justify-end">
          <div className="py-2 px-4 flex row items-center" id="withoutSign">
       
              <a href="/login?[/]">
                <Button variant="tertiary">Log in</Button>
              </a>
          </div>
          <div
            id="installTronLink"
            style={{ display: "none" }}
            className="wallets"
          >
            <div className="wallet">
              <Button variant="tertiary" onClick={() => { window.open("https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec", "_blank") }}> TronLink</Button>
            </div>
          </div>

          <div id="withSign" className="wallets" style={{ display: "none" }}>
            <div
              className="wallet"
              style={{ height: 48, display: "flex", alignItems: "center" }}
            >
              <div className="wallet__wrapper gap-4 flex items-center">
                <div className="wallet__info flex flex-col items-end">
                  <a className="text-primary">
                    <div className="font-light text-goten">{acc}</div>
                  </a>
                  <div className="text-goten">{Balance}</div>
                </div>
                <Button iconOnly onClick={onClickDisConnect}>
                  <SoftwareLogOut
                    className="text-moon-24"
                    transform="rotate(180)"
                  ></SoftwareLogOut>
                </Button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
}
