/** @format */

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
                            <h1 className="logo-text">LENTERA</h1>
                            <p className="logo-subtitle">SETDA SUMBAR</p>
                        </div>
                    </div>
                    <nav className="nav-menu">
                        <a href="#home" className="nav-link active">Beranda</a>
                        <a onClick={() => navigate('/kab-kota-info')} className="nav-link" style={{ cursor: 'pointer' }}>Kabupaten/Kota</a>
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
                            Layanan Terpadu<br />
                            <span className="hero-title-highlight">Kelembagaan</span><br />
                            Kabupaten/Kota
                        </h1>
                        <p className="hero-subtitle">
                            Provinsi Sumatera Barat
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
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Pengajuan Online</h3>
                            <p className="feature-description">
                                Ajukan permohonan layanan kelembagaan secara digital, cepat, dan mudah
                            </p>
                        </div>

                        <div className="feature-card" ref={(el) => (featureCardsRef.current[1] = el)} style={{ animationDelay: '0.2s' }}>
                            <div className="feature-icon feature-icon-2">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Tracking Real-time</h3>
                            <p className="feature-description">
                                Pantau status pengajuan Anda secara real-time dengan sistem tracking otomatis
                            </p>
                        </div>

                        <div className="feature-card" ref={(el) => (featureCardsRef.current[2] = el)} style={{ animationDelay: '0.3s' }}>
                            <div className="feature-icon feature-icon-3">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="feature-title">Manajemen Dokumen</h3>
                            <p className="feature-description">
                                Kelola semua dokumen kelembagaan dalam satu platform terintegrasi
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
                            © 2026 BBiro Organisasi Sekeretariat Daerah Sumatera Barat. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
