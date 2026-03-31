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
import { AdminCreateProgram } from './pages/admin/AdminCreateProgram';
import { AdminActivities } from './pages/admin/AdminActivities';
import { AdminCreateActivity } from './pages/admin/AdminCreateActivity';
import { AdminRules } from './pages/admin/AdminRules';
import { AdminCreateRule } from './pages/admin/AdminCreateRule';
import { AdminMembers } from './pages/admin/AdminMembers';
import { AdminRedemptions } from './pages/admin/AdminRedemptions';
import { AdminEmployerGroups } from './pages/admin/AdminEmployerGroups';
import { AdminCreateEmployerGroup } from './pages/admin/AdminCreateEmployerGroup';

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
            <Route path="/admin/programs/new" element={<AdminCreateProgram />} />
            <Route path="/admin/activities" element={<AdminActivities />} />
            <Route path="/admin/activities/new" element={<AdminCreateActivity />} />
            <Route path="/admin/rules" element={<AdminRules />} />
            <Route path="/admin/rules/new" element={<AdminCreateRule />} />
            <Route path="/admin/employer-groups" element={<AdminEmployerGroups />} />
            <Route path="/admin/employer-groups/new" element={<AdminCreateEmployerGroup />} />
            <Route path="/admin/members" element={<AdminMembers />} />
            <Route path="/admin/redemptions" element={<AdminRedemptions />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
