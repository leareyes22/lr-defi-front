import { Outlet } from 'react-router-dom';
import { Footer, Navbar } from '../../components';

export const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex flex-grow items-center justify-center p-2">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
