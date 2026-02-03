import { NavLink } from 'react-router-dom';

interface Props {
  path: string;
  icon?: string;
  title: string;
}

export const NavbarMenuItem = ({ path, icon, title }: Props) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex justify-center items-center rounded-md p-2 transition-colors mr-2 fade-in shadow-md ${
          isActive
            ? 'bg-teal-800 text-gray-100'
            : 'hover:bg-teal-800 hover:text-gray-100  text-black'
        }`
      }
    >
      <div className="flex items-center">
        <i className={`${icon} text-2xl mr-4 text-teal-500`} />
        <span className="text-lg font-semibold">{title}</span>
      </div>
    </NavLink>
  );
};
