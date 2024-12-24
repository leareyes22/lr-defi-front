# Challenge-Front
Create a basic repo in React where you are going to code a couple of exercises with basic logic in a clean and simple manner.
The idea is to use redux state management or useContext and viem/wagmi library to communicate with the blockchain.

## **Keypoints:**

- Understand how the blockchain and contracts work.
- What are viem/wagmi and how to integrate them into a repo.
- Connect a wallet to your app.
- Detect the wrong network and allow the user to switch chains.
- Fetch allowances and balances: show them and manipulate them.
  - Humanize the data.
  - Perform calculations.
  - Inputs and buttons with check validations and UI/UX states (loadings, invalid, errors, etc).
- Write methods on the blockchain.
  - Transfer tokens.
  - Increase and decrease allowance.

## Technologies you should use:

- Nextjs or Vite.
- Router/dom.
- useConext or Redux (Actions/Thunks, Reducer, Selectors).
- Viem / Wagmi.
- Rainbowkit/Rabbykit/Blocknative/Web3modal.
- Prettier/Linter.
- TypeScript.

  
## Tools:
- How to use etherscan: Etherscan is really usefull to develop since you can see the actual contract and check the read/write methods that this contracts has, also use them (read methods are free to use, write of course you will need to pay for the tx).

# Frontend Exercise
Create a repository with a React app that:

- Allows you connect your wallet.
- Detect the wrong network and allows you to switch between chains (Sepolia and Polygon Mumbai).
- Fetch balances of DAI and USDC tokens.
- Displays both balances in a readable/human way.
- Has an input for wallet address to set selected/target user.
- Has an input for each token to enter the amount of tokens to be approved or transfered.
- Has 2 buttons for each token: APPROVE and TRANSFER.
- The inputs have the correct validations hooked to the buttons and also an error message to show to the user ('not enough funds', 'need to approve token first', etc). All of this is calculated/validated with the amount the user types.
- Allows the user to TRANSFER the token to the selected address
- Allows the user to APPROVE the token to the selected address
- Some UNIT tests.
- Allows you to call the Mint() function to get some tokens to test the app.

## Bonuses:

- Organized folder/files structure.
- Well defined state architecture.
- Buttons with loading state.
- Detect that you are in the correct network.
- Some E2E tests.
- UI/UX.
  - Design: custom or using a lib (material, etc).
  - Animations.
  - Responsive.

NOTE: you can add anything you want to the UI.

# Sepolia:
- Get Testnet ETH: https://www.alchemy.com/faucets/ethereum-sepolia
- Sepolia ERC20 contracts:
  - 18 decimals: 0x1D70D57ccD2798323232B2dD027B3aBcA5C00091 [DAI]
  - 6 decimals: 0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47 [USDC]

# Steps to run in DEV environment
1. Run `npm install` command to install dependencies.
2. Create an .env file.
3. Setup your WalletConnect ProjectId in your .env file `VITE_WALLETCONNECT_PROJECT_ID`.
4. Run `npm run dev` command.
5. Optional - Run `npm run test` command to run unit tests.
