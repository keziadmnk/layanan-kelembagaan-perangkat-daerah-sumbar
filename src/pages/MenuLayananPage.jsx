import { useNavigate } from 'react-router-dom';
import { ChevronRight, Building2, Landmark, ClipboardList } from 'lucide-react';
import AdminTopBar from '../components/layout/AdminTopBar';
import dashboardImage from '../assets/dashboard.png';

const SERVICES = [
    {
        id: 'provinsi',
        icon: Building2,
        iconBg: 'menu-icon-bg-1',
        title: 'Fasilitasi Penataan Kelembagaan Provinsi',
        description: 'Penataan Perangkat Daerah (Pembentukan, Penggabungan, Pemisahan OPD).\nPembentukan UPTD (Pembentukan, Penghapusan UPTD dan Perubahan Tugas dan Fungsi).',
        route: '/dashboard-provinsi',
        badge: 'Provinsi',
        badgeClass: 'menu-badge-blue',
        delay: '0s',
    },
    {
        id: 'kabkota',
        icon: Landmark,
        iconBg: 'menu-icon-bg-2',
        title: 'Fasilitasi Penataan Kelembagaan Kab/Kota',
        description: 'Penataan Perangkat Daerah pada Kabupaten/Kota (Pembentukan, Penggabungan, Pemisahan).\n Pembentukan UPTD pada Kabupaten/Kota (Pembentukan, Penghapusan UPTD dan Perubahan Tugas dan Fungsi).',
        route: '/dashboard-kabkota',
        badge: 'Kab/Kota',
        badgeClass: 'menu-badge-gold',
        delay: '0.1s',
    },
    {
        id: 'anjab',
        icon: ClipboardList,
        iconBg: 'menu-icon-bg-3',
        title: 'Fasilitasi AnJab (Analisis Jabatan)',
        description: 'Layanan Terintegrasi untuk Pengusulan Dokumen Penataan Jabatan yang Meliputi Dokumen Anjab & ABK, SKJ, dan Evaluasi Jabatan.',
        route: '/dashboard-anjab',
        badge: 'AnJab',
        badgeClass: 'menu-badge-teal',
        delay: '0.2s',
    },
];

const MenuLayananPage = () => {
    const navigate = useNavigate();

    return (
        <div className="menu-layanan-page">
            <AdminTopBar />

            <main className="menu-layanan-main">
                <div
                    className="menu-layanan-hero"
                    style={{ backgroundImage: `url(${dashboardImage})` }}
                >
                    <div className="menu-layanan-hero-overlay" />
                    <div className="menu-layanan-hero-content">
                        <div className="menu-layanan-hero-badge">
                            <span>Layanan Administrasi Publik</span>
                        </div>
                        <h2 className="menu-layanan-hero-heading">Selamat Datang, Admin</h2>
                        <p className="menu-layanan-hero-sub">
                            Silakan pilih layanan untuk melanjutkan ke dashboard pengelolaan data kelembagaan.
                        </p>
                    </div>
                    <div className="menu-layanan-hero-deco-1" />
                    <div className="menu-layanan-hero-deco-2" />
                </div>

                <div className="menu-layanan-section">
                    <div className="menu-layanan-section-inner">
                        <div className="menu-layanan-section-header">
                            <div className="menu-layanan-section-line" />
                            <h3 className="menu-layanan-section-title">Layanan Utama</h3>
                        </div>

                        <div className="menu-layanan-grid">
                            {SERVICES.map((service) => {
                                const Icon = service.icon;
                                return (
                                    <div
                                        key={service.id}
                                        className="menu-service-card"
                                        style={{ animationDelay: service.delay }}
                                    >
                                        <div className="menu-service-card-top">
                                            <div className={`menu-service-icon ${service.iconBg}`}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <span className={`menu-service-badge ${service.badgeClass}`}>
                                                {service.badge}
                                            </span>
                                        </div>

                                        <h4 className="menu-service-title">{service.title}</h4>
                                        <p className="menu-service-desc" style={{ whiteSpace: 'pre-line' }}>{service.description}</p>

                                        <button
                                            onClick={() => navigate(service.route)}
                                            className="menu-service-cta"
                                        >
                                            <span>Ke Dashboard</span>
                                            <ChevronRight className="w-4 h-4 menu-service-cta-arrow" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="menu-layanan-footer">
                <p>© 2026 Biro Organisasi Sekretariat Daerah Provinsi Sumatera Barat. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MenuLayananPage;
