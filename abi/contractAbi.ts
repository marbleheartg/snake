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
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'MessageTooLong' },
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
  { type: 'error', inputs: [], name: 'WrongId' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'id', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'message', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Gift',
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
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'exists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'initialOwner', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint8', type: 'uint8' },
      { name: 'message', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newuri', internalType: 'string', type: 'string' }],
    name: 'setURI',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'totalSupply',
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
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadContractBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadContractBalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: contractAbi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"exists"`
 */
export const useReadContractExists = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'exists',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadContractIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: contractAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadContractOwner = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadContractSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: contractAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadContractTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"uri"`
 */
export const useReadContractUri = /*#__PURE__*/ createUseReadContract({
  abi: contractAbi,
  functionName: 'uri',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteContractMint = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
  functionName: 'mint',
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteContractSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: contractAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteContractSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: contractAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteContractSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: contractAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"setURI"`
 */
export const useWriteContractSetUri = /*#__PURE__*/ createUseWriteContract({
  abi: contractAbi,
  functionName: 'setURI',
})

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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateContractMint = /*#__PURE__*/ createUseSimulateContract({
  abi: contractAbi,
  functionName: 'mint',
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateContractSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateContractSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateContractSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link contractAbi}__ and `functionName` set to `"setURI"`
 */
export const useSimulateContractSetUri =
  /*#__PURE__*/ createUseSimulateContract({
    abi: contractAbi,
    functionName: 'setURI',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchContractApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"Gift"`
 */
export const useWatchContractGiftEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'Gift',
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
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchContractTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchContractTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contractAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchContractUriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contractAbi,
    eventName: 'URI',
  })
