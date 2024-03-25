// GameCard.tsx
import React from "react"

interface GameCardProps {
  gameData: any
  selected: boolean
  onClick: () => void
}

const GameCard: React.FC<GameCardProps> = ({ selected, onClick, gameData }) => {
  let image = "/thimblerigger.gif"
  let redeemed = "Non Redeemable"
  const name = `Game ${gameData.key}`
  const description = `Result: ${gameData.value.result === "0" ? "Won" : "Lost"}`

  if (gameData.value.result === "0") {
    image = `/game_images/success/${gameData.value.result_id}.JPG`
  }
  if (gameData.value.result === "1") {
    image = `/game_images/failure/${gameData.value.result_id}.JPG`
  }
  if (gameData.value.redeemed && gameData.value.result === "0") {
    redeemed = "Redeemed"
  }
  if (!gameData.value.redeemed && gameData.value.result === "0") {
    redeemed = "Not Redeemed"
  }

  return (
    <div
      className={`rounded-md border-2 ${
        selected
          ? "border-[#ff2ea8] bg-[#fad5eb] border-4"
          : "border-white bg-white border-2"
      } cursor-pointer`}
      onClick={onClick}
    >
      <img
        className="rounded-md w-full h-50 md:h-76 object-cover"
        src={image}
        alt={name}
      />
      <div className="px-4 py-2">
        <div className="font-bold text-lg mb-1 text-black">{name}</div>
        <p className="text-gray-800 text-md text-base  ">{description}</p>
        <p className="text-gray-500 text-md text-base">{redeemed}</p>
      </div>
    </div>
  )
}

export default GameCard
