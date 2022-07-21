import React from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import BigNumber from "bignumber.js";
import "./Home.css";

const Home = ({ goods, buyGood, wallet }) => {
  const iconFromAddress = (_address) => {
    return <Jazzicon diameter={50} seed={jsNumberForAddress(_address)} />;
  };
  return (
    <div className="home">
      {goods?.map((good) => (
        <div className="good-card">
          <div className="good-image">
            <img src={good.image} />
          </div>
          <div className="good-details">
            <div className="good-details-d">
              <div className="owner">{iconFromAddress(good.owner)}</div>
              <div className="price">
                ${BigNumber(good.price).shiftedBy(-18).toString()}
              </div>
            </div>
            <div className="good-props">
              <div className="good-name">{good.name}</div>
              <div className="good-description">{good.description}</div>
            </div>
            <div className="good-details-s">Sold {good.sales}</div>
            {good.owner !== wallet && (
              <div
                className="buy-button"
                onClick={() => buyGood(good.id, good.price)}
              >
                Buy
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
