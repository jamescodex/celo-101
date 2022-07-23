// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Gainers {  

    uint256 counter;   
    address cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    address[] internal buyersRecord;
    mapping(uint256 => mapping(address => bool)) internal buyers;
    mapping (uint256 => Good) public goods;
    mapping (address => uint256) internal purchaseCount;
    mapping (address => uint256) internal purchaseAmount;    

    struct Good {
        uint256 id;
        address payable owner;
        string name;
        string description;
        string image;
        uint256 price; 
        uint256 salesCount;       
    }

    // create new good
    function createGood(
        string memory _name,
        string memory _description,
        string memory _image,
        uint256 _price
    ) public {

        uint256 salesCount = 0;

        goods[counter] = Good(
            counter,
            payable(msg.sender),
            _name,
            _description,
            _image,
            _price,
            salesCount        
        );

        counter++;
    }

    // update buyers record
    function updateBuyersRecord(address _buyer) private {
        bool added = false;
        for (uint256 i = 0; i < buyersRecord.length; i++) {
            if (buyersRecord[i] == _buyer) {
                added = true;
            }
        }
        if (!added) {
            buyersRecord.push(_buyer);
        }
    }

    // buy good from market
    function buyGood(uint256 _index) public payable {
        Good storage good = goods[_index];
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                good.owner,
                good.price
            ),
            "Sending funds failed"
        );

        updateBuyersRecord(msg.sender);
        good.salesCount++;
        buyers[_index][msg.sender] = true;
        purchaseCount[msg.sender]++;
        purchaseAmount[msg.sender] += good.price;
    }

    // get top spender
    function getTopSpender() public view returns (address) {
        address topSpender = address(0);
        uint256 highest = 0;
        for (uint256 i = 0; i < buyersRecord.length; i++)  {
            if (purchaseAmount[buyersRecord[i]] > highest) {
                highest = purchaseAmount[buyersRecord[i]];
                topSpender = buyersRecord[i];
            }
        }   
        return (topSpender);
    }

    //
    function getTopSpenderNumber(address _spender) public view returns (uint256) {
        return purchaseAmount[_spender];
    }

    // get top buyer
    function getTopBuyer() public view returns (address) {
        address topBuyer = address(0);
        uint256 highest = 0;
        for (uint256 i = 0; i < buyersRecord.length; i++) {
            if (purchaseCount[buyersRecord[i]] > highest) {
                highest = purchaseCount[buyersRecord[i]];
                topBuyer = buyersRecord[i];
            }
        }
        return topBuyer;
    }

    // 
    function getTopBuyerNumber(address _buyer) public view returns (uint256) {
        return purchaseCount[_buyer];
    }

    //
    function getCounter() public view returns (uint256) {
        return counter;
    }


}