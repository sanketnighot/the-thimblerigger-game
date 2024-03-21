import React from "react"
import { EXPLORER, HUX_CONTRACT_ADDRESS } from "@/utils/config"


const Navigation = () => {
  return (
    <>
      <nav className="fixed w-full z-20 bottom-0 start-0 py-2 bg-[#8728c6]">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-5 md:mx-auto text-center">
          <p className="w-full justify-center items-center text-center text-white">
            <a 
            href={`${EXPLORER}/${HUX_CONTRACT_ADDRESS}`} 
            target="_blank"
            className="text-white underline hover:text-[#7c7cff]"
            >
              $HUX contract
              </a>
              : A project by Max Haarich / 
              Twitter: &nbsp;
              <a
              href="https://x.com/UzupisMUC" 
              target="_blank"
              className="text-white underline hover:text-[#7c7cff]"
            >
                UzupisMUC
              </a>
          </p>
        </div>
      </nav>
    </>
  )
}

export default Navigation
