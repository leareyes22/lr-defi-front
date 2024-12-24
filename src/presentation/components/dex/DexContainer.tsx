import { ChangeEvent } from 'react';
import {
  Button,
  Card,
  Input,
  Typography,
  Tooltip,
} from '@material-tailwind/react';
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address, formatUnits, isAddress, parseUnits } from 'viem';
import abi from '../../../core/web3/ERC20.abi.json';
import { useAppDispatch, useAppSelector } from '../../../core/store';
import { AssetOptions } from '../../../core';
import {
  clearError,
  resetState,
  setAmount,
  setDestinationAddress,
  setError,
  setIsLoading,
  setToken,
  setTransactionHash,
} from '../../../core/store/dex/dexSlice';
import { Loader } from '../loader/Loader';
import { ErrorMessage } from '../error/ErrorMessage';
import { TokensSelect } from '../select/TokensSelect';

interface ApproveCall {
  spenderAddress: Address;
  amount: number;
}

interface MintCall {
  address: Address;
  amount: number;
}

interface TransferCall {
  toAddress: Address;
  amount: number;
}

export const DexContainer = () => {
  // Redux global state
  const {
    amount,
    destinationAddress,
    errors,
    isLoading,
    token,
    transactionHash,
  } = useAppSelector((state) => state.dex);
  const dispatch = useAppDispatch();

  // Wagmi state hooks
  const configChainId = useChainId();
  const { address, chainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { data: balance } = useReadContract({
    abi,
    address: token.address as Address,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!address && !!token.address,
    },
  });
  const { data: allowance } = useReadContract({
    abi,
    address: token.address as Address,
    functionName: 'allowance',
    args: [address, destinationAddress],
    query: {
      enabled: !!address && !!token.address && !!destinationAddress,
    },
  });
  const { isLoading: txIsLoading } = useWaitForTransactionReceipt({
    hash: transactionHash,
    confirmations: 1,
    query: {
      enabled: transactionHash !== '0x',
    },
  });

  // Formatted token balance and allowance
  const formattedBalance = balance
    ? formatUnits(BigInt(balance.toString()), token.decimals)
    : 0.0;
  const formattedAllowance = allowance
    ? formatUnits(BigInt(allowance.toString()), token.decimals)
    : 0.0;

  // Form handlers
  const onPasteDestinationAddress = async () => {
    const copiedAddress = await navigator.clipboard.readText();

    if (!copiedAddress) return;

    dispatch(setDestinationAddress(copiedAddress));
    dispatch(clearError('destinationAddress'));
  };

  const onChangeDestinationAddress = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setDestinationAddress(e.target.value));
    dispatch(clearError('destinationAddress'));
  };

  const onChangeToken = (value?: string) => {
    if (!value) return;

    const token = AssetOptions.find((token) => token.address === value);

    if (!token) return;

    dispatch(
      setToken({
        address: token.address,
        decimals: token.decimals,
        label: token.label,
      })
    );
  };

  const onChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setAmount(e.target.valueAsNumber));
    dispatch(clearError('amount'));
  };

  // Contract calls
  const mint = async ({ address, amount }: MintCall) => {
    if (amount <= 0) {
      dispatch(
        setError({
          field: 'amount',
          message: 'Amount must be greater than zero.',
        })
      );
    }

    if (!address || amount <= 0) return;

    const txHash = await writeContractAsync({
      abi,
      address: token.address as Address,
      functionName: 'mint',
      args: [address, parseUnits(amount.toString(), token.decimals)],
    });

    dispatch(setTransactionHash(txHash));
    dispatch(resetState());
  };

  const approve = async ({ spenderAddress, amount }: ApproveCall) => {
    try {
      if (!isAddress(spenderAddress)) {
        dispatch(
          setError({
            field: 'destinationAddress',
            message: 'Destination address must be a valid address.',
          })
        );
      }

      if (amount <= 0) {
        console.log('amount must be greater than zero');
        dispatch(
          setError({
            field: 'amount',
            message: 'Amount must be greater than zero.',
          })
        );
      }

      if (amount > Number(formattedBalance)) {
        dispatch(
          setError({
            field: 'amount',
            message: `Insufficient ${token.label} balance.`,
          })
        );
      }

      if (
        !isAddress(spenderAddress) ||
        amount <= 0 ||
        amount > Number(formattedBalance)
      )
        return;

      dispatch(setIsLoading({ method: 'approve', isLoading: true }));

      const txHash = await writeContractAsync({
        abi,
        address: token.address as Address,
        functionName: 'approve',
        args: [spenderAddress, parseUnits(amount.toString(), token.decimals)],
      });

      dispatch(setTransactionHash(txHash));
      dispatch(resetState());
    } catch (error) {
      dispatch(setIsLoading({ method: 'approve', isLoading: false }));
    }
  };

  const transfer = async ({ toAddress, amount }: TransferCall) => {
    try {
      if (!isAddress(toAddress)) {
        dispatch(
          setError({
            field: 'destinationAddress',
            message: 'Destination address must be a valid address.',
          })
        );
      }

      if (amount <= 0) {
        dispatch(
          setError({
            field: 'amount',
            message: 'Amount must be greater than zero.',
          })
        );
      }

      if (amount > Number(formattedAllowance)) {
        dispatch(
          setError({
            field: 'amount',
            message: `Insufficient ${token.label} allowance.`,
          })
        );
      }

      if (amount > Number(formattedBalance)) {
        dispatch(
          setError({
            field: 'amount',
            message: `Insufficient ${token.label} balance.`,
          })
        );
      }

      if (
        !isAddress(toAddress) ||
        amount <= 0 ||
        amount > Number(formattedAllowance) ||
        amount > Number(formattedBalance)
      )
        return;

      dispatch(setIsLoading({ method: 'transfer', isLoading: true }));

      const txHash = await writeContractAsync({
        abi,
        address: token.address as Address,
        functionName: 'transfer',
        args: [toAddress, parseUnits(amount.toString(), token.decimals)],
      });

      dispatch(setTransactionHash(txHash));
      dispatch(resetState());
    } catch (error) {
      dispatch(setIsLoading({ method: 'transfer', isLoading: false }));
    }
  };

  return (
    <Card
      shadow={true}
      className="p-4 bg-gradient-to-r from-gray-100 to-teal-100 w-96"
    >
      <Typography className="p-2" variant="h5" color="black">
        DeFi Page
      </Typography>
      <div>
        <div className="p-2 flex">
          <Input
            crossOrigin=""
            label="Destination Address"
            className="rounded-r-none"
            value={destinationAddress}
            onChange={onChangeDestinationAddress}
            error={!!errors['destinationAddress']}
          />
          <Tooltip content="Click to paste address!">
            <Button
              ripple={false}
              variant="text"
              color="blue-gray"
              className="h-10 w-14 shrink-0 rounded-l-none border border-l-0 border-blue-gray-200 bg-transparent px-3"
              onClick={onPasteDestinationAddress}
            >
              <i className="fa-solid fa-paste" />
            </Button>
          </Tooltip>
        </div>
        <ErrorMessage error={errors['destinationAddress']} />
      </div>
      <div className="p-2 flex justify-between">
        <TokensSelect
          label={'Select an Asset'}
          value={token.address}
          onChange={onChangeToken}
          options={AssetOptions}
        />
        <Tooltip
          content={`Click to mint ${token.label} to the connected wallet!`}
        >
          <Button
            disabled={
              !isAddress(token.address) || !address || configChainId !== chainId
            }
            className="ml-2"
            variant="gradient"
            color="teal"
            onClick={() =>
              mint({
                address: address as Address,
                amount: amount ?? 0,
              })
            }
          >
            Mint
          </Button>
        </Tooltip>
      </div>
      <div className="p-2">
        <strong>Balance: </strong>
        {formattedBalance}
      </div>
      <div className="p-2">
        <strong>Allowance: </strong>
        {formattedAllowance}
      </div>
      <div className="bg-neutral-400 rounded-md p-2 font-semibold">
        <Input
          crossOrigin=""
          label="Amount"
          min={0}
          type="number"
          value={amount || ''}
          onChange={onChangeAmount}
          error={!!errors['amount']}
        />
        <ErrorMessage error={errors['amount']} />
      </div>
      <div className="flex justify-between pb-4 pt-4 font-semibold">
        <Button
          disabled={
            !isAddress(token.address) || !address || configChainId !== chainId
          }
          variant="gradient"
          color="purple"
          onClick={() =>
            approve({
              spenderAddress: destinationAddress as Address,
              amount: amount ?? 0,
            })
          }
          loading={isLoading['approve']}
        >
          Approve
        </Button>
        <Button
          disabled={
            !isAddress(token.address) || !address || configChainId !== chainId
          }
          variant="gradient"
          onClick={() =>
            transfer({
              toAddress: destinationAddress as Address,
              amount: amount ?? 0,
            })
          }
          loading={isLoading['transfer']}
        >
          Transfer
        </Button>
      </div>
      <Loader txIsLoading={txIsLoading} />
    </Card>
  );
};
