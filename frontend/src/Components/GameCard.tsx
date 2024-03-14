// GameCard.tsx
import React from "react"

interface GameCardProps {
  image: string
  name: string
  description: string
  selected: boolean
  onClick: () => void
}

const GameCard: React.FC<GameCardProps> = ({
  image,
  name,
  description,
  selected,
  onClick,
}) => {
  return (
    <div
      className={`game-card rounded-md border-2  ${selected ? "border-[#ff2ea8] bg-[#fad5eb] border-4" : "border-white bg-white border-2"}`}
      onClick={onClick}
    >
      <img
        className="rounded-md w-full h-72 object-cover"
        src={image}
        alt={name}
      />
      <div className="px-4 py-2">
        <div className="font-bold text-lg mb-1 text-black">{name}</div>
        <p className="text-gray-500 text-md">{description}</p>
      </div>
    </div>
  )
}

export default GameCard
