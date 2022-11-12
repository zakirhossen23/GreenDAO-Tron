import { Button } from "@heathmont/moon-core-tw";
import Head from "next/head";
import { useEffect, useState } from "react";
import NavLink from "next/link";
import SlideShow from '../../../../../components/components/Slideshow';
import useContract from '../../../../../services/useContract';

import isServer from "../../../../../components/isServer";
import { Header } from "../../../../../components/layout/Header";
import styles from "../../../daos.module.css";
let IdeasEnd = "";
let IdeasWaiting = false;
let running = false;
export default function GrantIdeas() {
  //variables
  const [eventId, setIdeasId] = useState(-1);
  const [imageList, setimageList] = useState([]);
  const [IdeasURI, setIdeasURI] = useState({ ideasId: "", Title: "", Description: "", wallet: "", logo: "", End_Date: "", voted: 0, isVoted: true, allfiles: [] });

  const [AccountAddress, setAccountAddress] = useState("");
  const { contract, signerAddress } = useContract();

  const [count, setCount] = useState(0);
  const formatter = new Intl.NumberFormat("en-US", {
    //Converting number into comma version
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sleep = (milliseconds) => {
    //Custom Sleep function to wait
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  let m;
  let id = ""; //Ideas id from url
  let Goalid = ""; //Goal id
  function LeftDate(datetext) {
    //String date to dd/hh/mm/ss format

    var c = new Date(datetext).getTime();
    var n = new Date().getTime();
    var d = c - n;
    var da = Math.floor(d / (1000 * 60 * 60 * 24));
    var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((d % (1000 * 60)) / 1000);
    return (
      da.toString() +
      " Days " +
      h.toString() +
      " hours " +
      m.toString() +
      " minutes " +
      s.toString() +
      " seconds"
    );
  }
  function LeftDateBid(datetext) {
    //String date to d/h/m/s format

    var c = new Date(datetext).getTime();
    var n = new Date().getTime();
    var d = c - n;
    var da = Math.floor(d / (1000 * 60 * 60 * 24));
    var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((d % (1000 * 60)) / 1000);
    if (IdeasEnd === "Finished" && s.toString().includes("-")) {
      return "Ideas Ended";
    } else if (
      s.toString().includes("-") &&
      IdeasWaiting === true &&
      IdeasEnd !== "Finished"
    ) {
      return "Waiting for release";
    } else {
      return (
        da.toString() +
        "d " +
        h.toString() +
        "h " +
        m.toString() +
        "m " +
        s.toString() +
        "s" + " left"
      );
    }
  }

  
  useEffect(() => {
    fetchContractData()
  }, [contract])
  
  useEffect(() => {
    DesignSlide();
  });

  if (isServer()) return null;
  const regex = /\[(.*)\]/g;
  const str = decodeURIComponent(window.location.search);

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches

    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    id = m[1];
  }

  async function fetchContractData() {
    try {
      if (contract && id) {
        setAccountAddress(signerAddress);
        setIdeasId(id); //setting Ideas id
        id = Number(id);

        const ideaURI = await contract.ideas_uri(Number(id)).call(); //Getting ideas uri
        const object = JSON.parse(ideaURI); //Getting ideas uri
        Goalid = await contract.get_goal_id_from_ideas_uri(ideaURI).call();


        const goalURI = JSON.parse(await contract.goal_uri(Number(Goalid)).call()); //Getting goal URI
        let isvoted = false;
        const Allvotes = await contract.get_ideas_votes_from_goal(Number(Goalid), Number(id)).call(); //Getting all votes
        for (let i = 0; i < Allvotes.length; i++) {
          const element = Allvotes[i];
          if (element === signerAddress) isvoted = true;
        }

        setIdeasURI({
          ideasId: id,
          Title: object.properties.Title.description,
          Description: object.properties.Description.description,
          wallet: object.properties.wallet.description,
          logo: object.properties.logo.description.url,
          End_Date: goalURI.properties.End_Date?.description,
          voted: Object.keys(Allvotes).length,
          isVoted: isvoted,
          allfiles: object.properties.allFiles
        })

        setimageList(object.properties.allFiles);

        if (document.getElementById("Loading"))
          document.getElementById("Loading").style = "display:none";


      }
    } catch (error) {
      console.error(error);
    }
    running = false;
  }

  async function DesignSlide() {

    if (document.querySelector('[data-type="prev"]') !== null) {
      document.querySelector('[data-type="prev"]').innerHTML = '<div class="undefined nav " data-type="prev" aria-label="Previous Slide" style="width: 45px;margin-right: -50px;cursor: pointer;"><div class="undefined nav " data-type="prev" aria-label="Previous Slide" style="color: black;cursor: pointer;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79 79"><svg xmlns="http://www.w3.org/2000/svg" width="79" height="79" fill="none"><g filter="url(#filter0_b_48_4254)"><circle cx="39.5" cy="39.5" r="39.5" fill="white"></circle><circle cx="39.5" cy="39.5" r="39.25" stroke="#C4C4C4" stroke-width="0.5"></circle></g><path d="M29.0556 39.9087L42.3821 26.6582C42.8187 26.2244 43.5256 26.2251 43.9615 26.6605C44.3971 27.0958 44.3959 27.801 43.9592 28.2353L31.426 40.6971L43.9597 53.1588C44.3963 53.5931 44.3974 54.2979 43.9619 54.7333C43.7434 54.9515 43.4572 55.0606 43.1709 55.0606C42.8854 55.0606 42.6002 54.9522 42.3821 54.7355L29.0556 41.4854C28.8453 41.2768 28.7273 40.9929 28.7273 40.6971C28.7273 40.4013 28.8456 40.1177 29.0556 39.9087Z" fill="black"></path><defs><filter id="filter0_b_48_4254" x="-4" y="-4" width="87" height="87" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feGaussianBlur in="BackgroundImageFix" stdDeviation="2"></feGaussianBlur><feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_48_4254"></feComposite><feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_48_4254" result="shape"></feBlend></filter></defs></svg></svg></div></div>'
      document.querySelector('[data-type="next"]').innerHTML = '<div class="undefined nav " data-type="next" aria-label="Next Slide" style="width: 45px;margin-left: -17px;cursor: pointer;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79 79" fill="#2e2e2e"><svg width="79" height="79" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_b_48_4262)"><circle cx="39.5" cy="39.5" r="39.5" fill="white"></circle><circle cx="39.5" cy="39.5" r="39.25" stroke="#C4C4C4" stroke-width="0.5"></circle></g><path d="M43.9596 41.4853L30.6331 54.7358C30.1965 55.1697 29.4896 55.169 29.0537 54.7336C28.6181 54.2982 28.6192 53.593 29.0559 53.1588L41.5892 40.697L29.0555 28.2352C28.6188 27.801 28.6177 27.0962 29.0532 26.6608C29.2717 26.4425 29.558 26.3334 29.8443 26.3334C30.1298 26.3334 30.4149 26.4418 30.633 26.6585L43.9596 39.9087C44.1699 40.1173 44.2879 40.4012 44.2879 40.697C44.2879 40.9928 44.1696 41.2763 43.9596 41.4853Z" fill="black"></path><defs><filter id="filter0_b_48_4262" x="-4" y="-4" width="87" height="87" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood><feGaussianBlur in="BackgroundImageFix" stdDeviation="2"></feGaussianBlur><feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_48_4262"></feComposite><feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_48_4262" result="shape"></feBlend></filter></defs></svg></svg></div>'
      document.querySelector('.react-slideshow-zoom-wrapper').classList.add("rounded-xl");
      document.querySelector('.react-slideshow-container').classList.add("overflow-hidden rounded-xl");
      document.querySelector('.react-slideshow-container').style.height = "500px";
    }
  }

  setInterval(function () {
    calculateTimeLeft();
  }, 1000);

  function calculateTimeLeft() {
    //Calculating time left
    try {
      var allDates = document.getElementsByName("dateleft");
      for (let i = 0; i < allDates.length; i++) {
        var date = allDates[i].getAttribute("date");
        allDates[i].innerHTML = LeftDate(date);
      }
      var allDates = document.getElementsByName("date");
      for (let i = 0; i < allDates.length; i++) {
        var date = allDates[i].getAttribute("date");
        if (date !== undefined && date !== "") {
          allDates[i].innerHTML = LeftDateBid(date);
        }
      }
    } catch (error) { }
  }


  async function VoteIdees() {
    await contract.create_goal_ideas_vote(Number(Goalid), Number(id), signerAddress).send({
      feeLimit:1_000_000_000,
      shouldPollResponse:false
    });
    window.location.reload();
  }


  return (
    <>
      <Head>
        <title>{IdeasURI.Title}</title>
        <meta name="description" content={IdeasURI.Title} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div className={`${styles.container} flex flex-col items-center gap-8`}>
        <div className={`${styles.title} flex flex-col gap-2`}>
          <h1 className="text-moon-32 font-bold pb-2">{IdeasURI.Title}</h1>
          <div>
            <a className="text-piccolo" dateleft={IdeasURI.End_Date}>
              {LeftDate(IdeasURI.End_Date)}
            </a>
          </div>
          <p>{IdeasURI.Description}</p>
          <p>Voted: {IdeasURI.voted}</p>
        </div>
        <div className={`${styles.tabtitle} flex gap-4 justify-start`}>
          <a className={`tab block px-3 cursor-pointer py-2 text-3xl text-[#0000ff]`} >
            Ideas
          </a>
          {(!IdeasURI.isVoted) ? (<><Button data-element-id="btn_donate" style={{ width: '147px' }} data-analytic-event-listener="true" onClick={() => { VoteIdees() }}>
            Vote
          </Button></>) : (<></>)}

        </div>
        <div className={styles.divider}></div>
        <>
          <div className={`flex gap-8`}>
            {(imageList.length > 1) ? (<><SlideShow className={styles.slideshow} images={imageList} />
            </>) : (<><div className="flex-1 rounded-xl overflow-hidden flex" style={{ height: '500px' }}>
              <img type={imageList[0]?.type} src={imageList[0]?.url} alt="" />
            </div></>)}


          </div>
        </>
      </div>

    </>
  );
}
