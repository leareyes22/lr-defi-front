import { Select, Option } from '@material-tailwind/react';
import { v7 } from 'uuid';
import { Token } from '../../../interfaces';

interface Props {
  label: string;
  value: string;
  onChange: (value?: string) => void;
  options?: Token[];
}

export const TokensSelect = ({
  label,
  value,
  onChange,
  options = [],
}: Props) => {
  return (
    <Select label={label} value={value} onChange={onChange}>
      {options.length
        ? options.map(({ address, label }) => {
            return (
              <Option key={v7()} value={address}>
                {label}
              </Option>
            );
          })
        : null}
    </Select>
  );
};
