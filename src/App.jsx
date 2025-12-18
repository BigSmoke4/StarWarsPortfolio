import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Home, User, Code, Briefcase, Mail, BookOpen,
  MapPin, Globe, Github, Linkedin, ExternalLink, Phone, Instagram, Facebook,
  Cpu, Zap, Activity, Brain, Image, Network, Settings, Layers, HardDrive, FileText, PenTool, Monitor, Database
} from 'lucide-react';
import {
  SiPython, SiReact, SiNodedotjs, SiJavascript,
  SiHtml5, SiCss3, SiFramer
} from 'react-icons/si';
import profileImg from './assets/profile_new.jpg';
import './App.css';

// --- STAR LOADER ---
const StarLoader = ({ onComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let stars = [];
    let animationFrameId;

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = (Math.random() - 0.5) * width;
        this.y = (Math.random() - 0.5) * height;
        this.z = Math.random() * width;
        this.pz = this.z;
      }

      update(speed) {
        this.z -= speed;
        if (this.z < 1) {
          this.reset();
          this.z = width;
          this.pz = this.z;
        }
      }

      draw(globalAlpha) {
        const x = (this.x / this.z) * width + width / 2;
        const y = (this.y / this.z) * height + height / 2;
        const px = (this.x / this.pz) * width + width / 2;
        const py = (this.y / this.pz) * height + height / 2;
        this.pz = this.z;

        if (x < 0 || x > width || y < 0 || y > height) return;

        const size = (1 - this.z / width) * 4;
        const alpha = (1 - this.z / width) * globalAlpha;

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }

    for (let i = 0; i < 400; i++) {
      stars.push(new Star());
    }

    let speed = 2;
    let time = 0;
    let globalAlpha = 1;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time++;

      if (time < 150) {
        speed *= 1.02;
        if (speed > 50) speed = 50;
      }

      if (time > 150) {
        globalAlpha -= 0.05;
      }

      stars.forEach(star => {
        star.update(speed);
        star.draw(Math.max(0, globalAlpha));
      });

      if (globalAlpha > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000000',
        zIndex: 9999,
      }}
    >
      <canvas ref={canvasRef} />
    </motion.div>
  );
};

// --- INTERACTIVE STARS ---
const InteractiveStars = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    let stars = [];
    let trail = [];
    let animationFrameId;

    canvas.width = width;
    canvas.height = height;

    const starCount = 150;
    const connectionDistance = 120;
    let mouse = { x: null, y: null };

    class Star {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2.5 + 0.5;
        this.baseAlpha = Math.random() * 0.6 + 0.3;
        this.color = `rgba(255, 255, 255, ${this.baseAlpha})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class TrailParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
        this.size = Math.random() * 3 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.life * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        star.update();
        star.draw();
      });

      if (mouse.x != null) {
        for (let i = 0; i < 3; i++) {
          trail.push(new TrailParticle(mouse.x, mouse.y));
        }
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.update();
        p.draw();
        if (p.life <= 0) {
          trail.splice(i, 1);
        }
      }

      if (mouse.x != null) {
        stars.forEach(star => {
          let dx = mouse.x - star.x;
          let dy = mouse.y - star.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'transparent',
        pointerEvents: 'none'
      }}
    />
  );
};

// --- NAVBAR ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrolled(window.scrollY > 50);
      const sections = ['hero', 'experience', 'education', 'skills', 'projects', 'references', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      }
    };

    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navLinks = [
    { title: 'Home', href: '#hero', id: 'hero', icon: <Home size={20} /> },
    { title: 'Experience', href: '#experience', id: 'experience', icon: <Briefcase size={20} /> },
    { title: 'Education', href: '#education', id: 'education', icon: <BookOpen size={20} /> },
    { title: 'Skills', href: '#skills', id: 'skills', icon: <Code size={20} /> },
    { title: 'Work', href: '#projects', id: 'projects', icon: <User size={20} /> },
    { title: 'Reference', href: '#references', id: 'references', icon: <User size={20} /> },
    { title: 'Contact', href: '#contact', id: 'contact', icon: <Mail size={20} /> },
  ];

  if (isMobile) {
    return (
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`glass ${scrolled ? 'scrolled' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '1rem 2rem',
          zIndex: 100,
          background: scrolled ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <a href="#hero" style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>
          AMO
        </a>
        <div onClick={() => setIsOpen(!isOpen)} style={{ color: 'white', cursor: 'pointer' }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden'
              }}
            >
              <ul style={{ listStyle: 'none', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                {navLinks.map((link) => (
                  <li key={link.title}>
                    <a href={link.href} onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', color: activeSection === link.id ? 'var(--accent-primary)' : 'white', textDecoration: 'none' }}>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    );
  }

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '240px',
        zIndex: 100,
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '2rem 0',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div style={{ width: '100%', opacity: 1, pointerEvents: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '0 2rem', marginBottom: '3rem' }}>
          <a href="#hero" style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'var(--font-display)', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>
            Ahanaf
          </a>
        </div>
        <ul style={{ listStyle: 'none', width: '100%', flex: 1, padding: '0 1rem' }}>
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.title} style={{ marginBottom: '1.5rem' }}>
                <a
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                    transition: 'all 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.querySelector('svg').style.stroke = 'var(--accent-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.querySelector('svg').style.stroke = 'currentColor';
                    }
                  }}
                >
                  {link.icon}
                  <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{link.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <div style={{ padding: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          © 2026 Ahanaf
        </div>
      </div>
    </motion.div>
  );
};

// --- HERO ---
const Hero = () => {
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      padding: '4rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 1
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridAutoRows: 'minmax(140px, auto)',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass"
          style={{
            gridColumn: 'span 8',
            gridRow: 'span 2',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h3 style={{ fontSize: '2rem', fontWeight: '700', lineHeight: 1.1, marginBottom: '0.5rem', color: '#52525b' }}>
            Hello Stranger
          </h3>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            I'm <span className="gradient-text">Ahanaf Mokammel Omi</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '90%', lineHeight: 1.6 }}>
            <b>Junior Web Developer</b> at Billing Master Software Ltd.<br />
            Passionate about <b>Software Engineering</b>, <b>Frontend</b>, and <b>Database Management</b>.
          </p>
          <div style={{ fontFamily: 'monospace', color: '#52525b', marginTop: '2rem', fontSize: '0.9rem' }}>
            &gt; const current_status = "building_future"; <br />
            &gt; system.init();
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass"
          style={{
            gridColumn: 'span 4',
            gridRow: 'span 3',
            padding: '0',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '400px'
          }}
        >
          <img
            src={profileImg}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%)',
              transition: 'filter 0.5s ease, transform 0.5s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.filter = 'grayscale(0%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'grayscale(100%)';
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass"
          style={{
            gridColumn: 'span 3',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <MapPin size={24} color="#a1a1aa" />
            <Globe size={20} color="#52525b" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>Dhaka, BD</h3>
            <p style={{ fontSize: '0.8rem', color: '#71717a' }}>Central Road, Dhanmondi</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass"
          style={{
            gridColumn: 'span 2',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.05)' }}
        >
          <a href="https://github.com/BigSmoke4" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
            <Github size={40} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass"
          style={{
            gridColumn: 'span 3',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: 'rgba(0,119,181,0.1)'
          }}
          whileHover={{ scale: 1.05, background: 'rgba(0,119,181,0.2)' }}
        >
          <a href="https://www.linkedin.com/in/ahanaf-mokammel-omi-b15764268/" target="_blank" rel="noreferrer" style={{ color: '#0077b5' }}>
            <Linkedin size={40} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// --- EXPERIENCE ---
const experiences = [
  {
    role: "Junior Web Developer",
    company: "Billing Master Software Ltd.",
    period: "2025 – Present",
    description: "Working on front-end development, back-end development, database management and e-commerce solutions."
  },
  {
    role: "Executive Member",
    company: "BRAC University Computer Club",
    period: "2022 – 2025",
    description: "Active member contributing to club activities and event organization."
  },
  {
    role: "General Member",
    company: "Dhaka Residential Model College Computer Club",
    period: "2018 – 2020",
    description: "Participated in computer club activities during college."
  }
];

const Experience = () => {
  return (
    <section id="experience" style={{ padding: '6rem 0' }}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '3rem', fontSize: '2.5rem' }}
        >
          <span className="gradient-text">Experience</span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="glass" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'white', fontWeight: '600' }}>{exp.role}</h3>
                    <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', color: '#a1a1aa' }}>
                      {exp.period}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--accent-secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {exp.company}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- EDUCATION ---
const educationData = [
  { degree: "B.Sc. in Computer Science", school: "BRAC University", year: "Graduated", grade: "CGPA: 3.01" },
  { degree: "College (HSC)", school: "Dhaka Residential Model College", year: "2020", grade: "GPA: 5.00" },
  { degree: "School (SSC)", school: "Ibn Taimiya School and College", year: "2018", grade: "GPA: 5.00" }
];

const Education = () => {
  return (
    <section id="education" style={{ padding: '6rem 0', background: 'var(--bg-card)' }}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '3rem', fontSize: '2.5rem' }}
        >
          <span className="gradient-text">Education</span>
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                borderTop: index === 0 ? '4px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '0.5rem', fontWeight: '600' }}>{edu.degree}</h3>
              <p style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{edu.school}</p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#52525b', border: '1px solid #333', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{edu.year}</span>
                <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700' }}>{edu.grade}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- SKILLS ---
const skillCategories = [
  {
    title: "Languages",
    items: [
      { name: "Python", icon: <SiPython size={20} color="#3776ab" /> },
      { name: "C#", icon: <Code size={20} color="#178600" /> },
      { name: "SQL", icon: <Code size={20} color="#003B57" /> },
      { name: "JavaScript", icon: <SiJavascript size={20} color="#f7df1e" /> }
    ]
  },
  {
    title: "Web Technologies",
    items: [
      { name: "HTML", icon: <SiHtml5 size={20} color="#e34f26" /> },
      { name: "CSS", icon: <SiCss3 size={20} color="#1572b6" /> },
      { name: "ASP.NET MVC", icon: <Code size={20} /> },
      { name: "Razor View", icon: <Code size={20} /> }
    ]
  },
  {
    title: "Tools",
    items: [
      { name: "MS Excel", icon: <FileText size={20} color="#217346" /> },
      { name: "MS PowerPoint", icon: <FileText size={20} color="#b7472a" /> },
      { name: "MS Word", icon: <FileText size={20} color="#2b579a" /> }
    ]
  }
];

const Skills = () => {
  return (
    <section id="skills" style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.02)' }}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '3rem', fontSize: '2.5rem' }}
        >
          Technical <span className="gradient-text">Skills</span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass"
            style={{ gridColumn: '1 / -1', padding: '2rem', marginBottom: '1rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', letterSpacing: '2px', color: '#52525b', textTransform: 'uppercase' }}>Skill Matrix Overview</h4>
              <Code size={20} color="#ffffff" />
            </div>
            <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
              <div>
                <h5 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>Core</h5>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['C++', 'Python', 'MATLAB', 'JavaScript'].map(skill => (
                    <span key={skill} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem', border: '1px solid #333', borderRadius: '20px', color: '#a1a1aa' }}>{skill}</span>
                  ))}
                </div>
              </div>
              <div>
                <h5 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>Tech</h5>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['React', 'ASP.NET', 'SQL', 'Git'].map(skill => (
                    <span key={skill} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem', border: '1px solid #333', borderRadius: '20px', color: '#a1a1aa' }}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '2.5rem', display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ flex: 3, background: '#ffffff' }} />
              <div style={{ flex: 2, background: '#52525b' }} />
              <div style={{ flex: 1, background: '#27272a' }} />
            </div>
          </motion.div>
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass"
              style={{ padding: '2rem' }}
            >
              <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#52525b', textTransform: 'uppercase', letterSpacing: '2px' }}>{category.title}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {category.items.map((skill, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', transition: 'all 0.3s ease'
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>{skill.icon}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{skill.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- PROJECTS ---
const projects = [
  {
    title: "E-Commerce Website",
    description: "Built with ASP.NET MVC and Razor View for dynamic web pages using C#, HTML, CSS, JavaScript. Implemented SQL Server for database management.",
    tags: ["ASP.NET", "C#", "SQL Server", "MVC"],
    link: "https://drive.google.com/drive/folders/1bN-vq5TKs6X75JuiA7vpXT1QZFYAjx3u?usp=drive_link",
    github: "#"
  },
  {
    title: "BMSL Tracker",
    description: "Tracks realtime location of employees at Billing Master Software Ltd. Developed using HTML for front-end interface.",
    tags: ["HTML", "Frontend", "Tracking"],
    link: "#",
    github: "https://github.com/BigSmoke4/BMSL_Tracker"
  },
  {
    title: "AI-Driven E-Waste Optimization",
    description: "Predicted metal composition and value from real-world e-waste using Python. Collected and curated original dataset.",
    tags: ["Python", "AI", "Data Analysis"],
    link: "https://drive.google.com/file/d/1Zis4KEEuaOnL9TP3O6GyNwdIXgSiZRwi/view?usp=sharing",
    github: "https://drive.google.com/drive/folders/1hKnlfJjjKK_FzNgWtO62S2vgxKoyRA_0?usp=drive_link",
    githubLabel: "Dataset"
  },
  {
    title: "2D Car Collision Game",
    description: "Developed using Python with OpenGL and PyOpenGL for 2D graphics rendering. Implemented AABB collision detection, Midpoint algorithms, and game state management with GLUT.",
    tags: ["Python", "OpenGL", "Game Dev"],
    link: "#",
    github: "https://github.com/BigSmoke4/CSE423-Project"
  },
  {
    title: "Online Class Survey",
    description: "Collected data from multiple university students across Bangladesh using Google Forms. Created data visualizations and analysis using Google Sheets.",
    tags: ["Data Analysis", "Google Sheets"],
    link: "https://drive.google.com/file/d/1gqvvTt9zl5qQJX6gCOTfOX7x7qHpkwA7/view?usp=sharing",
    github: "#"
  }
];

const References = () => {
  return (
    <section id="references" style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.02)' }}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '3rem', fontSize: '2.5rem' }}
        >
          <span className="gradient-text">References</span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass"
            style={{ padding: '2rem' }}
          >
            <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5rem' }}>Dr. Mahbubul Alam Majumdar, PhD</h3>
            <p style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Professor and Dean, School of Data and Sciences<br />
              Department of Computer Science and Engineering & Department of Mathematics and Natural Sciences<br />
              BRAC University
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
              Level: 4, Room: 4G33 Kha-224 Merul Badda Dhaka 1212, Bangladesh.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <a href="mailto:majumdar@bracu.ac.bd" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} /> majumdar@bracu.ac.bd
              </a>
              <a href="https://www.scopus.com/" target="_blank" rel="noreferrer" style={{ color: '#0077b5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ExternalLink size={16} /> Scopus
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass"
            style={{ padding: '2rem' }}
          >
            <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.5rem' }}>Dr. Jannatun Noor Mukta</h3>
            <p style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Associate Professor, Dept. of CSE & Director, Data Science Program<br />
              United International University
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
              ROOM: 412 B, PABX: 3102
            </p>
            <a href="mailto:jannatun@cse.uiu.ac.bd" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> jannatun@cse.uiu.ac.bd
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  return (
    <section id="projects" style={{ padding: '6rem 0' }}>
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '3rem', fontSize: '2.5rem' }}
        >
          Featured <span className="gradient-text">Work</span>
        </motion.h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass"
              style={{ padding: '2rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>{project.title}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>{project.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'rgba(255, 255, 255, 0.05)', color: '#a1a1aa', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {project.github !== "#" && (
                  <a href={project.github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', opacity: 0.8, transition: 'opacity 0.2s' }}>
                    {project.githubLabel === "Dataset" ? <Database size={20} /> : <Github size={20} />} {project.githubLabel || "Code"}
                  </a>
                )}
                {project.link !== "#" && (
                  <a href={project.link} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: '500' }}>
                    <ExternalLink size={20} /> Link
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- CONTACT ---
const Contact = () => {
  return (
    <section id="contact" style={{ padding: '6rem 0 4rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass"
            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Get In Touch</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
            <a href="mailto:ahanafmo@gmail.com" style={{ alignSelf: 'flex-start', padding: '1rem 2rem', background: 'var(--accent-primary)', color: 'var(--bg-dark)', borderRadius: '50px', fontSize: '1rem', fontWeight: '600', textDecoration: 'none', transition: 'transform 0.2s' }}>
              Hello there! &rarr;
            </a>
          </motion.div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass"
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}>
                <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}><Mail size={20} color="white" /></div>
                <span style={{ fontSize: '1.1rem' }}>ahanafmo@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}>
                <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}><Phone size={20} color="white" /></div>
                <span style={{ fontSize: '1.1rem' }}>+8801711581367</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}>
                <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}><MapPin size={20} color="white" /></div>
                <span style={{ fontSize: '1.1rem' }}>Dhanmondi, Dhaka-1209</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass"
              style={{ padding: '2rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
            >
              <a href="https://www.linkedin.com/in/ahanaf-mokammel-omi-b15764268/" target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', transform: 'scale(1.2)' }}>
                <Linkedin size={24} />
              </a>
              <a href="https://www.facebook.com/bigXsmoke/" target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2', transform: 'scale(1.2)' }}>
                <Facebook size={24} />
              </a>
              <a href="https://www.instagram.com/bigsmoke________/" target="_blank" rel="noopener noreferrer" style={{ color: '#E1306C', transform: 'scale(1.2)' }}>
                <Instagram size={24} />
              </a>
            </motion.div>
          </div>
        </div>
        <footer style={{ marginTop: '5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
          © 2025 Ahanaf Mokammel Omi. All rights reserved.
        </footer>
      </div>
    </section>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="app-container">
      <AnimatePresence>
        {loading && <StarLoader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <InteractiveStars />
          <Navbar />
          <main style={{ paddingLeft: '240px', minHeight: '100vh', paddingTop: '0' }}>
            <Hero />
            <Experience />
            <Education />
            <Skills />
            <Projects />
            <References />
            <Contact />
          </main>
        </>
      )}
    </div>
  );
}

export default App;
