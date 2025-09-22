import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Profile', href: '/profile', icon: '👤' },
  { name: 'Leaderboards', href: '/leaderboards', icon: '🏆' },
  { name: 'Tournaments', href: '/tournaments', icon: '♟️' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="bg-lichess-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-lichess-board-light">
                <span className="text-lichess-board-light">♔</span> Lichess Dashboard
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <NavLink key={item.name} to={item.href} isActive={location.pathname === item.href}>
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-lichess-board-light hover:text-white hover:bg-lichess-blue focus:outline-none focus:ring-2 focus:ring-inset focus:ring-lichess-board-light"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <MobileNavLink 
              key={item.name} 
              to={item.href} 
              isActive={location.pathname === item.href}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </MobileNavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, isActive }) => (
  <Link
    to={to}
    className={`${
      isActive
        ? 'border-lichess-board-light text-white'
        : 'border-transparent text-lichess-board-light hover:border-gray-300 hover:text-white'
    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, isActive }) => (
  <Link
    to={to}
    className={`${
      isActive
        ? 'bg-lichess-blue border-lichess-board-light text-white'
        : 'border-transparent text-lichess-board-light hover:bg-lichess-blue hover:bg-opacity-25 hover:border-gray-300 hover:text-white'
    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
  >
    {children}
  </Link>
);
