import React from "react";
import BigNumber from "bignumber.js";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import "./Dashboard.css";

const Dashboard = ({
  topBuyer,
  topBuyerNumber,
  topSpender,
  topSpenderNumber,
}) => {
  const iconFromAddress = (_address) => {
    return <Jazzicon diameter={80} seed={jsNumberForAddress(_address)} />;
  };

  const truncateAddress = (address) => {
    if (!address) return;
    return (
      address.slice(0, 5) +
      "..." +
      address.slice(address.length - 4, address.length)
    );
  };

  return (
    <div className="dashboard">
      <div className="section">
        <div className="section-title">Top Spender</div>
        <hr />
        {topSpender ? (
          <div className="section-details">
            <div className="icon">{iconFromAddress(topSpender)}</div>
            <div>
              <a
                href={`https://alfajores-blockscout.celo-testnet.org/address/${topSpender}/transactions`}
              >
                {truncateAddress(topSpender)}
              </a>
            </div>
            <div className="value">
              ${BigNumber(topSpenderNumber).shiftedBy(-18).toString()} spent
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>None yet</div>
        )}
      </div>
      <div className="section">
        <div className="section-title">Top Buyer</div>
        <hr />
        {topBuyer ? (
          <div className="section-details">
            <div className="icon">{iconFromAddress(topBuyer)}</div>
            <div>
              <a
                href={`https://alfajores-blockscout.celo-testnet.org/address/${topBuyer}/transactions`}
              >
                {truncateAddress(topBuyer)}
              </a>
            </div>
            <div className="value">{topBuyerNumber} purchases</div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>None yet</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
