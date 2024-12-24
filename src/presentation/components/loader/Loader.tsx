import { Spinner } from '@material-tailwind/react';

interface Props {
  txIsLoading: boolean;
}

export const Loader = ({ txIsLoading }: Props) => {
  return txIsLoading ? (
    <div className="flex justify-center">
      <Spinner className="mr-2" />
      Transaction in progress...
    </div>
  ) : null;
};
