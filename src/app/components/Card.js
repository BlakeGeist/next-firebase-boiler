import React from 'react'
import Link from 'next/link'

const Card = ({ card }) => {
  return (
    <div className="card">
      <h2>Random MTG Card</h2>
      {card.name}
      <div>
        <Link href="/c/[id]" as={`/c/${card.multiverse_ids}`}>
          <a><img src={card.image_uris.normal} width="260px" height="362px;" /></a>
        </Link>
      </div>
      <p>Prices: ${card.prices.usd}</p>
      <style jsx>{`
        .card{
          text-align: center;
        }
      `}</style>
    </div>
  )
};

export default Card;
