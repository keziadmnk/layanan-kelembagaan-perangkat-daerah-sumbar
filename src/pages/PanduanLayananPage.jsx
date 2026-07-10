import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, FileSearch } from 'lucide-react';
import provSumbarLogo from '../assets/prov-sumbar.png';

const PanduanLayananPage = () => {
    const navigate = useNavigate();

    return (
        <div className="syarat-layanan-page">
            <header className="landing-header">
                <div className="header-content">
                    <div className="logo-section" onClick={() => navigate('/landing-page')} style={{ cursor: 'pointer' }}>
                        <img src={provSumbarLogo} alt="Logo Pemprov Sumbar" className="logo-image" />
                        <div className="logo-text-wrapper">
                            <div className="logo-decoration"></div>
                            <div>
                                <h1 className="logo-text">LENTERA</h1>
                                <p className="logo-subtitle">SETDA SUMBAR</p>
                            </div>
                        </div>
                    </div>
                    <nav className="nav-menu">
                        <button type="button" onClick={() => navigate('/landing-page')} className="nav-link nav-button">Beranda</button>
                        <button type="button" onClick={() => navigate('/kab-kota-info')} className="nav-link nav-button">Kabupaten/Kota</button>
                        <button type="button" onClick={() => navigate('/syarat-layanan')} className="nav-link nav-button">Syarat Layanan</button>
                        <button type="button" onClick={() => navigate('/panduan-layanan')} className="nav-link nav-button active">Panduan Layanan</button>
                        <button onClick={() => navigate('/login')} className="btn-login">
                            Masuk
                        </button>
                    </nav>
                </div>
            </header>

            <main className="syarat-main-section">
                <div className="kabkota-container">
                    <section className="syarat-hero-panel">
                        <div className="page-header-decoration">
                            <span className="decoration-line"></span>
                            <span className="decoration-dot"></span>
                        </div>
                        <p className="syarat-eyebrow">Dokumentasi Layanan</p>
                        <h1 className="page-title">
                            Panduan <span className="page-title-highlight">Layanan LENTERA</span>
                        </h1>
                        <p className="page-subtitle">
                            Dokumen panduan penggunaan layanan terpadu kelembagaan perangkat daerah Provinsi Sumatera Barat.
                        </p>
                    </section>

                    {/* Under Construction Notice */}
                    <div className="panduan-notice-wrapper">
                        <div className="panduan-notice-card">
                            <div className="panduan-notice-icon-wrap">
                                <div className="panduan-notice-icon-ring">
                                    <FileSearch className="panduan-notice-icon" />
                                </div>
                            </div>

                            <div className="panduan-status-badge">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Dalam Penyusunan</span>
                            </div>

                            <h2 className="panduan-notice-title">Panduan Sedang Disusun</h2>

                            <p className="panduan-notice-desc">
                                Tim kami sedang dalam proses penyusunan panduan layanan yang komprehensif.
                                Dokumen ini akan mencakup tata cara penggunaan sistem, alur pengajuan,
                                serta informasi teknis yang dibutuhkan pengguna.
                            </p>

                            <p className="panduan-notice-eta">
                                Panduan akan segera diselesaikan dan dipublikasikan. Terima kasih atas kesabaran Anda.
                            </p>

                            <div className="panduan-divider" />

                            <div className="panduan-coming-soon-grid">
                                <div className="panduan-coming-item">
                                    <BookOpen className="panduan-coming-icon" />
                                    <span>Panduan Penggunaan Sistem</span>
                                </div>
                                <div className="panduan-coming-item">
                                    <BookOpen className="panduan-coming-icon" />
                                    <span>Alur & Prosedur Pengajuan</span>
                                </div>
                                <div className="panduan-coming-item">
                                    <BookOpen className="panduan-coming-icon" />
                                    <span>Tanya Jawab (FAQ)</span>
                                </div>
                                <div className="panduan-coming-item">
                                    <BookOpen className="panduan-coming-icon" />
                                    <span>Video Tutorial</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/landing-page')}
                                className="panduan-back-btn"
                            >
                                Kembali ke Beranda
                            </button>
                        </div>
                    </div>
                </div>
            </main>

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
                            © 2026 Biro Organisasi Sekretariat Daerah Sumatera Barat. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PanduanLayananPage;
