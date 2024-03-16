import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { dappClient } from "../utils/walletconnect"

const Navigation = () => {
  const [account, setAccount] = useState<string | null>(null)
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false)
  const router = useRouter()
  const isActive = (href: string) => router.pathname === href

  useEffect(() => {
    (async () => {
      // TODO 5.b - Get the active account
      const accounts = await dappClient().getAccount()
      if (accounts.success === true) {
        setAccount(accounts.account?.address)
      } else {
        setAccount(null)
      }
    })()
  }, [account])

  const connectWallet = async () => {
    await dappClient().CheckIfWalletConnected()
    const accounts = await dappClient().getAccount()
    if (accounts.success === true) {
      setAccount(accounts.account?.address)
    } else {
      setAccount(null)
    }
  }

  const disconnectWallet = async () => {
    await dappClient().disconnectWallet()
    const accounts = await dappClient().getAccount()
    if (accounts.success === true) {
      setAccount(accounts.account?.address)
    } else {
      setAccount(null)
    }
  }

  return (
    <>
      <nav className="bg-transparent fixed w-full z-20 top-0 start-0 py-4">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-3xl font-extrabold whitespace-nowrap text-white">
              The Thimblerigger
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="text-white bg-gradient-to-br from-[#e3c129] to-[#758256] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center hidden md:flex"
              onClick={account ? disconnectWallet : connectWallet}
            >
              {!account ? (
                <span className="flex justify-center items-center">
                  Connect Wallet &nbsp;
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                    />
                  </svg>
                </span>
              ) : (
                <span className="flex justify-center items-center">
                  Disconnect {account.slice(0, 10)}... &nbsp;
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                </span>
              )}
            </button>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-yellow-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-sticky"
              aria-expanded="false"
              onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            {isDropdownVisible && (
              <div className="absolute right-4 w-56 mt-12 origin-top-right bg-[#3a0f4df5] divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-white ring-opacity-5 py-5 px-2 border border-gray-500">
                <div className="px-1 py-2">
                  <button
                    type="button"
                    className="text-white bg-gradient-to-br from-[#e3c129] to-[#758256] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center w-full"
                    onClick={account ? disconnectWallet : connectWallet}
                  >
                    {!account ? (
                      <span className="flex justify-center items-center">
                        Connect Wallet &nbsp;
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span className="flex justify-center items-center">
                        Disconnect {account.slice(0, 10)}... &nbsp;
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
                <div className="px-1 py-2">
                  <a
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    Game
                  </a>
                  <a
                    href="/mygames"
                    className="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    My Games
                  </a>
                </div>
              </div>
            )}
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 text-xl"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:bg-transparent">
              <li>
                <a
                  href="/"
                  className={`block py-2 px-3 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-300 md:p-0 ${isActive("/") ? "text-red-500" : ""}`}
                  aria-current="page"
                >
                  Play Game
                </a>
              </li>
              <li>
                <a
                  href="/mygames"
                  className={`block py-2 px-3 text-gray-100 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-300 md:p-0 ${isActive("/mygames") ? "text-red-500" : ""}`}
                >
                  My Games
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navigation
