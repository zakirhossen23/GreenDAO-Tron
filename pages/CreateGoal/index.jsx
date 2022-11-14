import React, { useEffect, useState } from "react";
import Head from "next/head";
import UseFormInput from "../../components/components/UseFormInput";
import UseFormTextArea from "../../components/components/UseFormTextArea";
import { Header } from "../../components/layout/Header";
import NavLink from "next/link";
import isServer from "../../components/isServer";
import useContract from '../../services/useContract'
import { NFTStorage, File } from "nft.storage";
import styles from "./CreateGoal.module.css";
import { Button } from "@heathmont/moon-core-tw";
import { GenericPicture, ControlsPlus } from "@heathmont/moon-icons-tw";

export default function CreateGoal() {
  const [GoalImage, setGoalImage] = useState([]);
  const [GoalRules, setGoalRules] = useState([]);
  const { contract, signerAddress } = useContract()
  if (isServer()) return null;

  //Storage API for images and videos
  const NFT_STORAGE_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8";
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  //Input fields
  const [GoalTitle, GoalTitleInput] = UseFormInput({
    defaultValue: "",
    type: "text",
    placeholder: "Goal name",
    id: "",
  });

  const [GoalDescription, GoalDescriptionInput] = UseFormTextArea({
    defaultValue: "",
    placeholder: "Goal Description",
    id: "",
    rows: 4,
  });


  const [EndDate, EndDateInput] = UseFormInput({
    defaultValue: "",
    type: "datetime-local",
    placeholder: "End date",
    id: "enddate",
  });

  const [Budget, BudgetInput] = UseFormInput({
    defaultValue: "",
    type: "text",
    placeholder: "Budget",
    id: "goal",
  });
  let id = -1;


  async function CheckTransaction() {
    let params = (new URL(window.location)).searchParams;
    if (params.get("transactionHashes") !== null) {
      window.location.href = `/daos`;
    }
  }

  CheckTransaction();


  //Function after clicking Create Goal Button
  async function createGoal() {
    var CreateGoalBTN = document.getElementById("CreateGoalBTN");
    CreateGoalBTN.disabled = true;
    let allFiles = [];
    for (let index = 0; index < GoalImage.length; index++) {
      //Gathering all files link
      const element = GoalImage[index];
      const metadata = await client.storeBlob(element);
      const urlImageGoal = {
        url: "https://" + metadata + ".ipfs.nftstorage.link",
        type: element.type,
      };
      allFiles.push(urlImageGoal);
    }

    //Creating an object of all information to store in EVM
    const createdObject = {
      title: "Asset Metadata",
      type: "object",
      properties: {
        Title: {
          type: "string",
          description: GoalTitle,
        },
        Description: {
          type: "string",
          description: GoalDescription,
        },
        Budget: {
          type: "string",
          description: Budget,
        },
        End_Date: {
          type: 'string',
          description: EndDate,
        },
        wallet: {
          type: "string",
          description: signerAddress,
        },
        logo: {
          type: "string",
          description: allFiles[0],
        },
        allFiles,
      },
    };
    console.log("======================>Creating Goal");
    try {

      // Creating Goal in Rust Smart contract
      await contract.create_goal(JSON.stringify(createdObject),Number(id)).send({
        feeLimit:1_000_000_000,
        shouldPollResponse:false
      });

    } catch (error) {
      console.error(error);
      // window.location.href = "/login?[/]"; //If found any error then it will let the user to login page
    }
    window.location.href = `/daos/dao?[${id}]`; //After the success it will redirect the user to dao page

  }

  function CreateGoalBTN() {
    return (
      <>
        <div className="flex gap-4 justify-end">
          <NavLink href="/daos">
            <Button variant="secondary">Cancel</Button>
          </NavLink>
          <Button id="CreateGoalBTN" onClick={createGoal}>
            <ControlsPlus className="text-moon-24" />
            Create goal
          </Button>
        </div>
      </>
    );
  }
  function FilehandleChange(goal) {
    // If user uploaded images/videos
    var allNames = [];
    for (let index = 0; index < goal.target.files.length; index++) {
      const element = goal.target.files[index].name;
      allNames.push(element);
    }
    for (let index2 = 0; index2 < goal.target.files.length; index2++) {
      setGoalImage((pre) => [...pre, goal.target.files[index2]]);
    }
  }
  if (!isServer()) {
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);
    let m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      id = m[1];
    }
  }
  function AddBTNClick(goal) {
    //Clicking on +(Add) Function
    var GoalImagePic = document.getElementById("GoalImage");
    GoalImagePic.click();
  }

  function DeleteSelectedImages(goal) {
    //Deleting the selected image
    var DeleteBTN = goal.currentTarget;
    var idImage = Number(DeleteBTN.getAttribute("id"));
    var newImages = [];
    var allUploadedImages = document.getElementsByName("deleteBTN");
    for (let index = 0; index < GoalImage.length; index++) {
      if (index != idImage) {
        const elementDeleteBTN = allUploadedImages[index];
        elementDeleteBTN.setAttribute("id", newImages.length.toString());
        const element = GoalImage[index];
        newImages.push(element);
      }
    }
    setGoalImage(newImages);
  }

  return (
    <>
      <Head>
        <title>Create Goal</title>
        <meta name="description" content="Create Goal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div
        className={`${styles.container} flex items-center justify-center flex-col gap-8`}
      >
        <div className={`${styles.title} gap-8 flex flex-col`}>
          <h1 className="text-moon-32 font-bold">Create goal</h1>

        </div>
        <div className={styles.divider}></div>
        <div className={`${styles.form} flex flex-col gap-8`}>
          <div>
            <h6>Goal name</h6>
            {GoalTitleInput}
          </div>

          <div>
            <h6>Description</h6>
            {GoalDescriptionInput}
          </div>
          <div className="flex gap-8 w-full">
            <div className="flex-1">
              <h6>Budget</h6>
              {BudgetInput}
            </div>
          </div>
          <div className="flex gap-8 w-full">
            <div className="flex-1">
              <h6>End Date</h6>
              {EndDateInput}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h6>Content</h6>
            <div style={{ borderColor: '#6578F2' }} className="border-4 border-dashed content-start flex flex-row flex-wrap gap-4 h-full inset-0 justify-start m-auto overflow-auto p-1 relative text-center text-white w-full z-20">
              <input
                className="file-input"
                hidden
                onChange={FilehandleChange}
                id="GoalImage"
                name="GoalImage"
                type="file"
                multiple="multiple"
              />
              <div className="flex gap-4">
                {GoalImage.map((item, i) => {
                  return (
                    <>
                      <div key={i} className="flex gap-4">
                        <button
                          onClick={DeleteSelectedImages}
                          name="deleteBTN"
                          id={i}
                        >
                          {item.type.includes("image") ? (
                            <img
                              className={styles.image}
                              src={URL.createObjectURL(item)}
                            />
                          ) : (
                            <>
                              <div className="Goal-Uploaded-File-Container">

                                <span className="Goal-Uploaded-File-name">
                                  {item.name.substring(0, 10)}...
                                </span>
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  );
                })}
                <div className="Goal-ImageAdd">
                  <Button
                    id="Add-Image"
                    onClick={AddBTNClick}
                    variant="secondary"
                    style={{ height: 80, padding: "1.5rem" }}
                    iconLeft
                    size="lg"
                  >
                    <GenericPicture className="text-moon-24" />
                    Add image
                  </Button>
                </div>
              </div>
            </div>
          </div>
    
          <CreateGoalBTN />
        </div>
        <div className={styles.divider}></div>
      </div>
    </>
  );
}
