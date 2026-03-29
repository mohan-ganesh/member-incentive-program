import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Activity,
  Wallet,
  Gift,
  Trophy,
  Settings,
  Bell,
  Users,
  BookOpen,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState } from 'react';

const memberNav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/activities', label: 'Activities', icon: Activity },
  { to: '/ledger', label: 'Points Ledger', icon: Wallet },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/gamification', label: 'Achievements', icon: Trophy },
];

const adminNav = [
  { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  { to: '/admin/programs', label: 'Programs', icon: BookOpen },
  { to: '/admin/activities', label: 'Activities', icon: Activity },
  { to: '/admin/rules', label: 'Rules Engine', icon: Shield },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/redemptions', label: 'Redemptions', icon: Gift },
];

export function Layout() {
  const { state, dispatch, getBalance, getUnreadCount } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const balance = getBalance();
  const unreadCount = getUnreadCount();
  const nav = state.viewMode === 'admin' ? adminNav : memberNav;

  const levelColors: Record<string, string> = {
    bronze: 'bg-amber-700',
    silver: 'bg-zinc-400',
    gold: 'bg-yellow-500',
    platinum: 'bg-purple-500',
  };

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-6 border-b border-zinc-200">
          <h1 className="text-xl font-bold text-emerald-600 flex items-center gap-2">
            <Activity className="h-6 w-6" />
            WellnessHub
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Member Incentive Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/' || to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <Button
            variant={state.viewMode === 'admin' ? 'default' : 'outline'}
            className="w-full"
            onClick={() =>
              dispatch({
                type: 'SWITCH_VIEW',
                mode: state.viewMode === 'admin' ? 'member' : 'admin',
              })
            }
          >
            <Settings className="h-4 w-4 mr-2" />
            {state.viewMode === 'admin' ? 'Member View' : 'Admin View'}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
          <div>
            <h2 className="text-sm text-zinc-500">
              {state.viewMode === 'admin' ? 'Admin Panel' : 'Member Portal'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {state.viewMode === 'member' && (
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                <Wallet className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  {balance.toLocaleString()} pts
                </span>
              </div>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                className="relative p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell className="h-5 w-5 text-zinc-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && <NotificationDropdown onClose={() => setNotifOpen(false)} />}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 transition-colors"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div
                  className={`h-8 w-8 rounded-full ${levelColors[state.currentUser.level]} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {state.currentUser.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-zinc-700">
                  {state.currentUser.name}
                </span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </button>
              {userMenuOpen && <UserMenuDropdown onClose={() => setUserMenuOpen(false)} />}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const { dispatch, getUserNotifications } = useApp();
  const notifications = getUserNotifications().slice(0, 5);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 w-80 bg-white border border-zinc-200 rounded-lg shadow-lg z-50">
        <div className="p-3 border-b border-zinc-200 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <button
            className="text-xs text-emerald-600 hover:underline"
            onClick={() => {
              dispatch({ type: 'READ_ALL_NOTIFICATIONS' });
            }}
          >
            Mark all read
          </button>
        </div>
        <div className="max-h-64 overflow-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-zinc-500 text-center">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 ${
                  !n.read ? 'bg-emerald-50/50' : ''
                }`}
                onClick={() => dispatch({ type: 'READ_NOTIFICATION', notificationId: n.id })}
              >
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  {new Date(n.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function UserMenuDropdown({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useApp();
  const members = state.users.filter((u) => u.role === 'member');

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 w-56 bg-white border border-zinc-200 rounded-lg shadow-lg z-50">
        <div className="p-3 border-b border-zinc-200">
          <p className="text-xs text-zinc-500">Switch User (Demo)</p>
        </div>
        {members.map((u) => (
          <button
            key={u.id}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 flex items-center gap-2 ${
              u.id === state.currentUser.id ? 'bg-emerald-50 text-emerald-700' : 'text-zinc-700'
            }`}
            onClick={() => {
              dispatch({ type: 'SWITCH_USER', userId: u.id });
              onClose();
            }}
          >
            <div className="h-6 w-6 rounded-full bg-zinc-300 flex items-center justify-center text-xs font-bold text-white">
              {u.name.charAt(0)}
            </div>
            {u.name}
            {u.id === state.currentUser.id && (
              <Badge variant="success" className="ml-auto text-xs">
                Active
              </Badge>
            )}
          </button>
        ))}
      </div>
    </>
  );
}
