'use client';

import React from 'react';
import styled from 'styled-components';
import { useRouter, usePathname } from 'next/navigation';
import { FaTachometerAlt, FaArrowUp, FaArrowDown, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { darkTheme } from '@/styles/darkTheme';

// --- STYLED COMPONENTS ---

const SidebarContainer = styled.div`
    width: ${darkTheme.sidebar.width};
    height: 100vh;
    padding: 25px 0;
    background: ${darkTheme.background.sidebar};
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 4px 0 30px rgba(2, 8, 20, 0.5);
    border-right: 1px solid ${darkTheme.border.light};
    display: flex;
    flex-direction: column;
    gap: 25px;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 0;

    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(27, 211, 255, 0.2);
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: rgba(27, 211, 255, 0.4);
    }

    /* Subtle cyan glow on the right edge */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background: linear-gradient(180deg, transparent 0%, ${darkTheme.accent.cyan} 50%, transparent 100%);
        opacity: 0.3;
    }
`;

const AppTitleContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0 20px 20px 20px;
    border-bottom: 1px solid ${darkTheme.border.light};
    animation: fadeIn 0.5s ease-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const AppTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: ${darkTheme.text.primary};
    text-shadow: 0 0 30px rgba(27, 211, 255, 0.3);
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px 20px;
    margin: 0 15px 20px 15px;
    border-radius: ${darkTheme.radius.lg};
    background: ${darkTheme.background.glass};
    border: 1px solid ${darkTheme.border.light};
    transition: ${darkTheme.transition.normal};

    &:hover {
        background: ${darkTheme.background.glassHover};
        border-color: ${darkTheme.border.accent};
    }
`;

const UserInfo = styled.div`
    flex: 1;
    overflow: hidden;
`;

const UserName = styled.p`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${darkTheme.text.primary};
    margin: 0 0 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const UserEmail = styled.p`
    font-size: 0.8rem;
    color: ${darkTheme.text.secondary};
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const NavItem = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 14px 20px;
    cursor: pointer;
    border-radius: ${darkTheme.radius.lg};
    margin: 5px 15px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    overflow: hidden;
    font-weight: 500;
    font-size: 0.95rem;
    position: relative;
    background: ${props => props.isActive
        ? darkTheme.sidebar.activeBg
        : 'transparent'};
    color: ${props => props.isActive ? darkTheme.accent.cyan : darkTheme.text.secondary};
    box-shadow: ${props => props.isActive
        ? darkTheme.sidebar.activeGlow
        : 'none'};
    border: 1px solid ${props => props.isActive
        ? 'rgba(27, 211, 255, 0.2)'
        : 'transparent'};

    /* Left glow indicator for active state */
    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: ${props => props.isActive ? '60%' : '0'};
        background: ${darkTheme.accent.cyan};
        border-radius: 0 4px 4px 0;
        box-shadow: ${props => props.isActive ? darkTheme.accent.glowCyan : 'none'};
        transition: height 0.3s ease;
    }

    & > svg {
        color: ${props => props.isActive ? darkTheme.accent.cyan : darkTheme.text.secondary};
        font-size: 1.1rem;
        transition: all 0.3s ease;
    }

    &:hover {
        background: ${props => props.isActive
            ? darkTheme.sidebar.activeBg
            : darkTheme.sidebar.hoverBg};
        color: ${props => props.isActive ? darkTheme.accent.cyan : darkTheme.text.primary};
        transform: translateX(4px);
        box-shadow: ${props => props.isActive
            ? darkTheme.sidebar.activeGlow
            : 'none'};
        border-color: ${props => props.isActive
            ? 'rgba(27, 211, 255, 0.3)'
            : 'rgba(255, 255, 255, 0.1)'};

        & > svg {
            color: ${props => props.isActive ? darkTheme.accent.cyan : darkTheme.text.primary};
            transform: scale(1.1);
        }
    }

    &:active {
        transform: translateX(2px) scale(0.98);
    }
`;

const LogoutButton = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    margin: auto 15px 20px 15px;
    border-radius: ${darkTheme.radius.lg};
    background: ${darkTheme.background.glass};
    color: ${darkTheme.text.secondary};
    border: 1px solid ${darkTheme.border.light};
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: none;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);

    /* Subtle inner glow */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
        border-radius: ${darkTheme.radius.lg} ${darkTheme.radius.lg} 0 0;
    }

    &:hover {
        background: ${darkTheme.background.glassHover};
        border-color: rgba(239, 68, 68, 0.3);
        color: #ef4444;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
    }

    &:active {
        transform: translateY(0);
        box-shadow: none;
    }

    & > svg {
        font-size: 1.1rem;
        transition: transform 0.3s ease;
    }

    &:hover > svg {
        transform: rotate(-15deg);
    }
`;

// --- SIDEBAR COMPONENT LOGIC ---

const Sidebar = ({ onLogout }) => {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path) => {
        if (path === '/dashboard') return pathname === '/dashboard' || pathname === '/';
        return pathname === path;
    };

    const handleNavigation = (path) => {
        router.push(path);
    };

    const handleLogoutClick = async () => {
        if (onLogout) {
            await onLogout();
        } else {
            router.push('/login');
        }
    };

    return (
        <SidebarContainer>

            <AppTitleContainer>
                <AppTitle>Expense Tracker</AppTitle>
            </AppTitleContainer>

            <nav>
                <NavItem
                    onClick={() => handleNavigation('/dashboard')}
                    isActive={isActive('/dashboard')}
                >
                    <FaTachometerAlt /> Dashboard
                </NavItem>

                <NavItem
                    onClick={() => handleNavigation('/income')}
                    isActive={isActive('/income')}
                >
                    <FaArrowUp /> Income
                </NavItem>

                <NavItem
                    onClick={() => handleNavigation('/expense')}
                    isActive={isActive('/expense')}
                >
                    <FaArrowDown /> Expense
                </NavItem>

                {/* Teams integration */}
                <NavItem
                    onClick={() => handleNavigation('/teams')}
                    isActive={isActive('/teams')}
                >
                    <FaUsers /> Teams
                </NavItem>
            </nav>

            <LogoutButton onClick={handleLogoutClick}>
                <FaSignOutAlt />
                Logout
            </LogoutButton>

        </SidebarContainer>
    );
};

export default Sidebar;
