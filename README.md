# ChainForge - Decentralized Task Marketplace

A decentralized task marketplace MVP where users post tasks with ETH escrow, workers claim and complete tasks, and smart contracts automatically release payments.

## Features

- **Post Tasks**: Create tasks with ETH locked in escrow
- **Claim Tasks**: Workers can browse and claim available tasks
- **Complete & Approve**: Workers mark tasks complete, creators approve and release payment
- **Automatic Payments**: Smart contract releases 98% to worker, 2% platform fee
- **FORGE Token**: ERC20 token for future fee discounts

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Web3**: RainbowKit, Wagmi, Viem
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Network**: Base Sepolia Testnet

## Quick Start

### Prerequisites

- Node.js 18+
- MetaMask wallet
- Base Sepolia ETH ([Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))
- WalletConnect Project ID ([Get one](https://cloud.walletconnect.com))

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Add your WalletConnect Project ID to .env.local
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy Contracts

```bash
# Add your private key to .env.local
# PRIVATE_KEY=0x...

# Compile contracts
npx hardhat compile

# Deploy to Base Sepolia
npx hardhat run contracts/scripts/deploy.ts --network baseSepolia

# Add deployed addresses to .env.local
# NEXT_PUBLIC_TASK_ESCROW_ADDRESS=0x...
# NEXT_PUBLIC_FORGE_TOKEN_ADDRESS=0x...
```

## Project Structure

```
chainforge/
├── contracts/
│   ├── TaskEscrow.sol      # Main escrow contract
│   ├── ForgeToken.sol      # ERC20 token
│   └── scripts/deploy.ts   # Deployment script
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with providers
│   │   ├── page.tsx        # Homepage
│   │   ├── providers.tsx   # Web3 providers
│   │   └── tasks/
│   │       ├── page.tsx    # Task list
│   │       └── create/page.tsx  # Create task
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── TaskCard.tsx
│   │   └── CreateTaskForm.tsx
│   ├── hooks/
│   │   └── useTaskContract.ts  # Contract interaction hooks
│   └── lib/
│       ├── contracts.ts    # ABIs and addresses
│       └── utils.ts        # Utilities
├── .env.example
├── hardhat.config.ts
└── README.md
```

## Smart Contracts

### TaskEscrow.sol

Main contract for task management and escrow:

- `createTask(taskId)`: Create task with ETH escrow
- `claimTask(taskId)`: Worker claims task
- `completeTask(taskId)`: Worker marks complete
- `approveTask(taskId)`: Creator approves, releases payment
- `cancelTask(taskId)`: Creator cancels unclaimed task

### ForgeToken.sol

Standard ERC20 token:
- Name: Forge Token
- Symbol: FORGE
- Total Supply: 100,000,000

## How to Use

1. **Connect Wallet**: Click "Connect Wallet" and select MetaMask
2. **Switch to Base Sepolia**: Make sure you're on Base Sepolia network
3. **Get Test ETH**: Use the [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
4. **Post a Task**: Go to "Post a Task", fill in details, submit
5. **Claim a Task**: Browse tasks, click "Claim Task" on an open task
6. **Complete & Get Paid**: Mark complete, wait for creator approval

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project ID |
| `NEXT_PUBLIC_TASK_ESCROW_ADDRESS` | Deployed TaskEscrow contract address |
| `NEXT_PUBLIC_FORGE_TOKEN_ADDRESS` | Deployed ForgeToken contract address |
| `PRIVATE_KEY` | Wallet private key for deployment |

## Deployed Contracts

| Contract | Address |
|----------|---------|
| TaskEscrow | `0xde38Deb08456259d2d42Dfc7b59DFE65d524038f` |
| ForgeToken | `0x7023CD468BC5A14A6277AA6172870c7205674dB0` |

## License

MIT

---

Built for hackathon. Powered by Base Sepolia.
