import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Instagram Target URL
const INSTAGRAM_URL = "https://www.instagram.com/crx.wrld?igsh=NGc0dXIwMWs5ZmQ2&utm_source=qr";

// Hook สำหรับตัวเลขนับอนิเมชัน
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

// คอมโพเนนต์การ์ด 3D Interactive Spotlight Tilt
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

  // Preloader Timeout Handler (1.5 วินาที)
  useEffect(() => {
    const timer = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.classList.add("fade-out");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // State สำหรับ Section Course Packages & Carousel
  const [selectedPlan, setSelectedPlan] = useState("selfPaced");
  const [imgIndex, setImgIndex] = useState(0);

  // State สำหรับ Student Showcase Section
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  // State สำหรับ Lightbox Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  // รูปภาพในการ์ดสินค้า
  const images = ["/tem1.png", "/tem2.png", "/tem3.png", "/tem4.png"];
  const studentImages = ["/st1.png", "/st2.png", "/st3.png", "/st4.png", "/st5.png"];

  // ฟังก์ชันสำหรับการเลื่อน Section นุ่มๆ ด้วย Custom Easing (รวมถึง Home บนสุด)
  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    setActiveTab(targetId);

    const startPosition = window.pageYOffset;
    let targetPosition = 0;

    if (targetId !== "home") {
      const element = document.getElementById(targetId);
      if (!element) return;
      targetPosition = element.getBoundingClientRect().top + startPosition - 80;
    }

    const distance = targetPosition - startPosition;
    const duration = 1000; // 1 วินาที นุ่มนวลเท่ากันทุกปุ่ม
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
      if (!isModalOpen) return;
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

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
        <div className="hero-content">
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
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="get-started-white-btn"
            >
              Get Started
            </a>
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
        <div className="why-header">
          <div>
            <div className="why-tagline">WHY ORDERFLOW</div>
            <h2 className="why-main-title pixel-font">
              Four reasons <br />
              <span className="text-gradient-red">serious traders</span> <br />
              pick us.
            </h2>
          </div>
          <div className="why-subtitle">
            "ปลดล็อกศักยภาพการเทรดด้วยการมองเห็นสภาพคล่องจริงของสถาบัน เพื่อให้ทุกการส่งคำสั่งซื้อขายของคุณได้เปรียบที่สุดในตลาด"
          </div>
        </div>

        <div className="why-list">
          <TiltCard className="why-card">
            <div className="why-card-content">
              <div className="why-num pixel-font">01</div>
              <div className="why-info">
                <h3 className="why-title">เห็น Order จริง ไม่ต้องเดาทรงกราฟ</h3>
                <p className="why-desc">
                  อ่านแรงซื้อขายจาก Vol, CVD และ Footprint ตรงๆ เห็นชัดว่าฝั่งไหนคุมตลาดอยู่ ไม่ต้องพึ่ง Indicator ล่าช้า
                </p>
              </div>
            </div>
            <div className="why-badge">REAL-TIME DATA</div>
          </TiltCard>

          <TiltCard className="why-card">
            <div className="why-card-content">
              <div className="why-num pixel-font">02</div>
              <div className="why-info">
                <h3 className="why-title">คุม Stop Loss ได้แคบ คลังแสงไม่พัง</h3>
                <p className="why-desc">
                  เห็นจุด Liquidity ชัดเจน ทำให้ตั้ง SL ได้คม ผิดทางรู้ทันที ช่วยเซฟ Drawdown ไม่ให้ชนกฎ Max Loss ของกองทุน
                </p>
              </div>
            </div>
            <div className="why-badge">RISK CONTROL</div>
          </TiltCard>

          <TiltCard className="why-card">
            <div className="why-card-content">
              <div className="why-num pixel-font">03</div>
              <div className="why-info">
                <h3 className="why-title">หยุดอาการ Overtrade และ FOMO</h3>
                <p className="why-desc">
                  กราฟไม่มี Setup หรือ Vol ไม่เข้า Footprint จะฟ้องทันที ช่วยให้หยุดมือเป็น ไม่ไล่ราคาตามอารมณ์
                </p>
              </div>
            </div>
            <div className="why-badge">DISCIPLINE</div>
          </TiltCard>

          <TiltCard className="why-card">
            <div className="why-card-content">
              <div className="why-num pixel-font">04</div>
              <div className="why-info">
                <h3 className="why-title">ลอจิกชัดเจน ไม่ต้องนั่งจำ Pattern</h3>
                <p className="why-desc">
                  เลิกท่องจำรูปแบบกราฟร้อยแปด เปลี่ยนมาเข้าใจ Mechanism การจับคู่ Order เพียวๆ โฟกัสแค่เหตุผลที่ราคาขยับจริง
                </p>
              </div>
            </div>
            <div className="why-badge">PURE LOGIC</div>
          </TiltCard>
        </div>
      </section>

      {/* SINGLE PRODUCT DISPLAY SECTION */}
      <section className="tools-section" id="courses">
        <div className="tools-header">
          <div className="tools-tagline">COURSE PACKAGES</div>
          <h2 className="tools-main-title pixel-font">
            CHOOSE YOUR <span className="text-gradient-red">TRADING PATH</span>
          </h2>
          <p className="tools-sub-text">
            เลือกแพ็กเกจเรียน Order Flow เพื่อยกระดับการเทรดของคุณแบบสเต็ปบายสเต็ป
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="platform-switch-container">
          <div className="platform-switch">
            <button
              className={`platform-btn ${selectedPlan === "selfPaced" ? "active" : ""}`}
              onClick={() => setSelectedPlan("selfPaced")}
            >
              Self-Paced (เรียนด้วยตัวเอง)
            </button>
            <button
              className={`platform-btn ${selectedPlan === "mentorship" ? "active" : ""}`}
              onClick={() => setSelectedPlan("mentorship")}
            >
              Mentorship (เรียน + มีโค้ชดูแล)
            </button>
          </div>
        </div>

        {/* Card Content Display */}
        <div className="single-product-container">
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
                  title="คลิกเพื่อขยายรูปภาพ"
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
                      <span className="pill-tag sub">SELF-PACED</span>
                    </div>
                    <div className="pkg-title-row">
                      <h3 className="pkg-name">Standard Access</h3>
                    </div>
                    <p className="pkg-summary-desc">
                      คอร์สเรียนเจาะลึกการอ่าน Order Flow, Footprint, และ Volume Profile ตั้งแต่พื้นฐานจนถึงการสร้าง Setup เข้าเทรดจริง
                    </p>
                  </div>

                  <div className="price-box-side">
                    <div className="price-item-line">
                      <div>
                        <div className="price-type">Standard Access</div>
                        <div className="price-type-sub">เข้าถึงวิดีโอเนื้อหาอย่างเดียว</div>
                      </div>
                      <div className="price-amount">$36.23 / ฿1199</div>
                    </div>
                  </div>
                </div>

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="buy-action-btn"
                >
                  Get Access Now
                </a>

                <div className="included-features-wrapper">
                  <div className="included-label">• INCLUDED WITH PURCHASE</div>
                  <div className="features-3col-grid">
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Full Video Modules</div>
                        <div className="feature-item-desc">เนื้อหาบทเรียน 11บท ดูซ้ำได้ตลอดชีพ</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Private Discord Community</div>
                        <div className="feature-item-desc">เข้ากลุ่มพูดคุย แลกเปลี่ยนแผนการเทรดรายวัน</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Weekly Live Q&A / Review</div>
                        <div className="feature-item-desc">ไลฟ์สตรีมทบทวน กราฟประจำสัปดาห์ และตอบคำถามสงสัย</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Lifetime Course Updates</div>
                        <div className="feature-item-desc">อัปเดตเนื้อหาและเทคนิคใหม่ๆ ฟรี ตลอดอายุการใช้งาน</div>
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
                      คอร์สเรียนเจาะลึกการอ่าน Order Flow, Footprint, และ Volume Profile ตั้งแต่พื้นฐานจนถึงการสร้าง Setup เข้าเทรดจริง
                    </p>
                  </div>

                  <div className="price-box-side">
                    <div className="price-item-line">
                      <div>
                        <div className="price-type">Full Access Course</div>
                        <div className="price-type-sub">เนื้อหา + เข้ากลุ่มดิสคอร์ด + Template กราฟ</div>
                      </div>
                      <div className="price-amount">$42.28 / ฿1399</div>
                    </div>
                  </div>
                </div>

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="buy-action-btn"
                >
                  Get Access Now
                </a>

                <div className="included-features-wrapper">
                  <div className="included-label">• INCLUDED WITH PURCHASE</div>
                  <div className="features-3col-grid">
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Full Video Modules</div>
                        <div className="feature-item-desc">เนื้อหาบทเรียน 11บท ดูซ้ำได้ตลอดชีพ</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Chart Templates & Setups</div>
                        <div className="feature-item-desc">แจกไฟล์ Template Order Flow พร้อมใช้งานทันที</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Private Discord Community</div>
                        <div className="feature-item-desc">เข้ากลุ่มพูดคุย แลกเปลี่ยนแผนการเทรดรายวัน</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Weekly Live Q&A / Review</div>
                        <div className="feature-item-desc">ไลฟ์สตรีมทบทวน กราฟประจำสัปดาห์ และตอบคำถามสงสัย</div>
                      </div>
                    </div>
                    <div className="feature-check-item">
                      <span className="check-icon">✓</span>
                      <div>
                        <div className="feature-item-title">Lifetime Course Updates</div>
                        <div className="feature-item-desc">อัปเดตเนื้อหาและเทคนิคใหม่ๆ ฟรี ตลอดอายุการใช้งาน</div>
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
        <div className="why-header">
          <div>
            <div className="why-tagline">STUDENT REVIEWS</div>
            <h2 className="why-main-title pixel-font">
              WHAT OUR <br />
              <span className="text-gradient-red">TRADERS SAY</span>
            </h2>
          </div>
          <div className="why-subtitle">
            "เสียงตอบรับจริงจากนักเรียนในคอร์สคร่าวๆ ที่นำความรู้ Order Flow ไปลงมือปฏิบัติจริงในตลาด"
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "40px" }}>
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

          <TiltCard className="why-card">
            <div className="why-card-content" style={{ flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <span style={{ color: "#ef4444", fontSize: "16px" }}>★★★★★</span>
                <span className="why-badge">Full Access Course</span>
              </div>
              <h3 className="why-title" style={{ fontSize: "18px", margin: "0" }}>lnw_new</h3>
              <p className="why-desc" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                "สอนครั้งเเรกดีมากครับว้าวเลย เปิดประสบการณ์สุดๆทีแรกคิดว่าOrderflow จะแต่ถ้าลองเปิดในจริงๆง่ายม๊ากๆยิ่งคนสอนสอนเข้าใจสุดๆเนื้อแน่นๆ ทุกเนื้อหากระจ่างในการสอนเดียว พี่ไผ่เฟรนลี่คุยง่ายน่ารัก ไม่รู้สึกกดดันเลยเหมือนเป็นพี่ชายคนนึง สอนหมดไม่มีกั๊ก ถามได้หมด รักพี่ไผ่ฮ่ะ"
              </p>
            </div>
          </TiltCard>

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
      </section>

      {/* STUDENT SHOWCASE SECTION */}
      <section className="showcase-section" id="showcase">
        <div className="showcase-header">
          <div className="why-tagline">STUDIES SHOWCASE</div>
          <h2 className="showcase-main-title pixel-font">
            Real charts. <span className="text-gradient-blue">Real sessions.</span>
          </h2>
        </div>

        <div className="showcase-window-container">
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
                title="คลิกเพื่อขยายรูปภาพ"
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
        <div className="cta-container">
          <span className="cta-tagline">READY TO TRADE WITH EDGE?</span>
          <h2 className="cta-title">
            Upgrade Your <span className="text-gradient-red">Trading Edge.</span>
          </h2>
          <p className="cta-description">
            Order Flow isn't just a course — it's a proven methodology built by active traders, designed to refine your edge in live market conditions.
          </p>
          <div className="cta-buttons-group">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn btn-get-started"
            >
              Get Started
            </a>
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
    </div>
  );
}

export default App;