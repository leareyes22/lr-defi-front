import { Typography } from '@material-tailwind/react';

interface Props {
  error?: string;
}

export const ErrorMessage = ({ error }: Props) => {
  return error ? (
    <Typography className="pl-2" variant="small" color="red">
      {error}
    </Typography>
  ) : null;
};
