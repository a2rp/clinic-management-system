import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiActivity, FiCalendar, FiChevronDown, FiMenu, FiPlus, FiUsers, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const links = [
  { to: "/overview", label: "Overview", icon: FiActivity },
  { to: "/appointments", label: "Appointments", icon: FiCalendar },
  { to: "/patients", label: "Patients", icon: FiUsers },
  { to: "/care-team", label: "Care team", icon: FiChevronDown },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const previousScroll = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (menuOpen || currentScroll < 24 || currentScroll < previousScroll.current - 4) {
        setHidden(false);
      } else if (currentScroll > previousScroll.current + 5) {
        setHidden(true);
      }
      previousScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  const goToNewAppointment = () => {
    setMenuOpen(false);
    navigate("/appointments?create=1");
  };

  return (
    <header className={[styles.header, hidden && styles.hidden, menuOpen && styles.menuOpen].filter(Boolean).join(" ")}>
      <div className={styles.inner}>
        <NavLink className={styles.brand} to="/overview" aria-label="Luma Clinic overview" onClick={() => setMenuOpen(false)}>
          <span className={styles.brandMark}><FiPlus aria-hidden="true" /></span>
          <span className={styles.brandName}>luma<span>.</span><small>CLINIC</small></span>
        </NavLink>

        <nav className={[styles.navigation, menuOpen && styles.navigationOpen].filter(Boolean).join(" ")} aria-label="Main navigation" id="main-navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => [styles.navLink, isActive && styles.active].filter(Boolean).join(" ")} onClick={() => setMenuOpen(false)}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <span className={styles.clinicStatus}><i aria-hidden="true" /> Open today</span>
          <button className={styles.newAppointment} type="button" onClick={goToNewAppointment}>
            <FiPlus aria-hidden="true" />
            <span>New appointment</span>
          </button>
          <button
            className={styles.menuButton}
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
