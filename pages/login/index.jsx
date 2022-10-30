import React, { useState, useEffect } from "react";
import { Header } from "../../components/layout/Header";
import Head from "next/head";
import styles from "./Login.module.scss";
import Button  from "@heathmont/moon-core-tw/lib/button/Button";
import GenericCheckRounded  from "@heathmont/moon-icons-tw/lib/icons/GenericCheckRounded";
import GenericClose  from "@heathmont/moon-icons-tw/lib/icons/GenericClose";
import isServer from "../../components/isServer";

let redirecting = "";
export default function Login() {
  const [ConnectStatus, setConnectStatus] = useState(true);

  if (!isServer()) {
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);
    let m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      redirecting = m[1];
    }
  }



  const fetchDataStatus = async () => {
    if (
       window.localStorage.getItem("login-type") == "TronLink"
    ) {
      setConnectStatus(true);
    } else {
      setConnectStatus(false);
    }
  };
  useEffect(() => {
    if (!isServer()) {
      setInterval(() => {
        if ( window.localStorage.getItem("login-type") == "TronLink") {
          window.location.href = redirecting;
        }
        fetchDataStatus();
      }, 1000);
    }
  }, []);
  if (isServer()) return null;


  function TronLinkWallet() {
    if (typeof window.tronLink === "undefined") {
      return (
        <>
          <div className="flex gap-6 flex w-full items-center">
            <div
              style={{ height: 80, width: 80, border: "1px solid #EBEBEB" }}
              className="p-4 rounded-xl"
            >
                <img src="https://www.tronlink.org/favicon.ico" />
            </div>
            <div className="flex flex-1 flex-col">
            <span className="font-bold">TronLink Nile wallet</span>
           
            </div>
            <Button onClick={onClickConnect} style={{ width: 148 }}>
              Install TronLink
            </Button>
          </div>
        </>
      );
    }
    if (window.localStorage.getItem("login-type") !== "TronLink") {
      return (
        <>
          <div className="flex gap-6 flex w-full items-center">
            <div
              style={{ height: 80, width: 80, border: "1px solid #EBEBEB" }}
              className="p-4 rounded-xl"
            >
                <img src="https://www.tronlink.org/favicon.ico" />
            </div>
            <div className="flex flex-1 flex-col">
            <span className="font-bold">TronLink Nile wallet</span>
              <span
                className="flex items-center gap-1"
                style={{ color: "#FF4E64" }}
              >
                <GenericClose
                  className="text-moon-32"
                  color="#FF4E64"
                ></GenericClose>
                Disconnected
              </span>
            </div>
            <Button onClick={onClickConnect} style={{ width: 112 }}>
              Connect
            </Button>
          </div>
        </>
      );
    }
    if ( window.localStorage.getItem("login-type") == "TronLink") {
      return (
        <>
          <div className="flex gap-6 flex-1 w-full items-center">
            <div
              style={{ height: 80, width: 80, border: "1px solid #EBEBEB" }}
              className="p-4 rounded-xl"
            >
              <img src="https://www.tronlink.org/favicon.ico" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-bold">TronLink Nile wallet</span>
              <span
                className="flex items-center gap-1"
                style={{ color: "#40A69F" }}
              >
                <GenericCheckRounded
                  className="text-moon-32"
                  color="#40A69F"
                ></GenericCheckRounded>
                Connected
              </span>
            </div>
            <Button
              onClick={onClickDisConnect}
              variant="secondary"
              style={{ width: 112 }}
            >
              Disconnect
            </Button>
          </div>
        </>
      );
    }
  }
  async function onClickConnect() {
     if (typeof window.tronLink === "undefined") {
      window.open(
        "https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec",
        "_blank"
      );
      return;
     }
    let result = await window.tronWeb.request({ method: 'tron_requestAccounts' });
    result;
    window.localStorage.setItem('loggedin', 'true')
    window.localStorage.setItem('login-type', "TronLink");
  }
  async function onClickDisConnect() {
    window.localStorage.setItem('loggedin', 'false')
    window.localStorage.setItem('login-type', "");
  }

  

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="GreenDAO - Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div className={`${styles.container} flex items-center flex-col gap-8`}>
        <div className={`${styles.title} gap-8 flex flex-col`}>
          <h1 className="text-moon-32 font-bold">Login to your account</h1>
          <p className="text-trunks">Please connect to TronLink Nile wallet in order to login.</p>
        </div>
        <div className={styles.divider}></div>
        <div className={`${styles.title} flex flex-col items-center gap-8`}>
          <TronLinkWallet />
        </div>

      </div>
    </>
  );
}
