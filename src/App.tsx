import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Activities } from './pages/Activities';
import { Ledger } from './pages/Ledger';
import { Rewards } from './pages/Rewards';
import { Gamification } from './pages/Gamification';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPrograms } from './pages/admin/AdminPrograms';
import { AdminActivities } from './pages/admin/AdminActivities';
import { AdminRules } from './pages/admin/AdminRules';
import { AdminMembers } from './pages/admin/AdminMembers';
import { AdminRedemptions } from './pages/admin/AdminRedemptions';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Member routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/gamification" element={<Gamification />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/programs" element={<AdminPrograms />} />
            <Route path="/admin/activities" element={<AdminActivities />} />
            <Route path="/admin/rules" element={<AdminRules />} />
            <Route path="/admin/members" element={<AdminMembers />} />
            <Route path="/admin/redemptions" element={<AdminRedemptions />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
