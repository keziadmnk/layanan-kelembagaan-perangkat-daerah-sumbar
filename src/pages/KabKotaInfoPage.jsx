/** @format */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import provSumbarLogo from '../assets/prov-sumbar.png';

const KabKotaInfoPage = () => {
    const navigate = useNavigate();
    const [kabKotaList, setKabKotaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchKabKotaInfo();
    }, []);

    const fetchKabKotaInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userAPI.getKabKotaInfo();
            if (response.success) {
                setKabKotaList(response.data);
            }
        } catch (err) {
            console.error('Error fetching kab/kota info:', err);
            setError(err.message || 'Gagal mengambil data kabupaten/kota');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="kabkota-info-page">
            {/* Header */}
            <header className="landing-header">
                <div className="header-content">
                    <div className="logo-section" onClick={() => navigate('/landing-page')} style={{ cursor: 'pointer' }}>
                        <img src={provSumbarLogo} alt="Logo Pemprov Sumbar" className="logo-image" />
                        <div className="logo-text-wrapper">
                            <div className="logo-decoration"></div>
                            <h1 className="logo-text">LENTERA</h1>
                            <p className="logo-subtitle">SETDA SUMBAR</p>
                        </div>
                    </div>
                    <nav className="nav-menu">
                        <a href="/landing-page" className="nav-link">Beranda</a>
                        <a href="/kab-kota-info" className="nav-link active">Kabupaten/Kota</a>
                        <button onClick={() => navigate('/login')} className="btn-login">
                            Masuk
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="kabkota-main-section">
                <div className="kabkota-container">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="page-header-decoration">
                            <span className="decoration-line"></span>
                            <span className="decoration-dot"></span>
                        </div>
                        <h1 className="page-title">
                            Informasi Kontak Kabupaten/Kota
                        </h1>
                        <p className="page-subtitle">
                            Daftar informasi kontak Bagian Organisasi di seluruh Kabupaten dan Kota di Provinsi Sumatera Barat
                        </p>
                    </div>

                    {/* Table Section */}
                    <div className="table-section">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Memuat data...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p>{error}</p>
                                <button onClick={fetchKabKotaInfo} className="retry-btn">Coba Lagi</button>
                            </div>
                        ) : kabKotaList.length === 0 ? (
                            <div className="empty-state">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p>Belum ada data kabupaten/kota</p>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table className="kabkota-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Kabupaten/Kota</th>
                                            <th>Alamat</th>
                                            <th>Nomor HP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {kabKotaList.map((item, index) => (
                                            <tr key={index}>
                                                <td className="text-center">{index + 1}</td>
                                                <td className="kabkota-name">{item.kabupaten_kota}</td>
                                                <td>{item.alamat || '-'}</td>
                                                <td className="contact-info">{item.no_hp || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-main">
                        <div className="footer-brand">
                            <div className="footer-logo-decoration"></div>
                            <h3 className="footer-title">Biro Organisasi</h3>
                            <p className="footer-subtitle">Sekretariat Daerah Provinsi Sumatera Barat</p>
                        </div>
                        <div className="footer-info">
                            <h4 className="footer-heading">Kontak</h4>
                            <p className="footer-text">Jl. Jend. Sudirman No. 51, Padang</p>
                            <p className="footer-text">Sumatera Barat, Indonesia</p>
                            <p className="footer-text">biroorganisasi.sumbarprov.go.id</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p className="footer-copyright">
                            © 2026 Biro Organisasi Sekeretariat Daerah Sumatera Barat. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default KabKotaInfoPage;
