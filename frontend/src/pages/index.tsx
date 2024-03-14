"use client"
import Head from "next/head"
import React, { useState } from "react"
import Image from "next/image"
import Navigation from "@/Components/Navigation"
import styles from "../styles/Home.module.css"

export default function Home() {
  const [account, setAccount] = useState()
  const [toAddress, setToAddress] = useState<string>("")
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [transactionMsg, setTransactionMsg] = useState<string>("")
  const [isTxn, setIsTxn] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>("")

  return (
    <>
      <Navigation />
      <div className={`${styles.container}`}>
        <Head>
          <title>The Thimblerigger</title>
          <meta
            name="description"
            content="Send a million $HUX to your Tezos friends"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={`${styles.main} text-white font-mono`}>

          <Image
            className="mb-4 mt-6 rounded-md"
            src="/thimblerigger.gif"
            alt="thimblerigger"
            width={250*1.1}
            height={150*1.1}
          />

          <p className="mb-10 text-center justify-center text-gray-300 md:text-2xl">
            Hello my friend, please come here! <br />
            Let’s play a game for 3 Tezos: if you find the pea, I will triple
            your bet and give you 9 Tezos back. Click on the button to give me 3
            Tezos and I will mint the outcome to your wallet. <br />
            Let’s go, my friend! I will not stay forever.
          </p>
          <div className="flex flex-col md:flex-row w-full justify-center items-center">
            <button
              type="button"
              className="text-white bg-gradient-to-br from-[#25102f] to-[#1c1c7c] hover:bg-gradient-to-bl font-medium rounded-lg text-base md:px-5 py-2.5 text-center me-2 mb-2 w-5/6 sm:w-2/6  justify-center"
            >
              <span className="flex justify-center text-center">
                Play Game &nbsp;
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </span>
            </button>
          </div>
          {isTxn && <InfoAlert transactionMsg={transactionMsg} />}
          {isSuccess && (
            <SuccessAlert
              transactionMsg={transactionMsg}
              setIsSuccess={setIsSuccess}
            />
          )}
          {isError && (
            <ErrorAlert setIsError={setIsError} errorMsg={errorMsg} />
          )}
        </main>
        {/* <SuccessToast /> */}
        {/* <ErrorToast /> */}
      </div>
    </>
  )
}

const InfoAlert = ({ transactionMsg }: { transactionMsg: string }) => {
  return (
    <div
      id="alert-additional-content-1"
      className="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50"
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="flex-shrink-0 w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <h3 className="text-lg font-medium">
          Your Transaction is in process, Please Wait ...
        </h3>
      </div>

      <div className="mt-2 mb-4 text-sm">- {transactionMsg}</div>
    </div>
  )
}

const SuccessAlert = ({
  transactionMsg,
  setIsSuccess,
}: {
  transactionMsg?: string
  setIsSuccess?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div
      id="alert-additional-content-3"
      className="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50"
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="flex-shrink-0 w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <h3 className="text-lg font-medium">
          Your $HUX were delivered successfully
        </h3>
      </div>
      <div className="mt-2 mb-4 text-sm"></div>
      <div className="flex">
        <a href={transactionMsg} target="_blank">
          <button
            type="button"
            className="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center"
          >
            <svg
              className="me-2 h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 14"
            >
              <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
            </svg>
            View Transaction
          </button>
        </a>
        <button
          type="button"
          className="text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center"
          data-dismiss-target="#alert-additional-content-3"
          aria-label="Close"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

const ErrorAlert = ({
  setIsError,
  errorMsg,
}: {
  setIsError?: React.Dispatch<React.SetStateAction<boolean>>
  errorMsg?: string
}) => {
  return (
    <div
      id="alert-additional-content-2"
      className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50"
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="flex-shrink-0 w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <h3 className="text-lg font-medium">
          There was an Error in the transaction
        </h3>
      </div>
      <div className="mt-2 mb-4 text-sm">- {errorMsg}</div>
      <div className="flex">
        <button
          type="button"
          className="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center"
          data-dismiss-target="#alert-additional-content-2"
          aria-label="Close"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
