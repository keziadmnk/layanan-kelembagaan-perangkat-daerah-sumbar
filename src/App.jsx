import { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardPemohon from './pages/DashboardPemohon';
import FormPengajuanBaru from './pages/FormPengajuanBaru';
import SuratListPage from './pages/SuratListPage';
import VerifikasiSuratPage from './pages/VerifikasiSuratPage';
import UserManagementPage from './pages/UserManagementPage';
import DetailSuratModal from './components/features/DetailSuratModal';
import { useAuth } from './hooks/useAuth';
import { suratMasuk } from './constants/mockData';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);
  const [selectedModuleForSubmission, setSelectedModuleForSubmission] = useState(null);
  const { userRole, setUserRole, userInfo } = useAuth();
  const suratPemohon = suratMasuk.filter(s => s.pemohon === 'Kab. Padang Pariaman');

  const handleRoleChange = (role) => {
    setUserRole(role);
    setActiveTab('dashboard');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedModuleForSubmission(null);
  };

  const handleNewSubmission = (moduleId) => {
    setSelectedModuleForSubmission(moduleId);
    setActiveTab('pengajuan-baru');
  };

  const renderContent = () => {
    if (userRole === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <DashboardAdmin data={suratMasuk} onDetailClick={setSelectedSurat} />;
        case 'verifikasi-surat':
          return <VerifikasiSuratPage data={suratMasuk} onDetailClick={setSelectedSurat} />;
        case 'surat-masuk':
          return <SuratListPage title="Semua Surat Masuk" data={suratMasuk} onDetailClick={setSelectedSurat} />;
        case 'dalam-proses':
          return <SuratListPage title="Surat Dalam Proses" data={suratMasuk.filter(s => !s.status.includes('Selesai'))} onDetailClick={setSelectedSurat} />;
        case 'selesai':
          return <SuratListPage title="Surat Selesai" data={suratMasuk.filter(s => s.status.includes('Selesai'))} onDetailClick={setSelectedSurat} />;
        case 'kelola-akun':
          return <UserManagementPage />;
        default:
          return <DashboardAdmin data={suratMasuk} onDetailClick={setSelectedSurat} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <DashboardPemohon onDetailClick={setSelectedSurat} onNewSubmission={handleNewSubmission} />;
        case 'pengajuan-baru':
          return <FormPengajuanBaru selectedModuleId={selectedModuleForSubmission} onCancel={() => setActiveTab('dashboard')} onNavigateToRiwayat={() => setActiveTab('riwayat')} />;
        case 'riwayat':
          return <SuratListPage title="Riwayat Pengajuan" onDetailClick={setSelectedSurat} />;
        default:
          return <DashboardPemohon onDetailClick={setSelectedSurat} onNewSubmission={handleNewSubmission} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userInfo={userInfo}
        userRole={userRole}
        onRoleChange={handleRoleChange}
        showRoleSwitch={showRoleSwitch}
        setShowRoleSwitch={setShowRoleSwitch}
        sidebarOpen={sidebarOpen}
      />

      <div className="relative">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userRole={userRole}
        />

        <main
          className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
            } p-4 lg:p-8 min-h-screen`}
        >
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <DetailSuratModal
        surat={selectedSurat}
        onClose={() => setSelectedSurat(null)}
        userRole={userRole}
      />
    </div>
  );
};

export default App;
