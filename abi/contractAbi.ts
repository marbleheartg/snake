import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Contract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const contractAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'InsufficientFee' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidScore' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'WithdrawFailed' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'score',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GamePlayed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'score',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'position',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'LeaderboardUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'score',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NewGlobalRecord',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'score',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NewPersonalBest',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOP_SIZE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'bestScore',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'gamesPlayed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLeaderboard',
    outputs: [
      {
        name: '',
        internalType: 'struct Contract.LeaderboardEntry[10]',
        type: 'tuple[10]',
        components: [
          { name: 'player', internalType: 'address', type: 'address' },
          { name: 'score', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'player', internalType: 'address', type: 'address' }],
    name: 'getPlayerStats',
    outputs: [
      { name: '_bestScore', internalType: 'uint256', type: 'uint256' },
      { name: '_gamesPlayed', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'globalBestPlayer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'globalBestScore',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'initialOwner', internalType: 'address', type: 'address' },
      { name: 'initialPlayFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'leaderboard',
    outputs: [
      { name: 'player', internalType: 'address', type: 'address' },
      { name: 'score', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'playFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newFee', internalType: 'uint256', type: 'uint256' }],
    name: 'setPlayFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'score', internalType: 'uint256', type: 'uint256' }],
    name: 'submitScore',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalGamesPlayed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__
 */
export const useReadContract = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"TOP_SIZE"`
 */
export const useReadContractTopSize = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'TOP_SIZE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"bestScore"`
 */
export const useReadContractBestScore = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'bestScore',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"gamesPlayed"`
 */
export const useReadContractGamesPlayed = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'gamesPlayed',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"getLeaderboard"`
 */
export const useReadContractGetLeaderboard =
  /*#__PURE__*/ createUseReadContract({
    abi: contractAbi,
    functionName: 'getLeaderboard',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"getPlayerStats"`
 */
export const useReadContractGetPlayerStats =
  /*#__PURE__*/ createUseReadContract({
    abi: contractAbi,
    functionName: 'getPlayerStats',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"globalBestPlayer"`
 */
export const useReadContractGlobalBestPlayer =
  /*#__PURE__*/ createUseReadContract({
    abi: contractAbi,
    functionName: 'globalBestPlayer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"globalBestScore"`
 */
export const useReadContractGlobalBestScore =
  /*#__PURE__*/ createUseReadContract({
    abi: contractAbi,
    functionName: 'globalBestScore',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"leaderboard"`
 */
export const useReadContractLeaderboard = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'leaderboard',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadContractOwner = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"playFee"`
 */
export const useReadContractPlayFee = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'playFee',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"totalGamesPlayed"`
 */
export const useReadContractTotalGamesPlayed =
  /*#__PURE__*/ createUseReadContract({
    abi: contractAbi,
    functionName: 'totalGamesPlayed',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__
 */
export const useWriteContract = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteContractInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteContractRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: contractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"setPlayFee"`
 */
export const useWriteContractSetPlayFee = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
  functionName: 'setPlayFee',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"submitScore"`
 */
export const useWriteContractSubmitScore = /*#__PURE__*/ createUseWriteContract(
  { abi: contractAbi, functionName: 'submitScore' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteContractTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: contractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteContractWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__
 */
export const useSimulateContract = /*#__PURE__*/ createUseSimulateContract({
  abi: contractAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateContractInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"setPlayFee"`
 */
export const useSimulateContractSetPlayFee =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'setPlayFee',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"submitScore"`
 */
export const useSimulateContractSubmitScore =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'submitScore',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateContractWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__
 */
export const useWatchContractEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: contractAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"GamePlayed"`
 */
export const useWatchContractGamePlayedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'GamePlayed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchContractInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"LeaderboardUpdated"`
 */
export const useWatchContractLeaderboardUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'LeaderboardUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"NewGlobalRecord"`
 */
export const useWatchContractNewGlobalRecordEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'NewGlobalRecord',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"NewPersonalBest"`
 */
export const useWatchContractNewPersonalBestEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'NewPersonalBest',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'OwnershipTransferred',
  })
