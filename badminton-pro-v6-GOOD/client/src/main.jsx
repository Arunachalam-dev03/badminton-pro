import React from 'react'; import { createRoot } from 'react-dom/client'; import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './styles.css'; import { I18nProvider, useI18n } from './i18n';
import Home from './pages/Home.jsx'; import Live from './pages/Live.jsx'; import Leaderboard from './pages/Leaderboard.jsx'; import Register from './pages/Register.jsx';
import AdminLogin from './pages/AdminLogin.jsx'; import Admin from './pages/Admin.jsx'; import Umpire from './pages/Umpire.jsx'; import Scheduler from './pages/Scheduler.jsx'; import Swiss from './pages/Swiss.jsx';

const Nav = ()=>{ const { t, lang, change } = useI18n(); return (
  <header className="card flex items-center justify-between">
    <h1 className="text-xl font-bold">🏸 {t('home_title')}</h1>
    <nav className="space-x-4">
      <Link className="link" to="/live">{t('nav_live')}</Link>
      <Link className="link" to="/leaderboard">{t('nav_leaderboard')}</Link>
      <Link className="link" to="/register">{t('nav_register')}</Link>
      <Link className="link" to="/umpire">Umpire</Link>
      <Link className="link" to="/scheduler">Scheduler</Link>
      <Link className="link" to="/swiss">Swiss</Link>
      <Link className="link" to="/admin/login">{t('nav_admin')}</Link>
      <select className="input !w-auto" value={lang} onChange={e=>change(e.target.value)}><option value="en">EN</option><option value="ta">TA</option></select>
    </nav>
  </header>
)};

const RequireAdmin = ({ children }) => { const t = localStorage.getItem('token'); const r = localStorage.getItem('role'); if(!t || r!=='admin') return <Navigate to="/admin/login" replace/>; return children; };

createRoot(document.getElementById('root')).render(
  <I18nProvider>
    <BrowserRouter>
      <div className="p-6 space-y-4">
        <Nav/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/live" element={<Live/>} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/umpire" element={<Umpire/>} />
          <Route path="/scheduler" element={<Scheduler/>} />
          <Route path="/swiss" element={<Swiss/>} />
          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="/admin" element={<RequireAdmin><Admin/></RequireAdmin>} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  </I18nProvider>
);
