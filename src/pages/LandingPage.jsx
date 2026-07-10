/** @format */

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Landmark, ClipboardList } from 'lucide-react';
import heroImage from '../assets/landingpage.png';
import provSumbarLogo from '../assets/prov-sumbar.png';

const LandingPage = () => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const featureCardsRef = useRef([]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe section header
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        // Observe feature cards
        featureCardsRef.current.forEach((card) => {
            if (card) {
                observer.observe(card);
            }
        });

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
            featureCardsRef.current.forEach((card) => {
                if (card) {
                    observer.unobserve(card);
                }
            });
        };
    }, []);

    return (
        <div className="landing-page">
            {/* Header */}
            <header className="landing-header">
                <div className="header-content">
                    <div className="logo-section">
                        <img src={provSumbarLogo} alt="Logo Pemprov Sumbar" className="logo-image" />
                        <div className="logo-text-wrapper">
                            <div className="logo-decoration"></div>
                            <h1 className="logo-text">SILEGA</h1>
                            <p className="logo-subtitle">SETDA SUMBAR</p>
                        </div>
                    </div>
                    <nav className="nav-menu">
                        <button type="button" onClick={() => navigate('/landing-page')} className="nav-link nav-button active">Beranda</button>
                        <button type="button" onClick={() => navigate('/kab-kota-info')} className="nav-link nav-button">Kabupaten/Kota</button>
                        <button type="button" onClick={() => navigate('/syarat-layanan')} className="nav-link nav-button">Syarat Layanan</button>
                        <button type="button" onClick={() => navigate('/panduan-layanan')} className="nav-link nav-button">Panduan Layanan</button>
                        <button onClick={() => navigate('/login')} className="btn-login">
                            Masuk
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="title-decoration">
                            <span className="decoration-line"></span>
                            <span className="decoration-dot"></span>
                        </div>
                        <h1 className="hero-title">
                            Sistem Informasi<br />
                            <span className="hero-title-highlight">Kelembagaan</span><br />
                            yang Adaptif
                        </h1>
                        <p className="hero-subtitle">
                            Sekretariat Daerah Provinsi Sumatera Barat
                        </p>
                        <div className="hero-buttons">
                            <button onClick={() => navigate('/login')} className="btn-primary">
                                <span>Mulai Sekarang</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="hero-decoration hero-decoration-1"></div>
                <div className="hero-decoration hero-decoration-2"></div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="kabkota">
                <div className="features-container">
                    <div className="section-header" ref={sectionRef}>
                        <h2 className="section-title">Layanan Kami</h2>
                        <p className="section-subtitle">
                            Mempermudah pengelolaan kelembagaan perangkat daerah di Sumatera Barat
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card" ref={(el) => (featureCardsRef.current[0] = el)} style={{ animationDelay: '0.1s' }}>
                            <div className="feature-icon feature-icon-1">
                                <Building2 className="w-8 h-8 text-current" />
                            </div>
                            <h3 className="feature-title">Fasilitasi Kelembagaan Provinsi</h3>
                            <p className="feature-description">
                                Layanan terintegrasi untuk pengawasan dan bimbingan teknis penataan kelembagaan bagi seluruh OPD Provinsi.
                            </p>
                        </div>

                        <div className="feature-card" ref={(el) => (featureCardsRef.current[1] = el)} style={{ animationDelay: '0.2s' }}>
                            <div className="feature-icon feature-icon-2">
                                <Landmark className="w-8 h-8 text-current" />
                            </div>
                            <h3 className="feature-title">Fasilitasi Kelembagaan Kab/Kota</h3>
                            <p className="feature-description">
                                Layanan terintegrasi untuk pengawasan dan bimbingan teknis penataan kelembagaan bagi Kabupaten dan Kota di wilayah Sumatera Barat.
                            </p>
                        </div>

                        <div className="feature-card" ref={(el) => (featureCardsRef.current[2] = el)} style={{ animationDelay: '0.3s' }}>
                            <div className="feature-icon feature-icon-3">
                                <ClipboardList className="w-8 h-8 text-current" />
                            </div>
                            <h3 className="feature-title">Fasilitasi AnJab (Analisis Jabatan)</h3>
                            <p className="feature-description">
                                Layanan terintegrasi untuk analisis jabatan dan analisis beban kerja guna optimalisasi distribusi personel fungsional.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

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

export default LandingPage;

