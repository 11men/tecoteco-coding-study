import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-md mx-auto pb-20">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
