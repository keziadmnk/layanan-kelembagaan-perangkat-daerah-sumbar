/** @format */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardPemohon from './pages/DashboardPemohon';
import FormPengajuanBaru from './pages/FormPengajuanBaru';
import FormRevisi from './pages/FormRevisi';
import SuratListPage from './pages/SuratListPage';
import VerifikasiSuratPage from './pages/VerifikasiSuratPage';
import UserManagementPage from './pages/UserManagementPage';
import ProfilePage from './pages/ProfilePage';
import NotificationPage from './pages/NotificationPage';
import DetailSuratModal from './components/features/DetailSuratModal';

const AppRoutes = () => {
  const { user, isAuthenticated, loading } = useAuthContext();
  const location = useLocation();
  const [selectedSurat, setSelectedSurat] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (user?.role === 'admin') {
    return (
      <>
        <Routes>
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<DashboardAdmin onDetailClick={setSelectedSurat} />} />
            <Route path="/verifikasi-surat" element={<VerifikasiSuratPage onDetailClick={setSelectedSurat} />} />
            <Route path="/surat-masuk" element={
              <SuratListPage
                title="Semua Surat Masuk"
                onDetailClick={setSelectedSurat}
              />
            } />
            <Route path="/dalam-proses" element={
              <SuratListPage
                title="Tahapan Proses Pengajuan"
                showTahapan={true}
                onDetailClick={setSelectedSurat}
              />
            } />
            <Route path="/selesai" element={
              <SuratListPage
                title="Surat Selesai"
                status="Selesai"
                onDetailClick={setSelectedSurat}
              />
            } />
            <Route path="/kelola-akun" element={<UserManagementPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifikasi" element={<NotificationPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
        <DetailSuratModal
          surat={selectedSurat}
          onClose={() => setSelectedSurat(null)}
          userRole={user?.role}
          isVerificationMode={location.pathname === '/verifikasi-surat'}
        />
      </>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route element={
          <ProtectedRoute allowedRoles={['kab/kota']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={
            <DashboardPemohon
              onDetailClick={setSelectedSurat}
            />
          } />
          <Route path="/pengajuan-baru" element={<FormPengajuanBaru />} />
          <Route path="/revisi/:id" element={<FormRevisi />} />
          <Route path="/riwayat" element={
            <SuratListPage
              title="Riwayat Pengajuan"
              onDetailClick={setSelectedSurat}
            />
          } />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifikasi" element={<NotificationPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
      <DetailSuratModal
        surat={selectedSurat}
        onClose={() => setSelectedSurat(null)}
        userRole={user?.role}
        isVerificationMode={false}
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
