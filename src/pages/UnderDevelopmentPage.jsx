import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction, Clock } from 'lucide-react';
import PropTypes from 'prop-types';
import AdminTopBar from '../components/layout/AdminTopBar';

const UnderDevelopmentPage = ({ serviceTitle }) => {
    const navigate = useNavigate();

    return (
        <div className="menu-layanan-page">
            <AdminTopBar />

            <main className="underdev-main">
                <div className="underdev-container">
                    <button
                        onClick={() => navigate('/menu-layanan')}
                        className="underdev-back-btn"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Menu Layanan</span>
                    </button>

                    <div className="underdev-card">
                        <div className="underdev-icon-wrap">
                            <div className="underdev-icon-ring">
                                <Construction className="w-12 h-12 underdev-icon-color" />
                            </div>
                        </div>

                        <div className="underdev-badge">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Dalam Pengembangan</span>
                        </div>

                        <h2 className="underdev-title">Fitur Sedang Dikembangkan</h2>

                        <p className="underdev-service-name">{serviceTitle}</p>

                        <p className="underdev-desc">
                            Modul layanan ini sedang dalam tahap pengembangan aktif oleh tim kami.
                            Kami berkomitmen untuk menghadirkan fitur yang komprehensif, andal,
                            dan sesuai dengan kebutuhan pengelolaan kelembagaan daerah.
                        </p>

                        <p className="underdev-eta">
                            Fitur ini akan segera tersedia. Terima kasih atas kesabaran dan dukungan Anda.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="menu-layanan-footer">
                <p>© 2026 Biro Organisasi Sekretariat Daerah Provinsi Sumatera Barat. All rights reserved.</p>
            </footer>
        </div>
    );
};

UnderDevelopmentPage.propTypes = {
    serviceTitle: PropTypes.string.isRequired,
};

export default UnderDevelopmentPage;
