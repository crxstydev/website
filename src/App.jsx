import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Instagram Target URL
const INSTAGRAM_URL = "https://www.instagram.com/crx.wrld?igsh=NGc0dXIwMWs5ZmQ2&utm_source=qr";

// Hook for Count Up Animation
function useCountUp(end, duration = 1500, decimals = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(easeProgress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count.toFixed(decimals);
}

// 3D Interactive Spotlight Tilt Card Component
function TiltCard({ children, className = "", onClick }) {
  const cardRef = useRef(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0, opacity: 0 });
  const [transformStyle, setTransformStyle] = useState("");

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
    setSpotlightPos({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      className={`liquid-glass ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ transform: transformStyle }}
    >
      <div
        className="card-spotlight"
        style={{
          opacity: spotlightPos.opacity,
          background: `radial-gradient(220px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(239, 68, 68, 0.2), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // State for Purchase Agreement Modal & Checkbox State
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  // Handler to open Purchase Agreement Modal
  const handleOpenAgreement = (e) => {
    if (e) e.preventDefault();
    setIsAccepted(false); // Reset check state on open
    setIsAgreementOpen(true);
  };

  // Handler to accept terms and redirect to Instagram
  const handleAcceptAndRedirect = () => {
    if (!isAccepted) return;
    setIsAgreementOpen(false);
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  // Scroll Reveal Observer Effect
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const revealElements = document.querySelectorAll(".reveal-on-scroll, .reveal-left, .reveal-right");
    
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Preloader Timeout Handler (1.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.classList.add("fade-out");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // State for Course Packages & Carousel
  const [selectedPlan, setSelectedPlan] = useState("selfPaced");
  const [imgIndex, setImgIndex] = useState(0);

  // State for Student Showcase Section
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  // State for Image Lightbox Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  // State for Legal Modal
  const [legalModalContent, setLegalModalContent] = useState(null);

  // Assets
  const images = ["/tem1.png", "/tem2.png", "/tem3.png", "/tem4.png"];
  const studentImages = ["/st1.png", "/st2.png", "/st3.png", "/st4.png", "/st5.png"];

  // Legal Modal Handler
  const openLegalModal = (e, type) => {
    e.preventDefault();
    if (type === "terms") {
      setLegalModalContent({
        title: "Terms of Service",
        body: (
          <div>
            <p><strong>1. Educational Purpose Only</strong><br />All educational materials, live sessions, chart templates, and community discussions provided by FSEGO Academy are strictly for educational and informational purposes only. Nothing provided constitutes financial, investment, or legal advice.</p>
            <p style={{ marginTop: "12px" }}><strong>2. Intellectual Property & Non-Redistribution</strong><br />All course materials, video lectures, indicators, and Motivewave templates are exclusive properties of FSEGO Academy. Unlawful copying, sharing, recording, or redistributing course materials will result in an immediate permanent ban without refund and potential legal action.</p>
            <p style={{ marginTop: "12px" }}><strong>3. Refund Policy</strong><br />Due to the digital nature of our proprietary trading materials, templates, and instant access to our Discord community, all course purchases and mentorship fees are strictly non-refundable once access has been granted.</p>
          </div>
        )
      });
    } else if (type === "privacy") {
      setLegalModalContent({
        title: "Privacy Policy",
        body: (
          <div>
            <p><strong>1. Data Collection</strong><br />FSEGO Academy collects minimal required personal information (such as email, Discord handle, or Instagram handle) exclusively for account verification, enrollment processing, and customer support.</p>
            <p style={{ marginTop: "12px" }}><strong>2. Use of Information</strong><br />Your personal information is strictly used to deliver service access, updates, and community support. We do not sell, rent, or trade student data to third parties.</p>
            <p style={{ marginTop: "12px" }}><strong>3. Security</strong><br />We implement robust data security measures to ensure your personal contact details remain protected and confidential.</p>
          </div>
        )
      });
    } else if (type === "risk") {
      setLegalModalContent({
        title: "Risk Disclosure",
        body: (
          <div>
            <p><strong>1. High-Risk Warning</strong><br />Trading foreign exchange (Forex), futures, commodities, and digital assets on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you.</p>
            <p style={{ marginTop: "12px" }}><strong>2. No Guarantee of Profit</strong><br />Past performance, order flow analysis results, or student testimonials displayed on this site do not guarantee future results or profits. You should never trade with money you cannot afford to lose.</p>
            <p style={{ marginTop: "12px" }}><strong>3. Independent Decision Making</strong><br />You are solely responsible for your trading decisions and risk management. FSEGO Academy is not responsible for any financial loss incurred during live trading execution.</p>
          </div>
        )
      });
    }
  };

  const closeLegalModal = () => setLegalModalContent(null);

  // Custom Smooth Scrolling with Easing
  const scrollToSection = (e, targetId) => {
    if (e) e.preventDefault();
    setActiveTab(targetId);

    const startPosition = window.pageYOffset;
    let targetPosition = 0;

    if (targetId !== "home") {
      const element = document.getElementById(targetId);
      if (!element) return;
      targetPosition = element.getBoundingClientRect().top + startPosition - 80;
    }

    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const timeFraction = Math.min(progress / duration, 1);
      const ease = easeInOutCubic(timeFraction);

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const handlePrevImg = (e) => {
    if (e) e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e) => {
    if (e) e.stopPropagation();
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevShowcase = (e) => {
    if (e) e.stopPropagation();
    setShowcaseIndex((prev) => (prev === 0 ? studentImages.length - 1 : prev - 1));
  };

  const handleNextShowcase = (e) => {
    if (e) e.stopPropagation();
    setShowcaseIndex((prev) => (prev === studentImages.length - 1 ? 0 : prev + 1));
  };

  const openModal = (src) => {
    setModalImageSrc(src);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
        closeLegalModal();
        setIsAgreementOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const ratingCount = useCountUp(90, 1500, 0);
  const studentsCount = useCountUp(36, 1200, 0);

  // Cursor Tracker
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Canvas Particles Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ef4444";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(239, 68, 68, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="page">
      <div className="abstract-grid-bg" />
      <canvas ref={canvasRef} className="particles-canvas" />

      <div
        className="cursor-glow"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />

      <div className="ambient-glow glow-top-left pulse-glow" />
      <div className="ambient-glow glow-center-warm pulse-glow-delay" />

      {/* NAVBAR */}
      <header className="navbar-container">
        <div 
          className="logo-badge" 
          onClick={(e) => scrollToSection(e, "home")}
          title="Go to top"
        >
          <img src="/logo.gif" alt="FSEGO Logo" className="brand-logo-img" />
        </div>

        <nav className="pill-nav-menu liquid-glass">
          <a
            href="#home"
            className={`pill-nav-item ${activeTab === "home" ? "active" : ""}`}
            onClick={(e) => scrollToSection(e, "home")}
          >
            Home
          </a>
          <a
            href="#courses"
            className={`pill-nav-item ${activeTab === "courses" ? "active" : ""}`}
            onClick={(e) => scrollToSection(e, "courses")}
          >
            Courses
          </a>
          <a
            href="#reviews"
            className={`pill-nav-item ${activeTab === "reviews" ? "active" : ""}`}
            onClick={(e) => scrollToSection(e, "reviews")}
          >
            Reviews
          </a>
          <a
            href="#showcase"
            className={`pill-nav-item ${activeTab === "showcase" ? "active" : ""}`}
            onClick={(e) => scrollToSection(e, "showcase")}
          >
            Showcase
          </a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="hero" id="home">
        <div className="hero-content reveal-on-scroll active">
          <div className="trusted-badge liquid-glass">
            <div className="trusted-icons">
              <span className="mini-icon">⬡</span>
              <span className="mini-icon">▲</span>
              <span className="mini-icon">●</span>
            </div>
            <span className="trusted-text">FSEGO ACADEMY</span>
          </div>

          <h1 className="hero-title pixel-font">
            MASTER THE MARKET<br />
            <span className="text-gradient-red">WITH ORDER FLOW</span>
          </h1>

          <p className="hero-description">
            "Gain a true trading edge with institutional-grade Order Flow concepts.
            Learn to read liquidity, order book imbalances, and institutional footprints to execute with high precision."
          </p>

          <div className="hero-actions">
            <button
              onClick={(e) => scrollToSection(e, "courses")}
              className="get-started-white-btn"
              style={{ border: "none", cursor: "pointer" }}
            >
              Get Started
            </button>
          </div>

          <div className="minimal-stats">
            <TiltCard className="stat-box">
              <div className="stat-icon">❮❯</div>
              <div className="stat-val">Module 11</div>
              <div className="stat-lbl">Structured Curriculum</div>
            </TiltCard>

            <TiltCard className="stat-box">
              <div className="stat-icon">❖</div>
              <div className="stat-val">{ratingCount}%+</div>
              <div className="stat-lbl">Student Rating</div>
            </TiltCard>

            <TiltCard className="stat-box">
              <div className="stat-icon">✳</div>
              <div className="stat-val">24/7</div>
              <div className="stat-lbl">Private Trader Community</div>
            </TiltCard>

            <TiltCard className="stat-box">
              <div className="stat-icon">⧉</div>
              <div className="stat-val">{studentsCount}+</div>
              <div className="stat-lbl">Active Students</div>
            </TiltCard>
          </div>
        </div>
      </main>

      {/* WHY ORDERFLOW SECTION */}
      <section className="why-section">
        <div className="why-header reveal-on-scroll">
          <div>
            <div className="why-tagline">WHY ORDERFLOW</div>
            <h2 className="why-main-title pixel-font">
              Four reasons <br />
              <span className="text-gradient-red">serious traders</span> <br />
              use orderflow.
            </h2>
          </div>
          <div className="why-subtitle">
            "Unlock your full trading potential by tracking real institutional liquidity, giving every execution a distinct statistical edge."
          </div>
        </div>

        <div className="why-list">
          <div className="reveal-on-scroll">
            <TiltCard className="why-card">
              <div className="why-card-content">
                <div className="why-num pixel-font">01</div>
                <div className="why-info">
                  <h3 className="why-title">Real Order Insights, No Chart Guessing</h3>
                  <p className="why-desc">
                    Read buying and selling pressure directly through Volume and Footprint. Clear market control without lagging indicators.
                  </p>
                </div>
              </div>
              <div className="why-badge">REAL-TIME DATA</div>
            </TiltCard>
          </div>

          <div className="reveal-on-scroll">
            <TiltCard className="why-card">
              <div className="why-card-content">
                <div className="why-num pixel-font">02</div>
                <div className="why-info">
                  <h3 className="why-title">Tight Stop Loss, Protect Drawdown</h3>
                  <p className="why-desc">
                    Identify precise liquidity pools to place tight Stop Losses. Know instantly when invalidated and keep drawdown well within Prop Firm rules.
                  </p>
                </div>
              </div>
              <div className="why-badge">RISK CONTROL</div>
            </TiltCard>
          </div>

          <div className="reveal-on-scroll">
            <TiltCard className="why-card">
              <div className="why-card-content">
                <div className="why-num pixel-font">03</div>
                <div className="why-info">
                  <h3 className="why-title">Eliminate Overtrading & FOMO</h3>
                  <p className="why-desc">
                    When there is no setup or volume, the Footprint warns you instantly. Know when to stay out and avoid emotional chasing.
                  </p>
                </div>
              </div>
              <div className="why-badge">DISCIPLINE</div>
            </TiltCard>
          </div>

          <div className="reveal-on-scroll">
            <TiltCard className="why-card">
              <div className="why-card-content">
                <div className="why-num pixel-font">04</div>
                <div className="why-info">
                  <h3 className="why-title">Pure Market Logic, No Pattern Memorization</h3>
                  <p className="why-desc">
                    Stop memorizing endless chart patterns. Understand pure order-matching mechanics and focus strictly on why price moves.
                  </p>
                </div>
              </div>
              <div className="why-badge">PURE LOGIC</div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* SINGLE PRODUCT DISPLAY SECTION */}
      <section className="tools-section" id="courses">
        <div className="tools-header reveal-on-scroll">
          <div className="tools-tagline">COURSE PACKAGES</div>
          <h2 className="tools-main-title pixel-font">
            CHOOSE YOUR <span className="text-gradient-red">TRADING PATH</span>
          </h2>
          <p className="tools-sub-text">
            Select the learning path that fits your goals and master Order Flow step by step.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="platform-switch-container reveal-on-scroll">
          <div className="platform-switch">
            <button
              className={`platform-btn ${selectedPlan === "selfPaced" ? "active" : ""}`}
              onClick={() => setSelectedPlan("selfPaced")}
            >
              VIP Mentorship
            </button>
            <button
              className={`platform-btn ${selectedPlan === "mentorship" ? "active" : ""}`}
              onClick={() => setSelectedPlan("mentorship")}
            >
              Full Access Course
            </button>
          </div>
        </div>

        {/* Card Content Display */}
        <div className="single-product-container reveal-on-scroll">
          <TiltCard className="redesigned-product-card">
            {/* Visual Header Banner with Image Carousel */}
            <div className="card-visual-banner">
              <span className="banner-tag">PREVIEW</span>
              
              <div className="carousel-container">
                <img
                  src={images[imgIndex]}
                  alt={`Course Preview ${imgIndex + 1}`}
                  className="carousel-img"
                  onClick={() => openModal(images[imgIndex])}
                  style={{ cursor: "pointer" }}
                  title="Click to expand"
                />
                
                <button className="carousel-btn prev-btn" onClick={handlePrevImg}>❮</button>
                <button className="carousel-btn next-btn" onClick={handleNextImg}>❯</button>
                
                <div className="carousel-dots">
                  {images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`dot ${idx === imgIndex ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgIndex(idx);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {selectedPlan === "selfPaced" ? (
              <>
                <div className="price-info-row">
                  <div className="pkg-title-area">
                    <div className="badge-pills">
                      <span className="pill-tag bestseller">POPULAR</span>
                      <span className="pill-tag sub">PRIVATE MENTORSHIP</span>
                    </div>
                    <div className="pkg-title-row">
                      <h3 className="pkg-name">VIP Access</h3>
                    </div>
                    <p className="pkg-summary-desc">
                      An intensive 1-on-1 Order Flow program with personalized coaching, trade journal reviews, and custom trading system setup.
                    </p>
                  </div>

                  <div className="price-box-side">
                    <div className="price-item-line">
                      <div>
                        <div className="price-type">PRIVATE MENTORSHIP</div>
                        <div className="price-type-sub">1-on-1 Coaching + Course Content + Discord Community + Motivewave Templates</div>
                      </div>
                      <div className="price-amount">$105.80 / ฿3500</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOpenAgreement}
                  className="buy-action-btn"
                  style={{ border: "none", cursor: "pointer", width: "100%" }}
                >
                  Get Access Now
                </button>

                <div className="included-features-wrapper">
                  <div className="included-label">• INCLUDED WITH PURCHASE</div>
                  <div className="features-3col-grid">
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">1-on-1 Live Coaching</div>
                        <div className="feature-item-desc">Personalized sessions to refine your execution and strategy</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Full Video Modules</div>
                        <div className="feature-item-desc">11 comprehensive video lessons with lifetime access</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Motivewave Templates</div>
                        <div className="feature-item-desc">Ready-to-use Order Flow chart setups and configurations</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Private Discord Community</div>
                        <div className="feature-item-desc">Exclusive trader channel for daily breakdowns and trade plans</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Weekly Live Q&A / Review</div>
                        <div className="feature-item-desc">Weekly live market recaps and direct Q&A support</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Lifetime Updates</div>
                        <div className="feature-item-desc">Free access to all future strategy and content updates</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="price-info-row">
                  <div className="pkg-title-area">
                    <div className="badge-pills">
                      <span className="pill-tag bestseller">RECOMMENDED</span>
                      <span className="pill-tag sub">FULL ACCESS</span>
                    </div>
                    <div className="pkg-title-row">
                      <h3 className="pkg-name">Full Access Course</h3>
                    </div>
                    <p className="pkg-summary-desc">
                      Master Order Flow, Footprint, and Volume Profile from the ground up to build your own high-precision execution setups.
                    </p>
                  </div>

                  <div className="price-box-side">
                    <div className="price-item-line">
                      <div>
                        <div className="price-type">Full Access Course</div>
                        <div className="price-type-sub">11 Video Modules + Discord Community + Motivewave Templates</div>
                      </div>
                      <div className="price-amount">$42.28 / ฿1399</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOpenAgreement}
                  className="buy-action-btn"
                  style={{ border: "none", cursor: "pointer", width: "100%" }}
                >
                  Get Access Now
                </button>

                <div className="included-features-wrapper">
                  <div className="included-label">• INCLUDED WITH PURCHASE</div>
                  <div className="features-3col-grid">
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Full Video Modules</div>
                        <div className="feature-item-desc">11 comprehensive video lessons with lifetime access</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Chart Templates & Setups</div>
                        <div className="feature-item-desc">Pre-configured Order Flow chart templates ready to deploy</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Private Discord Community</div>
                        <div className="feature-item-desc">Exclusive trader channel for daily breakdowns and trade plans</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Weekly Live Q&A / Review</div>
                        <div className="feature-item-desc">Weekly live market recaps and direct Q&A support</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Lifetime Course Updates</div>
                        <div className="feature-item-desc">Free access to all future strategy and content updates</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

          </TiltCard>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="why-section" id="reviews">
        <div className="why-header reveal-on-scroll">
          <div>
            <div className="why-tagline">STUDENT REVIEWS</div>
            <h2 className="why-main-title pixel-font">
              WHAT OUR <br />
              <span className="text-gradient-red">STUDENTS SAY</span>
            </h2>
          </div>
          <div className="why-subtitle">
            "Real feedback from students applying Order Flow concepts directly in live market conditions."
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "40px" }}>
          <div className="reveal-on-scroll">
            <TiltCard className="why-card">
              <div className="why-card-content" style={{ flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <span style={{ color: "#ef4444", fontSize: "16px" }}>★★★★★</span>
                  <span className="why-badge">Full Access Course</span>
                </div>
                <h3 className="why-title" style={{ fontSize: "18px", margin: "0" }}>bliahased</h3>
                <p className="why-desc" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  "มารีวิวรอบ2ครับหลังจากเริ่มคอร์สมา 2 อาทิตย์ แบบเรียนคลิปจบภายใน1วันแล้วที่เหลือมาลองในตลาดเองจนตอนนี้ได้กำไรเกินค่าเรียนไป หลายเท่าแล้วคร้บ อยากจะบอกว่ามันดีมากจริงๆสำหรับผมคนที่เคยลองมาหลายๆเทคนิค แต่ไม่เคยทำกำไรได้เองเลยสักนิดเดียวมีแต่ตามซิกจนมาเจอ orderflow อันนี้ทำให้ผมสามารถทำกำไรได้เองจริงครั้งแรก มันคุ้มจริงๆสำหรับผมดีมาก"
                </p>
              </div>
            </TiltCard>
          </div>

          <div className="reveal-on-scroll">
            <TiltCard className="why-card">
              <div className="why-card-content" style={{ flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <span style={{ color: "#ef4444", fontSize: "16px" }}>★★★★★</span>
                  <span className="why-badge">Full Access Course</span>
                </div>
                <h3 className="why-title" style={{ fontSize: "18px", margin: "0" }}>wizchy_th_789</h3>
                <p className="why-desc" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  "สอนดีครับ จากคนไม่รู้เรื่องเลยอย่างผม ยังสามารถเข้าใจได้ ถือว่าสอนลงรายละเอียดดีครับ บวกกับการ ให้ดูว่าที่มาที่ไปของการเทรดจริงต้องดูยังไง เริ่มจากตรงไหน เหมือนได้เปิดโลกใหม่เลยครับ ผู้สอนแนะนำระหว่างสอนดีครับมีทวนให้ตลอดถ้าไม่เข้าใจ"
                </p>
              </div>
            </TiltCard>
          </div>

          <div className="reveal-on-scroll">
            <TiltCard className="why-card">
              <div className="why-card-content" style={{ flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <span style={{ color: "#ef4444", fontSize: "16px" }}>★★★★★</span>
                  <span className="why-badge">Full Access Course</span>
                </div>
                <h3 className="why-title" style={{ fontSize: "18px", margin: "0" }}>ingbluejay</h3>
                <p className="why-desc" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  "ส่วนตัวนี่เคยเรียนจากคนอื่นมา ไม่ค่อยเข้าใจ orderflow ซะที จนมาลองเรียนกับน้องไผ่ เรียนปุ๊ปกระจ่างเลยอะไรที่งงๆอยู่คือเข้าใจหมดเลย ไผ่ไม่มีกั๊กสอนหมด แนะนำอยากให้เพิ่มสอนจากกราฟจริงเพิ่มเติมลงในคลิปควบคู่ไปให้หน่อยแบบประกอบร่างรวมกันกับข้อมูลที่เรียนมาทั้งหมดเวลาหาedgeก่อนเข้าเทรด เผื่อคนไม่เข้าใจจะได้เกทเลย ขอบคุณมากที่เอาความรู้ที่ยากๆมาสอนให้เข้าใจง่าย !!ถูกและดีมีจริงนะทุกคน!!"
                </p>
              </div>
            </TiltCard>
          </div>

          <div className="reveal-on-scroll">
            <TiltCard className="why-card">
              <div className="why-card-content" style={{ flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <span style={{ color: "#ef4444", fontSize: "16px" }}>★★★★★</span>
                  <span className="why-badge">Full Access Course</span>
                </div>
                <h3 className="why-title" style={{ fontSize: "18px", margin: "0" }}>attakler</h3>
                <p className="why-desc" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  "อาจารย์สอนแบบเป็นกันเอง เข้าใจง่าย สอนเน้นๆเนื้อๆที่จะนำไปเทรดได้เลย ตั้งแต่ วางแผน bias หาจุดเข้าเทรด การรอจังหวะ การใช้Platform ทุกอย่างสรุปมาแบบเข้าใจง่ายมากๆ ชอบครับ หลายอย่างเป็นปัญหามาก่อนหน้านี้(จากที่ศึกษาจาาต่างประเทศเองแล้วไม่เข้าใจ) ก็มาเข้าใจจากการเรียนไม่กี่ชั่วโมง ตรงไหนตามไม่ทันอาจารย์ใจดียินดีทวนให้ซ้ำ หลังจากเรียนวิธีการนี้จะพบว่าจริงๆง่ายกว่าและมีเหตุผลกว่าวิชาอื่นๆที่แพร่หลายอยู่ก่อนด้วยซ้ำ ผมคิดหลายคนอาจมองว่ายากจากหลายๆที่อัพค่าวิชาไปแพงมากด้วย แต่ที่นี่อาจารย์คิดราคาน่ารักราคาแบ่งปันราคาเอาสังคมเปิดโอกาสให้น้องๆได้ศึกษา ขอบคุณมากๆครับ สำหรับคนสนใจแนะนำจริงๆ"
                </p>
              </div>
            </TiltCard>
          </div>

          <div className="reveal-on-scroll">
            <TiltCard className="why-card">
              <div className="why-card-content" style={{ flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <span style={{ color: "#ef4444", fontSize: "16px" }}>★★★★★</span>
                  <span className="why-badge">Full Access Course</span>
                </div>
                <h3 className="why-title" style={{ fontSize: "18px", margin: "0" }}>lnw_new</h3>
                <p className="why-desc" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  "สอนครั้งเเรกดีมากครับว้าวเลย เปิดประสบการณ์สุดๆทีแรกคิดว่าOrderflow จะแต่ถ้าลองเปิดในจริงๆง่ายม๊ากๆยิ่งคนสอนสอนเข้าใจสุดๆเนื้อเนื้อหากระจ่างในการสอนเดียว พี่ไผ่เฟรนลี่คุยง่ายน่ารัก ไม่รู้สึกกดดันเลยเหมือนเป็นพี่ชายคนนึง สอนหมดไม่มีกั๊ก ถามได้หมด รักพี่ไผ่ฮ่ะ"
                </p>
              </div>
            </TiltCard>
          </div>

          <div className="reveal-on-scroll">
            <TiltCard className="why-card">
              <div className="why-card-content" style={{ flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                  <span style={{ color: "#ef4444", fontSize: "16px" }}>★★★★★</span>
                  <span className="why-badge">Full Access Course</span>
                </div>
                <h3 className="why-title" style={{ fontSize: "18px", margin: "0" }}>bliahased</h3>
                <p className="why-desc" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  "ไม่กักความรุ้เลยเวลาคนเรียนมีคำถามอะไรตอบทุกอย่างเป็นกันเองมากครับเข้ามาฟังแล้วรุ้สึกไม่เครียดเลย ทำให้ เข้าใจการทำงานของตลาดว่าอะไรยังไงเป็นมายังไง ดีมากครับ"
                </p>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* STUDENT SHOWCASE SECTION */}
      <section className="showcase-section" id="showcase">
        <div className="showcase-header reveal-on-scroll">
          <div className="why-tagline">STUDIES SHOWCASE</div>
          <h2 className="showcase-main-title pixel-font">
            Real charts. <span className="text-gradient-blue">Real sessions.</span>
          </h2>
        </div>

        <div className="showcase-window-container reveal-on-scroll">
          <div className="showcase-window liquid-glass">
            <div className="window-header">
              <div className="window-dots">
                <span className="dot-btn red"></span>
                <span className="dot-btn yellow"></span>
                <span className="dot-btn green"></span>
              </div>
              <div className="window-title">
                FSEGO_ORDERFLOW — IMAGE 0{showcaseIndex + 1} / {studentImages.length}
              </div>
            </div>

            <div className="window-body">
              <button className="window-nav-btn prev" onClick={handlePrevShowcase}>❮</button>
              <img
                src={studentImages[showcaseIndex]}
                alt={`Student Trading Performance ${showcaseIndex + 1}`}
                className="window-img"
                onClick={() => openModal(studentImages[showcaseIndex])}
                style={{ cursor: "pointer" }}
                title="Click to expand"
              />
              <button className="window-nav-btn next" onClick={handleNextShowcase}>❯</button>
            </div>
          </div>

          <div className="showcase-thumbnails">
            {studentImages.map((img, idx) => (
              <div
                key={idx}
                className={`thumb-item ${idx === showcaseIndex ? "active" : ""}`}
                onClick={() => setShowcaseIndex(idx)}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="cta-final-section">
        <div className="cta-container reveal-on-scroll">
          <span className="cta-tagline">READY TO TRADE WITH EDGE?</span>
          <h2 className="cta-title">
            Upgrade Your <span className="text-gradient-red">Trading Edge.</span>
          </h2>
          <p className="cta-description">
            Order Flow isn't just a course — it's a proven methodology built by active traders, designed to refine your edge in live market conditions.
          </p>
          <div className="cta-buttons-group">
            <button
              onClick={(e) => scrollToSection(e, "courses")}
              className="cta-btn btn-get-started"
              style={{ border: "none", cursor: "pointer" }}
            >
              Get Started
            </button>
            <a 
              href="https://discord.gg/AbgJTN4dzc" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cta-btn btn-discord"
            >
              <svg className="discord-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Join Discord <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="site-footer">
        <div className="footer-inner-container">
          <div className="footer-top-grid">
            {/* Brand Column */}
            <div className="footer-brand-col">
              <div className="footer-logo-row">
                <img src="/logo.gif" alt="FSEGO Logo" className="footer-logo-img" />
                <span className="footer-brand-name">FSEGO Academy</span>
              </div>
              <p className="footer-brand-desc">
                Professional orderflow studies for institutional precision trading. Built to master the market edge.
              </p>
              <div className="footer-status-badge">
                <span className="status-dot-pulse" />
                OPERATIONAL
              </div>
            </div>

            {/* Product Column */}
            <div className="footer-col">
              <div className="footer-col-title">PRODUCT</div>
              <ul className="footer-links-list">
                <li><a href="#courses" onClick={(e) => scrollToSection(e, "courses")} className="footer-link">Courses</a></li>
                <li><a href="#courses" onClick={(e) => scrollToSection(e, "courses")} className="footer-link">VIP Mentorship</a></li>
                <li><a href="#reviews" onClick={(e) => scrollToSection(e, "reviews")} className="footer-link">Reviews</a></li>
                <li><a href="#showcase" onClick={(e) => scrollToSection(e, "showcase")} className="footer-link">Showcase</a></li>
              </ul>
            </div>

            {/* Support Column */}
            <div className="footer-col">
              <div className="footer-col-title">SUPPORT</div>
              <ul className="footer-links-list">
                <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="footer-link">Contact Support</a></li>
                <li><a href="https://discord.gg/AbgJTN4dzc" target="_blank" rel="noopener noreferrer" className="footer-link">Discord Support</a></li>
              </ul>
            </div>

            {/* Community Column */}
            <div className="footer-col">
              <div className="footer-col-title">COMMUNITY</div>
              <ul className="footer-links-list">
                <li><a href="https://discord.gg/AbgJTN4dzc" target="_blank" rel="noopener noreferrer" className="footer-link">Discord Community</a></li>
                <li><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="footer-col">
              <div className="footer-col-title">LEGAL</div>
              <ul className="footer-links-list">
                <li><a href="#terms" onClick={(e) => openLegalModal(e, "terms")} className="footer-link">Terms of Service</a></li>
                <li><a href="#privacy" onClick={(e) => openLegalModal(e, "privacy")} className="footer-link">Privacy Policy</a></li>
                <li><a href="#risk" onClick={(e) => openLegalModal(e, "risk")} className="footer-link">Risk Disclosure</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-divider" />

          <div className="footer-disclaimer">
            <span>Disclaimer:</span> FSEGO Academy provides educational content and tools for informational purposes only and should not be considered as financial or investment advice. We are not licensed financial advisors, and nothing shared here constitutes a recommendation to buy, sell, or hold any financial instrument. Trading and investing in financial markets involve significant risk and may not be suitable for all individuals.
          </div>

          <div className="footer-bottom-row">
            <div className="footer-copyright">
              © 2026 FSEGO Academy. All rights reserved.
            </div>
            <div className="footer-social-icons">
              <a href="https://discord.gg/AbgJTN4dzc" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Discord">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      {isModalOpen && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal} aria-label="Close Preview">
              ✕
            </button>
            <img
              src={modalImageSrc}
              alt="Preview Full"
              className="modal-preview-img"
            />
          </div>
        </div>
      )}

      {/* PURCHASE AGREEMENT / TERMS MODAL (PROFESSIONAL LEGAL BINDING) */}
      {isAgreementOpen && (
        <div className="image-modal-overlay" onClick={() => setIsAgreementOpen(false)}>
          <div 
            className="liquid-glass" 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "600px",
              width: "90%",
              padding: "32px",
              borderRadius: "16px",
              position: "relative",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              background: "#0d0d12",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(239, 68, 68, 0.2)"
            }}
          >
            <button 
              className="modal-close-btn" 
              onClick={() => setIsAgreementOpen(false)} 
              aria-label="Close Modal"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#a1a1aa",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                transition: "all 0.2s ease"
              }}
            >
              ✕
            </button>

            {/* Header Area */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "16px" }}>
              <img src="/logo1.png" alt="FSEGO Logo" style={{ width: "48px", height: "48px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} />
              <div>
                <h3 style={{ fontSize: "20px", color: "#fff", margin: 0, fontWeight: "700", fontFamily: "monospace", letterSpacing: "0.5px" }}>
                  LEGAL PURCHASE AGREEMENT
                </h3>
                <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "600" }}>
                  CONFIDENTIALITY & INTELLECTUAL PROPERTY POLICY
                </span>
              </div>
            </div>

            {/* Scrollable Terms Content */}
<div 
  className="legal-scroll-box"
  style={{
    maxHeight: "220px",
    overflowY: "auto",
    paddingRight: "10px",
    fontSize: "13px",
    color: "#a1a1aa",
    lineHeight: "1.6",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "rgba(0,0,0,0.3)",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div>
                <strong style={{ color: "#fff" }}>1. STRICT NON-DISCLOSURE & PROPRIETARY RIGHTS</strong><br />
                All course content, video lectures, proprietary chart templates, indicators, and Discord community materials are exclusive intellectual property of FSEGO Academy.
              </div>
              <div>
                <strong style={{ color: "#ef4444" }}>2. PROHIBITION OF RESALE AND REDISTRIBUTION</strong><br />
                Any unauthorized recording, sharing, reselling, or public dissemination of these materials is strictly prohibited under applicable Intellectual Property Laws.
              </div>
              <div>
                <strong style={{ color: "#fff" }}>3. LEGAL PENALTIES & ENFORCEMENT</strong><br />
                Violations will result in an immediate lifetime access revocation without refund, followed by a fine enforcement of <strong style={{ color: "#fff", textDecoration: "underline" }}>50,000 THB</strong> and full legal prosecution for damages.
              </div>
              <div>
                <strong style={{ color: "#fff" }}>4. FINAL ACCESS DIRECTIVE</strong><br />
                By proceeding, you agree to be bound by these legal terms and acknowledge that your enrollment is strictly for personal educational usage.
              </div>
            </div>

            {/* Checkbox Area */}
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
              cursor: "pointer",
              fontSize: "13px",
              color: isAccepted ? "#fff" : "#a1a1aa",
              userSelect: "none"
            }}>
              <input 
                type="checkbox" 
                checked={isAccepted} 
                onChange={(e) => setIsAccepted(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "#ef4444", cursor: "pointer" }}
              />
              <span>I have read and agree to the Legal Terms and Fine Policy.</span>
            </label>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
              <button 
                onClick={() => setIsAgreementOpen(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#a1a1aa",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "14px",
                  transition: "all 0.2s ease"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAcceptAndRedirect}
                disabled={!isAccepted}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  background: isAccepted ? "#ef4444" : "#3f3f46",
                  border: "none",
                  color: isAccepted ? "#fff" : "#71717a",
                  cursor: isAccepted ? "pointer" : "not-allowed",
                  fontWeight: "600",
                  fontSize: "14px",
                  boxShadow: isAccepted ? "0 0 20px rgba(239, 68, 68, 0.5)" : "none",
                  transition: "all 0.2s ease",
                  opacity: isAccepted ? 1 : 0.6
                }}
              >
                Accept & Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEGAL DOCUMENT MODAL */}
      {legalModalContent && (
        <div className="image-modal-overlay" onClick={closeLegalModal}>
          <div 
            className="liquid-glass" 
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "600px",
              width: "90%",
              padding: "32px",
              borderRadius: "16px",
              position: "relative",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              background: "#0d0d12"
            }}
          >
            <button 
              className="modal-close-btn" 
              onClick={closeLegalModal} 
              aria-label="Close Legal Modal"
              style={{ top: "16px", right: "16px" }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: "20px", color: "#fff", marginBottom: "16px", fontFamily: "monospace" }}>
              {legalModalContent.title}
            </h3>
            <div style={{ fontSize: "14px", color: "#a1a1aa", lineHeight: "1.6" }}>
              {legalModalContent.body}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;