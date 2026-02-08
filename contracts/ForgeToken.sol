// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ForgeToken
 * @dev Standard ERC20 token for the ChainForge platform.
 * Used for fee discounts and governance.
 */
contract ForgeToken is ERC20 {
    // Total supply: 100,000,000 FORGE (18 decimals)
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18;

    constructor() ERC20("Forge Token", "FORGE") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
