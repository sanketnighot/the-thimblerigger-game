"use client"
import Head from "next/head"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import Navigation from "@/Components/Navigation"
import styles from "../styles/Home.module.css"
import { GAME_CONTRACT_ADDRESS, GAME_FEES } from "@/utils/config"
import { dappClient } from "../utils/walletconnect"
import { toast } from "react-toastify"

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      // TODO 5.b - Get the active account
      const accounts = await dappClient().getAccount()
      if (accounts.success === true) {
        setAccount(accounts.account?.address)
      } else {
        setAccount(null)
      }
    })()
  }, [])

  const playGame = async () => {
    try {
      toast.info("Preparing to play game ...")
      await dappClient().CheckIfWalletConnected()
      const accounts = await dappClient().getAccount()
      if (accounts.success === true) {
        setAccount(accounts.account?.address)
      } else {
        setAccount(null)
      }
      const tezos = await dappClient().tezos()
      const game_contract = await tezos.wallet.at(GAME_CONTRACT_ADDRESS)
      const operation = await game_contract.methodsObject
        .play()
        .send({ amount: GAME_FEES, mutez: true })
      toast.promise(operation.confirmation(), {
        pending: "Waiting for confirmation ...",
        success: "Transaction Successful!",
        error: "Error in operation",
      })
      console.log(operation.opHash)
    } catch (error: any) {
      console.log(error)
      toast.error("Error: " + error.message)
    }
  }

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
            width={250 * 1.1}
            height={150 * 1.1}
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
              onClick={playGame}
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
        </main>
      </div>
    </>
  )
}
