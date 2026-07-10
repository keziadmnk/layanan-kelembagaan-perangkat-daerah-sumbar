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
                                <h1 className="logo-text">SILEGA</h1>
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
                            Panduan <span className="page-title-highlight">Layanan SILEGA</span>
                        </h1>
                        <p className="page-subtitle">
                            Dokumen panduan penggunaan sistem informasi kelembagaan yang adaptif Provinsi Sumatera Barat.
                        </p>
                    </section>

                    {/* Under Construction Notice */}
                    <div className="flex justify-center pb-12 w-full">
                        <div className="underdev-card w-full bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl flex flex-col items-center">
                            <div className="underdev-icon-wrap flex justify-center w-full">
                                <div className="underdev-icon-ring flex justify-center items-center">
                                    <FileSearch className="w-12 h-12 text-navy-600" />
                                </div>
                            </div>

                            <div className="underdev-badge mx-auto mb-6 flex justify-center items-center">
                                <Clock className="w-4 h-4" />
                                <span>Dalam Penyusunan</span>
                            </div>

                            <h2 className="underdev-title text-2xl sm:text-3xl mb-4 text-center w-full">Panduan Sedang Disusun</h2>

                            <p className="underdev-desc text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto text-center w-full">
                                Tim kami sedang dalam proses penyusunan panduan layanan yang komprehensif.
                                Dokumen ini akan mencakup tata cara penggunaan sistem, alur pengajuan,
                                serta informasi teknis yang dibutuhkan pengguna.
                            </p>

                            <p className="underdev-eta text-sm text-gray-400 italic mb-10 text-center w-full">
                                Panduan akan segera diselesaikan dan dipublikasikan. Terima kasih atas kesabaran Anda.
                            </p>

                            <div className="border-t border-gray-100 w-full mb-10" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-10 text-left">
                                <div className="flex flex-col items-center justify-center text-center gap-3 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:bg-navy-50 hover:border-navy-100 transition-all cursor-default">
                                    <BookOpen className="w-8 h-8 text-navy-600 mb-1" />
                                    <span className="text-sm font-semibold text-gray-700">Panduan Penggunaan Sistem</span>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center gap-3 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:bg-navy-50 hover:border-navy-100 transition-all cursor-default">
                                    <BookOpen className="w-8 h-8 text-navy-600 mb-1" />
                                    <span className="text-sm font-semibold text-gray-700">Alur & Prosedur Pengajuan</span>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center gap-3 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:bg-navy-50 hover:border-navy-100 transition-all cursor-default">
                                    <BookOpen className="w-8 h-8 text-navy-600 mb-1" />
                                    <span className="text-sm font-semibold text-gray-700">Tanya Jawab (FAQ)</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/landing-page')}
                                className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-navy-600 transition-colors shadow-sm gap-2"
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
