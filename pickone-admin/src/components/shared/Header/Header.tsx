'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useLogoutMutation } from '@/redux/api/authApi';
import { logout } from '@/redux/features/authSlice';
import Dropdown from './UserDropdown';

const Header = () => {
    const [logoutMutation] = useLogoutMutation();

    const router = useRouter();

    const handleLogout = async () => {
        await logoutMutation({});
        logout();
        router.push('/login');
    };

    return (
        <header className="py-4 px-6 rounded-xl text-gray-800 bg-white sticky top-0 left-0 right-0 z-30 shadow-lg border border-gray-100 mb-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    {/* Logo for larger screens */}
                    <div className="hidden lg:block">
                        <div className="flex items-center gap-3">
                            {/* Styled Logo */}
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">EK</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Ekhoni Kinbo
                                </h2>
                                <p className="text-xs text-gray-500">Admin Panel</p>
                            </div>
                        </div>
                    </div>

                    {/* Brand name for mobile/tablet when sidebar is hidden */}
                    <div className="lg:hidden ml-12">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-sm">EK</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Ekhoni Kinbo
                                </h2>
                                <p className="text-xs text-gray-500">Admin Panel</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center text-sm text-gray-600">
                        <span className="font-medium">Admin Dashboard</span>
                    </div>
                    <Dropdown handleLogout={handleLogout} />
                </div>
            </div>
        </header>
    );
};

export default Header;
