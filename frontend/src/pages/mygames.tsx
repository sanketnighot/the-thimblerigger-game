// redeem.tsx
import React, { useState } from "react"
import Navigation from "@/Components/Navigation"
import GameCard from "@/Components/GameCard" // Adjust the import path as necessary
import styles from "../styles/Home.module.css"

const games = [
  {
    image: "/thimblerigger.gif",
    name: "Game 1",
    description: "Description for Game 1",
  },
  {
    image: "/thimblerigger.gif",
    name: "Game 2",
    description: "Description for Game 2",
  },
  {
    image: "/thimblerigger.gif",
    name: "Game 1",
    description: "Description for Game 1",
  },
  {
    image: "/thimblerigger.gif",
    name: "Game 2",
    description: "Description for Game 2",
  },
  {
    image: "/thimblerigger.gif",
    name: "Game 2",
    description: "Description for Game 2",
  },
  {
    image: "/thimblerigger.gif",
    name: "Game 1",
    description: "Description for Game 1",
  },
  {
    image: "/thimblerigger.gif",
    name: "Game 2",
    description: "Description for Game 2",
  },
  {
    image: "/thimblerigger.gif",
    name: "Game 2",
    description: "Description for Game 2",
  },
  {
    image: "/thimblerigger.gif",
    name: "Game 1",
    description: "Description for Game 1",
  },
  // Add more games as needed
]
const MyGames = () => {
  const [selectedGames, setSelectedGames] = useState<number[]>([])

  const handleGameSelect = (game: number) => {
    setSelectedGames((prevSelectedGames) => {
      if (prevSelectedGames.includes(game)) {
        return prevSelectedGames.filter((g) => g !== game)
      } else {
        return [...prevSelectedGames, game]
      }
    })
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto mt-32 h-[92vh] text-center bg-fixed">
        {" "}
        {/* Increase the top margin here */}
        <h1 className="text-5xl font-bold mb-4 text-gray-300">Your Games</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-10 overflow-y-auto max-h-[70vh] p-4 border-2 rounded-xl mx-4">
          {games.map((game, index) => (
            <GameCard
              key={index}
              image={game.image}
              name={game.name}
              description={game.description}
              selected={selectedGames.includes(index)}
              onClick={() => handleGameSelect(index)}
            />
          ))}
        </div>
        <div className="flex justify-center my-5">
          <button
            type="button"
            className="text-white bg-gradient-to-br from-[#9b831d] to-[#85975b] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-8 py-2 text-center w-auto"
          >
            <span className="flex items-center justify-center">
              Redeem &nbsp;
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
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

export default MyGames
