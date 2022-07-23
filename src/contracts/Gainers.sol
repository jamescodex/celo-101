// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Gainers {
    uint256 private counter;
    address private cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    address[] private buyersRecord;
    mapping(address => bool) private isBuyer;
    mapping(uint256 => mapping(address => bool)) private buyers;
    mapping(uint256 => Good) private goods;
    mapping(address => uint256) private purchaseCount;
    mapping(address => uint256) private purchaseAmount;
    mapping(uint => bool) private exists;

    struct Good {
        address payable owner;
        string name;
        string description;
        string image;
        uint256 price;
        uint256 salesCount;
    }

    modifier exist(uint _index) {
        require(exists[_index], "Query of non existent good");
        _;
    }

    /// @dev create new good
    function createGood(
        string calldata _name,
        string calldata _description,
        string calldata _image,
        uint256 _price
    ) public {
        require(_price > 0, "Price needs to be at least one wei");
        require(bytes(_name).length > 0, "Empty name");
        require(bytes(_description).length > 0, "Empty description");
        require(bytes(_image).length > 0, "Empty image url");
        uint256 salesCount = 0;
        exists[counter] = true;
        goods[counter] = Good(
            payable(msg.sender),
            _name,
            _description,
            _image,
            _price,
            salesCount
        );

        counter++;
    }

    /// @dev get good with id of _index
    function checkGood(uint256 _index)
        public
        view
        exist(_index)
        returns (
            address payable owner,
            string memory name,
            string memory description,
            string memory image,
            uint256 price,
            uint256 salesCount
        )
    {
        Good memory good = goods[_index];
        owner = good.owner;
        name = good.name;
        description = good.description;
        image = good.image;
        price = good.price;
        salesCount = good.salesCount;
    }

    /// @dev buy a good from the marketplace
    function buyGood(uint256 _index) external payable exist(_index) {
        require(
            goods[_index].owner != msg.sender,
            "owner can't buy his own good"
        );
        Good storage good = goods[_index];
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                good.owner,
                good.price
            ),
            "Sending funds failed"
        );
        if (isBuyer[msg.sender] == false) {
            isBuyer[msg.sender] = true;
            buyersRecord.push(msg.sender);
        }
        good.salesCount++;
        buyers[_index][msg.sender] = true;
        purchaseCount[msg.sender]++;
        purchaseAmount[msg.sender] += good.price;
    }

    /// @dev gets top spender
    function getTopSpender() public view returns (address, uint) {
        address topSpender = address(0);
        uint256 highest = 0;
        for (uint256 i = 0; i < buyersRecord.length; i++) {
            if (purchaseAmount[buyersRecord[i]] > highest) {
                highest = purchaseAmount[buyersRecord[i]];
                topSpender = buyersRecord[i];
            }
        }
        return (topSpender, highest);
    }

    /// @dev gets top buyer
    function getTopBuyer() public view returns (address, uint) {
        address topBuyer = address(0);
        uint256 highest = 0;
        for (uint256 i = 0; i < buyersRecord.length; i++) {
            if (purchaseCount[buyersRecord[i]] > highest) {
                highest = purchaseCount[buyersRecord[i]];
                topBuyer = buyersRecord[i];
            }
        }
        return (topBuyer, highest);
    }

    /// @dev returns the purchaseCount and purchaseAmount of address user
    function getPurchaseDetails(address user) public view returns (uint, uint) {
        require(user != address(0), "Invalid address");
        return (purchaseAmount[user], purchaseCount[user]);
    }

    /// @dev returns the number of Goods listed
    function getCounter() public view returns (uint256) {
        return counter;
    }
}
