import React from 'react'

const Card = ({ card }) => {
  return (
    <div className="card">
      <h2>Random MTG Card</h2>
      {card.name}
      <div>
        <img src={card.image_uris.normal} width="260px" height="362px;" />
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
