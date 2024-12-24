import { v7 } from 'uuid';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { menuRoutes } from '../../router';
import { NavbarMenuItem } from './NavbarMenuItem';

export const Navbar = () => {
  return (
    <nav className="flex justify-between bg-teal-800 bg-opacity-30 p-2 m-2 rounded">
      {menuRoutes.map((menuItem) => {
        return <NavbarMenuItem key={v7()} {...menuItem} />;
      })}
      <div className="flex flex-1" />
      <ConnectButton />
    </nav>
  );
};
