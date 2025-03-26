import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { menuConfig } from '../menuConfig';

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (path: string) => {
    setOpenMenu(openMenu === path ? null : path);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4">
          <h2 className="text-xl font-bold">Menu</h2>
          <ul className="mt-4">
            {menuConfig.map((menu) => (
              <li key={menu.path}>
                <div
                  className="flex items-center justify-between py-2 px-4 hover:bg-gray-700 cursor-pointer"
                  onClick={() => toggleMenu(menu.title)}
                >
                  <div className="flex items-center">
                    <menu.icon />
                    <Link to={menu.path} className="ml-2">
                      {menu.title}
                    </Link>
                  </div>
                  {menu.subMenu && (
                    <span>{openMenu === menu.path ? '-' : '+'}</span>
                  )}
                </div>
                {menu.subMenu && openMenu === menu.title && (
                  <ul className="ml-4">
                    {menu.subMenu.map((sub) => (
                      <li key={sub.path} className="flex items-center py-1 px-4 hover:bg-gray-700">
                        <sub.icon />
                        <Link to={sub.path} className="ml-2">
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900 text-white p-4">
          <h1 className="text-2xl">Header</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 