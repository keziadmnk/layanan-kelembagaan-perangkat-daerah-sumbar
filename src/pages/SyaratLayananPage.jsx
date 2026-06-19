import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Building, Building2, CheckCircle, ClipboardList, FileText, RefreshCw } from 'lucide-react';
import { modulLayananAPI } from '../services/api';
import provSumbarLogo from '../assets/prov-sumbar.png';

const getModuleIcon = (namaModul = '') => {
    const iconProps = { className: 'service-requirement-icon-svg' };
    const normalized = namaModul.toLowerCase();

    if (normalized.includes('evaluasi')) return <Building {...iconProps} />;
    if (normalized.includes('ranperda')) return <ClipboardList {...iconProps} />;
    if (normalized.includes('uptd')) return <Building2 {...iconProps} />;
    return <FileText {...iconProps} />;
};

const SyaratLayananPage = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchServiceRequirements();
    }, []);

    const fetchServiceRequirements = async () => {
        try {
            setLoading(true);
            setError(null);

            const layananRes = await modulLayananAPI.getAll();
            if (!layananRes.success) {
                throw new Error(layananRes.message || 'Gagal mengambil data layanan');
            }

            const layananWithRequirements = await Promise.all(
                layananRes.data.map(async (layanan) => {
                    const persyaratanRes = await modulLayananAPI.getPersyaratan(layanan.id_modul);
                    return {
                        ...layanan,
                        persyaratan: persyaratanRes.success ? persyaratanRes.data.persyaratan : [],
                    };
                })
            );

            setServices(layananWithRequirements);
        } catch (err) {
            console.error('Error fetching service requirements:', err);
            setError(err.message || 'Gagal memuat syarat layanan');
        } finally {
            setLoading(false);
        }
    };

    const totalRequiredDocs = useMemo(
        () => services.reduce((total, service) => total + service.persyaratan.filter((dok) => dok.is_required).length, 0),
        [services]
    );

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
                        <button type="button" onClick={() => navigate('/syarat-layanan')} className="nav-link nav-button active">Syarat Layanan</button>
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
                        <p className="syarat-eyebrow">Informasi Persyaratan</p>
                        <h1 className="page-title">
                            Syarat Dokumen <span className="page-title-highlight">Layanan Kelembagaan</span>
                        </h1>
                        <p className="page-subtitle">
                            Daftar layanan dan persyaratan dokumen ini terhubung langsung dengan data layanan pada sistem pengajuan.
                        </p>

                        <div className="syarat-summary-grid">
                            <div className="syarat-summary-item">
                                <span className="summary-value">{services.length || '-'}</span>
                                <span className="summary-label">Jenis layanan</span>
                            </div>
                            <div className="syarat-summary-item">
                                <span className="summary-value">{totalRequiredDocs || '-'}</span>
                                <span className="summary-label">Dokumen wajib</span>
                            </div>
                            <div className="syarat-summary-item">
                                <span className="summary-value">10MB</span>
                                <span className="summary-label">Maks. upload per file</span>
                            </div>
                        </div>
                    </section>

                    {loading ? (
                        <div className="table-section">
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Memuat syarat layanan...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="table-section">
                            <div className="error-state">
                                <AlertCircle size={48} />
                                <p>{error}</p>
                                <button onClick={fetchServiceRequirements} className="retry-btn">
                                    <RefreshCw size={16} />
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="table-section">
                            <div className="empty-state">
                                <FileText size={64} />
                                <p>Belum ada data layanan</p>
                            </div>
                        </div>
                    ) : (
                        <section className="service-requirement-grid">
                            {services.map((service, serviceIndex) => (
                                <article key={service.id_modul} className="service-requirement-card">
                                    <div className="service-card-header">
                                        <div className={`service-requirement-icon icon-tone-${(serviceIndex % 3) + 1}`}>
                                            {getModuleIcon(service.nama_modul)}
                                        </div>
                                        <div>
                                            <p className="service-number">Layanan {String(serviceIndex + 1).padStart(2, '0')}</p>
                                            <h2>{service.nama_modul}</h2>
                                            {service.deskripsi && <p>{service.deskripsi}</p>}
                                        </div>
                                    </div>

                                    <div className="requirement-list">
                                        {service.persyaratan.length === 0 ? (
                                            <div className="requirement-empty">Belum ada persyaratan dokumen untuk layanan ini.</div>
                                        ) : (
                                            service.persyaratan.map((dokumen, index) => (
                                                <div key={dokumen.id_persyaratan} className="requirement-item">
                                                    <div className="requirement-index">{index + 1}</div>
                                                    <div className="requirement-content">
                                                        <div className="requirement-title-row">
                                                            <h3>{dokumen.nama_dokumen}</h3>
                                                            <span className={dokumen.is_required ? 'required-badge' : 'optional-badge'}>
                                                                {dokumen.is_required ? 'Wajib' : 'Opsional'}
                                                            </span>
                                                        </div>
                                                        <div className="requirement-meta">
                                                            <span><FileText size={14} /> Format: {dokumen.format_file || '-'}</span>
                                                            <span><CheckCircle size={14} /> Diunggah saat pengajuan</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </article>
                            ))}
                        </section>
                    )}
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

export default SyaratLayananPage;
