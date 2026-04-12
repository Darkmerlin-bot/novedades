
const { useState, useEffect, useMemo, useCallback, useRef } = React;
const { createClient } = supabase;

// ==================== INYECCIÓN DE ESTILOS Y FUENTE ====================
(() => {
  // Fuente Inter
  if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Inter"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    document.head.appendChild(link);
  }
  // Estilos custom
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bg-primary: #f1f5f9;
      --bg-card: #ffffff;
      --bg-card-hover: #ffffff;
      --bg-header: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
      --bg-modal-overlay: rgba(15, 23, 42, 0.6);
      --bg-glass: rgba(255, 255, 255, 0.85);
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --border-color: #e2e8f0;
      --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      --shadow-card-hover: 0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.06);
      --shadow-modal: 0 25px 60px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1);
    }
    [data-theme="dark"] {
      --bg-primary: #0f172a;
      --bg-card: #1e293b;
      --bg-card-hover: #334155;
      --bg-header: linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #020617 100%);
      --bg-modal-overlay: rgba(0, 0, 0, 0.7);
      --bg-glass: rgba(30, 41, 59, 0.85);
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --border-color: #334155;
      --shadow-card: 0 1px 3px rgba(0,0,0,0.2);
      --shadow-card-hover: 0 20px 40px rgba(0,0,0,0.3);
      --shadow-modal: 0 25px 60px rgba(0,0,0,0.4);
    }
    * { font-family: 'Inter', system-ui, -apple-system, sans-serif !important; }
    body { background: var(--bg-primary); transition: background 0.3s ease; }
    
    /* Glassmorphism */
    .glass { background: var(--bg-glass); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); }
    .glass-strong { background: rgba(255,255,255,0.92); backdrop-filter: blur(40px) saturate(200%); -webkit-backdrop-filter: blur(40px) saturate(200%); }
    [data-theme="dark"] .glass { background: rgba(30,41,59,0.85); }
    [data-theme="dark"] .glass-strong { background: rgba(30,41,59,0.92); }
    
    /* Animaciones mejoradas */
    @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes expandDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 2000px; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
    @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); } 50% { box-shadow: 0 0 20px 4px rgba(16,185,129,0.15); } }
    @keyframes tabSlide { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-slideInRight { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
    .animate-expandDown { animation: expandDown 0.35s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-pulseGlow { animation: pulseGlow 2s ease-in-out infinite; }
    
    /* Skeleton loader */
    .skeleton { background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 12px; }
    [data-theme="dark"] .skeleton { background: linear-gradient(90deg, #334155 25%, #475569 50%, #334155 75%); background-size: 200% 100%; }
    
    /* Card hover lift */
    .card-lift { transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
    .card-lift:hover { transform: translateY(-2px); box-shadow: var(--shadow-card-hover); }
    
    /* Nav tab active indicator */
    .nav-tab-active { position: relative; }
    .nav-tab-active::after { content: ''; position: absolute; bottom: -2px; left: 20%; right: 20%; height: 2px; background: #10b981; border-radius: 2px; animation: tabSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: center; }
    
    /* Floating label */
    .float-label-group { position: relative; }
    .float-label-group input:focus + label,
    .float-label-group input:not(:placeholder-shown) + label {
      transform: translateY(-28px) scale(0.75);
      color: #10b981;
      background: var(--bg-card);
      padding: 0 6px;
    }
    .float-label-group label {
      position: absolute; left: 16px; top: 16px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none; transform-origin: left;
      font-weight: 700; font-size: 13px; color: #94a3b8;
    }
    
    /* Dark mode overrides */
    [data-theme="dark"] .bg-white { background: var(--bg-card) !important; }
    [data-theme="dark"] .bg-slate-50, [data-theme="dark"] .bg-slate-100 { background: #1e293b !important; }
    [data-theme="dark"] .bg-slate-300 { background: var(--bg-primary) !important; }
    [data-theme="dark"] .text-slate-800, [data-theme="dark"] .text-slate-700 { color: #f1f5f9 !important; }
    [data-theme="dark"] .text-slate-600, [data-theme="dark"] .text-slate-500 { color: #94a3b8 !important; }
    [data-theme="dark"] .border-slate-200, [data-theme="dark"] .border-slate-100 { border-color: #334155 !important; }
    [data-theme="dark"] .shadow-md, [data-theme="dark"] .shadow-sm { box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important; }
    [data-theme="dark"] input, [data-theme="dark"] select, [data-theme="dark"] textarea { background: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important; }
    
    /* Header selects - force dark dropdown */
    header select option { background: #1e293b; color: #f1f5f9; }
    
    /* Mobile optimizations */
    @media (max-width: 640px) {
      .card-lift:hover { transform: none; } /* Disable hover lift on touch devices */
      .float-label-group label { font-size: 12px; }
      .float-label-group input:focus + label,
      .float-label-group input:not(:placeholder-shown) + label { transform: translateY(-26px) scale(0.72); }
    }
    
    /* Print */
    @media print { .print\\:hidden { display: none !important; } body { background: white !important; } [data-theme] { --bg-primary: white; } }
  `;
  document.head.appendChild(style);
})();

// ==================== SISTEMA DE ÍCONOS SVG ====================
const Icon = ({ name, size = 18, className = '' }) => {
  const icons = {
    folder: <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>,
    check: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></>,
    scale: <path d="M12 3v17.25m0-17.25c-1.33 0-6.47 1.48-8.5 3.25L12 3zm0 0c1.33 0 6.47 1.48 8.5 3.25L12 3zM4.75 15.5l2-4.5h2.5l2-4.5M14.75 6.5l2 4.5h2.5l2 4.5"/>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    package: <><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    log: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    printer: <><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>,
    save: <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></>,
    key: <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></>,
    logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    chevronDown: <polyline points="6,9 12,15 18,9"/>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    camera: <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></>,
    car: <><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a1 1 0 00-.9.55l-2.2 4.4A1 1 0 002 12.3V16h3"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></>,
    party: <><path d="M5.8 11.3L2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24.75a1 1 0 00-.64.64L18.38 5.6a1 1 0 01-.64.64L15.5 7l2.24-.75a1 1 0 01.64.64l.75 2.24"/></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name] || null}
    </svg>
  );
};

// Skeleton Loader Component
const Skeleton = ({ rows = 4, className = '' }) => (
  <div className={`space-y-4 animate-fadeIn ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton h-20 w-full" style={{ animationDelay: `${i * 0.1}s` }}></div>
    ))}
  </div>
);

// Empty State Component
const EmptyState = ({ icon = 'folder', title, subtitle, isSearch = false }) => (
  <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 animate-fadeIn">
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-5 animate-float">
      <Icon name={isSearch ? 'search' : icon} size={32} className="text-slate-400" />
    </div>
    <p className="text-slate-500 font-bold text-lg">{title}</p>
    {subtitle && <p className="text-slate-400 text-sm mt-2">{subtitle}</p>}
  </div>
);

// CONFIGURACIÓN
// ⚠️ SEGURIDAD: No subir este archivo a repositorios públicos (GitHub, etc.)
// Si se rota la key en Supabase, actualizarla aquí y en el servidor.
// La anon key es pública por diseño pero no debe exponerse en repos.
const SUPABASE_URL = 'https://whfrenunfcrcrljithex.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_FEJnmZ7CIE_haY1gz4PRxQ_Omz7dpX3';
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función de escape HTML para prevenir XSS en impresiones
const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Función para exportar datos como CSV
const exportCSV = (filename, headers, rows) => {
  const escapeCsv = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const csv = [headers.map(escapeCsv).join(','), ...rows.map(row => row.map(escapeCsv).join(','))].join('\n');
  // BOM para que Excel detecte UTF-8
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const currentYear = new Date().getFullYear();
const availableYears = [];
for (let y = currentYear + 1; y >= 2020; y--) availableYears.push(y);

// NOTIFICACIÓN
const Notification = ({ message, type }) => (
  <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-6 z-[200] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideInRight glass-strong border ${type === 'success' ? 'border-emerald-200 text-slate-800' : 'border-red-300 bg-red-500/90 text-white'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-emerald-100' : 'bg-white/20'}`}>
      <Icon name={type === 'success' ? 'check' : 'alert'} size={16} className={type === 'success' ? 'text-emerald-600' : 'text-white'} />
    </div>
    <span className="font-semibold text-sm">{message}</span>
  </div>
);

// LOGO - Escudo Policía Científica
const LOGO_URL = 'https://raw.githubusercontent.com/Darkmerlin-bot/novedades/main/Logo%20para%20programa.png';
const LOGO_URL_LARGE = 'https://raw.githubusercontent.com/Darkmerlin-bot/novedades/main/Escudo%203d%20sin%20fondo.png';

// HEADER
const Header = ({ userProfile, currentView, setView, onLogout, onShowStats, onShowPass, onShowReport, onBackup, pendingCount, completedCount, juiciosCount, recordatoriosCount, stockBajoCount, turnoActivo, setTurnoActivo, TURNOS, darkMode, toggleDarkMode }) => (
  <header className="text-white shadow-lg sticky top-0 z-50 print:hidden" style={{ background: 'var(--bg-header)' }}>
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {LOGO_URL ? (
            <img 
              src={LOGO_URL} 
              alt="Escudo" 
              className="w-12 h-12 rounded-xl shadow-lg object-contain bg-white/90 p-1 ring-2 ring-white/20"
            />
          ) : (
            <div className="bg-emerald-500 p-2.5 rounded-xl text-xl shadow-lg shadow-emerald-500/30">🔬</div>
          )}
          <div>
            <h1 className="text-base sm:text-xl font-extrabold tracking-tight">Policía Científica</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Sistema de Gestión</p>
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Selector de turno para admin/supervisor */}
          {userProfile?.permisos?.ver_todos_turnos && (
            <select 
              value={turnoActivo} 
              onChange={(e) => setTurnoActivo(parseInt(e.target.value))}
              className="px-3 py-2 bg-white/10 text-white rounded-xl font-bold text-xs cursor-pointer border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all"
              style={{ colorScheme: 'dark' }}
            >
              <option value="0" className="bg-slate-800 text-white">Todos los turnos</option>
              <option value="1" className="bg-slate-800 text-white">T1 - 1er Turno</option>
              <option value="2" className="bg-slate-800 text-white">T2 - 2do Turno</option>
              <option value="3" className="bg-slate-800 text-white">T3 - 3er Turno</option>
              <option value="4" className="bg-slate-800 text-white">ZO - Zona Oeste</option>
            </select>
          )}
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-emerald-400 truncate max-w-[100px] sm:max-w-none">{userProfile?.nombre}</span>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase border ${userProfile?.role === 'admin' ? 'border-red-400/30 bg-red-500/10 text-red-400' : 'border-slate-400/30 bg-slate-500/10 text-slate-400'}`}>
                {userProfile?.role === 'admin' ? 'Admin' : 'Usuario'}
              </span>
              {!userProfile?.permisos?.ver_todos_turnos && (
                <span className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase border border-indigo-400/30 bg-indigo-500/10 text-indigo-400">{userProfile?.turno === 4 ? 'ZO' : `T${userProfile?.turno || 1}`}</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={toggleDarkMode} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10" title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}>
              <Icon name={darkMode ? 'sun' : 'moon'} size={16} />
            </button>
            <button onClick={onShowPass} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10" title="Cambiar Contraseña">
              <Icon name="key" size={16} />
            </button>
            {userProfile?.permisos?.ver_estadisticas && (
              <>
                <button onClick={onShowStats} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10" title="Estadísticas">
                  <Icon name="chart" size={16} />
                </button>
                <button onClick={onShowReport} className="p-2.5 bg-indigo-500/40 hover:bg-indigo-500/60 rounded-xl transition-all border border-indigo-400/30" title="Imprimir Reporte">
                  <Icon name="printer" size={16} />
                </button>
              </>
            )}
            {userProfile?.permisos?.ver_todos_turnos && (
              <button onClick={onBackup} className="p-2.5 bg-emerald-500/30 hover:bg-emerald-500/50 rounded-xl transition-all border border-emerald-400/30" title="Descargar Respaldo">
                <Icon name="save" size={16} />
              </button>
            )}
            <button onClick={onLogout} className="px-4 py-2.5 bg-red-500/80 hover:bg-red-500 text-white rounded-xl transition-all font-bold text-sm flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <Icon name="logout" size={15} /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
      <nav className="flex gap-1.5 pb-1 border-t border-white/10 pt-3 overflow-x-auto no-scrollbar">
        {[
          { key: 'list', icon: 'folder', label: 'Pend.', count: pendingCount, countColor: 'bg-red-500' },
          { key: 'completed', icon: 'check', label: 'Compl.', count: completedCount, countColor: 'bg-emerald-500' },
          { key: 'juicios', icon: 'scale', label: 'Juicios', count: juiciosCount, countColor: 'bg-amber-500' },
          { key: 'recordatorios', icon: 'bell', label: 'Recor.', count: recordatoriosCount, countColor: 'bg-purple-500' },
          { key: 'calendario', icon: 'calendar', label: 'Licencias' },
          { key: 'stock', icon: 'package', label: 'Stock', count: stockBajoCount, countColor: 'bg-red-500', pulse: true },
        ].map(tab => (
          <button key={tab.key} onClick={() => setView(tab.key)} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${currentView === tab.key ? 'bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/20 nav-tab-active' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Icon name={tab.icon} size={14} /> {tab.label} {tab.count > 0 && <span className={`${tab.countColor} text-white text-[9px] px-1.5 py-0.5 rounded-full font-black ${tab.pulse ? 'animate-pulse' : ''}`}>{tab.count}</span>}
          </button>
        ))}
        {userProfile?.permisos?.crear_novedades && (
          <button onClick={() => setView('form')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${currentView === 'form' ? 'bg-emerald-500/90 text-white shadow-lg nav-tab-active' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Icon name="plus" size={14} /> Nueva
          </button>
        )}
        {userProfile?.permisos?.ver_estadisticas && (
          <button onClick={() => setView('auditoria')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${currentView === 'auditoria' ? 'bg-emerald-500/90 text-white shadow-lg nav-tab-active' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Icon name="search" size={14} /> Auditar
          </button>
        )}
        {(userProfile?.permisos?.gestionar_personal || userProfile?.role === 'admin') && (
          <button onClick={() => setView('users')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${currentView === 'users' ? 'bg-emerald-500/90 text-white shadow-lg nav-tab-active' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Icon name="users" size={14} /> Personal
          </button>
        )}
        {(userProfile?.permisos?.ver_logs || userProfile?.role === 'admin') && (
          <button onClick={() => setView('logs')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${currentView === 'logs' ? 'bg-emerald-500/90 text-white shadow-lg nav-tab-active' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Icon name="log" size={14} /> Logs
          </button>
        )}
      </nav>
    </div>
  </header>
);

// MODAL PENDIENTES Y JUICIOS
const PendingModal = ({ count, juiciosProximos, recordatoriosProximos, onClose, userName }) => (
  <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" style={{ background: 'var(--bg-modal-overlay)', backdropFilter: 'blur(12px)' }}>
    <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'var(--shadow-modal)' }}>
      <div className="p-5 sm:p-8 bg-red-500 text-white text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="font-black uppercase tracking-widest text-lg">Atención</h3>
      </div>
      <div className="p-5 sm:p-8">
        {count > 0 && (
          <div className="text-center mb-6">
            <p className="text-slate-600 font-bold text-lg mb-2">Tienes tareas pendientes</p>
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <span className="text-5xl font-black text-red-500">{count}</span>
              <p className="text-red-400 font-bold text-sm mt-2 uppercase">{count === 1 ? 'Novedad asignada' : 'Novedades asignadas'}</p>
            </div>
          </div>
        )}
        
        {juiciosProximos && juiciosProximos.length > 0 && (
          <div className="mt-4">
            <p className="text-slate-600 font-bold text-lg mb-3 text-center">⚖️ Juicios próximos (5 días)</p>
            <div className="space-y-3">
              {juiciosProximos.map(j => {
                // Corregir fecha para evitar problemas de zona horaria
                const fechaStr = j.fecha_juicio?.split('T')[0];
                const [year, month, day] = fechaStr ? fechaStr.split('-').map(Number) : [0,0,0];
                const fecha = new Date(year, month - 1, day);
                const hoy = new Date();
                hoy.setHours(0,0,0,0);
                fecha.setHours(0,0,0,0);
                const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
                const citados = j.citados || [];
                const estaUsuarioCitado = citados.includes(userName);
                const titulo = j.numero_novedad ? `Nov. ${j.numero_novedad}` : j.iue ? `IUE: ${j.iue}` : 'Juicio';
                
                return (
                  <div key={j.id} className={`border-2 rounded-xl p-4 ${estaUsuarioCitado ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-800">{titulo}</p>
                          {estaUsuarioCitado && <span className="text-[9px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black">CITADO</span>}
                        </div>
                        {j.numero_sgsp && <p className="text-xs text-slate-500">SGSP: {j.numero_sgsp}</p>}
                        {j.iue && j.numero_novedad && <p className="text-xs text-purple-600 font-bold">IUE: {j.iue}</p>}
                        {j.descripcion && <p className="text-xs text-slate-600 mt-1">{j.descripcion}</p>}
                        {citados.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {citados.map((c, i) => (
                              <span key={i} className={`text-[10px] px-2 py-0.5 rounded font-bold ${c === userName ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>{c}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-amber-700">{fecha.toLocaleDateString()}</p>
                        <p className={`text-xs font-black ${diasRestantes === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                          {diasRestantes === 0 ? '¡HOY!' : diasRestantes === 1 ? 'Mañana' : `En ${diasRestantes} días`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {recordatoriosProximos && recordatoriosProximos.length > 0 && (
          <div className="mt-4">
            <p className="text-slate-600 font-bold text-lg mb-3 text-center">🔔 Recordatorios próximos</p>
            <div className="space-y-3">
              {recordatoriosProximos.map(r => {
                const fecha = new Date(r.fecha_hora);
                const ahora = new Date();
                const diffMs = fecha - ahora;
                const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                let tiempoTexto = '';
                if (diffMs < 0) tiempoTexto = '¡VENCIDO!';
                else if (diffHoras < 1) tiempoTexto = 'En menos de 1 hora';
                else if (diffHoras < 24) tiempoTexto = `En ${diffHoras} horas`;
                else if (diffDias === 1) tiempoTexto = 'Mañana';
                else tiempoTexto = `En ${diffDias} días`;
                
                return (
                  <div key={r.id} className={`border-2 rounded-xl p-4 ${diffMs < 0 ? 'bg-red-50 border-red-300' : 'bg-purple-50 border-purple-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-slate-800">{r.titulo}</p>
                        {r.descripcion && <p className="text-xs text-slate-600 mt-1">{r.descripcion}</p>}
                        <p className="text-[10px] text-slate-400 mt-1">Por: {r.creado_por_nombre}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-purple-700">{fecha.toLocaleDateString()}</p>
                        <p className="text-xs text-purple-600">{fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        <p className={`text-xs font-black mt-1 ${diffMs < 0 ? 'text-red-600' : 'text-purple-600'}`}>{tiempoTexto}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <button onClick={onClose} className="w-full mt-6 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs shadow-xl">Entendido</button>
      </div>
    </div>
  </div>
);

// BÚSQUEDA
const SearchAndFilter = ({ searchTerm, onSearchChange, selectedYear, onYearChange }) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-6">
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><Icon name="search" size={16} className="text-slate-400" /></div>
      <input type="text" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar por N° Novedad, SGSP o Título..." className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold text-slate-700 placeholder-slate-400" style={{ boxShadow: 'var(--shadow-card)' }} />
      {searchTerm && <button onClick={() => onSearchChange('')} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"><Icon name="x" size={16} /></button>}
    </div>
    <select value={selectedYear} onChange={(e) => onYearChange(e.target.value)} className="appearance-none w-full sm:w-40 px-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold text-slate-700 cursor-pointer" style={{ boxShadow: 'var(--shadow-card)' }}>
      <option value="">Todos los años</option>
      {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
    </select>
  </div>
);

// APP PRINCIPAL
const App = () => {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [novedades, setNovedades] = useState([]); // Solo pendientes (completado=false)
  const [completedNov, setCompletedNov] = useState([]); // Completadas cargadas por página
  const [completedTotal, setCompletedTotal] = useState(0);
  const [completedLoading, setCompletedLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentView, setCurrentView] = useState(() => {
    try { return localStorage.getItem('filter_view') || 'list'; } catch { return 'list'; }
  });
  const [editingNovedad, setEditingNovedad] = useState(null);
  const [isComision, setIsComision] = useState(false);
  const [isEventoSocial, setIsEventoSocial] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showStats, setShowStats] = useState(false);
  
  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
  });
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
      return next;
    });
  };
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, []);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showUbicacionesModal, setShowUbicacionesModal] = useState(false);
  const [editingUbicacion, setEditingUbicacion] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [modalShownOnce, setModalShownOnce] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);
  const [selectedUserTurno, setSelectedUserTurno] = useState(0);
  const [userSearch, setUserSearch] = useState('');
  const [turnoActivo, setTurnoActivo] = useState(() => {
    try { return parseInt(localStorage.getItem('filter_turno') || '0', 10); } catch { return 0; }
  });
  const [selectedUserStats, setSelectedUserStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [completedPage, setCompletedPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(() => {
    try { return localStorage.getItem('filter_year') || String(currentYear); } catch { return String(currentYear); }
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Rate limit de login — servidor controla, cliente solo muestra countdown
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const loginLocked = lockoutSeconds > 0;
  
  // Tick cada segundo mientras está bloqueado (solo visual)
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds > 0]);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editPermisos, setEditPermisos] = useState({});
  const [editLoginVal, setEditLoginVal] = useState('');
  const [editPassVal, setEditPassVal] = useState('');
  
  // Estados para Juicios
  const [juicios, setJuicios] = useState([]);
  const [editingJuicio, setEditingJuicio] = useState(null);
  const [upcomingJuicios, setUpcomingJuicios] = useState([]);
  const [selectedCitados, setSelectedCitados] = useState([]);
  
  // Estados para Recordatorios
  const [recordatorios, setRecordatorios] = useState([]);
  const [editingRecordatorio, setEditingRecordatorio] = useState(null);
  const [upcomingRecordatorios, setUpcomingRecordatorios] = useState([]);
  
  // Estados para Licencias/Calendario
  const [licencias, setLicencias] = useState([]);
  const [calendarioYear, setCalendarioYear] = useState(new Date().getFullYear());
  const [licPrintUser, setLicPrintUser] = useState('');
  const [licDetailUser, setLicDetailUser] = useState(null); // nombre del usuario cuyo detalle se muestra
  const [calendarioMonth, setCalendarioMonth] = useState(new Date().getMonth());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  // Form controlado de licencias (en vez de document.getElementById)
  const [licForm, setLicForm] = useState({ usuario: '', fechaDesde: '', fechaHasta: '', tipo: 'licencia', descripcion: '' });
  
  // Estados para Stock
  const [stockItems, setStockItems] = useState([]);
  const [stockUbicaciones, setStockUbicaciones] = useState([]);
  const [stockMovimientos, setStockMovimientos] = useState([]);
  const [selectedUbicacion, setSelectedUbicacion] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [itemNombreInput, setItemNombreInput] = useState('');
  const [itemSugerencias, setItemSugerencias] = useState([]);
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [transferItem, setTransferItem] = useState(null); // { item, cantidad, destino }
  const [stockSearch, setStockSearch] = useState('');
  const [stockSearchScope, setStockSearchScope] = useState('actual');
  const [stockTurnoFilter, setStockTurnoFilter] = useState(0); // 0=todos, 1-4=turno específico (solo admin/supervisor)
  // Form controlado de stock item (en vez de document.getElementById)
  const [itemForm, setItemForm] = useState({ tipo: 'consumible', cantidad: 0, minimo: 5, replicar: false });
  
  // Estados para Auditoría
  const [selectedAuditUser, setSelectedAuditUser] = useState(null);
  const [auditTurnoFilter, setAuditTurnoFilter] = useState(0);
  const [statsYear, setStatsYear] = useState('todos');
  const [statsTurnoFilter, setStatsTurnoFilter] = useState(() => {
    // Encargado: forzar a su turno por defecto
    // Admin/Supervisor: todos
    return 0; // se ajusta después en el modal según rol
  });
  
  // Estados para feedback y bloqueo optimista
  const [saving, setSaving] = useState(false);
  const [originalUpdatedAt, setOriginalUpdatedAt] = useState(null);
  
  // Estados para impresión
  const [printType, setPrintType] = useState('todo');
  const [printYear, setPrintYear] = useState('todos');
  const [printDateFrom, setPrintDateFrom] = useState('');
  const [printDateTo, setPrintDateTo] = useState('');
  const [printReady, setPrintReady] = useState(false);
  const [printUser, setPrintUser] = useState('todos');
  const [showPrintLicMenu, setShowPrintLicMenu] = useState(false);
  const [showPrintStockMenu, setShowPrintStockMenu] = useState(false);
  
  // Estados para filtros de auditoría
  const [logsFilterUser, setLogsFilterUser] = useState('todos');
  const [logsFilterAction, setLogsFilterAction] = useState('todos');
  const [auditView, setAuditView] = useState('logs'); // 'logs' o 'tareas'

  const showNotify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Ocultar pantalla de carga inicial
  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) loadingScreen.style.display = 'none';
  }, []);

  // Sincronizar form de licencias cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedCalendarDate && selectedCalendarDate !== 'nueva') {
      setLicForm(prev => ({ ...prev, fechaDesde: selectedCalendarDate, fechaHasta: selectedCalendarDate }));
    } else {
      setLicForm(prev => ({ ...prev, fechaDesde: '', fechaHasta: '' }));
    }
  }, [selectedCalendarDate]);
  
  // Sincronizar form de stock item cuando cambia el item en edición
  useEffect(() => {
    if (editingItem) {
      setItemForm({ tipo: editingItem.tipo || 'consumible', cantidad: editingItem.cantidad || 0, minimo: editingItem.cantidad_minima || 5, replicar: false });
    }
  }, [editingItem]);

  // Persistir filtros en localStorage
  useEffect(() => { try { localStorage.setItem('filter_view', currentView); } catch {} }, [currentView]);
  useEffect(() => { try { localStorage.setItem('filter_turno', String(turnoActivo)); } catch {} }, [turnoActivo]);
  useEffect(() => { try { localStorage.setItem('filter_year', selectedYear); } catch {} }, [selectedYear]);

  // TIMEOUT DE SESIÓN POR INACTIVIDAD (30 minutos)
  // Usa timestamp de última actividad + setInterval (no se "duerme" con la pestaña en background)
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const WARNING_BEFORE = 2 * 60 * 1000;
  const lastActivityRef = React.useRef(Date.now());
  const intervalRef = React.useRef(null);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  
  const resetSessionTimeout = () => {
    lastActivityRef.current = Date.now();
    setShowTimeoutWarning(false);
  };
  
  useEffect(() => {
    if (!session) return;
    
    // Registrar actividad con debounce de 30s
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    let lastDebounce = 0;
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastDebounce > 30000) {
        lastDebounce = now;
        resetSessionTimeout();
      }
    };
    
    events.forEach(event => window.addEventListener(event, handleActivity));
    lastActivityRef.current = Date.now();
    
    // Chequear cada 30 segundos si expiró (funciona incluso con pestaña en background)
    intervalRef.current = setInterval(async () => {
      const elapsed = Date.now() - lastActivityRef.current;
      
      if (elapsed >= SESSION_TIMEOUT) {
        // Expiró: cerrar sesión
        clearInterval(intervalRef.current);
        await sb.auth.signOut({ scope: 'local' });
        localStorage.removeItem('sb-whfrenunfcrcrljithex-auth-token');
        setShowTimeoutWarning(false);
        setLoginUsername('');
        setLoginPassword('');
        setSession(null);
        setUserProfile(null);
        showNotify("Sesión cerrada por inactividad", "error");
      } else if (elapsed >= SESSION_TIMEOUT - WARNING_BEFORE) {
        // Faltan menos de 2 minutos: mostrar advertencia
        setShowTimeoutWarning(true);
      }
    }, 30000);
    
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session]);

  // AUTENTICACIÓN
  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadUserProfile(session.user.id);
      setAuthLoading(false);
    }).catch(err => {
      console.error('Error de sesión:', err);
      setAuthLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadUserProfile(session.user.id);
      else {
        setUserProfile(null);
        // Limpiar campos de login y localStorage cuando la sesión expira
        setLoginUsername('');
        setLoginPassword('');
        localStorage.removeItem('sb-whfrenunfcrcrljithex-auth-token');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    const { data } = await sb.from('profiles').select('*').eq('id', userId).single();
    if (data) setUserProfile(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Si el countdown visual sigue activo, bloquear sin consultar servidor
    if (loginLocked) {
      const timeMsg = lockoutSeconds >= 60 ? `${Math.ceil(lockoutSeconds / 60)} min` : `${lockoutSeconds}s`;
      showNotify(`Demasiados intentos. Esperá ${timeMsg}`, "error");
      return;
    }
    
    setLoginLoading(true);
    const email = loginUsername.toLowerCase().trim() + '@local.com';
    
    // 1. Consultar rate limit en el SERVIDOR antes de intentar login
    try {
      const { data: rateCheck, error: rateErr } = await sb.rpc('check_login_rate_limit', { p_email: email });
      if (!rateErr && rateCheck && !rateCheck.allowed) {
        setLockoutSeconds(rateCheck.wait_seconds);
        const timeMsg = rateCheck.wait_seconds >= 60 ? `${Math.ceil(rateCheck.wait_seconds / 60)} min` : `${rateCheck.wait_seconds}s`;
        showNotify(`Demasiados intentos. Esperá ${timeMsg}`, "error");
        setLoginLoading(false);
        return;
      }
    } catch (err) {
      // Si falla el rate check, continuar con el login (no bloquear por error del check)
    }
    
    // 2. Intentar login
    const { data, error } = await sb.auth.signInWithPassword({ email, password: loginPassword });
    
    if (error) {
      // 3. Registrar intento fallido en el SERVIDOR
      try { await sb.rpc('record_login_attempt', { p_email: email, p_success: false }); } catch (e) {}
      await sb.from('logs').insert([{ action: 'LOGIN_FALLIDO', details: 'Usuario: ' + loginUsername + ' | Intento fallido' }]);
      
      // 4. Re-consultar rate limit para mostrar bloqueo si aplica
      try {
        const { data: newCheck } = await sb.rpc('check_login_rate_limit', { p_email: email });
        if (newCheck && !newCheck.allowed && newCheck.wait_seconds > 0) {
          setLockoutSeconds(newCheck.wait_seconds);
        }
      } catch (err) {}
      
      showNotify("Usuario o contraseña incorrectos", "error");
    } else {
      // 5. Registrar login exitoso en el SERVIDOR (resetea el conteo de fallos)
      try { await sb.rpc('record_login_attempt', { p_email: email, p_success: true }); } catch (e) {}
      setLockoutSeconds(0);
      // Registrar en logs
      const { data: profileData } = await sb.from('profiles').select('*').eq('id', data.user.id).single();
      if (profileData) {
        await sb.from('logs').insert([{ 
          user_id: data.user.id, 
          user_email: email, 
          user_nombre: profileData.nombre, 
          action: 'LOGIN', 
          details: 'Inicio de sesión exitoso' 
        }]);
      }
      showNotify("Bienvenido!");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await addLog('LOGOUT', 'Cierre de sesión');
    await sb.auth.signOut({ scope: 'local' });
    // Limpiar cualquier token residual
    localStorage.removeItem('sb-whfrenunfcrcrljithex-auth-token');
    // Limpiar campos de login por seguridad
    setLoginUsername('');
    setLoginPassword('');
    setSession(null);
    setUserProfile(null);
  };

  // DATOS
  const addLog = async (action, details) => {
    if (!session || !userProfile) return;
    await sb.from('logs').insert([{ user_id: session.user.id, user_email: session.user.email, user_nombre: userProfile.nombre, action, details }]);
  };

  const loadData = async () => {
    if (!session) return;
    // Solo mostrar skeleton en la carga inicial, no al refrescar con datos existentes
    if (novedades.length === 0) setDataLoading(true);
    
    let loadErrors = [];
    
    const { data: novData, error: novErr } = await sb.from('novedades').select('*').eq('completado', false).order('created_at', { ascending: false });
    if (novErr) loadErrors.push('novedades'); 
    setNovedades(novData || []);
    
    // Solo el conteo de completadas (la data se carga on-demand)
    const { count: compCount } = await sb.from('novedades').select('id', { count: 'exact', head: true }).eq('completado', true);
    setCompletedTotal(compCount || 0);
    
    const { data: profilesData, error: profErr } = await sb.from('profiles').select('*').order('nombre');
    if (profErr) loadErrors.push('profiles');
    setProfiles(profilesData || []);
    
    // Cargar juicios
    const { data: juiciosData, error: juicErr } = await sb.from('juicios').select('*').order('fecha_juicio', { ascending: true });
    if (juicErr) loadErrors.push('juicios');
    setJuicios(juiciosData || []);
    
    // Cargar recordatorios
    const { data: recordatoriosData, error: recErr } = await sb.from('recordatorios').select('*').eq('completado', false).order('fecha_hora', { ascending: true });
    if (recErr) loadErrors.push('recordatorios');
    setRecordatorios(recordatoriosData || []);
    
    // Cargar licencias
    const { data: licenciasData, error: licErr } = await sb.from('licencias').select('*').order('fecha', { ascending: true });
    if (licErr) loadErrors.push('licencias');
    setLicencias(licenciasData || []);
    
    // Cargar stock
    const { data: stockData, error: stockErr } = await sb.from('stock_items').select('*').order('nombre', { ascending: true });
    if (stockErr) loadErrors.push('stock_items');
    setStockItems(stockData || []);
    
    // Cargar ubicaciones de stock
    const { data: ubicacionesData, error: ubErr } = await sb.from('stock_ubicaciones').select('*').order('orden', { ascending: true });
    if (ubErr) loadErrors.push('stock_ubicaciones');
    setStockUbicaciones(ubicacionesData || []);
    
    const { data: movData, error: movErr } = await sb.from('stock_movimientos').select('*').order('created_at', { ascending: false }).limit(500);
    if (movErr) loadErrors.push('stock_movimientos');
    setStockMovimientos(movData || []);
    
    if (userProfile?.permisos?.ver_logs || userProfile?.role === 'admin') {
      const { data: logData, error: logErr } = await sb.from('logs').select('*').order('created_at', { ascending: false }).limit(500);
      if (logErr) loadErrors.push('logs');
      setLogs(logData || []);
    }
    
    if (loadErrors.length > 0) {
      console.error('Error cargando tablas:', loadErrors);
      showNotify('Error cargando: ' + loadErrors.join(', '), 'error');
    }
    setDataLoading(false);
  };

  // Carga paginada de completadas desde servidor
  const COMPLETED_PAGE_SIZE = 20;
  const loadCompletedPage = async (page = 1, append = false) => {
    setCompletedLoading(true);
    const from = (page - 1) * COMPLETED_PAGE_SIZE;
    const to = from + COMPLETED_PAGE_SIZE - 1;
    const { data, error } = await sb.from('novedades').select('*').eq('completado', true).order('created_at', { ascending: false }).range(from, to);
    if (!error && data) {
      setCompletedNov(prev => append ? [...prev, ...data] : data);
    }
    setCompletedLoading(false);
  };

  // Realtime: suscripción a cambios en tablas clave
  useEffect(() => {
    if (!session) return;
    const channel = sb.channel('sistema-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'novedades' }, () => { loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_items' }, () => { loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recordatorios' }, () => { loadData(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'juicios' }, () => { loadData(); })
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, [session]);

  // Calcular juicios próximos (5 días) - mostrar a todos
  useEffect(() => {
    if (!userProfile || !juicios || juicios.length === 0) {
      setUpcomingJuicios([]);
      return;
    }
    
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const en5Dias = new Date(hoy);
      en5Dias.setDate(en5Dias.getDate() + 5);
      
      const proximos = juicios.filter(j => {
        if (!j || !j.fecha_juicio) return false;
        try {
          // Corregir fecha para evitar problemas de zona horaria
          const fechaStr = String(j.fecha_juicio).split('T')[0];
          if (!fechaStr) return false;
          const parts = fechaStr.split('-');
          if (parts.length !== 3) return false;
          const [year, month, day] = parts.map(Number);
          if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
          const fechaJuicio = new Date(year, month - 1, day);
          fechaJuicio.setHours(0, 0, 0, 0);
          
          return fechaJuicio >= hoy && fechaJuicio <= en5Dias;
        } catch (e) {
          console.error('Error parsing fecha_juicio:', e);
          return false;
        }
      });
      
      // Todos ven todos los juicios próximos en la notificación
      setUpcomingJuicios(proximos);
    } catch (e) {
      console.error('Error en cálculo de juicios próximos:', e);
      setUpcomingJuicios([]);
    }
  }, [juicios, userProfile]);

  // Calcular recordatorios próximos (24 horas) - filtrados por visibilidad
  useEffect(() => {
    if (!recordatorios || recordatorios.length === 0) {
      setUpcomingRecordatorios([]);
      return;
    }
    
    try {
      const ahora = new Date();
      const en24Horas = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
      
      const visibles = filterRecordatoriosByVisibility(recordatorios);
      const proximos = visibles.filter(r => {
        if (!r || !r.fecha_hora || r.completado) return false;
        const fecha = new Date(r.fecha_hora);
        return fecha <= en24Horas;
      });
      
      setUpcomingRecordatorios(proximos);
    } catch (e) {
      console.error('Error en cálculo de recordatorios próximos:', e);
      setUpcomingRecordatorios([]);
    }
  }, [recordatorios, userProfile]);

  // Validación de duplicados en servidor
  const checkDuplicateServer = async (num, anio, excludeId) => {
    try {
      let query = sb
        .from('novedades')
        .select('id')
        .ilike('numero_novedad', num)
        .eq('anio', parseInt(anio));
      
      if (excludeId) query = query.neq('id', excludeId);
      
      const { data, error } = await query.limit(1);
      if (error) {
        console.error('Error validando duplicado:', error);
        return false;
      }
      return data && data.length > 0;
    } catch (err) {
      console.error('Error en checkDuplicate:', err);
      return false;
    }
  };

  useEffect(() => {
    if (session && userProfile) {
      loadData();
    }
  }, [session, userProfile]);

  // Mostrar modal de pendientes/juicios/recordatorios después de cargar datos (solo una vez)
  useEffect(() => {
    if (session && userProfile && novedades.length > 0 && !modalShownOnce) {
      const pending = countUserPendingTasks(userProfile, novedades);
      const hasUpcomingJuicios = upcomingJuicios.length > 0;
      const hasUpcomingRecordatorios = upcomingRecordatorios.length > 0;
      
      if (pending > 0 || hasUpcomingJuicios || hasUpcomingRecordatorios) {
        setPendingCount(pending);
        setShowPendingModal(true);
        setModalShownOnce(true);
      }
    }
  }, [novedades, upcomingJuicios, upcomingRecordatorios, modalShownOnce]);

  // UTILIDADES
  const extractNumber = (str) => { if (!str) return 0; const m = str.match(/\d+/g); return m ? parseInt(m[m.length - 1], 10) : 0; };
  const extractYear = (n) => n.anio ? n.anio.toString() : n.created_at ? new Date(n.created_at).getFullYear().toString() : '';

  // ==================== SISTEMA DE TURNOS Y PERMISOS ====================
  const TURNOS = { 1: '1er Turno', 2: '2do Turno', 3: '3er Turno', 4: 'Zona Oeste' };
  const ROLES = {
    admin: { label: 'Administrador', color: 'bg-red-500' },
    user: { label: 'Usuario', color: 'bg-slate-500' }
  };
  const PERMISSION_KEYS = [
    { key: 'ver_novedades', label: 'Ver novedades', group: 'Novedades' },
    { key: 'completar_tareas', label: 'Completar sus tareas', group: 'Novedades' },
    { key: 'crear_novedades', label: 'Crear novedades', group: 'Novedades' },
    { key: 'editar_novedades', label: 'Editar/Eliminar novedades', group: 'Novedades' },
    { key: 'marcar_checks_otros', label: 'Marcar checks de otros', group: 'Novedades' },
    { key: 'gestionar_juicios', label: 'Gestionar juicios', group: 'Módulos' },
    { key: 'gestionar_licencias', label: 'Gestionar licencias', group: 'Módulos' },
    { key: 'gestionar_stock', label: 'Gestionar stock', group: 'Módulos' },
    { key: 'retirar_consumibles', label: 'Retirar consumibles', group: 'Módulos' },
    { key: 'ver_estadisticas', label: 'Ver estadísticas', group: 'Administración' },
    { key: 'auditar', label: 'Auditar usuarios', group: 'Administración' },
    { key: 'imprimir', label: 'Imprimir reportes', group: 'Administración' },
    { key: 'exportar_respaldo', label: 'Exportar respaldo', group: 'Administración' },
    { key: 'ver_todos_turnos', label: 'Ver todos los turnos', group: 'Sistema' },
    { key: 'gestionar_personal', label: 'Gestionar personal', group: 'Sistema' },
    { key: 'ver_logs', label: 'Ver logs del sistema', group: 'Sistema' },
  ];
  // Plantillas de permisos para asignación rápida
  const PERM_TEMPLATES = {
    'Acceso total': {ver_novedades:true,completar_tareas:true,crear_novedades:true,editar_novedades:true,marcar_checks_otros:true,gestionar_juicios:true,gestionar_licencias:true,gestionar_stock:true,retirar_consumibles:true,ver_estadisticas:true,auditar:true,imprimir:true,exportar_respaldo:true,ver_todos_turnos:true,gestionar_personal:true,ver_logs:true},
    'Supervisor': {ver_novedades:true,completar_tareas:true,crear_novedades:true,editar_novedades:true,marcar_checks_otros:true,gestionar_juicios:true,gestionar_licencias:true,gestionar_stock:true,retirar_consumibles:true,ver_estadisticas:true,auditar:true,imprimir:true,exportar_respaldo:true,ver_todos_turnos:true,gestionar_personal:false,ver_logs:false},
    'Encargado': {ver_novedades:true,completar_tareas:true,crear_novedades:true,editar_novedades:true,marcar_checks_otros:true,gestionar_juicios:true,gestionar_licencias:true,gestionar_stock:true,retirar_consumibles:true,ver_estadisticas:true,auditar:true,imprimir:true,exportar_respaldo:false,ver_todos_turnos:false,gestionar_personal:false,ver_logs:false},
    'Moderador+': {ver_novedades:true,completar_tareas:true,crear_novedades:true,editar_novedades:false,marcar_checks_otros:false,gestionar_juicios:true,gestionar_licencias:true,gestionar_stock:true,retirar_consumibles:true,ver_estadisticas:false,auditar:false,imprimir:false,exportar_respaldo:false,ver_todos_turnos:false,gestionar_personal:false,ver_logs:false},
    'Moderador': {ver_novedades:true,completar_tareas:true,crear_novedades:true,editar_novedades:false,marcar_checks_otros:false,gestionar_juicios:true,gestionar_licencias:true,gestionar_stock:false,retirar_consumibles:true,ver_estadisticas:false,auditar:false,imprimir:false,exportar_respaldo:false,ver_todos_turnos:false,gestionar_personal:false,ver_logs:false},
    'Básico': {ver_novedades:true,completar_tareas:true,crear_novedades:false,editar_novedades:false,marcar_checks_otros:false,gestionar_juicios:false,gestionar_licencias:false,gestionar_stock:false,retirar_consumibles:true,ver_estadisticas:false,auditar:false,imprimir:false,exportar_respaldo:false,ver_todos_turnos:false,gestionar_personal:false,ver_logs:false},
  };
  const PERM_TEMPLATE_COLORS = {'Acceso total':'bg-red-500','Supervisor':'bg-purple-500','Encargado':'bg-blue-500','Moderador+':'bg-teal-500','Moderador':'bg-amber-500','Básico':'bg-slate-400'};
  const hasPerm = (perm) => {
    if (userProfile?.permisos && userProfile.permisos[perm] !== undefined) return userProfile.permisos[perm];
    // Fallback: admin tiene todo, user tiene básico
    if (userProfile?.role === 'admin') return true;
    return perm === 'ver_novedades' || perm === 'completar_tareas' || perm === 'retirar_consumibles';
  };
  const detectRole = (perms) => perms?.gestionar_personal ? 'admin' : 'user';
  const canSeeAllTurnos = () => hasPerm('ver_todos_turnos');
  const canManageUsers = () => hasPerm('gestionar_personal');
  const canSeeLogs = () => hasPerm('ver_logs');
  const canEditAll = () => hasPerm('editar_novedades');
  const canManageNovedades = () => hasPerm('crear_novedades');
  const canManageJuicios = () => hasPerm('gestionar_juicios');
  const canEditJuicio = (juicio) => {
    if (hasPerm('editar_novedades')) return true;
    if (hasPerm('gestionar_juicios')) return juicio.creado_por === userProfile?.nombre;
    return false;
  };
  const canManageLicencias = () => hasPerm('gestionar_licencias');
  const canManageStock = () => hasPerm('gestionar_stock');
  const canWithdrawStock = () => hasPerm('retirar_consumibles');
  const canSeeStats = () => hasPerm('ver_estadisticas');
  const canAudit = () => hasPerm('auditar');
  const canBackup = () => hasPerm('exportar_respaldo');
  const canPrint = () => hasPerm('imprimir');
  const getUserTurno = () => userProfile?.turno || 1;
  
  // Obtener el turno efectivo para filtrar/crear datos
  const getTurnoEfectivo = () => {
    if (canSeeAllTurnos()) {
      return turnoActivo || 0; // 0 = todos
    }
    return getUserTurno();
  };

  // Filtrar datos por turno
  const filterByTurno = (items) => {
    if (!items || !Array.isArray(items)) return [];
    const turnoEfectivo = getTurnoEfectivo();
    if (turnoEfectivo === 0) return items; // Ver todos (admin/supervisor)
    // Solo mostrar items del turno del usuario (no items sin turno)
    return items.filter(item => item.turno === turnoEfectivo);
  };

  // Filtrar profiles por turno (para selectores) - memoizado
  const profilesByTurno = useMemo(() => {
    const turnoEfectivo = getTurnoEfectivo();
    if (turnoEfectivo === 0) return profiles;
    return profiles.filter(p => p.turno === turnoEfectivo);
  }, [profiles, turnoActivo, userProfile]);
  const getProfilesByTurno = () => profilesByTurno;
  
  // Obtener turno para guardar nuevos registros
  const getTurnoParaGuardar = () => {
    if (canSeeAllTurnos() && turnoActivo > 0) {
      return turnoActivo;
    }
    return getUserTurno();
  };
  // ==================== FIN SISTEMA DE TURNOS ====================
  
  // Filtrar recordatorios por visibilidad:
  // turno=0 (general) → visible para TODOS
  // turno=1-4 → visible solo para ese turno + admin/supervisor
  const filterRecordatoriosByVisibility = (items) => {
    if (!items || !Array.isArray(items)) return [];
    if (canSeeAllTurnos()) return items; // Admin/supervisor ven todo
    const miTurno = getUserTurno();
    return items.filter(r => r.turno === 0 || r.turno === miTurno);
  };

  const sortByNumber = (a, b) => extractNumber(a.numero_novedad) - extractNumber(b.numero_novedad);
  
  // Colores para usuarios en calendario — máximo contraste entre adyacentes, saturación 300 + borde 500
  const userColorPalette = [
    { bg: 'bg-blue-300',    text: 'text-blue-900',    border: 'border-blue-500',    dot: '#3b82f6' },
    { bg: 'bg-orange-300',  text: 'text-orange-900',  border: 'border-orange-500',  dot: '#f97316' },
    { bg: 'bg-emerald-300', text: 'text-emerald-900', border: 'border-emerald-500', dot: '#10b981' },
    { bg: 'bg-rose-300',    text: 'text-rose-900',    border: 'border-rose-500',    dot: '#f43f5e' },
    { bg: 'bg-violet-300',  text: 'text-violet-900',  border: 'border-violet-500',  dot: '#8b5cf6' },
    { bg: 'bg-amber-300',   text: 'text-amber-900',   border: 'border-amber-500',   dot: '#f59e0b' },
    { bg: 'bg-cyan-300',    text: 'text-cyan-900',    border: 'border-cyan-500',    dot: '#06b6d4' },
    { bg: 'bg-fuchsia-300', text: 'text-fuchsia-900', border: 'border-fuchsia-500', dot: '#d946ef' },
    { bg: 'bg-lime-300',    text: 'text-lime-900',    border: 'border-lime-600',    dot: '#84cc16' },
    { bg: 'bg-red-300',     text: 'text-red-900',     border: 'border-red-500',     dot: '#ef4444' },
    { bg: 'bg-teal-300',    text: 'text-teal-900',    border: 'border-teal-500',    dot: '#14b8a6' },
    { bg: 'bg-yellow-200',  text: 'text-yellow-900',  border: 'border-yellow-500',  dot: '#eab308' },
    { bg: 'bg-indigo-300',  text: 'text-indigo-900',  border: 'border-indigo-500',  dot: '#6366f1' },
    { bg: 'bg-pink-200',    text: 'text-pink-900',    border: 'border-pink-500',    dot: '#ec4899' },
    { bg: 'bg-sky-300',     text: 'text-sky-900',     border: 'border-sky-500',     dot: '#0ea5e9' },
    { bg: 'bg-purple-300',  text: 'text-purple-900',  border: 'border-purple-500',  dot: '#a855f7' },
  ];
  
  // Mapa de usuarios a índice de color (se calcula una vez)
  const userColorMap = React.useMemo(() => {
    const uniqueUsers = [...new Set(licencias.map(l => l.user_nombre))].filter(Boolean).sort();
    const map = {};
    uniqueUsers.forEach((user, idx) => {
      map[user] = idx % userColorPalette.length;
    });
    return map;
  }, [licencias]);
  
  const getUserColor = (userName) => {
    if (!userName) return userColorPalette[0];
    const idx = userColorMap[userName] ?? 0;
    return userColorPalette[idx];
  };

  // Función segura para parsear fechas de juicios (evita problemas de zona horaria)
  const parseFechaJuicio = (fechaStr) => {
    if (!fechaStr) return null;
    try {
      const str = String(fechaStr).split('T')[0];
      const parts = str.split('-');
      if (parts.length !== 3) return null;
      const [year, month, day] = parts.map(Number);
      if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
      const fecha = new Date(year, month - 1, day);
      fecha.setHours(0, 0, 0, 0);
      return fecha;
    } catch (e) {
      return null;
    }
  };

  const getAssignedTasks = (n) => {
    const tasks = [];
    if (n.es_comision) {
      // Las comisiones tienen tareas especiales (siempre completadas)
      if (n.comision_carga_sgsp) tasks.push({ field: 'comision_carga_sgsp', checkKey: 'comision_done', label: 'Carga SGSP', person: n.comision_carga_sgsp, isComision: true });
      if (n.comision_chofer) tasks.push({ field: 'comision_chofer', checkKey: 'comision_done', label: 'Chofer', person: n.comision_chofer, isComision: true });
      if (n.comision_acompanante) tasks.push({ field: 'comision_acompanante', checkKey: 'comision_done', label: 'Acompañante', person: n.comision_acompanante, isComision: true });
    } else if (n.es_evento_social) {
      // Los eventos sociales tienen tareas especiales (siempre completadas)
      if (n.evento_fotografo) tasks.push({ field: 'evento_fotografo', checkKey: 'evento_done', label: 'Fotógrafo', person: n.evento_fotografo, isEventoSocial: true });
      if (n.evento_acompanante1) tasks.push({ field: 'evento_acompanante1', checkKey: 'evento_done', label: 'Acompañante', person: n.evento_acompanante1, isEventoSocial: true });
      if (n.evento_acompanante2) tasks.push({ field: 'evento_acompanante2', checkKey: 'evento_done', label: 'Acompañante', person: n.evento_acompanante2, isEventoSocial: true });
      if (n.evento_acompanante3) tasks.push({ field: 'evento_acompanante3', checkKey: 'evento_done', label: 'Acompañante', person: n.evento_acompanante3, isEventoSocial: true });
    } else {
      if (n.informe_actuacion || n.informeActuacion) tasks.push({ field: 'informe_actuacion', checkKey: 'actuacion_realizada', checkKeyOld: 'actuacionRealizada', label: 'Informe Actuación', person: n.informe_actuacion || n.informeActuacion });
      if (n.informe_criminalistico || n.informeCriminalistico) tasks.push({ field: 'informe_criminalistico', checkKey: 'criminalistico_realizado', checkKeyOld: 'criminalisticoRealizado', label: 'Criminalístico', person: n.informe_criminalistico || n.informeCriminalistico });
      if (n.informe_pericial || n.informePericial) tasks.push({ field: 'informe_pericial', checkKey: 'pericial_realizado', checkKeyOld: 'pericialRealizado', label: 'Pericial', person: n.informe_pericial || n.informePericial });
      if (n.croquis) tasks.push({ field: 'croquis', checkKey: 'croquis_realizado', checkKeyOld: 'croquisRealizado', label: 'Croquis', person: n.croquis });
    }
    return tasks;
  };

  const isTaskDone = (n, task) => (task.isComision || task.isEventoSocial) ? true : (n[task.checkKey] || (n.checks && n.checks[task.checkKeyOld]));

  const getTaskCounts = (n) => {
    const tasks = getAssignedTasks(n);
    return { completed: tasks.filter(t => isTaskDone(n, t)).length, total: tasks.length };
  };

  const getUserAssignment = (n, profile) => {
    if (!profile) return { isAssigned: false, assignments: [] };
    const name = profile.nombre;
    const assignments = [];
    if (n.es_comision) {
      // Asignaciones de comisión (siempre completadas)
      if (n.comision_carga_sgsp === name) assignments.push({ checkKey: 'comision_done', label: 'Carga SGSP', isComision: true });
      if (n.comision_chofer === name) assignments.push({ checkKey: 'comision_done', label: 'Chofer', isComision: true });
      if (n.comision_acompanante === name) assignments.push({ checkKey: 'comision_done', label: 'Acompañante', isComision: true });
    } else if (n.es_evento_social) {
      // Asignaciones de evento social (siempre completadas)
      if (n.evento_fotografo === name) assignments.push({ checkKey: 'evento_done', label: 'Fotógrafo', isEventoSocial: true });
      if (n.evento_acompanante1 === name) assignments.push({ checkKey: 'evento_done', label: 'Acompañante', isEventoSocial: true });
      if (n.evento_acompanante2 === name) assignments.push({ checkKey: 'evento_done', label: 'Acompañante', isEventoSocial: true });
      if (n.evento_acompanante3 === name) assignments.push({ checkKey: 'evento_done', label: 'Acompañante', isEventoSocial: true });
    } else {
      if ((n.informe_actuacion || n.informeActuacion) === name) assignments.push({ checkKey: 'actuacion_realizada', checkKeyOld: 'actuacionRealizada', label: 'Informe Actuación' });
      if ((n.informe_criminalistico || n.informeCriminalistico) === name) assignments.push({ checkKey: 'criminalistico_realizado', checkKeyOld: 'criminalisticoRealizado', label: 'Criminalístico' });
      if ((n.informe_pericial || n.informePericial) === name) assignments.push({ checkKey: 'pericial_realizado', checkKeyOld: 'pericialRealizado', label: 'Pericial' });
      if (n.croquis === name) assignments.push({ checkKey: 'croquis_realizado', checkKeyOld: 'croquisRealizado', label: 'Croquis' });
    }
    return { isAssigned: assignments.length > 0, assignments };
  };

  const areUserTasksComplete = (n, assignments) => assignments.length > 0 && assignments.every(a => (a.isComision || a.isEventoSocial) ? true : (n[a.checkKey] || (n.checks && n.checks[a.checkKeyOld])));
  const isNovedadComplete = (n) => { if (n.es_comision || n.es_evento_social) return true; const { completed, total } = getTaskCounts(n); return total > 0 && completed === total; };
  const countUserPendingTasks = (profile, list) => list.filter(n => { if (n.es_comision || n.es_evento_social) return false; const { isAssigned, assignments } = getUserAssignment(n, profile); return isAssigned && !areUserTasksComplete(n, assignments); }).length;

  const filterNovedades = (list) => {
    // Primero filtrar por turno
    let f = filterByTurno(list);
    if (selectedYear) f = f.filter(n => extractYear(n) === selectedYear);
    if (searchTerm.trim()) { const t = searchTerm.toLowerCase(); f = f.filter(n => (n.numero_novedad || '').toLowerCase().includes(t) || (n.numero_sgsp || '').toLowerCase().includes(t) || (n.titulo || '').toLowerCase().includes(t)); }
    return f;
  };

  const sortNovedades = (list, profile) => [...list].sort((a, b) => {
    const aA = getUserAssignment(a, profile), bA = getUserAssignment(b, profile);
    const aC = areUserTasksComplete(a, aA.assignments), bC = areUserTasksComplete(b, bA.assignments);
    if (aA.isAssigned && !aC && !(bA.isAssigned && !bC)) return -1;
    if (bA.isAssigned && !bC && !(aA.isAssigned && !aC)) return 1;
    return sortByNumber(a, b);
  });

  const pendingNovedades = useMemo(
    () => sortNovedades(filterNovedades(novedades), userProfile),
    [novedades, userProfile, searchTerm, selectedYear, turnoActivo]
  );
  // Completadas: filtradas desde datos cargados del servidor por página
  const completedNovedades = useMemo(
    () => { const filtered = filterNovedades(completedNov); return filtered.sort(sortByNumber); },
    [completedNov, searchTerm, selectedYear, turnoActivo]
  );
  // Contadores filtrados por turno (para pestañas)
  const novedadesFiltradas = useMemo(
    () => filterByTurno(novedades),
    [novedades, turnoActivo]
  );
  const totalPending = useMemo(
    () => novedadesFiltradas.length,
    [novedadesFiltradas]
  );
  // totalCompleted viene del server (conteo exacto)
  const totalCompleted = completedTotal;

  const checkDuplicate = checkDuplicateServer;

  const handleToggleCheck = async (id, checkKey, checkKeyOld) => {
    const n = novedades.find(x => x.id === id) || completedNov.find(x => x.id === id);
    if (!n) { console.error('No se encontró la novedad'); return; }
    const currentVal = n[checkKey] || (n.checks && n.checks[checkKeyOld]) || false;
    const newVal = !currentVal;
    
    // Actualizar columna booleana nueva
    const { data, error } = await sb.from('novedades').update({ [checkKey]: newVal, modificado_por: userProfile?.nombre }).eq('id', id).select();
    
    if (error) {
      console.error('Error al actualizar:', error);
      showNotify("Error al actualizar: " + error.message, "error");
      return;
    }
    
    // Actualizar estado local con los datos devueltos por el servidor
    if (data && data.length > 0) {
      setNovedades(prev => prev.map(x => x.id === id ? data[0] : x));
      setCompletedNov(prev => prev.map(x => x.id === id ? data[0] : x));
    }
    
    // Log descriptivo
    const taskNames = {
      'actuacion_realizada': 'Informe Actuación',
      'criminalistico_realizado': 'Criminalístico',
      'pericial_realizado': 'Pericial',
      'croquis_realizado': 'Croquis'
    };
    const taskName = taskNames[checkKey] || checkKey;
    const action = newVal ? 'CHECK_COMPLETADO' : 'CHECK_DESMARCADO';
    const detail = newVal 
      ? `Completó "${taskName}" en Nov. ${n.numero_novedad}` 
      : `Desmarcó "${taskName}" en Nov. ${n.numero_novedad}`;
    await addLog(action, detail);
    
    // Recalcular si la novedad está completa y actualizar columna
    if (data && data.length > 0) {
      const updated = data[0];
      const nowComplete = isNovedadComplete(updated);
      if (nowComplete !== updated.completado) {
        await sb.from('novedades').update({ completado: nowComplete }).eq('id', id);
        // Si se completó, moverla de pendientes y actualizar conteo
        if (nowComplete) {
          setNovedades(prev => prev.filter(x => x.id !== id));
          setCompletedTotal(prev => prev + 1);
        } else {
          // Se desmarcó — traerla de vuelta a pendientes
          setNovedades(prev => [...prev, {...updated, completado: false}]);
          setCompletedTotal(prev => Math.max(0, prev - 1));
          setCompletedNov(prev => prev.filter(x => x.id !== id));
        }
      }
    }
  };

  const handleBackup = async () => {
    showNotify("Generando respaldo...");
    const { data: allNov } = await sb.from('novedades').select('*');
    const { data: allProf } = await sb.from('profiles').select('*');
    const { data: allLogs } = await sb.from('logs').select('*').limit(500);
    const { data: allJuicios } = await sb.from('juicios').select('*');
    const { data: allRecordatorios } = await sb.from('recordatorios').select('*');
    const { data: allLicencias } = await sb.from('licencias').select('*');
    const { data: allStockItems } = await sb.from('stock_items').select('*');
    const { data: allStockUbicaciones } = await sb.from('stock_ubicaciones').select('*');
    const { data: allStockMovimientos } = await sb.from('stock_movimientos').select('*');
    const backup = { 
      fecha: new Date().toISOString(), 
      generado_por: userProfile?.nombre, 
      novedades: allNov, 
      profiles: allProf, 
      logs: allLogs,
      juicios: allJuicios,
      recordatorios: allRecordatorios,
      licencias: allLicencias,
      stock_items: allStockItems,
      stock_ubicaciones: allStockUbicaciones,
      stock_movimientos: allStockMovimientos
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `respaldo_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    await addLog('RESPALDO', 'Descargó respaldo');
    showNotify("Respaldo descargado");
  };

  const getUserDetailedStats = (profile, filterYear = 'todos') => {
    const stats = { informeActuacion: { a: 0, c: 0 }, informeCriminalistico: { a: 0, c: 0 }, informePericial: { a: 0, c: 0 }, croquis: { a: 0, c: 0 }, juicios: 0, comisiones: { cargaSgsp: 0, chofer: 0, acompanante: 0 }, eventos: { fotografo: 0, acompanante: 0 } };
    
    // Combinar pendientes + completadas cargadas para estadísticas
    const allNov = [...novedades, ...completedNov];
    const filteredNovedades = filterYear === 'todos' ? allNov : allNov.filter(n => n.anio?.toString() === filterYear);
    
    // Set para contar novedades únicas donde participó
    const novedadesConcurridas = new Set();
    const novedadesNormales = new Set();
    const novedadesComisiones = new Set();
    const novedadesEventos = new Set();
    
    filteredNovedades.forEach(n => {
      const name = profile.nombre;
      let participaEnEsta = false;
      
      // Novedades normales
      if (!n.es_comision && !n.es_evento_social) {
        if ((n.informe_actuacion || n.informeActuacion) === name) { stats.informeActuacion.a++; if (isTaskDone(n, { checkKey: 'actuacion_realizada', checkKeyOld: 'actuacionRealizada' })) stats.informeActuacion.c++; participaEnEsta = true; }
        if ((n.informe_criminalistico || n.informeCriminalistico) === name) { stats.informeCriminalistico.a++; if (isTaskDone(n, { checkKey: 'criminalistico_realizado', checkKeyOld: 'criminalisticoRealizado' })) stats.informeCriminalistico.c++; participaEnEsta = true; }
        if ((n.informe_pericial || n.informePericial) === name) { stats.informePericial.a++; if (isTaskDone(n, { checkKey: 'pericial_realizado', checkKeyOld: 'pericialRealizado' })) stats.informePericial.c++; participaEnEsta = true; }
        if (n.croquis === name) { stats.croquis.a++; if (isTaskDone(n, { checkKey: 'croquis_realizado', checkKeyOld: 'croquisRealizado' })) stats.croquis.c++; participaEnEsta = true; }
        if (participaEnEsta) novedadesNormales.add(n.id);
      }
      
      // Comisiones
      if (n.es_comision) {
        if (n.comision_carga_sgsp === name) { stats.comisiones.cargaSgsp++; } // Solo registro, no genera concurrencia
        if (n.comision_chofer === name) { stats.comisiones.chofer++; participaEnEsta = true; }
        if (n.comision_acompanante === name) { stats.comisiones.acompanante++; participaEnEsta = true; }
        if (participaEnEsta) novedadesComisiones.add(n.id);
      }
      
      // Eventos sociales
      if (n.es_evento_social) {
        if (n.evento_fotografo === name) { stats.eventos.fotografo++; participaEnEsta = true; }
        if (n.evento_acompanante1 === name) { stats.eventos.acompanante++; participaEnEsta = true; }
        if (n.evento_acompanante2 === name) { stats.eventos.acompanante++; participaEnEsta = true; }
        if (n.evento_acompanante3 === name) { stats.eventos.acompanante++; participaEnEsta = true; }
        if (participaEnEsta) novedadesEventos.add(n.id);
      }
      
      if (participaEnEsta) novedadesConcurridas.add(n.id);
    });
    
    // Contar juicios donde el usuario está citado
    const filteredJuicios = filterYear === 'todos' ? juicios : juicios.filter(j => {
      const fecha = parseFechaJuicio(j.fecha_juicio);
      return fecha && fecha.getFullYear().toString() === filterYear;
    });
    stats.juicios = filteredJuicios.filter(j => (j.citados || []).includes(profile.nombre)).length;
    
    const total = stats.informeActuacion.a + stats.informeCriminalistico.a + stats.informePericial.a + stats.croquis.a;
    const done = stats.informeActuacion.c + stats.informeCriminalistico.c + stats.informePericial.c + stats.croquis.c;
    const totalComisiones = stats.comisiones.chofer + stats.comisiones.acompanante; // cargaSgsp no suma, solo se registra
    const totalEventos = stats.eventos.fotografo + stats.eventos.acompanante;
    // Las comisiones y eventos suman al total de tareas y se consideran completadas
    const totalConExtras = total + totalComisiones + totalEventos;
    const doneConExtras = done + totalComisiones + totalEventos;
    
    return { 
      ...stats, 
      total: totalConExtras, 
      done: doneConExtras, 
      pending: totalConExtras - doneConExtras, 
      totalComisiones, 
      totalEventos,
      // Novedades concurridas (únicas)
      novedadesConcurridas: novedadesConcurridas.size,
      novedadesNormales: novedadesNormales.size,
      novedadesComisiones: novedadesComisiones.size,
      novedadesEventos: novedadesEventos.size
    };
  };
  
  // Obtener años disponibles para el filtro
  const getAvailableStatsYears = () => {
    const years = new Set();
    novedades.forEach(n => { if (n.anio) years.add(n.anio.toString()); });
    juicios.forEach(j => { 
      const fecha = parseFechaJuicio(j.fecha_juicio);
      if (fecha) years.add(fecha.getFullYear().toString()); 
    });
    return Array.from(years).sort((a, b) => b - a);
  };
  
  // Estadísticas filtradas por año
  const getFilteredStats = (turnoFilter) => {
    const allNov = [...novedades, ...completedNov];
    let filteredNovedades = statsYear === 'todos' ? allNov : allNov.filter(n => n.anio?.toString() === statsYear);
    // Filtrar por turno si se especifica
    if (turnoFilter && turnoFilter > 0) {
      filteredNovedades = filteredNovedades.filter(n => n.turno === turnoFilter);
    }
    let filteredJuicios = statsYear === 'todos' ? juicios : juicios.filter(j => {
      const fecha = parseFechaJuicio(j.fecha_juicio);
      return fecha && fecha.getFullYear().toString() === statsYear;
    });
    if (turnoFilter && turnoFilter > 0) {
      filteredJuicios = filteredJuicios.filter(j => j.turno === turnoFilter);
    }
    
    return {
      totalNovedades: filteredNovedades.length,
      pendientes: filteredNovedades.filter(n => !isNovedadComplete(n)).length,
      completadas: filteredNovedades.filter(n => isNovedadComplete(n)).length,
      comisiones: filteredNovedades.filter(n => n.es_comision).length,
      eventos: filteredNovedades.filter(n => n.es_evento_social).length,
      totalJuicios: filteredJuicios.length
    };
  };

  // PANTALLA CARGA
  if (authLoading) return <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-header)' }}><div className="flex flex-col items-center gap-4"><div className="w-12 h-12 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div><div className="text-white text-sm font-semibold animate-pulse">Verificando sesión...</div></div></div>;

  // PANTALLA LOGIN
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 font-sans" style={{ background: 'var(--bg-header)' }}>
        <div className="w-full max-w-md glass-strong rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl animate-slideUp border border-white/20">
          <div className="text-center mb-8">
            {LOGO_URL_LARGE ? (
              <img src={LOGO_URL_LARGE} alt="Escudo Policía Científica" className="w-28 h-28 mx-auto mb-4 object-contain drop-shadow-2xl" />
            ) : (
              <div className="inline-block p-5 bg-emerald-50 rounded-full text-5xl mb-4">🔬</div>
            )}
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">Policía Científica</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">Sistema de Gestión</p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-200">
              <Icon name="lock" size={12} /> Acceso Seguro
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            <div className="float-label-group">
              <input 
                type="text" 
                name={"user_" + Date.now()}
                value={loginUsername} 
                onChange={(e) => setLoginUsername(e.target.value)} 
                placeholder=" " 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-slate-700 transition-all" 
                required 
                autoComplete="off" 
              />
              <label>Usuario</label>
            </div>
            <div className="float-label-group">
              <input 
                type="password" 
                name={"pass_" + Date.now()}
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                placeholder=" " 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-slate-700 transition-all" 
                required 
                autoComplete="new-password" 
              />
              <label>Contraseña</label>
            </div>
            {loginLocked && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-bold">
                <Icon name="clock" size={14} /> Demasiados intentos. Esperá {lockoutSeconds >= 60 ? `${Math.ceil(lockoutSeconds / 60)} minuto${Math.ceil(lockoutSeconds / 60) > 1 ? 's' : ''}` : `${lockoutSeconds}s`}.
              </div>
            )}
            <button type="submit" disabled={loginLoading || loginLocked} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black shadow-xl hover:bg-slate-800 hover:shadow-2xl mt-2 uppercase text-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {loginLoading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Verificando...</> : <><Icon name="lock" size={16} /> Entrar</>}
            </button>
          </form>
          {notification && <Notification {...notification} />}
        </div>
      </div>
    );
  }

  if (!userProfile) return <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-header)' }}><div className="flex flex-col items-center gap-4"><div className="w-12 h-12 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div><div className="text-white text-sm font-semibold animate-pulse">Cargando perfil...</div></div></div>;

  // TARJETA NOVEDAD
  const NovedadCard = ({ n, isCompletedView }) => {
    const { completed, total } = getTaskCounts(n);
    const isEx = expandedId === n.id;
    const { isAssigned, assignments } = getUserAssignment(n, userProfile);
    const userDone = areUserTasksComplete(n, assignments);
    const tasks = getAssignedTasks(n);
    
    let border = 'border-slate-200', bg = 'bg-white', left = '';
    if (!isCompletedView && isAssigned) {
      if (userDone) { border = 'border-emerald-200'; bg = 'bg-emerald-50/50'; left = 'border-l-4 border-l-emerald-500'; }
      else { border = 'border-red-200'; bg = 'bg-red-50/50'; left = 'border-l-4 border-l-red-500'; }
    }
    if (isCompletedView) { border = 'border-emerald-200'; bg = 'bg-emerald-50/50'; left = 'border-l-4 border-l-emerald-500'; }

    return (
      <div className={`${bg} rounded-2xl border ${border} ${left} overflow-hidden card-lift`} style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="p-5 flex items-center justify-between cursor-pointer select-none" onClick={() => setExpandedId(isEx ? null : n.id)}>
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm ${n.es_comision ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/20' : n.es_evento_social ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-500/20' : completed === total && total > 0 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/20' : total === 0 ? 'bg-slate-200 text-slate-500' : 'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/20'}`}>{total > 0 ? `${completed}/${total}` : 'N/A'}</div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-black text-slate-800 text-lg">{n.numero_novedad}</span>
                {n.anio && <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">{n.anio}</span>}
                {n.es_comision && <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1"><Icon name="car" size={11} /> COMISIÓN</span>}
                {n.es_evento_social && <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 flex items-center gap-1"><Icon name="party" size={11} /> EVENTO</span>}
                {n.titulo && <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-md border border-emerald-200">{n.titulo}</span>}
                {!isCompletedView && isAssigned && <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${userDone ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>{userDone ? <><Icon name="check" size={10} /> Listo</> : <><Icon name="alert" size={10} /> Pendiente</>}</span>}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase mt-1.5">SGSP: {n.numero_sgsp}</div>
            </div>
          </div>
          <span className={`text-slate-400 transition-transform duration-300 ${isEx ? 'rotate-180' : ''}`}><Icon name="chevronDown" size={18} /></span>
        </div>
        {isEx && (
          <div className="px-6 pb-6 border-t border-slate-100 animate-expandDown bg-white/50">
            {n.titulo && <div className="py-4 border-b border-slate-100"><span className="text-[10px] font-black text-slate-400 uppercase">Título:</span><p className="text-slate-700 font-bold mt-1">{n.titulo}</p></div>}
            {!isCompletedView && isAssigned && (
              <div className="py-4 border-b border-slate-200 bg-slate-100 -mx-6 px-6 my-4">
                <span className="text-[10px] font-black text-slate-600 uppercase">📌 Tus tareas:</span>
                {userProfile.role === 'user' ? (
                  <div className="mt-3 space-y-2">
                    {assignments.map(a => (
                      <div key={a.checkKey} className="flex items-center gap-4 py-2">
                        <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center ${isTaskDone(n, a) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-slate-200'}`}>
                          {isTaskDone(n, a) && <span className="text-white text-sm">✓</span>}
                        </div>
                        <span className={`text-sm font-bold ${isTaskDone(n, a) ? 'text-emerald-600 line-through' : 'text-slate-600'}`}>{a.label}</span>
                        <span className="text-[9px] text-slate-400 italic">(Solo lectura)</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    {assignments.map(a => (
                      <label key={a.checkKey} className="flex items-center gap-4 py-2 cursor-pointer group select-none">
                        <div onClick={() => handleToggleCheck(n.id, a.checkKey, a.checkKeyOld)} className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center ${isTaskDone(n, a) ? 'bg-emerald-500 border-emerald-500' : 'border-red-400 bg-red-100'}`}>
                          {isTaskDone(n, a) && <span className="text-white text-sm">✓</span>}
                        </div>
                        <span className={`text-sm font-bold ${isTaskDone(n, a) ? 'text-emerald-600 line-through' : 'text-red-600'}`}>{a.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              <div className="space-y-3">
                {n.es_comision ? (
                  <>
                    <h4 className="text-[11px] font-black text-amber-600 uppercase border-b border-amber-200 pb-2">🚗 Participantes de Comisión</h4>
                    <div className="space-y-2">
                      {n.comision_carga_sgsp && (
                        <div className={`flex justify-between items-center text-xs py-2 px-3 rounded-lg ${n.comision_carga_sgsp === userProfile.nombre ? 'bg-emerald-100' : 'bg-amber-50'}`}>
                          <span className="text-amber-700 font-bold">Carga SGSP:</span>
                          <span className="font-black text-emerald-700">{n.comision_carga_sgsp} ✓</span>
                        </div>
                      )}
                      {n.comision_chofer && (
                        <div className={`flex justify-between items-center text-xs py-2 px-3 rounded-lg ${n.comision_chofer === userProfile.nombre ? 'bg-emerald-100' : 'bg-amber-50'}`}>
                          <span className="text-amber-700 font-bold">Chofer:</span>
                          <span className="font-black text-emerald-700">{n.comision_chofer} ✓</span>
                        </div>
                      )}
                      {n.comision_acompanante && (
                        <div className={`flex justify-between items-center text-xs py-2 px-3 rounded-lg ${n.comision_acompanante === userProfile.nombre ? 'bg-emerald-100' : 'bg-amber-50'}`}>
                          <span className="text-amber-700 font-bold">Acompañante:</span>
                          <span className="font-black text-emerald-700">{n.comision_acompanante} ✓</span>
                        </div>
                      )}
                      {!n.comision_carga_sgsp && !n.comision_chofer && !n.comision_acompanante && (
                        <p className="text-slate-400 text-xs italic py-2 text-center">Sin participantes asignados</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-[11px] font-black text-slate-500 uppercase border-b border-slate-200 pb-2">Asignaciones</h4>
                    {[{ f: 'informe_actuacion', fOld: 'informeActuacion', l: 'Informe Actuación', ck: 'actuacion_realizada', ckOld: 'actuacionRealizada' }, { f: 'informe_criminalistico', fOld: 'informeCriminalistico', l: 'Criminalístico', ck: 'criminalistico_realizado', ckOld: 'criminalisticoRealizado' }, { f: 'informe_pericial', fOld: 'informePericial', l: 'Pericial', ck: 'pericial_realizado', ckOld: 'pericialRealizado' }, { f: 'croquis', fOld: 'croquis', l: 'Croquis', ck: 'croquis_realizado', ckOld: 'croquisRealizado' }].map(item => {
                      const person = n[item.f] || n[item.fOld];
                      const isMe = person === userProfile.nombre;
                      const done = isTaskDone(n, { checkKey: item.ck, checkKeyOld: item.ckOld });
                      return (
                        <div key={item.f} className={`flex justify-between items-center text-xs py-2 px-3 rounded-lg ${isMe ? (done ? 'bg-emerald-100' : 'bg-red-100') : 'bg-slate-50'}`}>
                          <span className="text-slate-600 font-bold">{item.l}:</span>
                          <span className={`font-black ${!person ? 'text-slate-400 italic' : isMe ? (done ? 'text-emerald-600' : 'text-red-600') : 'text-slate-800'}`}>{person || 'Sin asignar'}{isMe && person && <span className="ml-1">{done ? '✓' : '←'}</span>}</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              <div className="space-y-3">
                {n.es_comision ? (
                  <>
                    <h4 className="text-[11px] font-black text-emerald-600 uppercase border-b border-emerald-200 pb-2">Tareas ({completed}/{total})</h4>
                    <div className="space-y-2">
                      {tasks.map(task => (
                        <div key={task.field} className={`flex items-center gap-3 py-2 px-3 rounded-lg ${task.person === userProfile.nombre ? 'bg-emerald-100' : 'bg-emerald-50'}`}>
                          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>
                          <span className="text-xs font-bold text-emerald-700">{task.label} - {task.person}</span>
                        </div>
                      ))}
                      {tasks.length === 0 && <p className="text-slate-400 text-xs italic py-4 text-center bg-slate-50 rounded-xl">Sin tareas asignadas</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-[11px] font-black text-slate-500 uppercase border-b border-slate-200 pb-2">Checklist ({completed}/{total})</h4>
                    {tasks.length === 0 ? <p className="text-slate-400 text-xs italic py-4 text-center bg-slate-50 rounded-xl">Sin tareas</p> : tasks.map(task => {
                      const isMe = task.person === userProfile.nombre;
                      const done = isTaskDone(n, task);
                      const canToggle = hasPerm('marcar_checks_otros') || (hasPerm('completar_tareas') && isMe);
                      return (
                        <label key={task.checkKey} className={`flex items-center gap-4 py-2 ${canToggle ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} group select-none rounded-lg px-3 ${isMe ? 'bg-slate-100' : 'bg-slate-50'}`}>
                          <div onClick={() => canToggle && handleToggleCheck(n.id, task.checkKey, task.checkKeyOld)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'} ${!canToggle && 'opacity-50'}`}>{done && <span className="text-white text-[10px]">✓</span>}</div>
                          <span className={`text-xs font-bold ${done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.label}{isMe && <span className="ml-1 text-[9px] text-emerald-600">(TÚ)</span>} <span className="text-[9px] text-slate-400">- {task.person}</span></span>
                        </label>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
            <div className="pt-6 flex justify-between items-center border-t border-slate-200">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Cargado: {n.creado_por}</span>
                {n.modificado_por && <span className="text-[9px] text-emerald-500 font-bold uppercase">Mod: {n.modificado_por}</span>}
              </div>
              {canEditAll() && (
                <div className="flex gap-2">
                  <button onClick={() => { setEditingNovedad(n); setOriginalUpdatedAt(n.updated_at); setIsComision(n.es_comision || false); setIsEventoSocial(n.es_evento_social || false); setCurrentView('form'); }} className="text-[10px] bg-slate-100 px-3 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-1.5 border border-slate-200"><Icon name="edit" size={12} /> Editar</button>
                  <button onClick={async () => { if(confirm("¿Eliminar?")){ await sb.from('novedades').delete().eq('id', n.id); await addLog('BORRAR', 'Eliminó ' + n.numero_novedad); loadData(); showNotify("Eliminado"); } }} className="text-[10px] bg-red-50 px-3 py-2 rounded-lg font-bold text-red-600 hover:bg-red-100 transition-all flex items-center gap-1.5 border border-red-200"><Icon name="trash" size={12} /> Eliminar</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // APP
  return (
    <div className="pb-20 min-h-screen bg-slate-300 font-sans">
      <Header userProfile={userProfile} currentView={currentView} setView={v => { setCurrentView(v); setEditingNovedad(null); setIsComision(false); setIsEventoSocial(false); setSearchTerm(''); if(v === 'logs' || v === 'users' || v === 'recordatorios') loadData(); if(v === 'completed') { setCompletedPage(1); loadCompletedPage(1, false); } }} onLogout={handleLogout} onShowStats={async () => { 
                  setShowStats(true); 
                  // Cargar TODAS las completadas para estadísticas precisas
                  const { data } = await sb.from('novedades').select('*').eq('completado', true).order('created_at', { ascending: false });
                  if (data) setCompletedNov(data);
                }} onShowPass={() => setShowPassModal(true)} onShowReport={() => setShowReport(true)} onBackup={handleBackup} pendingCount={totalPending} completedCount={totalCompleted} juiciosCount={filterByTurno(juicios).filter(j => { const fecha = parseFechaJuicio(j.fecha_juicio); if (!fecha) return false; const hoy = new Date(); hoy.setHours(0,0,0,0); return fecha >= hoy; }).length} recordatoriosCount={filterRecordatoriosByVisibility(recordatorios).filter(r => !r.completado).length} stockBajoCount={stockItems.filter(i => i.cantidad <= i.cantidad_minima).length} turnoActivo={turnoActivo} setTurnoActivo={setTurnoActivo} TURNOS={TURNOS} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="max-w-5xl mx-auto px-3 py-4 md:p-8 animate-fadeIn">
        {/* PENDIENTES */}
        {currentView === 'list' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-2xl sm:text-3xl font-black text-slate-800">Pendientes</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Tus tareas primero</p></div>
              {canManageNovedades() && <button onClick={() => setCurrentView('form')} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2"><Icon name="plus" size={16} /> Nuevo</button>}
            </div>
            <SearchAndFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} selectedYear={selectedYear} onYearChange={setSelectedYear} />
            <div className="flex flex-wrap gap-3 mb-6 p-3 bg-white/80 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200"></div><span className="text-xs font-medium text-slate-500">Pendiente tuyo</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></div><span className="text-xs font-medium text-slate-500">Tu tarea lista</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-300 ring-2 ring-slate-100"></div><span className="text-xs font-medium text-slate-500">No asignado</span></div>
            </div>
            {dataLoading ? <Skeleton rows={4} /> : pendingNovedades.length === 0 ? <EmptyState icon="check" title={searchTerm || selectedYear ? 'Sin resultados' : '¡No hay pendientes!'} subtitle={searchTerm || selectedYear ? 'Probá con otros filtros' : 'Todo al día'} isSearch={!!(searchTerm || selectedYear)} /> : <div className="grid gap-3">{pendingNovedades.map(n => <NovedadCard key={n.id} n={n} isCompletedView={false} />)}</div>}
          </div>
        )}

        {/* COMPLETADOS */}
        {currentView === 'completed' && (
          <div className="space-y-4">
            <div className="mb-6"><h2 className="text-2xl sm:text-3xl font-black text-slate-800">Completados</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Tareas finalizadas ({completedTotal})</p></div>
            <SearchAndFilter searchTerm={searchTerm} onSearchChange={(v) => { setSearchTerm(v); }} selectedYear={selectedYear} onYearChange={(v) => { setSelectedYear(v); }} />
            {completedLoading && completedNov.length === 0 ? <Skeleton rows={4} /> : completedNovedades.length === 0 && !completedLoading ? <EmptyState icon="folder" title="Sin completados" subtitle="Las novedades finalizadas aparecerán aquí" /> : (() => {
              const hasMore = completedNov.length < completedTotal;
              return (<>
                <div className="grid gap-3">{completedNovedades.map(n => <NovedadCard key={n.id} n={n} isCompletedView={true} />)}</div>
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button onClick={() => { const nextPage = Math.floor(completedNov.length / COMPLETED_PAGE_SIZE) + 1; loadCompletedPage(nextPage, true); }} disabled={completedLoading} className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
                      {completedLoading ? 'Cargando...' : <><Icon name="chevronDown" size={14} /> Mostrar más ({completedNov.length} de {completedTotal})</>}
                    </button>
                  </div>
                )}
                {!hasMore && completedNov.length > COMPLETED_PAGE_SIZE && (
                  <p className="text-center text-xs text-slate-400 font-bold pt-2">Mostrando todas ({completedTotal})</p>
                )}
              </>);
            })()}
          </div>
        )}

        {/* FORMULARIO (Solo Admin) */}
        {currentView === 'form' && canManageNovedades() && (
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-w-2xl mx-auto border border-slate-200">
            <div className="p-6 sm:p-10 bg-slate-900 text-white flex justify-between items-center">
              <div><h2 className="text-xl sm:text-3xl font-black">{editingNovedad ? 'Editar' : 'Nueva'} Novedad</h2><p className="text-slate-400 text-xs mt-1 font-bold uppercase">Datos de la actuación</p></div>
              <div className="text-4xl">📝</div>
            </div>
            <form className="p-5 sm:p-10 space-y-6 sm:space-y-8" onSubmit={async (e) => {
              e.preventDefault();
              if (saving) return;
              setSaving(true);
              
              const d = new FormData(e.target);
              const num = d.get('nov'), anio = d.get('anio');
              const isDuplicate = await checkDuplicate(num, anio, editingNovedad?.id);
              if (isDuplicate) { showNotify("Ya existe esa novedad en " + anio, "error"); setSaving(false); return; }
              
              const payload = isComision ? {
                numero_novedad: num, 
                numero_sgsp: d.get('sgsp'), 
                anio: parseInt(anio), 
                titulo: d.get('titulo') || null,
                es_comision: true,
                es_evento_social: false,
                comision_carga_sgsp: d.get('comisionCargaSgsp') || null,
                comision_chofer: d.get('comisionChofer') || null,
                comision_acompanante: d.get('comisionAcompanante') || null,
                informe_actuacion: null,
                informe_criminalistico: null,
                informe_pericial: null,
                croquis: null,
                evento_fotografo: null,
                evento_acompanante1: null,
                evento_acompanante2: null,
                evento_acompanante3: null
              } : isEventoSocial ? {
                numero_novedad: num, 
                numero_sgsp: d.get('sgsp') || null, 
                anio: parseInt(anio), 
                titulo: d.get('titulo') || null,
                es_comision: false,
                es_evento_social: true,
                evento_fotografo: d.get('eventoFotografo') || null,
                evento_acompanante1: d.get('eventoAcompanante1') || null,
                evento_acompanante2: d.get('eventoAcompanante2') || null,
                evento_acompanante3: d.get('eventoAcompanante3') || null,
                informe_actuacion: null,
                informe_criminalistico: null,
                informe_pericial: null,
                croquis: null,
                comision_carga_sgsp: null,
                comision_chofer: null,
                comision_acompanante: null
              } : { 
                numero_novedad: num, 
                numero_sgsp: d.get('sgsp'), 
                anio: parseInt(anio), 
                titulo: d.get('titulo') || null, 
                es_comision: false,
                es_evento_social: false,
                informe_actuacion: d.get('ia') || null, 
                informe_criminalistico: d.get('ic') || null, 
                informe_pericial: d.get('ip') || null, 
                croquis: d.get('cr') || null 
              };
              
              try {
                if (editingNovedad) {
                  // Bloqueo optimista: verificar que no cambió
                  if (originalUpdatedAt) {
                    const { data: current } = await sb.from('novedades').select('updated_at').eq('id', editingNovedad.id).single();
                    if (current && current.updated_at !== originalUpdatedAt) {
                      showNotify("Este registro fue modificado por otro usuario. Recargando...", "error");
                      setSaving(false);
                      loadData();
                      setCurrentView('list');
                      return;
                    }
                  }
                  const { error } = await sb.from('novedades').update({ ...payload, modificado_por: userProfile.nombre }).eq('id', editingNovedad.id);
                  if (error) { showNotify("Error al actualizar: " + error.message, "error"); setSaving(false); return; }
                  await addLog('EDITAR', 'Editó ' + num); showNotify("Actualizado");
                } else {
                  const insertPayload = (isComision || isEventoSocial) ? 
                    { ...payload, turno: getTurnoParaGuardar(), creado_por: userProfile.nombre, actuacion_realizada: true, criminalistico_realizado: true, pericial_realizado: true, croquis_realizado: true } :
                    { ...payload, turno: getTurnoParaGuardar(), creado_por: userProfile.nombre, actuacion_realizada: false, criminalistico_realizado: false, pericial_realizado: false, croquis_realizado: false };
                  const { error } = await sb.from('novedades').insert([insertPayload]);
                  if (error) { showNotify("Error al crear: " + error.message, "error"); setSaving(false); return; }
                  await addLog('CREAR', 'Creó ' + num); showNotify("Guardado");
                }
                setEditingNovedad(null);
                setOriginalUpdatedAt(null);
                setIsComision(false);
                setIsEventoSocial(false);
                setCurrentView('list');
                loadData();
              } catch (err) {
                showNotify("Error: " + err.message, "error");
              }
              setSaving(false);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">N° Novedad *</label><input name="nov" defaultValue={editingNovedad?.numero_novedad} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="001" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Año *</label><select name="anio" defaultValue={editingNovedad?.anio || currentYear} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold cursor-pointer">{availableYears.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">N° SGSP *</label><input name="sgsp" defaultValue={editingNovedad?.numero_sgsp} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="SGSP-XXX" /></div>
              </div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Título</label><input name="titulo" defaultValue={editingNovedad?.titulo} className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-2xl font-bold text-emerald-700" placeholder="Descripción breve" /></div>
              
              {/* Checkboxes Comisión y Evento Social */}
              <div className="flex flex-wrap gap-3">
                <div className={`flex items-center gap-3 p-4 rounded-2xl flex-1 min-w-[140px] sm:min-w-[200px] ${isComision ? 'bg-amber-100 border-2 border-amber-400' : 'bg-amber-50 border-2 border-amber-200'}`}>
                  <input type="checkbox" id="esComision" name="esComision" checked={isComision} onChange={(e) => { setIsComision(e.target.checked); if(e.target.checked) setIsEventoSocial(false); }} className="w-5 h-5 rounded accent-amber-500" />
                  <label htmlFor="esComision" className="font-bold text-amber-800 cursor-pointer text-sm">🚗 Comisión</label>
                </div>
                <div className={`flex items-center gap-3 p-4 rounded-2xl flex-1 min-w-[140px] sm:min-w-[200px] ${isEventoSocial ? 'bg-pink-100 border-2 border-pink-400' : 'bg-pink-50 border-2 border-pink-200'}`}>
                  <input type="checkbox" id="esEventoSocial" name="esEventoSocial" checked={isEventoSocial} onChange={(e) => { setIsEventoSocial(e.target.checked); if(e.target.checked) setIsComision(false); }} className="w-5 h-5 rounded accent-pink-500" />
                  <label htmlFor="esEventoSocial" className="font-bold text-pink-800 cursor-pointer text-sm">🎉 Evento Social</label>
                </div>
              </div>
              
              {!isComision && !isEventoSocial ? (
                <div className="space-y-6 pt-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase border-b border-slate-100 pb-3">Asignaciones</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[{ n: 'ia', f: 'informe_actuacion', fOld: 'informeActuacion', l: 'Informe Actuación' }, { n: 'ic', f: 'informe_criminalistico', fOld: 'informeCriminalistico', l: 'Criminalístico' }, { n: 'ip', f: 'informe_pericial', fOld: 'informePericial', l: 'Pericial' }, { n: 'cr', f: 'croquis', fOld: 'croquis', l: 'Croquis' }].map(item => (
                      <div key={item.n} className="space-y-1.5"><label className="text-[10px] font-black text-slate-500 uppercase ml-1">{item.l}</label><select name={item.n} defaultValue={editingNovedad ? (editingNovedad[item.f] || editingNovedad[item.fOld]) : ''} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm cursor-pointer"><option value="">-- Sin asignar --</option>{getProfilesByTurno().map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}</select></div>
                    ))}
                  </div>
                </div>
              ) : isComision ? (
                <div className="space-y-6 pt-4">
                  <h3 className="text-[11px] font-black text-amber-600 uppercase border-b border-amber-200 pb-3">🚗 Datos de Comisión</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-amber-600 uppercase ml-1">Carga SGSP</label>
                      <select name="comisionCargaSgsp" defaultValue={editingNovedad?.comision_carga_sgsp || ''} className="w-full p-4 bg-amber-50 border border-amber-200 rounded-2xl font-bold text-sm cursor-pointer">
                        <option value="">-- Seleccionar --</option>
                        {getProfilesByTurno().map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-amber-600 uppercase ml-1">Chofer</label>
                      <select name="comisionChofer" defaultValue={editingNovedad?.comision_chofer || ''} className="w-full p-4 bg-amber-50 border border-amber-200 rounded-2xl font-bold text-sm cursor-pointer">
                        <option value="">-- Seleccionar --</option>
                        {getProfilesByTurno().map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-amber-600 uppercase ml-1">Acompañante</label>
                      <select name="comisionAcompanante" defaultValue={editingNovedad?.comision_acompanante || ''} className="w-full p-4 bg-amber-50 border border-amber-200 rounded-2xl font-bold text-sm cursor-pointer">
                        <option value="">-- Seleccionar --</option>
                        {getProfilesByTurno().map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pt-4">
                  <h3 className="text-[11px] font-black text-pink-600 uppercase border-b border-pink-200 pb-3">🎉 Datos de Evento Social</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-pink-600 uppercase ml-1">📷 Fotógrafo</label>
                      <select name="eventoFotografo" defaultValue={editingNovedad?.evento_fotografo || ''} className="w-full p-4 bg-pink-50 border border-pink-200 rounded-2xl font-bold text-sm cursor-pointer">
                        <option value="">-- Seleccionar --</option>
                        {getProfilesByTurno().map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-pink-600 uppercase ml-1">👤 Acompañante 1</label>
                      <select name="eventoAcompanante1" defaultValue={editingNovedad?.evento_acompanante1 || ''} className="w-full p-4 bg-pink-50 border border-pink-200 rounded-2xl font-bold text-sm cursor-pointer">
                        <option value="">-- Seleccionar --</option>
                        {getProfilesByTurno().map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-pink-600 uppercase ml-1">👤 Acompañante 2</label>
                      <select name="eventoAcompanante2" defaultValue={editingNovedad?.evento_acompanante2 || ''} className="w-full p-4 bg-pink-50 border border-pink-200 rounded-2xl font-bold text-sm cursor-pointer">
                        <option value="">-- Seleccionar --</option>
                        {getProfilesByTurno().map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-pink-600 uppercase ml-1">👤 Acompañante 3</label>
                      <select name="eventoAcompanante3" defaultValue={editingNovedad?.evento_acompanante3 || ''} className="w-full p-4 bg-pink-50 border border-pink-200 rounded-2xl font-bold text-sm cursor-pointer">
                        <option value="">-- Seleccionar --</option>
                        {getProfilesByTurno().map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-4 pt-10">
                <button type="button" onClick={() => { setCurrentView('list'); setOriginalUpdatedAt(null); setIsComision(false); setIsEventoSocial(false); }} disabled={saving} className="flex-1 p-5 bg-slate-200 rounded-[1.5rem] font-black text-slate-600 uppercase text-xs disabled:opacity-50">Cancelar</button>
                <button disabled={saving} className="flex-1 p-5 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase text-xs shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Guardando...</> : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* USUARIOS (Admin) */}
        {currentView === 'users' && canManageUsers() && (
          <div className="space-y-6">
            {/* Si hay usuario seleccionado para editar, mostrar pantalla completa de edición */}
            {editingProfile ? (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => { setEditingProfile(null); setEditPermisos({}); }} className="p-2 bg-slate-200 rounded-xl hover:bg-slate-300 transition-all"><Icon name="chevronDown" size={18} className="rotate-90" /></button>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">{editingProfile.isSelf ? 'Mi Perfil' : `Editar: ${editingProfile.nombre}`}</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase">{ROLES[editingProfile.role]?.label} {!['admin','supervisor'].includes(editingProfile.role) ? `• ${editingProfile.turno === 4 ? 'Zona Oeste' : TURNOS[editingProfile.turno] || 'T1'}` : ''}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Columna izquierda: Datos del usuario */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4" style={{boxShadow:'var(--shadow-card)'}}>
                      <h3 className="text-sm font-black text-slate-700 uppercase">Datos</h3>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const nombre = e.target.nombre.value.trim();
                        if (!nombre) return;
                        await sb.from('profiles').update({ nombre }).eq('id', editingProfile.id);
                        await addLog('EDITAR_USUARIO', `Cambió nombre de ${editingProfile.nombre} a ${nombre}`);
                        showNotify("Nombre actualizado");
                        setEditingProfile({...editingProfile, nombre});
                        loadData();
                      }}>
                        <div className="space-y-1.5 mb-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase">Nombre</label>
                          <div className="flex gap-2">
                            <input name="nombre" defaultValue={editingProfile.nombre} required className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" />
                            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-xs hover:bg-emerald-600">OK</button>
                          </div>
                        </div>
                      </form>
                      
                      {!editingProfile.isSelf && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase">Login</label>
                            <div className="flex gap-2">
                              <input value={editLoginVal} onChange={(e) => setEditLoginVal(e.target.value)} className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" />
                              <button type="button" onClick={async () => {
                                const newLogin = editLoginVal.trim().toLowerCase();
                                if (!newLogin) return;
                                if (newLogin === editingProfile.email?.split('@')[0]) { showNotify("Es el mismo", "error"); return; }
                                try {
                                  const { error } = await sb.rpc('admin_update_user_email', { user_id: editingProfile.id, new_email: newLogin + '@local.com' });
                                  if (error) { showNotify("Error: " + error.message, "error"); return; }
                                  await sb.from('profiles').update({ email: newLogin + '@local.com' }).eq('id', editingProfile.id);
                                  await addLog('CAMBIO_LOGIN', `${editingProfile.nombre}: → ${newLogin}`);
                                  showNotify("Login actualizado");
                                  loadData();
                                } catch (err) { showNotify("Error: " + err.message, "error"); }
                              }} className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold text-xs hover:bg-blue-600">OK</button>
                            </div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase">Turno</label>
                            <select value={String(editingProfile.turno || 1)} onChange={async (e) => {
                              const t = parseInt(e.target.value, 10);
                              try {
                                const { error } = await sb.from('profiles').update({ turno: t }).eq('id', editingProfile.id).select();
                                if (error) { showNotify("Error: " + error.message, "error"); return; }
                                await addLog('CAMBIO_TURNO', `${editingProfile.nombre} → ${TURNOS[t]}`);
                                showNotify("Turno cambiado");
                                setEditingProfile({...editingProfile, turno: t});
                                loadData();
                              } catch (err) { showNotify("Error: " + err.message, "error"); }
                            }} className="w-full p-3 bg-indigo-50 border border-indigo-200 rounded-xl font-bold text-sm text-indigo-700 cursor-pointer">
                              <option value="1">1er Turno</option>
                              <option value="2">2do Turno</option>
                              <option value="3">3er Turno</option>
                              <option value="4">Zona Oeste</option>
                            </select>
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase">Nueva Contraseña</label>
                            <div className="flex gap-2">
                              <input value={editPassVal} onChange={(e) => setEditPassVal(e.target.value)} type="password" placeholder="Min. 6 caracteres" className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" />
                              <button type="button" onClick={async () => {
                                if (!editPassVal || editPassVal.length < 6) { showNotify("Mínimo 6 caracteres", "error"); return; }
                                try {
                                  const { error } = await sb.rpc('admin_update_user_password', { target_user_id: editingProfile.id, new_password: editPassVal });
                                  if (error) { showNotify("Error: " + error.message, "error"); return; }
                                  await addLog('CAMBIO_PASS_ADMIN', `Cambió contraseña de ${editingProfile.nombre}`);
                                  showNotify("Contraseña actualizada");
                                  setEditPassVal('');
                                } catch (err) { showNotify("Error: " + err.message, "error"); }
                              }} className="px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-xs hover:bg-amber-600">OK</button>
                            </div>
                          </div>
                        </>
                      )}
                      {editingProfile.isSelf && (
                        <p className="text-xs text-slate-400 italic">Solo podés cambiar tu nombre. Para cambiar contraseña usá el botón 🔑 del header.</p>
                      )}
                    </div>
                    
                    {/* Eliminar usuario */}
                    {!editingProfile.isSelf && (
                      <button onClick={async () => {
                        if (!confirm(`¿Eliminar "${editingProfile.nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
                        try {
                          const { error } = await sb.rpc('admin_delete_user', { target_user_id: editingProfile.id });
                          if (error) { showNotify("Error: " + error.message, "error"); return; }
                          await addLog('ELIMINAR_USUARIO', `Eliminó: ${editingProfile.nombre}`);
                          showNotify("Usuario eliminado");
                          setEditingProfile(null);
                          loadData();
                        } catch (err) { showNotify("Error: " + err.message, "error"); }
                      }} className="w-full py-3 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all">
                        Eliminar usuario permanentemente
                      </button>
                    )}
                  </div>

                  {/* Columna derecha: Permisos (2 columnas de ancho) */}
                  {!editingProfile.isSelf && (
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5" style={{boxShadow:'var(--shadow-card)'}}>
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-sm font-black text-slate-700 uppercase">Permisos</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-lg ${ROLES[detectRole(editPermisos)]?.color || 'bg-slate-500'} text-white`}>
                            {ROLES[detectRole(editPermisos)]?.label || 'Personalizado'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Plantillas rápidas */}
                      <div className="mb-5">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Cargar plantilla:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(PERM_TEMPLATES).map(([name, preset]) => (
                            <button key={name} onClick={() => setEditPermisos({...preset})} className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 bg-white border-slate-200 text-slate-600 hover:border-slate-400 flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${PERM_TEMPLATE_COLORS[name]}`}></span>{name}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Grid de permisos por grupo */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Novedades', 'Módulos', 'Administración', 'Sistema'].map(group => (
                          <div key={group} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase mb-3 border-b border-slate-200 pb-2">{group}</h4>
                            <div className="space-y-2">
                              {PERMISSION_KEYS.filter(pk => pk.group === group).map(pk => {
                                const checked = !!editPermisos[pk.key];
                                return (
                                  <label key={pk.key} className="flex items-center gap-3 cursor-pointer select-none group py-0.5">
                                    <div 
                                      onClick={() => setEditPermisos(prev => ({...prev, [pk.key]: !prev[pk.key]}))} 
                                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white group-hover:border-emerald-400'}`}
                                    >
                                      {checked && <span className="text-white text-[10px] font-bold">✓</span>}
                                    </div>
                                    <span className={`text-xs font-semibold ${checked ? 'text-slate-800' : 'text-slate-400'}`}>{pk.label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Botón guardar permisos */}
                      <div className="flex gap-3 mt-5 pt-5 border-t border-slate-200">
                        <button onClick={async () => {
                          const newRole = detectRole(editPermisos);
                          try {
                            const { error } = await sb.from('profiles').update({ permisos: editPermisos, role: newRole }).eq('id', editingProfile.id);
                            if (error) { showNotify("Error: " + error.message, "error"); return; }
                            await addLog('CAMBIO_PERMISOS', `${editingProfile.nombre} → ${ROLES[newRole]?.label} (${Object.keys(editPermisos).filter(k => editPermisos[k]).length} permisos)`);
                            showNotify("Permisos guardados — Rol: " + (ROLES[newRole]?.label || newRole));
                            setEditingProfile({...editingProfile, role: newRole, permisos: editPermisos});
                            loadData();
                          } catch (err) { showNotify("Error: " + err.message, "error"); }
                        }} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase text-xs shadow-lg transition-all flex items-center justify-center gap-2">
                          <Icon name="check" size={16} /> Guardar Permisos
                        </button>
                        <button onClick={() => { setEditingProfile(null); setEditPermisos({}); }} className="px-8 py-4 bg-slate-200 text-slate-600 rounded-xl font-black uppercase text-xs hover:bg-slate-300 transition-all">
                          Volver
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Lista de usuarios */}
                <div className="flex justify-between items-end mb-8">
                  <div><h2 className="text-2xl sm:text-3xl font-black text-slate-800">Personal</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Usuarios del sistema</p></div>
                  <button onClick={() => setShowNewUser(true)} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2"><Icon name="plus" size={16} /> Nuevo</button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedUserTurno(0)} className={`px-4 py-2 rounded-xl text-sm font-bold ${selectedUserTurno === 0 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}>Todos</button>
                    {[1, 2, 3, 4].map(t => (
                      <button key={t} onClick={() => setSelectedUserTurno(t)} className={`px-4 py-2 rounded-xl text-sm font-bold ${selectedUserTurno === t ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{t === 4 ? 'ZO' : `T${t}`}</button>
                    ))}
                  </div>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Icon name="search" size={14} className="text-slate-400" /></div>
                    <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Buscar por nombre..." className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500" />
                    {userSearch && <button onClick={() => setUserSearch('')} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"><Icon name="x" size={14} /></button>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profiles.filter(p => {
                    if (selectedUserTurno !== 0 && p.turno !== selectedUserTurno) return false;
                    if (userSearch.trim()) return (p.nombre || '').toLowerCase().includes(userSearch.toLowerCase());
                    return true;
                  }).map(p => {
                    const roleInfo = ROLES[p.role] || ROLES.user;
                    const permCount = p.permisos ? Object.values(p.permisos).filter(Boolean).length : 0;
                    return (
                      <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 card-lift" style={{boxShadow:'var(--shadow-card)'}}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center font-black text-lg ${roleInfo.color}`}>{p.nombre?.charAt(0).toUpperCase()}</div>
                            <div>
                              <div className="font-black text-slate-800">{p.nombre}</div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded ${roleInfo.color} text-white text-[8px]`}>{roleInfo.label}</span>
                                {!p.permisos?.ver_todos_turnos && (
                                  <span className="px-2 py-0.5 rounded bg-indigo-500 text-white text-[8px]">{p.turno === 4 ? 'ZO' : `T${p.turno || 1}`}</span>
                                )}
                                {permCount > 0 && <span className="text-[8px] text-slate-400">{permCount} permisos</span>}
                              </div>
                            </div>
                          </div>
                          <button onClick={() => {
                            const isMe = p.id === userProfile.id;
                            const profile = isMe ? {...p, isSelf: true} : p;
                            setEditingProfile(profile);
                            setEditPermisos(p.permisos || (p.role === 'admin' ? PERM_TEMPLATES['Acceso total'] : PERM_TEMPLATES['Básico']));
                            setEditLoginVal(p.email?.split('@')[0] || '');
                            setEditPassVal('');
                          }} className="text-[10px] bg-slate-100 px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-1.5">
                            <Icon name="edit" size={12} /> {p.id === userProfile.id ? 'Mi Perfil' : 'Editar'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* MODAL NUEVO USUARIO */}

        {/* MODAL NUEVO USUARIO */}
        {showNewUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "var(--bg-modal-overlay)", backdropFilter: "blur(12px)" }} onClick={() => setShowNewUser(false)}>
            <div className="bg-white w-full max-w-sm rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
              <div className="p-5 sm:p-8 bg-emerald-600 text-white flex justify-between items-center">
                <h3 className="font-black uppercase text-sm">➕ Nuevo Usuario</h3>
                <button onClick={() => setShowNewUser(false)} className="text-emerald-200 hover:text-white">✕</button>
              </div>
              <form className="p-8 space-y-5" onSubmit={async (e) => {
                e.preventDefault();
                if (saving) return;
                setSaving(true);
                
                const nombre = e.target.nombre.value.trim();
                const login = e.target.login.value.trim().toLowerCase();
                const password = e.target.password.value;
                const role = e.target.role.value;
                const turno = parseInt(e.target.turno.value, 10) || 1;
                
                if (!nombre || !login || !password) {
                  showNotify("Completá todos los campos", "error");
                  setSaving(false);
                  return;
                }
                if (password.length < 6) {
                  showNotify("La contraseña debe tener al menos 6 caracteres", "error");
                  setSaving(false);
                  return;
                }
                
                const email = login + '@local.com';
                
                try {
                  // Crear usuario usando función SQL
                  const { data: newUserId, error: createError } = await sb.rpc('admin_create_user', {
                    p_email: email,
                    p_password: password,
                    p_nombre: nombre,
                    p_role: role
                  });
                  
                  if (createError) {
                    showNotify("Error: " + createError.message, "error");
                    setSaving(false);
                    return;
                  }
                  
                  // Actualizar turno del usuario
                  if (newUserId) {
                    const { data: updateData, error: turnoError } = await sb.from('profiles').update({ turno }).eq('id', newUserId).select();
                    if (turnoError) {
                      console.error("Error al asignar turno:", turnoError);
                      showNotify("Usuario creado pero error al asignar turno: " + turnoError.message, "error");
                    }
                  }
                  
                  await addLog('CREAR_USUARIO', `Creó usuario: ${nombre} (${role}) - T${turno}`);
                  showNotify("Usuario creado correctamente");
                  setShowNewUser(false);
                  loadData();
                } catch (err) {
                  showNotify("Error: " + err.message, "error");
                }
                setSaving(false);
              }}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre completo *</label>
                  <input name="nombre" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Juan Pérez" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Usuario (login) *</label>
                  <input name="login" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="juanperez" />
                  <p className="text-[9px] text-slate-400 ml-1">Solo letras y números, sin espacios</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Contraseña *</label>
                  <input name="password" type="password" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Mínimo 6 caracteres" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rol</label>
                  <select name="role" defaultValue="user" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold cursor-pointer">
                    <option value="user">Usuario (solo ver y completar sus tareas)</option>
                    <option value="moderator">Moderador (gestionar novedades de su turno)</option>
                    <option value="moderadorplus">Moderador+ (moderador + gestión de stock)</option>
                    <option value="encargado">Encargado (supervisor de su turno)</option>
                    <option value="supervisor">Supervisor (acceso a todos los turnos)</option>
                    <option value="admin">Administrador (acceso total + usuarios)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-500 uppercase ml-1">Turno Asignado</label>
                  <select name="turno" defaultValue="1" className="w-full p-4 bg-indigo-50 border border-indigo-200 rounded-2xl font-bold cursor-pointer text-indigo-700">
                    <option value="1">1er Turno</option>
                    <option value="2">2do Turno</option>
                    <option value="3">3er Turno</option>
                      <option value="4">Zona Oeste</option>
                  </select>
                  <p className="text-[9px] text-slate-400 ml-1">Admin y Supervisor ven todos los turnos automáticamente</p>
                </div>
                <button type="submit" disabled={saving} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Creando...</> : 'Crear Usuario'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* LOGS (Admin) */}
        {currentView === 'logs' && canSeeLogs() && (
          <div className="space-y-4">
            <div className="flex justify-between items-start mb-6">
              <div><h2 className="text-2xl sm:text-3xl font-black text-slate-800">Auditoría</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Registro de actividad</p></div>
              <button onClick={() => {
                const filteredLogs = logs.filter(l => {
                  if (logsFilterUser !== 'todos' && l.user_nombre !== logsFilterUser) return false;
                  if (logsFilterAction !== 'todos' && !l.action?.includes(logsFilterAction)) return false;
                  return true;
                });
                const rows = filteredLogs.map(l => [
                  new Date(l.created_at).toLocaleString(),
                  l.user_nombre || 'Sistema',
                  l.action,
                  l.details || ''
                ]);
                exportCSV(`auditoria_${new Date().toISOString().split('T')[0]}.csv`, ['Fecha', 'Usuario', 'Acción', 'Detalle'], rows);
                showNotify("CSV exportado");
              }} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"><Icon name="save" size={14} /> Exportar CSV</button>
            </div>
            
            {/* Pestañas de auditoría */}
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setAuditView('logs')}
                className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${auditView === 'logs' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                📜 Logs de Actividad
              </button>
              <button 
                onClick={() => setAuditView('tareas')}
                className={`px-6 py-3 rounded-2xl font-black text-sm transition-all ${auditView === 'tareas' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                ✅ Tareas Completadas
              </button>
            </div>
            
            {/* Vista de Tareas Completadas */}
            {auditView === 'tareas' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Usuario</label>
                      <select 
                        value={logsFilterUser} 
                        onChange={(e) => setLogsFilterUser(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                      >
                        <option value="todos">Todos los usuarios</option>
                        {getProfilesByTurno().map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Año</label>
                      <select 
                        value={printYear} 
                        onChange={(e) => setPrintYear(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                      >
                        <option value="todos">Todos los años</option>
                        {getAvailableStatsYears().map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Lista de tareas completadas por usuario */}
                {(() => {
                  const usersToShow = logsFilterUser === 'todos' ? profiles : profiles.filter(p => p.nombre === logsFilterUser);
                  
                  return usersToShow.map(p => {
                    // Filtrar novedades completadas por este usuario
                    let userNovedades = novedades.filter(n => {
                      const ia = n.informe_actuacion || n.informeActuacion;
                      const ic = n.informe_criminalistico || n.informeCriminalistico;
                      const ip = n.informe_pericial || n.informePericial;
                      const cr = n.croquis;
                      
                      // Verificar si tiene alguna tarea completada
                      const completedTasks = [];
                      if (ia === p.nombre && (n.actuacion_realizada || n.checks?.actuacionRealizada)) {
                        completedTasks.push({ tipo: 'Informe Actuación', novedad: n });
                      }
                      if (ic === p.nombre && (n.criminalistico_realizado || n.checks?.criminalisticoRealizado)) {
                        completedTasks.push({ tipo: 'Criminalístico', novedad: n });
                      }
                      if (ip === p.nombre && (n.pericial_realizado || n.checks?.pericialRealizado)) {
                        completedTasks.push({ tipo: 'Pericial', novedad: n });
                      }
                      if (cr === p.nombre && (n.croquis_realizado || n.checks?.croquisRealizado)) {
                        completedTasks.push({ tipo: 'Croquis', novedad: n });
                      }
                      
                      return completedTasks.length > 0;
                    });
                    
                    // Filtrar por año si aplica
                    if (printYear !== 'todos') {
                      userNovedades = userNovedades.filter(n => n.anio?.toString() === printYear);
                    }
                    
                    // Obtener lista detallada de tareas completadas
                    const completedTasksList = [];
                    userNovedades.forEach(n => {
                      const ia = n.informe_actuacion || n.informeActuacion;
                      const ic = n.informe_criminalistico || n.informeCriminalistico;
                      const ip = n.informe_pericial || n.informePericial;
                      const cr = n.croquis;
                      
                      if (ia === p.nombre && (n.actuacion_realizada || n.checks?.actuacionRealizada)) {
                        completedTasksList.push({ tipo: 'Informe Actuación', novedad: n.numero_novedad, anio: n.anio, sgsp: n.numero_sgsp });
                      }
                      if (ic === p.nombre && (n.criminalistico_realizado || n.checks?.criminalisticoRealizado)) {
                        completedTasksList.push({ tipo: 'Criminalístico', novedad: n.numero_novedad, anio: n.anio, sgsp: n.numero_sgsp });
                      }
                      if (ip === p.nombre && (n.pericial_realizado || n.checks?.pericialRealizado)) {
                        completedTasksList.push({ tipo: 'Pericial', novedad: n.numero_novedad, anio: n.anio, sgsp: n.numero_sgsp });
                      }
                      if (cr === p.nombre && (n.croquis_realizado || n.checks?.croquisRealizado)) {
                        completedTasksList.push({ tipo: 'Croquis', novedad: n.numero_novedad, anio: n.anio, sgsp: n.numero_sgsp });
                      }
                    });
                    
                    const roleColor = p.role === 'admin' ? 'bg-red-600' : 'bg-slate-700';
                    
                    return (
                      <div key={p.id} className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                        <div className={`${roleColor} text-white p-4 flex justify-between items-center`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-lg">
                              {p.nombre?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-black">{p.nombre}</h3>
                              <p className="text-xs opacity-80">{p.role === 'admin' ? 'Administrador' : p.role === 'moderator' ? 'Moderador' : 'Usuario'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black">{completedTasksList.length}</div>
                            <div className="text-[10px] opacity-80 uppercase">Tareas completadas</div>
                          </div>
                        </div>
                        
                        {completedTasksList.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 italic">
                            Sin tareas completadas {printYear !== 'todos' ? `en ${printYear}` : ''}
                          </div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50 sticky top-0">
                                <tr>
                                  <th className="p-3 text-left font-bold text-slate-600">Tipo</th>
                                  <th className="p-3 text-left font-bold text-slate-600">Novedad</th>
                                  <th className="p-3 text-left font-bold text-slate-600">Año</th>
                                  <th className="p-3 text-left font-bold text-slate-600">SGSP</th>
                                </tr>
                              </thead>
                              <tbody>
                                {completedTasksList.map((t, i) => (
                                  <tr key={i} className="border-b border-slate-100 hover:bg-emerald-50">
                                    <td className="p-3">
                                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-bold">
                                        ✓ {t.tipo}
                                      </span>
                                    </td>
                                    <td className="p-3 font-bold">{t.novedad}</td>
                                    <td className="p-3">{t.anio || '-'}</td>
                                    <td className="p-3 text-slate-500">{t.sgsp}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            )}
            
            {/* Vista de Logs */}
            {auditView === 'logs' && (
              <>
            {/* Filtros de logs */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Usuario</label>
                  <select 
                    value={logsFilterUser} 
                    onChange={(e) => setLogsFilterUser(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="todos">Todos los usuarios</option>
                    {profiles.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tipo de acción</label>
                  <select 
                    value={logsFilterAction} 
                    onChange={(e) => setLogsFilterAction(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="todos">Todas las acciones</option>
                    <option value="LOGIN">Inicios de sesión</option>
                    <option value="LOGOUT">Cierres de sesión</option>
                    <option value="LOGIN_FALLIDO">Intentos fallidos</option>
                    <option value="CREAR">Creación de novedades</option>
                    <option value="EDITAR">Edición de novedades</option>
                    <option value="BORRAR">Eliminación</option>
                    <option value="CHECK">Tareas completadas</option>
                  </select>
                </div>
                <div className="flex items-end">
                  {(logsFilterUser !== 'todos' || logsFilterAction !== 'todos') && (
                    <button 
                      onClick={() => { setLogsFilterUser('todos'); setLogsFilterAction('todos'); }}
                      className="w-full p-3 bg-red-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-200"
                    >
                      ✕ Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {(() => {
              let filteredLogs = logs;
              if (logsFilterUser !== 'todos') {
                filteredLogs = filteredLogs.filter(l => l.user_nombre === logsFilterUser);
              }
              if (logsFilterAction !== 'todos') {
                filteredLogs = filteredLogs.filter(l => l.action === logsFilterAction || l.action?.includes(logsFilterAction));
              }
              
              return filteredLogs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200"><p className="text-slate-500 font-bold">Sin registros</p></div>
              ) : (
                <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-md">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600">
                    Mostrando {filteredLogs.length} de {logs.length} registros
                  </div>
                  <div className="max-h-[600px] overflow-y-auto">
                    {filteredLogs.map((log, i) => {
                      const isFailed = log.action === 'LOGIN_FALLIDO';
                      const isLogin = log.action === 'LOGIN';
                      const isLogout = log.action === 'LOGOUT';
                      const isCheck = log.action?.includes('CHECK') || log.details?.includes('completó') || log.details?.includes('desmarcó');
                      return (
                        <div key={log.id || i} className={`p-5 border-b border-slate-100 last:border-0 flex items-start gap-4 ${isFailed ? 'bg-red-50' : isCheck ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0 ${isFailed ? 'bg-red-200' : isLogin ? 'bg-emerald-200' : isLogout ? 'bg-amber-200' : isCheck ? 'bg-emerald-300' : 'bg-slate-200'}`}>
                            {isLogin ? '🔓' : isLogout ? '🚪' : isFailed ? '🚫' : isCheck ? '✓' : '📝'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-black text-sm ${isFailed ? 'text-red-700' : 'text-slate-800'}`}>{log.user_nombre || 'Sistema'}</span>
                              {isFailed && <span className="text-[9px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full">⚠️ ALERTA</span>}
                              {isLogin && <span className="text-[9px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded-full">INGRESO</span>}
                              {isLogout && <span className="text-[9px] font-black text-white bg-amber-500 px-2 py-0.5 rounded-full">SALIDA</span>}
                            </div>
                            <p className={`text-xs mt-1 ${isFailed ? 'text-red-600' : 'text-slate-600'}`}>{log.details}</p>
                            <span className="text-[9px] text-slate-400 font-bold uppercase mt-2 inline-block">{log.action} • {new Date(log.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
              </>
            )}
          </div>
        )}

        {/* JUICIOS (Todos pueden acceder) */}
        {currentView === 'juicios' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-2xl sm:text-3xl font-black text-slate-800">⚖️ Juicios</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">{canSeeAllTurnos() ? 'Todas las citaciones' : 'Citaciones de tu turno'}</p></div>
              {canManageJuicios() && (
                <button onClick={() => { setEditingJuicio({}); setSelectedCitados([]); }} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2"><Icon name="plus" size={16} /> Nuevo Juicio</button>
              )}
            </div>
            
            {/* Formulario de nuevo/editar juicio */}
            {editingJuicio && canManageJuicios() && (
              <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-200 mb-6">
                <h3 className="text-lg font-black text-slate-800 mb-6">{editingJuicio.id ? 'Editar' : 'Nuevo'} Juicio</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (saving) return;
                  setSaving(true);
                  
                  const d = new FormData(e.target);
                  const fechaRaw = d.get('fecha');
                  // Agregar hora para evitar problemas de zona horaria
                  const fechaCorregida = fechaRaw ? fechaRaw + 'T12:00:00' : null;
                  
                  const payload = {
                    numero_novedad: d.get('nov') || null,
                    numero_sgsp: d.get('sgsp') || null,
                    iue: d.get('iue') || null,
                    descripcion: d.get('desc') || null,
                    fecha_juicio: fechaCorregida,
                    citados: selectedCitados,
                    creado_por: userProfile.nombre,
                    turno: getTurnoParaGuardar()
                  };
                  if (!fechaRaw) {
                    showNotify("La fecha es obligatoria", "error");
                    setSaving(false);
                    return;
                  }
                  if (selectedCitados.length === 0) {
                    showNotify("Debes seleccionar al menos un citado", "error");
                    setSaving(false);
                    return;
                  }
                  try {
                    if (editingJuicio.id) {
                      // Bloqueo optimista
                      if (originalUpdatedAt) {
                        const { data: current } = await sb.from('juicios').select('updated_at').eq('id', editingJuicio.id).single();
                        if (current && current.updated_at !== originalUpdatedAt) {
                          showNotify("Este registro fue modificado por otro usuario. Recargando...", "error");
                          setSaving(false);
                          loadData();
                          setEditingJuicio(null);
                          setSelectedCitados([]);
                          setOriginalUpdatedAt(null);
                          return;
                        }
                      }
                      const { error } = await sb.from('juicios').update(payload).eq('id', editingJuicio.id);
                      if (error) { showNotify("Error: " + error.message, "error"); setSaving(false); return; }
                      await addLog('EDITAR_JUICIO', 'Editó juicio' + (payload.numero_novedad ? ' Nov. ' + payload.numero_novedad : '') + (payload.iue ? ' IUE: ' + payload.iue : ''));
                      showNotify("Juicio actualizado");
                    } else {
                      const { error } = await sb.from('juicios').insert([payload]);
                      if (error) { showNotify("Error: " + error.message, "error"); setSaving(false); return; }
                      await addLog('CREAR_JUICIO', 'Creó juicio' + (payload.numero_novedad ? ' Nov. ' + payload.numero_novedad : '') + (payload.iue ? ' IUE: ' + payload.iue : ''));
                      showNotify("Juicio guardado");
                    }
                    setEditingJuicio(null);
                    setSelectedCitados([]);
                    setOriginalUpdatedAt(null);
                    loadData();
                  } catch (err) {
                    showNotify("Error: " + err.message, "error");
                  }
                  setSaving(false);
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">N° Novedad</label>
                      <input name="nov" defaultValue={editingJuicio.numero_novedad} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="001" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">N° SGSP</label>
                      <input name="sgsp" defaultValue={editingJuicio.numero_sgsp} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="SGSP-XXX" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">IUE</label>
                      <input name="iue" defaultValue={editingJuicio.iue} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="IUE-XXX" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fecha *</label>
                      <input name="fecha" type="date" defaultValue={editingJuicio.fecha_juicio?.split('T')[0]} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Descripción</label>
                    <textarea name="desc" defaultValue={editingJuicio.descripcion} rows="3" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold resize-none" placeholder="Detalles de la citación..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Citados *</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex flex-wrap gap-2">
                        {getProfilesByTurno().map(p => {
                          const isSelected = selectedCitados.includes(p.nombre);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedCitados(selectedCitados.filter(c => c !== p.nombre));
                                } else {
                                  setSelectedCitados([...selectedCitados, p.nombre]);
                                }
                              }}
                              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isSelected ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white border border-slate-300 text-slate-600 hover:border-emerald-400'}`}
                            >
                              {isSelected && '✓ '}{p.nombre}
                            </button>
                          );
                        })}
                      </div>
                      {selectedCitados.length > 0 && (
                        <p className="text-xs text-emerald-600 font-bold mt-3">{selectedCitados.length} persona(s) seleccionada(s)</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => { setEditingJuicio(null); setSelectedCitados([]); setOriginalUpdatedAt(null); }} disabled={saving} className="flex-1 py-4 bg-slate-200 text-slate-700 rounded-2xl font-black uppercase text-xs disabled:opacity-50">Cancelar</button>
                    <button type="submit" disabled={saving} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
                      {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Guardando...</> : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lista de juicios */}
            {(() => {
              // Filtrar juicios: admin/supervisor ven todos, otros solo su turno o donde están citados
              const juiciosPorTurno = filterByTurno(juicios);
              const juiciosVisibles = canSeeAllTurnos() 
                ? juicios 
                : canManageJuicios() 
                  ? juiciosPorTurno 
                  : juiciosPorTurno.filter(j => (j.citados || []).includes(userProfile?.nombre));
              
              if (juiciosVisibles.length === 0) {
                return (
                  <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-300">
                    <div className="text-5xl mb-4">⚖️</div>
                    <p className="text-slate-500 font-bold">{canSeeAllTurnos() ? 'No hay juicios programados' : 'No tienes citaciones pendientes'}</p>
                  </div>
                );
              }
              
              return (
                <div className="grid gap-4">
                  {juiciosVisibles.map(j => {
                    // Corregir fecha para evitar problemas de zona horaria
                    const fechaStr = j.fecha_juicio?.split('T')[0];
                    const [year, month, day] = fechaStr ? fechaStr.split('-').map(Number) : [0,0,0];
                    const fecha = new Date(year, month - 1, day);
                    const hoy = new Date();
                    hoy.setHours(0,0,0,0);
                    fecha.setHours(0,0,0,0);
                    const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
                    const isPast = diasRestantes < 0;
                    const isClose = diasRestantes >= 0 && diasRestantes <= 5;
                    const citados = j.citados || [];
                    // Admin puede todo, moderator solo los que creó, user nada
                    const canEdit = canEditJuicio(j);
                    const isMe = citados.includes(userProfile?.nombre);
                    
                    // Título dinámico
                    const titulo = j.numero_novedad ? `Novedad ${j.numero_novedad}` : j.iue ? `IUE: ${j.iue}` : 'Juicio';
                    
                    return (
                      <div key={j.id} className={`bg-white rounded-2xl p-6 shadow-md border-2 ${isPast ? 'border-slate-300 opacity-60' : isClose ? 'border-amber-400' : 'border-slate-200'} ${isMe && !isPast ? 'ring-2 ring-blue-400' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{isPast ? '📁' : isClose ? '⚠️' : '⚖️'}</span>
                              <div>
                                <h3 className="font-black text-slate-800 text-lg">{titulo}</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {j.numero_sgsp && <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">SGSP: {j.numero_sgsp}</span>}
                                  {j.iue && <span className="text-[10px] text-purple-600 bg-purple-100 px-2 py-0.5 rounded font-bold">IUE: {j.iue}</span>}
                                </div>
                              </div>
                              {isMe && !isPast && <span className="text-[9px] bg-blue-500 text-white px-2 py-1 rounded-full font-black uppercase">Estás citado</span>}
                            </div>
                            {j.descripcion && <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl">{j.descripcion}</p>}
                            {citados.length > 0 && (
                              <div className="mt-3">
                                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Citados:</p>
                                <div className="flex flex-wrap gap-1">
                                  {citados.map((c, i) => (
                                    <span key={i} className={`text-xs px-2 py-1 rounded-lg font-bold ${c === userProfile?.nombre ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>{c}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <p className="text-[9px] text-slate-400 mt-3 uppercase font-bold">Cargado por: {j.creado_por}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-bold text-slate-700">{fecha.toLocaleDateString()}</p>
                            <p className={`text-xs font-black mt-1 ${isPast ? 'text-slate-400' : isClose ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {isPast ? 'Pasado' : diasRestantes === 0 ? '¡HOY!' : diasRestantes === 1 ? 'Mañana' : `En ${diasRestantes} días`}
                            </p>
                            {canEdit && (
                              <div className="flex gap-2 mt-3 justify-end">
                                <button onClick={() => { setEditingJuicio(j); setSelectedCitados(j.citados || []); setOriginalUpdatedAt(j.updated_at); }} className="text-[10px] bg-slate-200 px-3 py-1.5 rounded-lg font-black text-slate-700 hover:bg-slate-300">Editar</button>
                                <button onClick={async () => {
                                  if (confirm("¿Eliminar este juicio?")) {
                                    await sb.from('juicios').delete().eq('id', j.id);
                                    await addLog('BORRAR_JUICIO', 'Eliminó juicio' + (j.numero_novedad ? ' Nov. ' + j.numero_novedad : '') + (j.iue ? ' IUE: ' + j.iue : ''));
                                    showNotify("Juicio eliminado");
                                    loadData();
                                  }
                                }} className="text-[10px] bg-red-100 px-3 py-1.5 rounded-lg font-black text-red-600 hover:bg-red-200">Eliminar</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* RECORDATORIOS */}
        {currentView === 'recordatorios' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-2xl sm:text-3xl font-black text-slate-800">🔔 Recordatorios</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Tareas y eventos pendientes</p></div>
              <button onClick={() => setEditingRecordatorio({})} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2"><Icon name="plus" size={16} /> Nuevo</button>
            </div>
            
            {/* Formulario de nuevo/editar recordatorio */}
            {editingRecordatorio && (
              <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-200 mb-6">
                <h3 className="text-lg font-black text-slate-800 mb-6">{editingRecordatorio.id ? 'Editar' : 'Nuevo'} Recordatorio</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (saving) return;
                  setSaving(true);
                  
                  const d = new FormData(e.target);
                  const fecha = d.get('fecha');
                  const hora = d.get('hora') || '09:00';
                  const titulo = d.get('titulo');
                  const recTurno = parseInt(d.get('recTurno') || '0', 10);
                  
                  if (!titulo) {
                    showNotify("El título es obligatorio", "error");
                    setSaving(false);
                    return;
                  }
                  if (!fecha) {
                    showNotify("La fecha es obligatoria", "error");
                    setSaving(false);
                    return;
                  }
                  
                  const fechaHora = new Date(`${fecha}T${hora}`);
                  
                  const payload = {
                    titulo: titulo,
                    descripcion: d.get('descripcion') || null,
                    fecha_hora: fechaHora.toISOString(),
                    creado_por: session.user.id,
                    creado_por_nombre: userProfile.nombre,
                    turno: recTurno
                  };
                  
                  try {
                    if (editingRecordatorio.id) {
                      const { error } = await sb.from('recordatorios').update(payload).eq('id', editingRecordatorio.id);
                      if (error) { showNotify("Error: " + error.message, "error"); setSaving(false); return; }
                      await addLog('EDITAR_RECORDATORIO', 'Editó recordatorio: ' + titulo + (recTurno === 0 ? ' (General)' : ` (${TURNOS[recTurno]})`));
                    } else {
                      const { error } = await sb.from('recordatorios').insert([payload]);
                      if (error) { showNotify("Error: " + error.message, "error"); setSaving(false); return; }
                      await addLog('CREAR_RECORDATORIO', 'Creó recordatorio: ' + titulo + (recTurno === 0 ? ' (General)' : ` (${TURNOS[recTurno]})`));
                    }
                    showNotify(editingRecordatorio.id ? "Recordatorio actualizado" : "Recordatorio creado");
                    setEditingRecordatorio(null);
                    loadData();
                  } catch (err) {
                    showNotify("Error: " + err.message, "error");
                  }
                  setSaving(false);
                }} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Título *</label>
                    <input name="titulo" defaultValue={editingRecordatorio.titulo || ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-purple-500" placeholder="Ej: Llamar al cliente" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Descripción</label>
                    <textarea name="descripcion" defaultValue={editingRecordatorio.descripcion || ''} rows={3} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-purple-500" placeholder="Detalles adicionales..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Fecha *</label>
                      <input name="fecha" type="date" defaultValue={editingRecordatorio.fecha_hora ? editingRecordatorio.fecha_hora.split('T')[0] : ''} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-purple-500" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Hora</label>
                      <input name="hora" type="time" defaultValue={editingRecordatorio.fecha_hora ? editingRecordatorio.fecha_hora.split('T')[1]?.substring(0,5) : '09:00'} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>
                  {/* Selector de alcance: General o por Turno */}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Alcance</label>
                    <select name="recTurno" defaultValue={editingRecordatorio.turno ?? 0} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-purple-500 cursor-pointer">
                      <option value="0">🌐 General — visible para todos</option>
                      <option value="1">T1 — Solo 1er Turno</option>
                      <option value="2">T2 — Solo 2do Turno</option>
                      <option value="3">T3 — Solo 3er Turno</option>
                      <option value="4">ZO — Solo Zona Oeste</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" disabled={saving} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-black uppercase text-xs disabled:opacity-50">{saving ? 'Guardando...' : (editingRecordatorio.id ? 'Actualizar' : 'Crear')}</button>
                    <button type="button" onClick={() => setEditingRecordatorio(null)} className="px-8 py-4 bg-slate-200 text-slate-600 rounded-xl font-black uppercase text-xs">Cancelar</button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Lista de recordatorios */}
            {(() => {
              const recVisibles = filterRecordatoriosByVisibility(recordatorios);
              return recVisibles.length === 0 ? (
              <div className="bg-white rounded-[2rem] shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">🔔</div>
                <p className="text-slate-500 font-bold">No hay recordatorios pendientes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recVisibles.map(r => {
                  const fecha = new Date(r.fecha_hora);
                  const ahora = new Date();
                  const diffMs = fecha - ahora;
                  const vencido = diffMs < 0;
                  const diffHoras = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
                  const diffDias = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
                  const esGeneral = r.turno === 0 || r.turno === null;
                  
                  let tiempoTexto = '';
                  if (vencido) {
                    if (diffDias > 0) tiempoTexto = `Hace ${diffDias} días`;
                    else if (diffHoras > 0) tiempoTexto = `Hace ${diffHoras} horas`;
                    else tiempoTexto = 'Hace unos minutos';
                  } else {
                    if (diffDias > 0) tiempoTexto = `En ${diffDias} días`;
                    else if (diffHoras > 0) tiempoTexto = `En ${diffHoras} horas`;
                    else tiempoTexto = 'Pronto';
                  }
                  
                  return (
                    <div key={r.id} className={`bg-white rounded-2xl shadow-md border-2 p-6 ${vencido ? 'border-red-300 bg-red-50' : 'border-purple-200'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-2xl ${vencido ? 'animate-pulse' : ''}`}>{vencido ? '⚠️' : '🔔'}</span>
                            <h4 className="font-black text-slate-800 text-lg">{r.titulo}</h4>
                            {vencido && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black">VENCIDO</span>}
                            {esGeneral 
                              ? <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">🌐 General</span>
                              : <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-200">{r.turno === 4 ? 'ZO' : `T${r.turno}`}</span>
                            }
                          </div>
                          {r.descripcion && <p className="text-slate-600 text-sm ml-9 mb-2">{r.descripcion}</p>}
                          <div className="ml-9 flex items-center gap-4 text-xs text-slate-500">
                            <span className="font-bold">📅 {fecha.toLocaleDateString()}</span>
                            <span className="font-bold">🕐 {fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className={`font-black ${vencido ? 'text-red-600' : 'text-purple-600'}`}>{tiempoTexto}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 ml-9 mt-2">Creado por: {r.creado_por_nombre}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={async () => {
                            if (!confirm('¿Marcar como completado?')) return;
                            const { error } = await sb.from('recordatorios').update({ completado: true }).eq('id', r.id);
                            if (error) { showNotify("Error: " + error.message, "error"); return; }
                            await addLog('COMPLETAR_RECORDATORIO', 'Completó: ' + r.titulo);
                            showNotify("Recordatorio completado");
                            loadData();
                          }} className="p-3 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200" title="Completar">✅</button>
                          {(r.creado_por === session.user.id || canEditAll()) && (
                            <>
                              <button onClick={() => setEditingRecordatorio(r)} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200" title="Editar">✏️</button>
                              <button onClick={async () => {
                                if (!confirm('¿Eliminar este recordatorio?')) return;
                                const { error } = await sb.from('recordatorios').delete().eq('id', r.id);
                                if (error) { showNotify("Error: " + error.message, "error"); return; }
                                await addLog('ELIMINAR_RECORDATORIO', 'Eliminó: ' + r.titulo);
                                showNotify("Recordatorio eliminado");
                                loadData();
                              }} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200" title="Eliminar">Eliminar</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
            })()}
          </div>
        )}

        {/* ALMANAQUE ANUAL DE LICENCIAS */}
        {currentView === 'calendario' && (() => {
          const licenciasFiltradas = filterByTurno(licencias);
          return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800">📅 Almanaque de Licencias</h2>
                <p className="text-xs text-slate-600 font-bold uppercase mt-1">
                  Registro anual de ausencias {getTurnoEfectivo() > 0 ? `(${TURNOS[getTurnoEfectivo()]})` : '(Todos los turnos)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedCalendarDate('nueva')} className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 shadow-lg">➕ Agregar</button>
                
                {/* Menú desplegable de impresión */}
                <div className="relative">
                  <button onClick={() => setShowPrintLicMenu(v => !v)} className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 flex items-center gap-2">🖨️ Imprimir ▼</button>
                  <div className={`${showPrintLicMenu ? '' : 'hidden'} absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-50 min-w-[220px]`}>
                    {/* Solo Calendario */}
                    <button onClick={() => {
                      setShowPrintLicMenu(false);
                      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                      const dias = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`<html><head><title>Calendario ${calendarioYear}</title><style>
                        body { font-family: Arial, sans-serif; padding: 10px; font-size: 10px; }
                        h1 { font-size: 16px; text-align: center; margin-bottom: 10px; }
                        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
                        .mes { border: 1px solid #ccc; padding: 5px; border-radius: 5px; }
                        .mes-nombre { font-weight: bold; text-align: center; margin-bottom: 5px; font-size: 11px; }
                        .dias-header { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: bold; color: #666; font-size: 8px; }
                        .dias { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; }
                        .dia { text-align: center; padding: 2px; font-size: 8px; border-radius: 2px; position: relative; }
                        .dia .inicial { font-size: 6px; font-weight: bold; display: block; line-height: 1; }
                        .finde { background: #f0f0f0; } .licencia { background: #bfdbfe; color: #1e40af; }
                        .enfermedad { background: #ef4444; color: white; } .estudio { background: #a855f7; color: white; }
                        .descanso { background: #fbbf24; color: #78350f; }
                        .leyenda { margin-top: 15px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; font-size: 9px; }
                        .leyenda span { display: flex; align-items: center; gap: 3px; }
                        .leyenda-color { width: 12px; height: 12px; border-radius: 2px; }
                        .fecha-impresion { text-align: right; font-size: 8px; color: #999; margin-top: 10px; }
                      </style></head><body>`);
                      printWindow.document.write(`<h1>📅 Almanaque - ${calendarioYear}</h1><div class="grid">`);
                      meses.forEach((mesNombre, mesIndex) => {
                        const firstDay = new Date(calendarioYear, mesIndex, 1).getDay();
                        const daysInMonth = new Date(calendarioYear, mesIndex + 1, 0).getDate();
                        const monthStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}`;
                        const mesLicencias = licenciasFiltradas.filter(l => l.fecha?.startsWith(monthStr));
                        printWindow.document.write(`<div class="mes"><div class="mes-nombre">${mesNombre}</div><div class="dias-header">${dias.map(d => `<div>${d}</div>`).join('')}</div><div class="dias">`);
                        for (let i = 0; i < firstDay; i++) printWindow.document.write('<div class="dia"></div>');
                        for (let day = 1; day <= daysInMonth; day++) {
                          const dateStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          const dayLic = mesLicencias.filter(l => l.fecha === dateStr);
                          const isWeekend = [0,6].includes(new Date(calendarioYear, mesIndex, day).getDay());
                          let clase = isWeekend ? 'finde' : '', inicial = '';
                          if (dayLic.length > 0) { clase = dayLic[0].tipo === 'enfermedad' ? 'enfermedad' : dayLic[0].tipo === 'estudio' ? 'estudio' : dayLic[0].tipo === 'descanso' ? 'descanso' : 'licencia'; inicial = dayLic.map(l => l.user_nombre?.charAt(0) || '').join(''); }
                          printWindow.document.write(`<div class="dia ${clase}">${day}${inicial ? `<span class="inicial">${escapeHtml(inicial)}</span>` : ''}</div>`);
                        }
                        printWindow.document.write('</div></div>');
                      });
                      printWindow.document.write('</div><div class="leyenda"><span><div class="leyenda-color" style="background:#bfdbfe"></div> Licencia</span><span><div class="leyenda-color" style="background:#ef4444"></div> Enfermedad</span><span><div class="leyenda-color" style="background:#a855f7"></div> Estudio</span><span><div class="leyenda-color" style="background:#f59e0b"></div> Descanso</span></div>');
                      printWindow.document.write(`<p class="fecha-impresion">Impreso: ${new Date().toLocaleString()}</p></body></html>`);
                      printWindow.document.close(); printWindow.print();
                    }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-100 rounded-t-xl">📅 Solo Calendario</button>
                    
                    {/* Calendario + Detalle completo */}
                    <button onClick={() => {
                      setShowPrintLicMenu(false);
                      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                      const dias = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`<html><head><title>Licencias ${calendarioYear}</title><style>
                        body { font-family: Arial, sans-serif; padding: 10px; font-size: 10px; }
                        h1 { font-size: 16px; text-align: center; margin-bottom: 10px; }
                        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
                        .mes { border: 1px solid #ccc; padding: 5px; border-radius: 5px; }
                        .mes-nombre { font-weight: bold; text-align: center; margin-bottom: 5px; font-size: 11px; }
                        .dias-header { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: bold; color: #666; font-size: 8px; }
                        .dias { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; }
                        .dia { text-align: center; padding: 2px; font-size: 8px; border-radius: 2px; position: relative; }
                        .dia .inicial { font-size: 6px; font-weight: bold; display: block; line-height: 1; }
                        .finde { background: #f0f0f0; } .licencia { background: #bfdbfe; color: #1e40af; }
                        .enfermedad { background: #ef4444; color: white; } .estudio { background: #a855f7; color: white; }
                        .descanso { background: #fbbf24; color: #78350f; }
                        .leyenda { margin-top: 15px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; font-size: 9px; }
                        .leyenda span { display: flex; align-items: center; gap: 3px; }
                        .leyenda-color { width: 12px; height: 12px; border-radius: 2px; }
                        .detalle { margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px; }
                        .detalle h2 { font-size: 12px; margin-bottom: 10px; }
                        .detalle-mes { margin-bottom: 10px; }
                        .detalle-mes h3 { font-size: 10px; background: #f0f0f0; padding: 3px 5px; margin-bottom: 5px; }
                        .detalle-item { font-size: 9px; padding: 2px 5px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
                        .fecha-impresion { text-align: right; font-size: 8px; color: #999; margin-top: 10px; }
                      </style></head><body>`);
                      printWindow.document.write(`<h1>📅 Almanaque de Licencias - ${calendarioYear}</h1><div class="grid">`);
                      meses.forEach((mesNombre, mesIndex) => {
                        const firstDay = new Date(calendarioYear, mesIndex, 1).getDay();
                        const daysInMonth = new Date(calendarioYear, mesIndex + 1, 0).getDate();
                        const monthStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}`;
                        const mesLicencias = licenciasFiltradas.filter(l => l.fecha?.startsWith(monthStr));
                        printWindow.document.write(`<div class="mes"><div class="mes-nombre">${mesNombre}</div><div class="dias-header">${dias.map(d => `<div>${d}</div>`).join('')}</div><div class="dias">`);
                        for (let i = 0; i < firstDay; i++) printWindow.document.write('<div class="dia"></div>');
                        for (let day = 1; day <= daysInMonth; day++) {
                          const dateStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          const dayLic = mesLicencias.filter(l => l.fecha === dateStr);
                          const isWeekend = [0,6].includes(new Date(calendarioYear, mesIndex, day).getDay());
                          let clase = isWeekend ? 'finde' : '', inicial = '';
                          if (dayLic.length > 0) { clase = dayLic[0].tipo === 'enfermedad' ? 'enfermedad' : dayLic[0].tipo === 'estudio' ? 'estudio' : dayLic[0].tipo === 'descanso' ? 'descanso' : 'licencia'; inicial = dayLic.map(l => l.user_nombre?.charAt(0) || '').join(''); }
                          printWindow.document.write(`<div class="dia ${clase}">${day}${inicial ? `<span class="inicial">${escapeHtml(inicial)}</span>` : ''}</div>`);
                        }
                        printWindow.document.write('</div></div>');
                      });
                      printWindow.document.write('</div><div class="leyenda"><span><div class="leyenda-color" style="background:#bfdbfe"></div> Licencia</span><span><div class="leyenda-color" style="background:#ef4444"></div> Enfermedad</span><span><div class="leyenda-color" style="background:#a855f7"></div> Estudio</span><span><div class="leyenda-color" style="background:#f59e0b"></div> Descanso</span></div>');
                      const licenciasYear = licenciasFiltradas.filter(l => l.fecha?.startsWith(calendarioYear.toString()));
                      if (licenciasYear.length > 0) {
                        printWindow.document.write('<div class="detalle"><h2>📋 Detalle de Licencias</h2>');
                        meses.forEach((mesNombre, mesIndex) => {
                          const monthStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}`;
                          const mesLics = licenciasYear.filter(l => l.fecha?.startsWith(monthStr)).sort((a,b) => a.fecha.localeCompare(b.fecha));
                          if (mesLics.length > 0) {
                            printWindow.document.write(`<div class="detalle-mes"><h3>${mesNombre} (${mesLics.length})</h3>`);
                            mesLics.forEach(l => { const tipoLabel = l.tipo === 'licencia' ? '📋 Licencia' : l.tipo === 'enfermedad' ? '🤒 Enfermedad' : l.tipo === 'estudio' ? '📚 Estudio' : '😴 Descanso'; printWindow.document.write(`<div class="detalle-item"><span>${l.fecha.split("-")[2]} - ${escapeHtml(l.user_nombre)}</span><span>${tipoLabel}</span></div>`); });
                            printWindow.document.write('</div>');
                          }
                        });
                        printWindow.document.write('</div>');
                      }
                      printWindow.document.write(`<p class="fecha-impresion">Impreso: ${new Date().toLocaleString()}</p></body></html>`);
                      printWindow.document.close(); printWindow.print();
                    }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-100 border-t">📋 Calendario + Detalle</button>
                    
                    {/* Solo Enfermedad/Estudio/Descanso */}
                    <button onClick={() => {
                      setShowPrintLicMenu(false);
                      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                      const licenciasYear = licenciasFiltradas.filter(l => l.fecha?.startsWith(calendarioYear.toString()) && ['enfermedad', 'estudio', 'descanso'].includes(l.tipo));
                      if (licenciasYear.length === 0) { showNotify("No hay registros de enfermedad/estudio/descanso", "error"); return; }
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`<html><head><title>Enf/Est/Desc ${calendarioYear}</title><style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                        .section { margin-bottom: 20px; }
                        .section h2 { font-size: 14px; padding: 5px 10px; margin-bottom: 10px; border-radius: 5px; }
                        .enfermedad h2 { background: #fee2e2; color: #dc2626; }
                        .estudio h2 { background: #f3e8ff; color: #9333ea; }
                        .descanso h2 { background: #fef3c7; color: #d97706; }
                        .mes { margin-bottom: 10px; }
                        .mes h3 { font-size: 11px; background: #f0f0f0; padding: 3px 8px; margin-bottom: 5px; }
                        .item { font-size: 10px; padding: 3px 8px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
                        .fecha-impresion { text-align: right; font-size: 9px; color: #999; margin-top: 20px; }
                      </style></head><body>`);
                      printWindow.document.write(`<h1>🤒📚😴 Enfermedad / Estudio / Descanso - ${calendarioYear}</h1>`);
                      ['enfermedad', 'estudio', 'descanso'].forEach(tipo => {
                        const tipoLics = licenciasYear.filter(l => l.tipo === tipo);
                        if (tipoLics.length === 0) return;
                        const emoji = tipo === 'enfermedad' ? '🤒' : tipo === 'estudio' ? '📚' : '😴';
                        printWindow.document.write(`<div class="section ${tipo}"><h2>${emoji} ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} (${tipoLics.length})</h2>`);
                        meses.forEach((mesNombre, mesIndex) => {
                          const monthStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}`;
                          const mesLics = tipoLics.filter(l => l.fecha?.startsWith(monthStr)).sort((a,b) => a.fecha.localeCompare(b.fecha));
                          if (mesLics.length > 0) {
                            printWindow.document.write(`<div class="mes"><h3>${mesNombre}</h3>`);
                            mesLics.forEach(l => printWindow.document.write(`<div class="item"><span>${l.fecha.split('-')[2]}</span><span>${escapeHtml(l.user_nombre)}</span></div>`));
                            printWindow.document.write('</div>');
                          }
                        });
                        printWindow.document.write('</div>');
                      });
                      printWindow.document.write(`<p class="fecha-impresion">Impreso: ${new Date().toLocaleString()}</p></body></html>`);
                      printWindow.document.close(); printWindow.print();
                    }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-100 border-t text-red-600">🤒📚😴 Enf/Est/Desc</button>
                    
                    {/* Solo Licencias */}
                    <button onClick={() => {
                      setShowPrintLicMenu(false);
                      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                      const licenciasYear = licenciasFiltradas.filter(l => l.fecha?.startsWith(calendarioYear.toString()) && l.tipo === 'licencia');
                      if (licenciasYear.length === 0) { showNotify("No hay licencias registradas", "error"); return; }
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`<html><head><title>Licencias ${calendarioYear}</title><style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { font-size: 16px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; color: #1e40af; }
                        .mes { margin-bottom: 15px; }
                        .mes h2 { font-size: 12px; background: #dbeafe; color: #1e40af; padding: 5px 10px; margin-bottom: 8px; border-radius: 5px; }
                        .item { font-size: 10px; padding: 4px 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
                        .fecha-impresion { text-align: right; font-size: 9px; color: #999; margin-top: 20px; }
                      </style></head><body>`);
                      printWindow.document.write(`<h1>📋 Licencias - ${calendarioYear}</h1>`);
                      meses.forEach((mesNombre, mesIndex) => {
                        const monthStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}`;
                        const mesLics = licenciasYear.filter(l => l.fecha?.startsWith(monthStr)).sort((a,b) => a.fecha.localeCompare(b.fecha));
                        if (mesLics.length > 0) {
                          printWindow.document.write(`<div class="mes"><h2>${mesNombre} (${mesLics.length})</h2>`);
                          mesLics.forEach(l => printWindow.document.write(`<div class="item"><span>Día ${l.fecha.split('-')[2]}</span><span>${escapeHtml(l.user_nombre)}</span></div>`));
                          printWindow.document.write('</div>');
                        }
                      });
                      printWindow.document.write(`<p class="fecha-impresion">Impreso: ${new Date().toLocaleString()}</p></body></html>`);
                      printWindow.document.close(); printWindow.print();
                    }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-100 border-t text-blue-600">📋 Solo Licencias</button>
                    
                    {/* Separador */}
                    <div className="border-t-2 border-slate-300 my-1"></div>
                    
                    {/* Por Usuario - Selector */}
                    <div className="px-4 py-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">👤 Por Usuario:</label>
                      <select value={licPrintUser} onChange={(e) => setLicPrintUser(e.target.value)} className="w-full mt-1 p-2 text-sm border border-slate-200 rounded-lg">
                        <option value="">-- Seleccionar --</option>
                        {getProfilesByTurno().map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                    <button onClick={() => {
                      if (!licPrintUser) { showNotify("Seleccioná un usuario", "error"); return; }
                      setShowPrintLicMenu(false);
                      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                      const userLics = licenciasFiltradas.filter(l => l.fecha?.startsWith(calendarioYear.toString()) && l.user_nombre === licPrintUser);
                      if (userLics.length === 0) { showNotify(`${licPrintUser} no tiene registros en ${calendarioYear}`, "error"); return; }
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`<html><head><title>${escapeHtml(licPrintUser)} - ${calendarioYear}</title><style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { font-size: 16px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                        .resumen { display: flex; gap: 20px; margin: 15px 0; padding: 10px; background: #f8fafc; border-radius: 8px; }
                        .resumen div { text-align: center; }
                        .resumen .num { font-size: 20px; font-weight: bold; }
                        .resumen .label { font-size: 9px; color: #666; }
                        .mes { margin-bottom: 12px; }
                        .mes h2 { font-size: 11px; background: #e2e8f0; padding: 4px 8px; margin-bottom: 5px; border-radius: 4px; }
                        .item { font-size: 10px; padding: 3px 8px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
                        .licencia { color: #1e40af; } .enfermedad { color: #dc2626; } .estudio { color: #9333ea; } .descanso { color: #d97706; }
                        .fecha-impresion { text-align: right; font-size: 9px; color: #999; margin-top: 20px; }
                      </style></head><body>`);
                      printWindow.document.write(`<h1>👤 ${escapeHtml(licPrintUser)} - ${calendarioYear}</h1>`);
                      const conteo = { licencia: 0, enfermedad: 0, estudio: 0, descanso: 0 };
                      userLics.forEach(l => conteo[l.tipo]++);
                      printWindow.document.write(`<div class="resumen"><div><div class="num" style="color:#1e40af">${conteo.licencia}</div><div class="label">Licencias</div></div><div><div class="num" style="color:#dc2626">${conteo.enfermedad}</div><div class="label">Enfermedad</div></div><div><div class="num" style="color:#9333ea">${conteo.estudio}</div><div class="label">Estudio</div></div><div><div class="num" style="color:#d97706">${conteo.descanso}</div><div class="label">Descanso</div></div><div><div class="num">${userLics.length}</div><div class="label">TOTAL</div></div></div>`);
                      meses.forEach((mesNombre, mesIndex) => {
                        const monthStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}`;
                        const mesLics = userLics.filter(l => l.fecha?.startsWith(monthStr)).sort((a,b) => a.fecha.localeCompare(b.fecha));
                        if (mesLics.length > 0) {
                          printWindow.document.write(`<div class="mes"><h2>${mesNombre} (${mesLics.length})</h2>`);
                          mesLics.forEach(l => { const tipoLabel = l.tipo === 'licencia' ? '📋 Licencia' : l.tipo === 'enfermedad' ? '🤒 Enfermedad' : l.tipo === 'estudio' ? '📚 Estudio' : '😴 Descanso'; printWindow.document.write(`<div class="item"><span>Día ${l.fecha.split('-')[2]}</span><span class="${l.tipo}">${tipoLabel}</span></div>`); });
                          printWindow.document.write('</div>');
                        }
                      });
                      printWindow.document.write(`<p class="fecha-impresion">Impreso: ${new Date().toLocaleString()}</p></body></html>`);
                      printWindow.document.close(); printWindow.print();
                      setLicPrintUser('');
                    }} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-100 border-t rounded-b-xl text-emerald-600 font-bold">🖨️ Imprimir Usuario</button>
                  </div>
                </div>
                <button onClick={() => setCalendarioYear(calendarioYear - 1)} className="p-2 bg-slate-200 rounded-xl hover:bg-slate-300 font-bold">◀</button>
                <select value={calendarioYear} onChange={(e) => setCalendarioYear(parseInt(e.target.value))} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-black text-slate-700 text-lg">
                  {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <button onClick={() => setCalendarioYear(calendarioYear + 1)} className="p-2 bg-slate-200 rounded-xl hover:bg-slate-300 font-bold">▶</button>
              </div>
            </div>
            
            {/* Leyenda de colores */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4">
              <div className="flex flex-wrap gap-4 text-sm font-bold">
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-blue-500"></span> Licencia</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-red-500"></span> Enfermedad</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-purple-500"></span> Estudio</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-amber-500"></span> Descanso</span>
              </div>
            </div>
            
            {/* Leyenda de usuarios y tipos */}
            {(() => {
              const usuariosConLicencias = [...new Set(licenciasFiltradas.filter(l => l.fecha?.startsWith(calendarioYear.toString()) && l.tipo === 'licencia').map(l => l.user_nombre))].filter(Boolean);
              return (
                <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-2">📋 Tipos:</p>
                      <div className="flex flex-wrap gap-2">
                        <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">🤒 Enfermedad</div>
                        <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">📚 Estudio</div>
                        <div className="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold">😴 Descanso</div>
                      </div>
                    </div>
                    {usuariosConLicencias.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-2">👤 Licencias por usuario (clic para detalle):</p>
                        <div className="flex flex-wrap gap-2">
                          {usuariosConLicencias.map(nombre => {
                            const color = getUserColor(nombre);
                            const isSelected = licDetailUser === nombre;
                            return (
                              <div key={nombre} onClick={() => setLicDetailUser(isSelected ? null : nombre)} className={`${color.bg} ${color.text} px-2 py-1 rounded text-xs font-bold flex items-center gap-1.5 border-l-3 ${color.border} cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-slate-800 shadow-lg scale-105' : ''}`}>
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color.dot }}></span>
                                {nombre.split(' ')[0]}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {/* Selector para ver detalle de cualquier usuario */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-2">🔍 Ver detalle de:</p>
                      <select value={licDetailUser || ''} onChange={(e) => setLicDetailUser(e.target.value || null)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold cursor-pointer">
                        <option value="">-- Seleccionar usuario --</option>
                        {getProfilesByTurno().map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })()}
            
            {/* Panel de detalle de licencias por usuario */}
            {licDetailUser && (() => {
              const userLics = licenciasFiltradas.filter(l => l.fecha?.startsWith(calendarioYear.toString()) && l.user_nombre === licDetailUser);
              const conteo = { licencia: 0, enfermedad: 0, estudio: 0, descanso: 0 };
              userLics.forEach(l => { if (conteo[l.tipo] !== undefined) conteo[l.tipo]++; });
              const total = userLics.length;
              const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
              const userColor = getUserColor(licDetailUser);
              const tipoIcon = { licencia: '📋', enfermedad: '🏥', estudio: '📚', descanso: '😴' };
              const tipoColorDot = { licencia: 'bg-blue-500', enfermedad: 'bg-red-500', estudio: 'bg-purple-500', descanso: 'bg-amber-500' };
              
              return (
                <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden animate-fadeIn">
                  {/* Header compacto */}
                  <div className={`${userColor.bg} px-4 py-3 flex justify-between items-center`}>
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: userColor.dot }}></span>
                      <span className={`font-black ${userColor.text}`}>{licDetailUser}</span>
                      <span className={`text-xs ${userColor.text} opacity-60`}>— {calendarioYear}</span>
                      {/* Contadores inline */}
                      <div className="flex gap-2 ml-2">
                        {conteo.licencia > 0 && <span className="text-xs font-bold bg-blue-500 text-white px-2 py-0.5 rounded">📋{conteo.licencia}</span>}
                        {conteo.enfermedad > 0 && <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded">🏥{conteo.enfermedad}</span>}
                        {conteo.estudio > 0 && <span className="text-xs font-bold bg-purple-500 text-white px-2 py-0.5 rounded">📚{conteo.estudio}</span>}
                        {conteo.descanso > 0 && <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded">😴{conteo.descanso}</span>}
                        <span className="text-xs font-black bg-slate-700 text-white px-2 py-0.5 rounded">{total}</span>
                      </div>
                    </div>
                    <button onClick={() => setLicDetailUser(null)} className="p-1.5 bg-white/50 rounded-lg hover:bg-white/80 transition-all">
                      <Icon name="x" size={14} />
                    </button>
                  </div>
                  
                  {total === 0 ? (
                    <div className="p-6 text-center"><p className="text-slate-400 font-bold text-sm">Sin registros en {calendarioYear}</p></div>
                  ) : (
                    <div className="p-3">
                      {/* Desglose compacto multicolumna */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {meses.map((mesNombre, mesIndex) => {
                          const monthStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}`;
                          const mesLics = userLics.filter(l => l.fecha?.startsWith(monthStr)).sort((a, b) => a.fecha.localeCompare(b.fecha));
                          if (mesLics.length === 0) return null;
                          return (
                            <div key={mesIndex} className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                              <div className="bg-slate-200 px-3 py-1.5 flex justify-between items-center">
                                <span className="font-black text-xs text-slate-700 uppercase">{mesNombre}</span>
                                <span className="text-[10px] font-bold text-slate-500">{mesLics.length} día{mesLics.length > 1 ? 's' : ''}</span>
                              </div>
                              <div className="px-2 py-1.5 space-y-1">
                                {mesLics.map(l => {
                                  const dia = parseInt(l.fecha.split('-')[2], 10);
                                  const fechaObj = new Date(l.fecha + 'T12:00:00');
                                  const diaSem = fechaObj.toLocaleDateString('es-ES', { weekday: 'short' });
                                  return (
                                    <div key={l.id} className="flex items-start gap-1.5 text-xs leading-tight">
                                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${tipoColorDot[l.tipo]}`}></span>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-black text-slate-700">{dia}</span>
                                          <span className="text-slate-400 capitalize">{diaSem}</span>
                                          <span className="ml-auto">{tipoIcon[l.tipo]}</span>
                                        </div>
                                        {l.descripcion && <p className="text-[10px] text-slate-500 italic truncate" title={l.descripcion}>{l.descripcion}</p>}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            
            {/* Almanaque - 12 meses */}
            {licDetailUser && (
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-xl">
                <span className="w-2 h-2 rounded-full" style={{ background: getUserColor(licDetailUser).dot }}></span>
                <span className="text-xs font-bold text-indigo-700">Mostrando solo: {licDetailUser}</span>
                <button onClick={() => setLicDetailUser(null)} className="ml-auto text-[10px] font-bold text-indigo-500 hover:text-indigo-700 underline">Ver todos</button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((mesNombre, mesIndex) => {
                const firstDay = new Date(calendarioYear, mesIndex, 1).getDay();
                const daysInMonth = new Date(calendarioYear, mesIndex + 1, 0).getDate();
                const monthStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}`;
                const mesLicencias = licenciasFiltradas.filter(l => l.fecha?.startsWith(monthStr) && (!licDetailUser || l.user_nombre === licDetailUser));
                const isCurrentMonth = new Date().getFullYear() === calendarioYear && new Date().getMonth() === mesIndex;
                
                return (
                  <div key={mesIndex} className={`bg-white rounded-2xl shadow-md border-2 p-3 ${isCurrentMonth ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-slate-200'}`}>
                    <h4 className={`text-center font-black text-sm mb-2 ${isCurrentMonth ? 'text-emerald-600' : 'text-slate-700'}`}>{mesNombre}</h4>
                    <div className="grid grid-cols-7 gap-0.5 text-[9px]">
                      {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                        <div key={i} className="text-center font-bold text-slate-400 py-0.5">{d}</div>
                      ))}
                      {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`}></div>)}
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const dateStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const dayLicencias = mesLicencias.filter(l => l.fecha === dateStr);
                        const isToday = new Date().toISOString().split('T')[0] === dateStr;
                        const isWeekend = new Date(calendarioYear, mesIndex, day).getDay() === 0 || new Date(calendarioYear, mesIndex, day).getDay() === 6;
                        
                        let bgColor = isWeekend ? 'bg-slate-100' : 'bg-white';
                        let textColor = 'text-slate-600';
                        let userName = '';
                        if (dayLicencias.length > 0) {
                          userName = dayLicencias[0].user_nombre;
                          const tipo = dayLicencias[0].tipo;
                          // Colores sólidos para enfermedad, estudio y descanso
                          if (tipo === 'enfermedad') {
                            bgColor = 'bg-red-500';
                            textColor = 'text-white';
                          } else if (tipo === 'estudio') {
                            bgColor = 'bg-purple-500';
                            textColor = 'text-white';
                          } else if (tipo === 'descanso') {
                            bgColor = 'bg-amber-400';
                            textColor = 'text-amber-900';
                          } else {
                            // Licencia normal: color pastel por usuario
                            const userColor = getUserColor(userName);
                            bgColor = userColor.bg;
                            textColor = userColor.text;
                          }
                        }
                        if (isToday && dayLicencias.length === 0) bgColor = 'bg-emerald-200 text-emerald-800 ring-2 ring-emerald-300';
                        
                        return (
                          <div 
                            key={day}
                            onClick={() => setSelectedCalendarDate(dateStr)}
                            className={`text-center py-1 rounded cursor-pointer hover:ring-2 hover:ring-slate-400 ${bgColor} ${textColor} ${selectedCalendarDate === dateStr ? 'ring-2 ring-slate-800' : ''} ${dayLicencias.length > 1 ? 'ring-2 ring-offset-1 ring-yellow-400' : ''} ${isToday ? 'font-black' : ''} ${dayLicencias.length > 0 && dayLicencias[0].tipo !== 'enfermedad' && dayLicencias[0].tipo !== 'estudio' && dayLicencias[0].tipo !== 'descanso' ? 'border-l-2 ' + (getUserColor(dayLicencias[0].user_nombre).border) : ''}`}
                            title={dayLicencias.map(l => `${l.user_nombre}: ${l.tipo}`).join(', ')}
                          >
                            {day}
                            {dayLicencias.length > 1 && <span className="text-[7px]">+{dayLicencias.length - 1}</span>}
                          </div>
                        );
                      })}
                    </div>
                    {mesLicencias.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 text-[9px] text-slate-500">
                        {mesLicencias.length} día{mesLicencias.length > 1 ? 's' : ''} de licencia
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Panel de día seleccionado o nueva licencia */}
            {selectedCalendarDate && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-slate-800 text-xl">
                    {selectedCalendarDate === 'nueva' ? '➕ Nueva Licencia' : `📅 ${new Date(selectedCalendarDate + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
                  </h3>
                  <button onClick={() => setSelectedCalendarDate(null)} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200">✕</button>
                </div>
                
                {(() => {
                  const dayLicencias = selectedCalendarDate !== 'nueva' ? licenciasFiltradas.filter(l => l.fecha === selectedCalendarDate) : [];
                  const myLicencia = dayLicencias.find(l => l.user_id === session?.user?.id);
                  
                  return (
                    <div className="space-y-4">
                      {/* Lista de ausencias del día (solo si es fecha específica) */}
                      {selectedCalendarDate !== 'nueva' && dayLicencias.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-slate-500 uppercase">Ausencias registradas:</p>
                          {dayLicencias.map(l => {
                            const colorMap = {
                              licencia: 'bg-blue-100 border-blue-400 text-blue-800',
                              enfermedad: 'bg-red-100 border-red-400 text-red-800',
                              estudio: 'bg-purple-100 border-purple-400 text-purple-800',
                              descanso: 'bg-amber-100 border-amber-400 text-amber-800'
                            };
                            const tipoLabel = { licencia: '📋 Licencia', enfermedad: '🏥 Enfermedad', estudio: '📚 Estudio', descanso: '😴 Descanso' };
                            return (
                              <div key={l.id} className={`p-4 rounded-xl border-2 ${colorMap[l.tipo] || 'bg-slate-100 border-slate-300'} flex justify-between items-center`}>
                                <div>
                                  <p className="font-black text-lg">{l.user_nombre}</p>
                                  <p className="text-sm font-bold">{tipoLabel[l.tipo] || l.tipo}{l.descripcion ? ` - ${l.descripcion}` : ''}</p>
                                </div>
                                {(l.user_id === session?.user?.id || canEditAll()) && (
                                  <button onClick={async () => {
                                    if (!confirm(`¿Eliminar licencia de ${l.user_nombre}?`)) return;
                                    const { error } = await sb.from('licencias').delete().eq('id', l.id);
                                    if (error) { showNotify("Error: " + error.message, "error"); return; }
                                    await addLog('ELIMINAR_LICENCIA', `Eliminó licencia de ${l.user_nombre} el ${selectedCalendarDate}`);
                                    showNotify("Licencia eliminada");
                                    loadData();
                                  }} className="p-3 bg-white rounded-xl hover:bg-red-50 text-red-500 font-bold">Eliminar</button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {selectedCalendarDate !== 'nueva' && dayLicencias.length === 0 && (
                        <p className="text-slate-400 py-4 text-center">No hay ausencias registradas este día</p>
                      )}
                      
                      {/* Formulario compacto para agregar/eliminar licencias */}
                      <div className={selectedCalendarDate !== 'nueva' ? "border-t-2 border-slate-100 pt-4 mt-4" : ""}>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2 items-end">
                            {canManageLicencias() && (
                              <select value={licForm.usuario} onChange={e => setLicForm(f => ({...f, usuario: e.target.value}))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold flex-1 min-w-[120px]">
                                {getProfilesByTurno().map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                              </select>
                            )}
                            <input type="date" value={licForm.fechaDesde} onChange={e => setLicForm(f => ({...f, fechaDesde: e.target.value}))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                            <span className="text-slate-400 text-sm">a</span>
                            <input type="date" value={licForm.fechaHasta} onChange={e => setLicForm(f => ({...f, fechaHasta: e.target.value}))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                            <select value={licForm.tipo} onChange={e => setLicForm(f => ({...f, tipo: e.target.value}))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">
                              <option value="licencia">📋 Licencia</option>
                              <option value="enfermedad">🏥 Enfermedad</option>
                              <option value="estudio">📚 Estudio</option>
                              <option value="descanso">😴 Descanso</option>
                            </select>
                            <input value={licForm.descripcion} onChange={e => setLicForm(f => ({...f, descripcion: e.target.value}))} placeholder="Nota..." className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm flex-1 min-w-[100px]" />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={async () => {
                              const fechaDesde = licForm.fechaDesde;
                              const fechaHasta = licForm.fechaHasta || fechaDesde;
                              const tipo = licForm.tipo;
                              const descripcion = licForm.descripcion;
                              const targetUserId = canManageLicencias() ? (licForm.usuario || getProfilesByTurno()[0]?.id) : session.user.id;
                              const targetUserNombre = canManageLicencias() ? profiles.find(p => p.id === targetUserId)?.nombre : userProfile.nombre;
                              
                              if (!fechaDesde) { showNotify("Selecciona una fecha", "error"); return; }
                              
                              const inicio = new Date(fechaDesde + 'T12:00:00');
                              const fin = new Date(fechaHasta + 'T12:00:00');
                              if (fin < inicio) { showNotify("Fecha hasta debe ser >= fecha desde", "error"); return; }
                              
                              const fechas = [];
                              let current = new Date(inicio);
                              while (current <= fin) {
                                const fechaStr = current.toISOString().split('T')[0];
                                const existe = licencias.find(l => l.fecha === fechaStr && l.user_id === targetUserId);
                                if (!existe) fechas.push({ user_id: targetUserId, user_nombre: targetUserNombre, fecha: fechaStr, tipo, descripcion: descripcion || null, turno: getTurnoParaGuardar() });
                                current.setDate(current.getDate() + 1);
                              }
                              
                              if (fechas.length === 0) { showNotify("Todas las fechas ya tienen licencia", "error"); return; }
                              
                              const { error } = await sb.from('licencias').insert(fechas);
                              if (error) { showNotify("Error: " + error.message, "error"); return; }
                              await addLog('AGREGAR_LICENCIA', `Agregó ${tipo} para ${targetUserNombre}: ${fechas.length} días`);
                              showNotify(`Agregado: ${fechas.length} días`);
                              setSelectedCalendarDate(null);
                              loadData();
                            }} className="flex-1 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm hover:bg-emerald-600">➕ Agregar</button>
                            {canEditAll() && (
                              <button onClick={async () => {
                                if (!confirm('¿Eliminar licencias en este rango?')) return;
                                
                                const fechaDesde = licForm.fechaDesde;
                                const fechaHasta = licForm.fechaHasta || fechaDesde;
                                const targetUserId = licForm.usuario || getProfilesByTurno()[0]?.id;
                                const targetUserNombre = profiles.find(p => p.id === targetUserId)?.nombre;
                                
                                if (!fechaDesde) { showNotify("Selecciona una fecha", "error"); return; }
                                
                                const inicio = new Date(fechaDesde + 'T12:00:00');
                                const fin = new Date(fechaHasta + 'T12:00:00');
                                if (fin < inicio) { showNotify("Fecha hasta debe ser >= fecha desde", "error"); return; }
                                
                                const fechasEliminar = [];
                                let current = new Date(inicio);
                                while (current <= fin) {
                                  fechasEliminar.push(current.toISOString().split('T')[0]);
                                  current.setDate(current.getDate() + 1);
                                }
                                
                                const { error } = await sb.from('licencias').delete().eq('user_id', targetUserId).in('fecha', fechasEliminar);
                                if (error) { showNotify("Error: " + error.message, "error"); return; }
                                await addLog('ELIMINAR_LICENCIAS', `Eliminó licencias de ${targetUserNombre}: ${fechaDesde} a ${fechaHasta}`);
                                showNotify(`Eliminado: ${fechasEliminar.length} días`);
                                setSelectedCalendarDate(null);
                                loadData();
                              }} className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600">🗑️ Eliminar</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            
            {/* Resumen anual por usuario */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
              <h3 className="font-black text-slate-800 text-xl mb-4">📊 Resumen Anual {calendarioYear}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-2 font-black text-slate-600">Usuario</th>
                      <th className="text-center py-3 px-2 font-bold text-blue-600">Licencia</th>
                      <th className="text-center py-3 px-2 font-bold text-red-600">Enfermedad</th>
                      <th className="text-center py-3 px-2 font-bold text-purple-600">Estudio</th>
                      <th className="text-center py-3 px-2 font-bold text-amber-600">Descanso</th>
                      <th className="text-center py-3 px-2 font-black text-slate-800">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const yearLicencias = licenciasFiltradas.filter(l => l.fecha?.startsWith(String(calendarioYear)));
                      const porUsuario = {};
                      
                      yearLicencias.forEach(l => {
                        if (!porUsuario[l.user_nombre]) {
                          porUsuario[l.user_nombre] = { licencia: 0, enfermedad: 0, estudio: 0, descanso: 0, total: 0 };
                        }
                        porUsuario[l.user_nombre][l.tipo] = (porUsuario[l.user_nombre][l.tipo] || 0) + 1;
                        porUsuario[l.user_nombre].total++;
                      });
                      
                      const sorted = Object.entries(porUsuario).sort((a, b) => b[1].total - a[1].total);
                      
                      if (sorted.length === 0) {
                        return (
                          <tr>
                            <td colSpan="6" className="text-center py-8 text-slate-400">No hay licencias registradas en {calendarioYear}</td>
                          </tr>
                        );
                      }
                      
                      return sorted.map(([nombre, data]) => (
                        <tr key={nombre} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-2 font-bold text-slate-800">{nombre}</td>
                          <td className="text-center py-3 px-2">
                            {data.licencia > 0 && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-bold">{data.licencia}</span>}
                          </td>
                          <td className="text-center py-3 px-2">
                            {data.enfermedad > 0 && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg font-bold">{data.enfermedad}</span>}
                          </td>
                          <td className="text-center py-3 px-2">
                            {data.estudio > 0 && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-bold">{data.estudio}</span>}
                          </td>
                          <td className="text-center py-3 px-2">
                            {data.descanso > 0 && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-bold">{data.descanso}</span>}
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="bg-slate-800 text-white px-3 py-1 rounded-lg font-black">{data.total}</span>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );})()}


        {/* STOCK / INVENTARIO */}
        {currentView === 'stock' && (() => {
          // Filtrar stock y ubicaciones por turno
          // Admin/Supervisor: usar stockTurnoFilter (filtro propio del stock)
          // Otros roles: usar su turno asignado
          const stockTurnoEfectivo = canSeeAllTurnos() ? stockTurnoFilter : getUserTurno();
          const stockFiltrado = stockTurnoEfectivo === 0 ? stockItems : stockItems.filter(i => i.turno === stockTurnoEfectivo);
          const ubicacionesFiltradas = stockTurnoEfectivo === 0 
            ? stockUbicaciones 
            : stockUbicaciones.filter(u => u.turno === stockTurnoEfectivo);
          // Seleccionar primera ubicación del turno si no hay ninguna seleccionada o la actual no está en el turno
          if (ubicacionesFiltradas.length > 0 && (!selectedUbicacion || !ubicacionesFiltradas.find(u => u.id === selectedUbicacion))) {
            setTimeout(() => setSelectedUbicacion(ubicacionesFiltradas[0].id), 0);
          }
          return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-2xl font-black text-slate-800">📦 Stock</h2>
                <p className="text-xs text-slate-500 font-bold">{stockTurnoEfectivo > 0 ? TURNOS[stockTurnoEfectivo] : 'Todos los turnos'}</p>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <select value={stockSearchScope} onChange={(e) => setStockSearchScope(e.target.value)} className="px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold cursor-pointer text-slate-700">
                  <option value="actual">🔍 Esta valija</option>
                  <option value="todas">🔍 Todas las valijas</option>
                </select>
                <div className="relative flex-1 min-w-[120px] sm:w-44">
                  <input value={stockSearch} onChange={(e) => setStockSearch(e.target.value)} placeholder="Buscar item..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold pr-8" />
                  {stockSearch && <button onClick={() => setStockSearch('')} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600">✕</button>}
                </div>
                <div className="relative">
                  <button onClick={() => {
                    setShowPrintStockMenu(v => !v);
                  }} className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600">🖨️</button>
                  <div className={`${showPrintStockMenu ? '' : 'hidden'} absolute right-0 top-10 bg-white border border-slate-200 rounded-lg shadow-xl z-50 min-w-[180px]`}>
                    <button onClick={() => {
                      setShowPrintStockMenu(false);
                      const getUbNombre = (id) => stockUbicaciones.find(u => u.id === id)?.nombre || id;
                      const items = stockFiltrado.filter(i => i.ubicacion === selectedUbicacion);
                      const consumibles = items.filter(i => i.tipo !== 'fijo');
                      const fijos = items.filter(i => i.tipo === 'fijo');
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`<html><head><title>Stock - ${escapeHtml(getUbNombre(selectedUbicacion))}</title><style>body{font-family:Arial,sans-serif;padding:15px;font-size:10px}h1{font-size:16px;border-bottom:2px solid #333;padding-bottom:8px;margin-bottom:10px}h2{font-size:12px;margin-top:15px;color:#666;margin-bottom:5px}.item{display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #999;font-size:10px;line-height:1.2}.bajo{color:red;font-weight:bold}.fecha{text-align:right;font-size:9px;color:#999;margin-top:15px}</style></head><body>`);
                      printWindow.document.write(`<h1>${escapeHtml(getUbNombre(selectedUbicacion))}</h1>`);
                      if(consumibles.length > 0) { printWindow.document.write('<h2>📦 CONSUMIBLES</h2>'); consumibles.forEach(i => printWindow.document.write(`<div class="item"><span>${escapeHtml(i.nombre)}</span><span class="${i.cantidad <= i.cantidad_minima ? 'bajo' : ''}">${i.cantidad}</span></div>`)); }
                      if(fijos.length > 0) { printWindow.document.write('<h2>🔧 ELEMENTOS FIJOS</h2>'); fijos.forEach(i => printWindow.document.write(`<div class="item"><span>${escapeHtml(i.nombre)}</span><span class="${i.cantidad <= i.cantidad_minima ? 'bajo' : ''}">${i.cantidad}</span></div>`)); }
                      printWindow.document.write(`<p class="fecha">Impreso: ${new Date().toLocaleString()}</p></body></html>`);
                      printWindow.document.close();
                      printWindow.print();
                    }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100">📋 Imprimir actual</button>
                    <button onClick={() => {
                      setShowPrintStockMenu(false);
                      const getUbNombre = (id) => stockUbicaciones.find(u => u.id === id)?.nombre || id;
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`<html><head><title>Stock Completo</title><style>body{font-family:Arial,sans-serif;padding:15px;font-size:10px}h1{font-size:16px;border-bottom:2px solid #333;padding-bottom:8px;margin-bottom:10px}h2{font-size:11px;margin-top:12px;background:#e0e0e0;padding:4px 8px;margin-bottom:5px}h3{font-size:10px;color:#666;margin:8px 0 3px}.item{display:flex;justify-content:space-between;padding:1px 0;border-bottom:1px solid #999;font-size:9px;line-height:1.2}.bajo{color:red;font-weight:bold}.fecha{text-align:right;font-size:8px;color:#999;margin-top:15px}.page-break{page-break-after:always}</style></head><body>`);
                      printWindow.document.write('<h1>📦 INVENTARIO COMPLETO</h1>');
                      ubicacionesFiltradas.forEach(ub => {
                        const items = stockFiltrado.filter(i => i.ubicacion === ub.id);
                        const consumibles = items.filter(i => i.tipo !== 'fijo');
                        const fijos = items.filter(i => i.tipo === 'fijo');
                        printWindow.document.write(`<h2>${escapeHtml(ub.nombre)}</h2>`);
                        if(consumibles.length > 0) { printWindow.document.write('<h3>Consumibles</h3>'); consumibles.forEach(i => printWindow.document.write(`<div class="item"><span>${escapeHtml(i.nombre)}</span><span class="${i.cantidad <= i.cantidad_minima ? 'bajo' : ''}">${i.cantidad}</span></div>`)); }
                        if(fijos.length > 0) { printWindow.document.write('<h3>Elementos Fijos</h3>'); fijos.forEach(i => printWindow.document.write(`<div class="item"><span>${escapeHtml(i.nombre)}</span><span class="${i.cantidad <= i.cantidad_minima ? 'bajo' : ''}">${i.cantidad}</span></div>`)); }
                      });
                      printWindow.document.write(`<p class="fecha">Impreso: ${new Date().toLocaleString()}</p></body></html>`);
                      printWindow.document.close();
                      printWindow.print();
                    }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 border-t">📦 Imprimir TODO</button>
                    <button onClick={() => {
                      setShowPrintStockMenu(false);
                      const bajos = stockFiltrado.filter(i => i.cantidad <= i.cantidad_minima);
                      if (bajos.length === 0) { showNotify("No hay items bajos", "error"); return; }
                      const getUbNombre = (id) => stockUbicaciones.find(u => u.id === id)?.nombre || id;
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`<html><head><title>Stock Bajo</title><style>body{font-family:Arial,sans-serif;padding:15px;font-size:10px}h1{font-size:16px;border-bottom:2px solid red;padding-bottom:8px;color:red;margin-bottom:10px}.item{display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #999;font-size:10px;line-height:1.2}.ub{color:#666;font-size:9px}.fecha{text-align:right;font-size:8px;color:#999;margin-top:15px}</style></head><body>`);
                      printWindow.document.write('<h1>⚠️ ITEMS CON STOCK BAJO</h1>');
                      bajos.forEach(i => printWindow.document.write(`<div class="item"><span>${escapeHtml(i.nombre)} <span class="ub">(${escapeHtml(getUbNombre(i.ubicacion))})</span></span><span style="color:red;font-weight:bold">${i.cantidad} / min:${i.cantidad_minima}</span></div>`));
                      printWindow.document.write(`<p class="fecha">Impreso: ${new Date().toLocaleString()}</p></body></html>`);
                      printWindow.document.close();
                      printWindow.print();
                    }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 border-t text-red-600">⚠️ Imprimir bajos</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filtro de turno para stock (admin/supervisor) */}
            {canSeeAllTurnos() && (
              <div className="flex gap-1.5 items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Turno:</span>
                <button onClick={() => setStockTurnoFilter(0)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${stockTurnoFilter === 0 ? 'bg-slate-800 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>Todos</button>
                {[1, 2, 3, 4].map(t => (
                  <button key={t} onClick={() => setStockTurnoFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${stockTurnoFilter === t ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>{t === 4 ? 'ZO' : `T${t}`}</button>
                ))}
              </div>
            )}
            
            {stockSearch && (
              <div className="bg-amber-50 rounded-xl border-2 border-amber-200 p-3">
                <p className="text-xs font-bold text-amber-700 mb-2">
                  {stockSearchScope === 'actual' 
                    ? `Resultados en ${ubicacionesFiltradas.find(u => u.id === selectedUbicacion)?.nombre || 'valija actual'}` 
                    : (stockTurnoEfectivo > 0 ? `Resultados en todas las valijas (${TURNOS[stockTurnoEfectivo]})` : 'Resultados en todas las valijas')}:
                </p>
                {(() => {
                  const q = stockSearch.toLowerCase();
                  const resultados = stockSearchScope === 'actual'
                    ? stockFiltrado.filter(i => i.ubicacion === selectedUbicacion && i.nombre.toLowerCase().includes(q))
                    : stockFiltrado.filter(i => i.nombre.toLowerCase().includes(q));
                  if (resultados.length === 0) return <p className="text-amber-600 text-sm">No encontrado</p>;
                  const getUbNombre = (id) => stockUbicaciones.find(u => u.id === id)?.nombre || id;
                  const getTurnoLabel = (id) => { const ub = stockUbicaciones.find(u => u.id === id); return ub ? (ub.turno === 4 ? 'ZO' : `T${ub.turno || 1}`) : ''; };
                  return (<div className="space-y-1 max-h-48 overflow-y-auto">{resultados.map(item => (
                    <div key={item.id} onClick={() => { 
                      setSelectedUbicacion(item.ubicacion); 
                      setStockSearch(''); 
                      setHighlightedItem(item.id); 
                      setTimeout(() => { const el = document.querySelector(`[data-stock-id="${item.id}"]`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
                      setTimeout(() => setHighlightedItem(null), 6000); 
                    }} className={`flex items-center justify-between p-2 rounded-lg text-sm cursor-pointer hover:ring-2 hover:ring-amber-400 ${item.cantidad <= item.cantidad_minima ? 'bg-red-100' : 'bg-white'}`}>
                      <span className="font-bold">{item.nombre}</span>
                      <div className="flex items-center gap-2">
                        {stockSearchScope === 'todas' && canSeeAllTurnos() && <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">{getTurnoLabel(item.ubicacion)}</span>}
                        {stockSearchScope === 'todas' && <span className="text-xs text-slate-500">{getUbNombre(item.ubicacion)}</span>}
                        <span className={`text-[9px] px-1 rounded ${item.tipo === 'fijo' ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>{item.tipo === 'fijo' ? '🔧' : '📦'}</span>
                        <span className={`font-black ${item.cantidad <= item.cantidad_minima ? 'text-red-600' : 'text-slate-800'}`}>{item.cantidad}</span>
                      </div>
                    </div>
                  ))}</div>);
                })()}
              </div>
            )}
            
            <div className="flex flex-wrap gap-1 items-center">
              {ubicacionesFiltradas.map(ub => {
                const alertas = stockFiltrado.filter(i => i.ubicacion === ub.id && i.cantidad <= i.cantidad_minima).length;
                const turnoLabel = canSeeAllTurnos() && stockTurnoEfectivo === 0 ? (ub.turno === 4 ? ' ZO' : ` T${ub.turno || 1}`) : '';
                return (<button key={ub.id} onClick={() => { setSelectedUbicacion(ub.id); setStockSearch(''); }} className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 ${selectedUbicacion === ub.id ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{ub.nombre}{turnoLabel && <span className={`text-[8px] px-1 py-0.5 rounded ${selectedUbicacion === ub.id ? 'bg-indigo-400/50' : 'bg-indigo-100 text-indigo-600'}`}>{turnoLabel}</span>}{alertas > 0 && <span className="bg-red-500 text-white text-[8px] px-1 rounded-full" title={`${alertas} item${alertas > 1 ? 's' : ''} por debajo del mínimo`}>{alertas}</span>}</button>);
              })}
              {canManageStock() && (
                <button onClick={() => setShowUbicacionesModal(true)} className="px-2 py-1.5 rounded-lg font-bold text-xs bg-teal-100 text-teal-700 hover:bg-teal-200">⚙️</button>
              )}
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700 text-sm">{stockFiltrado.filter(i => i.ubicacion === selectedUbicacion).length} items</span>
                {canManageStock() && (<button onClick={() => { setEditingItem({ ubicacion: selectedUbicacion }); setItemNombreInput(''); setItemSugerencias([]); }} className="px-3 py-1 bg-emerald-500 text-white rounded-lg font-bold text-xs">+ Nuevo</button>)}
              </div>
              
              {editingItem && (
                <div className="bg-slate-50 rounded-lg p-2 mb-2">
                  <div className="flex flex-wrap gap-1 items-center">
                    <div className="relative flex-1 min-w-[150px]">
                      <input 
                        id="itemNombre" 
                        placeholder="Escribí para buscar..."
                        value={itemNombreInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setItemNombreInput(val);
                          const todosLosItems = stockItems || [];
                          const nombresUnicos = [...new Set(todosLosItems.map(i => i.nombre).filter(Boolean))].sort();
                          if (val.length >= 2) {
                            setItemSugerencias(nombresUnicos.filter(n => n.toLowerCase().includes(val.toLowerCase())).slice(0, 10));
                          } else {
                            setItemSugerencias([]);
                          }
                        }}
                        onFocus={(e) => {
                          const rect = e.target.getBoundingClientRect();
                          window._suggestionPos = { top: rect.bottom + 2, left: rect.left, width: rect.width };
                          const todosLosItems = stockItems || [];
                          const nombresUnicos = [...new Set(todosLosItems.map(i => i.nombre).filter(Boolean))].sort();
                          if (itemNombreInput.length >= 2) {
                            setItemSugerencias(nombresUnicos.filter(n => n.toLowerCase().includes(itemNombreInput.toLowerCase())).slice(0, 10));
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setItemSugerencias([]), 200);
                        }}
                        className="w-full px-2 py-1 border-2 border-slate-300 rounded text-xs font-bold focus:border-emerald-500" 
                        autoComplete="off"
                      />
                      {itemSugerencias.length > 0 && window._suggestionPos && (
                        <div 
                          style={{
                            position: 'fixed',
                            top: window._suggestionPos.top,
                            left: window._suggestionPos.left,
                            width: window._suggestionPos.width,
                            zIndex: 99999
                          }}
                          className="bg-white border-2 border-emerald-500 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
                        >
                          {itemSugerencias.map((sug, idx) => (
                            <div 
                              key={idx}
                              onMouseDown={(e) => { e.preventDefault(); setItemNombreInput(sug); setItemSugerencias([]); }}
                              className="px-3 py-2 text-sm font-bold hover:bg-emerald-100 cursor-pointer border-b border-slate-100 last:border-b-0"
                            >
                              {sug}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <select value={itemForm.tipo} onChange={e => setItemForm(f => ({...f, tipo: e.target.value}))} className="px-2 py-1 border rounded text-xs font-bold bg-white">
                      <option value="consumible">📦 Consumible</option>
                      <option value="fijo">🔧 Fijo</option>
                    </select>
                    <input type="number" placeholder="Cant" value={itemForm.cantidad} onChange={e => setItemForm(f => ({...f, cantidad: e.target.value}))} className="w-12 px-2 py-1 border rounded text-xs font-bold" />
                    <input type="number" placeholder="Min" value={itemForm.minimo} onChange={e => setItemForm(f => ({...f, minimo: e.target.value}))} className="w-12 px-2 py-1 border rounded text-xs font-bold" />
                    {!editingItem.id && <label className="flex items-center gap-1 text-[10px] bg-blue-100 px-2 py-1 rounded"><input type="checkbox" checked={itemForm.replicar} onChange={e => setItemForm(f => ({...f, replicar: e.target.checked}))} className="w-3 h-3" /><span>Todas</span></label>}
                    <button onClick={async () => {
                      const nombre = itemNombreInput.trim();
                      const tipo = itemForm.tipo;
                      const cantidad = parseInt(itemForm.cantidad) || 0;
                      const cantidad_minima = parseInt(itemForm.minimo) || 5;
                      if (!nombre) { showNotify("Nombre requerido", "error"); return; }
                      if (editingItem.id) { 
                        await sb.from('stock_items').update({ nombre, tipo, cantidad, cantidad_minima }).eq('id', editingItem.id); 
                        showNotify("Actualizado");
                      } else {
                        const replicar = itemForm.replicar;
                        if (replicar) {
                          const items = ubicacionesFiltradas.map(ub => {
                            const ubTurno = stockUbicaciones.find(u => u.id === ub.id)?.turno || getUserTurno();
                            return { nombre, tipo, ubicacion: ub.id, cantidad: ub.id === selectedUbicacion ? cantidad : 0, cantidad_minima, turno: ubTurno };
                          });
                          const { error } = await sb.from('stock_items').insert(items);
                        if (error) { showNotify("Error: " + error.message, "error"); return; }
                        showNotify(`Creado en ${ubicacionesFiltradas.length} ubicaciones`);
                      } else {
                        const ubTurno = stockUbicaciones.find(u => u.id === selectedUbicacion)?.turno || getUserTurno();
                        await sb.from('stock_items').insert([{ nombre, tipo, ubicacion: selectedUbicacion, cantidad, cantidad_minima, turno: ubTurno }]);
                        showNotify("Creado");
                      }
                    }
                    setEditingItem(null); setItemNombreInput(''); setItemSugerencias([]); loadData();
                  }} className="px-2 py-1 bg-emerald-500 text-white rounded text-xs font-bold">OK</button>
                  <button onClick={() => { setEditingItem(null); setItemNombreInput(''); setItemSugerencias([]); }} className="px-2 py-1 bg-slate-300 rounded text-xs">X</button>
                  </div>
                </div>
              )}
              
              <div className="max-h-[50vh] overflow-y-auto">
                {(() => {
                  const items = stockFiltrado.filter(i => i.ubicacion === selectedUbicacion);
                  if (items.length === 0) return <p className="text-slate-400 text-center py-4 text-xs">Sin items</p>;
                  
                  const consumibles = items.filter(i => i.tipo !== 'fijo');
                  const fijos = items.filter(i => i.tipo === 'fijo');
                  
                  const renderItem = (item, idx) => {
                    const bajo = item.cantidad <= item.cantidad_minima;
                    const highlighted = highlightedItem === item.id;
                    const bgColor = highlighted ? 'bg-yellow-200 ring-2 ring-yellow-400' : bajo ? 'bg-red-50' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-100';
                    const esConsumible = item.tipo !== 'fijo';
                    return (
                      <div key={item.id} data-stock-id={item.id} className={`flex items-center justify-between py-1 px-2 rounded ${bgColor} ${highlighted ? 'animate-pulse ring-2 ring-yellow-400' : ''}`}>
                        <div className="flex items-center gap-1 flex-1 min-w-0"><span className="font-semibold text-slate-800 text-sm truncate">{item.nombre}</span>{bajo && <span className="text-[8px] bg-red-500 text-white px-1 rounded cursor-help" title={`Stock bajo el mínimo: ${item.cantidad} de ${item.cantidad_minima}`}>!</span>}</div>
                        <div className="flex items-center gap-0.5">
                          {canManageStock() ? (<>
                            <button onClick={async () => { const c = prompt("Sacar:","1"); if(!c)return; const n=parseInt(c); if(isNaN(n)||n<=0)return; if(n>item.cantidad){showNotify("No hay","error");return;} await sb.from('stock_items').update({cantidad:item.cantidad-n}).eq('id',item.id); await sb.from('stock_movimientos').insert([{item_id:item.id,tipo:'salida',cantidad:n,user_id:session.user.id,user_nombre:userProfile.nombre,ubicacion:item.ubicacion,turno:item.turno}]); loadData(); }} className="w-6 h-6 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200">-</button>
                            <span className={`w-8 text-center text-sm font-black ${bajo?'text-red-600':'text-slate-700'}`}>{item.cantidad}</span>
                            <button onClick={async () => { const c = prompt("Agregar:","1"); if(!c)return; const n=parseInt(c); if(isNaN(n)||n<=0)return; await sb.from('stock_items').update({cantidad:item.cantidad+n}).eq('id',item.id); await sb.from('stock_movimientos').insert([{item_id:item.id,tipo:'entrada',cantidad:n,user_id:session.user.id,user_nombre:userProfile.nombre,ubicacion:item.ubicacion,turno:item.turno}]); loadData(); }} className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded text-xs font-bold hover:bg-emerald-200">+</button>
                            <button onClick={() => setTransferItem({ item, cantidad: 1, destino: '' })} className="w-6 h-6 bg-blue-100 text-blue-600 rounded text-[10px] font-bold hover:bg-blue-200" title="Transferir a otra ubicación">⇄</button>
                            <button onClick={()=>{setEditingItem(item); setItemNombreInput(item.nombre || ''); setItemSugerencias([]);}} className="w-6 h-6 text-slate-400 hover:bg-slate-100 rounded text-[10px]">✏</button>
                            <button onClick={async()=>{if(!confirm('Eliminar?'))return;await sb.from('stock_items').delete().eq('id',item.id);loadData();}} className="w-6 h-6 text-red-400 hover:bg-red-50 rounded text-[10px]">🗑</button>
                          </>) : esConsumible ? (<>
                            <button onClick={async () => { const c = prompt("Sacar:","1"); if(!c)return; const n=parseInt(c); if(isNaN(n)||n<=0)return; if(n>item.cantidad){showNotify("No hay suficiente","error");return;} await sb.from('stock_items').update({cantidad:item.cantidad-n}).eq('id',item.id); await sb.from('stock_movimientos').insert([{item_id:item.id,tipo:'salida',cantidad:n,user_id:session.user.id,user_nombre:userProfile.nombre,ubicacion:item.ubicacion,turno:item.turno}]); showNotify(`Retirado: ${n} ${item.nombre}`); loadData(); }} className="w-6 h-6 bg-red-100 text-red-600 rounded text-xs font-bold hover:bg-red-200">-</button>
                            <span className={`w-8 text-center text-sm font-black ${bajo?'text-red-600':'text-slate-700'}`}>{item.cantidad}</span>
                          </>) : (<span className={`text-sm font-black ${bajo?'text-red-600':'text-slate-700'}`}>{item.cantidad}</span>)}
                        </div>
                      </div>
                    );
                  };
                  
                  return (
                    <div className="space-y-3">
                      {consumibles.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-xs font-black text-amber-700 uppercase">📦 Consumibles</span>
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded">{consumibles.length}</span>
                          </div>
                          <div className="space-y-0.5 border-l-2 border-amber-300 pl-2">
                            {consumibles.map((item, idx) => renderItem(item, idx))}
                          </div>
                        </div>
                      )}
                      {fijos.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-xs font-black text-slate-600 uppercase">🔧 Elementos Fijos</span>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded">{fijos.length}</span>
                          </div>
                          <div className="space-y-0.5 border-l-2 border-slate-300 pl-2">
                            {fijos.map((item, idx) => renderItem(item, idx))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-2">
              <details><summary className="font-bold text-slate-700 text-xs cursor-pointer">📜 Movimientos de {ubicacionesFiltradas.find(u => u.id === selectedUbicacion)?.nombre || 'esta ubicación'}</summary>
              <div className="space-y-0.5 max-h-48 overflow-y-auto mt-2">
                {(() => {
                  // Filtrar movimientos SOLO de esta ubicación Y de este turno
                  const ubTurno = stockUbicaciones.find(u => u.id === selectedUbicacion)?.turno;
                  const movsFiltrados = stockMovimientos.filter(m => 
                    m.ubicacion === selectedUbicacion && 
                    (ubTurno == null || m.turno === ubTurno || !m.turno)
                  ).slice(0, 30);
                  
                  if (movsFiltrados.length === 0) return <p className="text-slate-400 text-center py-2 text-xs">Sin movimientos en esta ubicación</p>;
                  
                  return movsFiltrados.map(mov => {
                    const item = stockItems.find(i => i.id === mov.item_id);
                    const fecha = new Date(mov.created_at);
                    const fechaStr = `${fecha.getDate()}/${fecha.getMonth()+1} ${fecha.getHours()}:${String(fecha.getMinutes()).padStart(2,'0')}`;
                    const esTransferencia = mov.descripcion && (mov.descripcion.startsWith('Transferido') || mov.descripcion.startsWith('Recibido'));
                    return (<div key={mov.id} className={`flex items-center justify-between py-0.5 px-2 rounded text-xs ${esTransferencia ? 'bg-blue-50' : mov.tipo==='entrada' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      <span className={`font-bold ${esTransferencia ? 'text-blue-700' : mov.tipo==='entrada' ? 'text-emerald-700' : 'text-red-700'}`}>{esTransferencia ? '⇄' : mov.tipo==='entrada' ? '+' : '-'}{mov.cantidad} {item?.nombre||'?'}{esTransferencia ? ` (${mov.descripcion})` : ''}</span>
                      <span className="text-slate-400 text-[10px]">{mov.user_nombre?.split(' ')[0]} • {fechaStr}</span>
                    </div>);
                  });
                })()}
              </div></details>
            </div>
          </div>
        );})()}

        {/* MODAL TRANSFERENCIA DE STOCK */}
        {transferItem && (() => {
          const { item } = transferItem;
          const origenUb = stockUbicaciones.find(u => u.id === item.ubicacion);
          // Destinos posibles: todas las ubicaciones excepto la actual
          const destinos = stockUbicaciones.filter(u => u.id !== item.ubicacion);
          
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "var(--bg-modal-overlay)", backdropFilter: "blur(12px)" }} onClick={() => setTransferItem(null)}>
              <div className="bg-white w-full max-w-sm rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
                <div className="p-5 sm:p-8 bg-blue-600 text-white">
                  <h3 className="font-black uppercase text-sm flex items-center gap-2">⇄ Transferir Item</h3>
                  <p className="text-blue-200 text-xs mt-1">{item.nombre} — {origenUb?.nombre || item.ubicacion}</p>
                  <p className="text-blue-300 text-[10px] mt-0.5">Stock actual: {item.cantidad}</p>
                </div>
                <div className="p-5 sm:p-8 space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Cantidad a transferir</label>
                    <input 
                      type="number" 
                      min="1" 
                      max={item.cantidad} 
                      value={transferItem.cantidad} 
                      onChange={(e) => setTransferItem(prev => ({...prev, cantidad: parseInt(e.target.value) || 0}))} 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-lg text-center" 
                    />
                    {transferItem.cantidad > item.cantidad && <p className="text-red-500 text-xs mt-1 font-bold">No hay suficiente stock ({item.cantidad} disponibles)</p>}
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Destino</label>
                    {destinos.length === 0 ? (
                      <p className="text-slate-400 text-sm p-4 bg-slate-50 rounded-xl text-center">No hay otras ubicaciones disponibles</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {destinos.map(ub => {
                          const isSelected = transferItem.destino === ub.id;
                          const turnoLabel = ub.turno === 4 ? 'ZO' : `T${ub.turno || 1}`;
                          // Ver si el item ya existe en destino
                          const existeEnDestino = stockItems.find(i => i.nombre === item.nombre && i.ubicacion === ub.id);
                          return (
                            <button 
                              key={ub.id} 
                              onClick={() => setTransferItem(prev => ({...prev, destino: ub.id}))}
                              className={`w-full text-left p-3 rounded-xl border-2 transition-all flex justify-between items-center ${isSelected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isSelected ? 'bg-blue-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>{turnoLabel}</span>
                                <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{ub.nombre}</span>
                              </div>
                              {existeEnDestino && <span className="text-[9px] text-slate-400">ya tiene {existeEnDestino.cantidad}</span>}
                              {isSelected && <span className="text-blue-500 font-black">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={async () => {
                        const cant = transferItem.cantidad;
                        const destId = transferItem.destino;
                        if (!cant || cant <= 0 || cant > item.cantidad) { showNotify("Cantidad inválida", "error"); return; }
                        if (!destId) { showNotify("Seleccioná un destino", "error"); return; }
                        
                        const destUb = stockUbicaciones.find(u => u.id === destId);
                        const destTurno = destUb?.turno || 1;
                        const origenNombre = origenUb?.nombre || item.ubicacion;
                        const destNombre = destUb?.nombre || destId;
                        
                        try {
                          // 1. Restar del origen
                          await sb.from('stock_items').update({ cantidad: item.cantidad - cant }).eq('id', item.id);
                          
                          // 2. Buscar si ya existe en destino
                          const existente = stockItems.find(i => i.nombre === item.nombre && i.ubicacion === destId);
                          if (existente) {
                            // Sumar al existente
                            await sb.from('stock_items').update({ cantidad: existente.cantidad + cant }).eq('id', existente.id);
                          } else {
                            // Crear nuevo en destino
                            await sb.from('stock_items').insert([{ 
                              nombre: item.nombre, 
                              tipo: item.tipo, 
                              ubicacion: destId, 
                              cantidad: cant, 
                              cantidad_minima: item.cantidad_minima, 
                              turno: destTurno 
                            }]);
                          }
                          
                          // 3. Registrar movimientos
                          await sb.from('stock_movimientos').insert([
                            { item_id: item.id, tipo: 'salida', cantidad: cant, descripcion: `Transferido a ${destNombre}`, user_id: session.user.id, user_nombre: userProfile.nombre, ubicacion: item.ubicacion, turno: item.turno },
                            { item_id: existente?.id || item.id, tipo: 'entrada', cantidad: cant, descripcion: `Recibido de ${origenNombre}`, user_id: session.user.id, user_nombre: userProfile.nombre, ubicacion: destId, turno: destTurno }
                          ]);
                          
                          // 4. Log
                          await addLog('TRANSFERIR_STOCK', `${cant}x ${item.nombre}: ${origenNombre} → ${destNombre}`);
                          
                          showNotify(`Transferido: ${cant}x ${item.nombre} → ${destNombre}`);
                          setTransferItem(null);
                          loadData();
                        } catch (err) {
                          showNotify("Error: " + err.message, "error");
                        }
                      }}
                      disabled={!transferItem.destino || transferItem.cantidad <= 0 || transferItem.cantidad > item.cantidad}
                      className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-black uppercase text-xs transition-all flex items-center justify-center gap-2"
                    >
                      ⇄ Transferir
                    </button>
                    <button onClick={() => setTransferItem(null)} className="px-6 py-4 bg-slate-200 text-slate-600 rounded-xl font-black uppercase text-xs hover:bg-slate-300">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* AUDITORÍA DE USUARIOS (Admin/Supervisor/Encargado) */}
        {currentView === 'auditoria' && canAudit() && (() => {
          // Turno efectivo para auditoría: encargado forzado, admin/supervisor eligen
          const auditEffectiveTurno = canSeeAllTurnos() ? auditTurnoFilter : getUserTurno();
          const auditableProfiles = auditEffectiveTurno === 0 
            ? profiles 
            : profiles.filter(p => p.turno === auditEffectiveTurno || p.permisos?.ver_todos_turnos);
          return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800">🔍 Auditar Usuario</h2>
              <p className="text-xs text-slate-600 font-bold uppercase mt-1">
                {auditEffectiveTurno > 0 ? `Ver pendientes (${TURNOS[auditEffectiveTurno]})` : 'Ver pendientes por persona (todos los turnos)'}
              </p>
            </div>
            
            {/* Filtro de turno para auditoría */}
            {canSeeAllTurnos() ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Turno:</span>
                <button onClick={() => { setAuditTurnoFilter(0); setSelectedAuditUser(null); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${auditTurnoFilter === 0 ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Todos</button>
                {[1, 2, 3, 4].map(t => (
                  <button key={t} onClick={() => { setAuditTurnoFilter(t); setSelectedAuditUser(null); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${auditTurnoFilter === t ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{t === 4 ? 'ZO' : `T${t}`}</button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-xl w-fit">
                <span className="text-[10px] font-black text-indigo-600 uppercase">Turno: {TURNOS[getUserTurno()]}</span>
              </div>
            )}
            
            {/* Selector de usuario */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Seleccionar usuario</label>
              <select 
                value={selectedAuditUser?.id || ''} 
                onChange={(e) => {
                  const user = profiles.find(p => p.id === e.target.value);
                  setSelectedAuditUser(user || null);
                }}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold cursor-pointer"
              >
                <option value="">-- Elegir usuario --</option>
                {auditableProfiles.map(p => <option key={p.id} value={p.id}>{p.nombre} ({ROLES[p.role]?.label || p.role}) {auditEffectiveTurno === 0 ? `- ${p.turno === 4 ? 'ZO' : `T${p.turno || 1}`}` : ''}</option>)}
              </select>
            </div>

            {/* Resultados de auditoría */}
            {selectedAuditUser && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-900 text-white rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">{selectedAuditUser.nombre?.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3 className="text-2xl font-black">{selectedAuditUser.nombre}</h3>
                      <p className="text-slate-400 text-sm uppercase font-bold flex items-center gap-2">
                        {ROLES[selectedAuditUser.role]?.label || selectedAuditUser.role}
                        {!selectedAuditUser.permisos?.ver_todos_turnos && (
                          <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-300 rounded text-[10px]">T{selectedAuditUser.turno || 1}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {(() => {
                  const userPendingNovedades = novedades.filter(n => {
                    const { isAssigned, assignments } = getUserAssignment(n, selectedAuditUser);
                    return isAssigned && !areUserTasksComplete(n, assignments);
                  });
                  
                  // Comisiones y eventos pueden estar en completadas
                  const allNov = [...novedades, ...completedNov];
                  const userComisiones = allNov.filter(n => 
                    n.es_comision && (
                      n.comision_carga_sgsp === selectedAuditUser.nombre ||
                      n.comision_chofer === selectedAuditUser.nombre ||
                      n.comision_acompanante === selectedAuditUser.nombre
                    )
                  );
                  
                  // Eventos sociales donde participó el usuario
                  const userEventos = allNov.filter(n => 
                    n.es_evento_social && (
                      n.evento_fotografo === selectedAuditUser.nombre ||
                      n.evento_acompanante1 === selectedAuditUser.nombre ||
                      n.evento_acompanante2 === selectedAuditUser.nombre ||
                      n.evento_acompanante3 === selectedAuditUser.nombre
                    )
                  );
                  
                  const stats = getUserDetailedStats(selectedAuditUser);
                  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

                  return (
                    <>
                      {/* Novedades concurridas */}
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 shadow-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-black">{stats.novedadesConcurridas}</div>
                            <div className="text-[10px] font-bold uppercase opacity-90">Novedades Concurridas</div>
                          </div>
                          <div className="flex gap-3 text-center">
                            <div className="bg-white/20 rounded-xl px-3 py-2">
                              <div className="text-lg font-black">{stats.novedadesNormales}</div>
                              <div className="text-[8px] uppercase">Pericias</div>
                            </div>
                            <div className="bg-white/20 rounded-xl px-3 py-2">
                              <div className="text-lg font-black">{stats.novedadesComisiones}</div>
                              <div className="text-[8px] uppercase">Comisiones</div>
                            </div>
                            <div className="bg-white/20 rounded-xl px-3 py-2">
                              <div className="text-lg font-black">{stats.novedadesEventos}</div>
                              <div className="text-[8px] uppercase">Eventos</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Estadísticas de tareas */}
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3 rounded-2xl text-center shadow-md border border-slate-200">
                          <div className="text-2xl font-black text-slate-800">{stats.total}</div>
                          <div className="text-[8px] text-slate-500 font-bold uppercase">Tareas</div>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-2xl text-center shadow-md border border-emerald-200">
                          <div className="text-2xl font-black text-emerald-700">{stats.done}</div>
                          <div className="text-[8px] text-emerald-600 font-bold uppercase">Completadas</div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-2xl text-center shadow-md border border-red-200">
                          <div className="text-2xl font-black text-red-600">{stats.pending}</div>
                          <div className="text-[8px] text-red-500 font-bold uppercase">Pendientes</div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-2xl text-center shadow-md border border-orange-200">
                          <div className="text-2xl font-black text-orange-700">{stats.totalComisiones}</div>
                          <div className="text-[8px] text-orange-600 font-bold uppercase">Comisiones</div>
                        </div>
                        <div className="bg-pink-50 p-3 rounded-2xl text-center shadow-md border border-pink-200">
                          <div className="text-2xl font-black text-pink-700">{stats.totalEventos || 0}</div>
                          <div className="text-[8px] text-pink-600 font-bold uppercase">Eventos</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-2xl text-center shadow-md border border-blue-200">
                          <div className="text-2xl font-black text-blue-700">{pct}%</div>
                          <div className="text-[8px] text-blue-600 font-bold uppercase">Avance</div>
                        </div>
                      </div>

                      {/* Desglose por tipo */}
                      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
                        <h4 className="text-sm font-black text-slate-700 mb-4 uppercase">Desglose por tipo</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-slate-50 p-4 rounded-xl text-center">
                            <div className="text-xs font-bold text-slate-600 mb-1">Inf. Actuación</div>
                            <div className="text-lg font-black"><span className="text-emerald-600">{stats.informeActuacion.c}</span><span className="text-slate-400">/</span><span className="text-slate-700">{stats.informeActuacion.a}</span></div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl text-center">
                            <div className="text-xs font-bold text-slate-600 mb-1">Criminalístico</div>
                            <div className="text-lg font-black"><span className="text-emerald-600">{stats.informeCriminalistico.c}</span><span className="text-slate-400">/</span><span className="text-slate-700">{stats.informeCriminalistico.a}</span></div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl text-center">
                            <div className="text-xs font-bold text-slate-600 mb-1">Pericial</div>
                            <div className="text-lg font-black"><span className="text-emerald-600">{stats.informePericial.c}</span><span className="text-slate-400">/</span><span className="text-slate-700">{stats.informePericial.a}</span></div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl text-center">
                            <div className="text-xs font-bold text-slate-600 mb-1">Croquis</div>
                            <div className="text-lg font-black"><span className="text-emerald-600">{stats.croquis.c}</span><span className="text-slate-400">/</span><span className="text-slate-700">{stats.croquis.a}</span></div>
                          </div>
                        </div>
                        {stats.totalComisiones > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <h5 className="text-xs font-black text-orange-600 mb-3 uppercase">🚗 Comisiones ({stats.totalComisiones})</h5>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-orange-50 p-4 rounded-xl text-center">
                                <div className="text-xs font-bold text-orange-600 mb-1">Carga SGSP</div>
                                <div className="text-lg font-black text-orange-700">{stats.comisiones.cargaSgsp}</div>
                              </div>
                              <div className="bg-orange-50 p-4 rounded-xl text-center">
                                <div className="text-xs font-bold text-orange-600 mb-1">Chofer</div>
                                <div className="text-lg font-black text-orange-700">{stats.comisiones.chofer}</div>
                              </div>
                              <div className="bg-orange-50 p-4 rounded-xl text-center">
                                <div className="text-xs font-bold text-orange-600 mb-1">Acompañante</div>
                                <div className="text-lg font-black text-orange-700">{stats.comisiones.acompanante}</div>
                              </div>
                            </div>
                          </div>
                        )}
                        {stats.totalEventos > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <h5 className="text-xs font-black text-pink-600 mb-3 uppercase">🎉 Eventos Sociales ({stats.totalEventos})</h5>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-pink-50 p-4 rounded-xl text-center">
                                <div className="text-xs font-bold text-pink-600 mb-1">Fotógrafo</div>
                                <div className="text-lg font-black text-pink-700">{stats.eventos.fotografo}</div>
                              </div>
                              <div className="bg-pink-50 p-4 rounded-xl text-center">
                                <div className="text-xs font-bold text-pink-600 mb-1">Acompañante</div>
                                <div className="text-lg font-black text-pink-700">{stats.eventos.acompanante}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Lista de pendientes */}
                      <div>
                        <h4 className="text-sm font-black text-slate-700 mb-4 uppercase">Novedades con tareas pendientes ({userPendingNovedades.length})</h4>
                        {userPendingNovedades.length === 0 ? (
                          <div className="text-center py-12 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-300">
                            <div className="text-4xl mb-2">🎉</div>
                            <p className="text-emerald-600 font-bold">¡Sin pendientes!</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {userPendingNovedades.map(n => {
                              const { assignments } = getUserAssignment(n, selectedAuditUser);
                              return (
                                <div key={n.id} className="bg-white rounded-xl p-4 shadow-md border border-slate-200">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-black text-slate-800">Novedad {n.numero_novedad}</h5>
                                      <p className="text-xs text-slate-500">SGSP: {n.numero_sgsp} {n.titulo && `• ${n.titulo}`}</p>
                                    </div>
                                    <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-600">{n.anio}</span>
                                  </div>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {assignments.map(a => {
                                      const done = n[a.checkKey] || (n.checks && n.checks[a.checkKeyOld]);
                                      return (
                                        <span key={a.checkKey} className={`text-xs px-3 py-1 rounded-full font-bold ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                          {a.label} {done ? '✓' : '✗'}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Lista de comisiones */}
                      {userComisiones.length > 0 && (
                        <div>
                          <h4 className="text-sm font-black text-orange-600 mb-4 uppercase">🚗 Comisiones ({userComisiones.length})</h4>
                          <div className="space-y-3">
                            {userComisiones.map(n => {
                              const roles = [];
                              if (n.comision_carga_sgsp === selectedAuditUser.nombre) roles.push('Carga SGSP');
                              if (n.comision_chofer === selectedAuditUser.nombre) roles.push('Chofer');
                              if (n.comision_acompanante === selectedAuditUser.nombre) roles.push('Acompañante');
                              return (
                                <div key={n.id} className="bg-orange-50 rounded-xl p-4 shadow-md border border-orange-200">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-black text-orange-800">Novedad {n.numero_novedad}</h5>
                                      <p className="text-xs text-orange-600">SGSP: {n.numero_sgsp} {n.titulo && `• ${n.titulo}`}</p>
                                    </div>
                                    <span className="text-xs bg-orange-200 px-2 py-1 rounded font-bold text-orange-700">{n.anio}</span>
                                  </div>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {roles.map(r => (
                                      <span key={r} className="text-xs px-3 py-1 rounded-full font-bold bg-orange-200 text-orange-700">
                                        {r} ✓
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Lista de eventos sociales */}
                      {userEventos.length > 0 && (
                        <div>
                          <h4 className="text-sm font-black text-pink-600 mb-4 uppercase">🎉 Eventos Sociales ({userEventos.length})</h4>
                          <div className="space-y-3">
                            {userEventos.map(n => {
                              const roles = [];
                              if (n.evento_fotografo === selectedAuditUser.nombre) roles.push('Fotógrafo');
                              if (n.evento_acompanante1 === selectedAuditUser.nombre) roles.push('Acompañante');
                              if (n.evento_acompanante2 === selectedAuditUser.nombre) roles.push('Acompañante');
                              if (n.evento_acompanante3 === selectedAuditUser.nombre) roles.push('Acompañante');
                              return (
                                <div key={n.id} className="bg-pink-50 rounded-xl p-4 shadow-md border border-pink-200">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-black text-pink-800">Novedad {n.numero_novedad}</h5>
                                      <p className="text-xs text-pink-600">{n.numero_sgsp ? `SGSP: ${n.numero_sgsp}` : 'Sin SGSP'} {n.titulo && `• ${n.titulo}`}</p>
                                    </div>
                                    <span className="text-xs bg-pink-200 px-2 py-1 rounded font-bold text-pink-700">{n.anio}</span>
                                  </div>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {roles.map((r, idx) => (
                                      <span key={idx} className="text-xs px-3 py-1 rounded-full font-bold bg-pink-200 text-pink-700">
                                        {r} ✓
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        );})()}
      </main>

      {/* MODAL CAMBIAR CONTRASEÑA */}
      {showPassModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "var(--bg-modal-overlay)", backdropFilter: "blur(12px)" }}>
          <div className="bg-white w-full max-w-sm rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-5 sm:p-8 bg-slate-900 text-white flex justify-between items-center"><h3 className="font-black uppercase text-sm">Cambiar Contraseña</h3><button onClick={() => setShowPassModal(false)} className="text-slate-500 hover:text-white">✕</button></div>
            <form className="p-8 space-y-5" onSubmit={async (e) => { e.preventDefault(); const pass = e.target.pass.value; if(pass.length < 6) return alert("Mínimo 6 caracteres"); const { error } = await sb.auth.updateUser({ password: pass }); if(error) showNotify("Error: " + error.message, "error"); else { await addLog('CAMBIO_PASS', 'Actualizó contraseña'); showNotify("Contraseña actualizada"); setShowPassModal(false); } }}>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Mínimo 6 caracteres</p>
              <input name="pass" type="password" placeholder="Nueva contraseña..." required className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
              <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs shadow-xl">Actualizar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL UBICACIONES DE STOCK */}
      {showUbicacionesModal && canManageStock() && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "var(--bg-modal-overlay)", backdropFilter: "blur(12px)" }} onClick={() => { setShowUbicacionesModal(false); setEditingUbicacion(null); }}>
          <div className="bg-white w-full max-w-md rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-teal-600 text-white flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-black uppercase text-sm">⚙️ Gestionar Ubicaciones</h3>
              <button onClick={() => { setShowUbicacionesModal(false); setEditingUbicacion(null); }} className="text-teal-200 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Formulario nueva/editar ubicación */}
              <form onSubmit={async (e) => {
                e.preventDefault();
                const id = e.target.ubId.value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                const nombre = e.target.ubNombre.value.trim();
                if (!id || !nombre) { showNotify("Completar ID y nombre", "error"); return; }
                
                if (editingUbicacion) {
                  // Actualizar nombre
                  const { error } = await sb.from('stock_ubicaciones').update({ nombre }).eq('id', editingUbicacion.id);
                  if (error) { showNotify("Error: " + error.message, "error"); return; }
                  showNotify("Ubicación actualizada");
                  setEditingUbicacion(null);
                } else {
                  // Crear nueva con turno — usar stockTurnoFilter si está seleccionado, o el selector del form
                  const turnoParaUbicacion = canSeeAllTurnos() 
                    ? parseInt(e.target.ubTurno?.value || stockTurnoFilter || getUserTurno(), 10) 
                    : getUserTurno();
                  const ubicacionesDelTurno = stockUbicaciones.filter(u => u.turno === turnoParaUbicacion);
                  const maxOrden = Math.max(0, ...ubicacionesDelTurno.map(u => u.orden || 0));
                  const { error } = await sb.from('stock_ubicaciones').insert([{ id, nombre, orden: maxOrden + 1, turno: turnoParaUbicacion, created_by: session.user.id }]);
                  if (error) { 
                    if (error.code === '23505') showNotify("Ya existe una ubicación con ese ID", "error");
                    else showNotify("Error: " + error.message, "error"); 
                    return; 
                  }
                  showNotify(`Ubicación creada en ${TURNOS[turnoParaUbicacion]}`);
                }
                e.target.reset();
                loadData();
              }} className="bg-slate-50 p-4 rounded-xl space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase">{editingUbicacion ? '✏️ Editar ubicación' : '➕ Nueva ubicación'}</p>
                <div className="flex gap-2">
                  <input 
                    name="ubId" 
                    placeholder="ID (ej: valija_nueva)" 
                    defaultValue={editingUbicacion?.id || ''}
                    disabled={!!editingUbicacion}
                    className={`flex-1 px-3 py-2 border rounded-lg text-sm font-bold ${editingUbicacion ? 'bg-slate-200 text-slate-500' : ''}`} 
                  />
                  <input 
                    name="ubNombre" 
                    placeholder="Nombre visible" 
                    defaultValue={editingUbicacion?.nombre || ''}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm font-bold" 
                  />
                  {/* Selector de turno para admin/supervisor al crear nueva ubicación */}
                  {canSeeAllTurnos() && !editingUbicacion && (
                    <select name="ubTurno" defaultValue={stockTurnoFilter || getUserTurno()} className="px-2 py-2 border rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700">
                      <option value="1">T1</option>
                      <option value="2">T2</option>
                      <option value="3">T3</option>
                      <option value="4">ZO</option>
                    </select>
                  )}
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-2 bg-teal-600 text-white rounded-lg font-bold text-xs">
                    {editingUbicacion ? 'Guardar' : 'Crear'}
                  </button>
                  {editingUbicacion && (
                    <button type="button" onClick={() => setEditingUbicacion(null)} className="px-4 py-2 bg-slate-300 rounded-lg font-bold text-xs">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              {/* Lista de ubicaciones */}
              <div className="space-y-2">
                {(() => {
                  // Admin/supervisor: mostrar agrupado por turno; otros: solo su turno
                  const turnosToShow = canSeeAllTurnos() 
                    ? (stockTurnoFilter > 0 ? [stockTurnoFilter] : [1, 2, 3, 4])
                    : [getUserTurno()];
                  
                  return turnosToShow.map(t => {
                    const ubicacionesDelTurno = stockUbicaciones.filter(u => u.turno === t);
                    if (ubicacionesDelTurno.length === 0) return null;
                    return (
                      <div key={t} className="mb-3">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{TURNOS[t]} ({ubicacionesDelTurno.length})</p>
                        {ubicacionesDelTurno.map((ub, idx) => {
                          const itemCount = stockItems.filter(i => i.ubicacion === ub.id).length;
                      return (
                        <div key={ub.id} className="flex items-center justify-between bg-white border rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs font-bold">{idx + 1}.</span>
                            <span className="font-bold text-sm">{ub.nombre}</span>
                            <span className="text-[10px] text-slate-400">({ub.id})</span>
                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded">{itemCount} items</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => setEditingUbicacion(ub)} 
                              className="w-7 h-7 bg-amber-100 text-amber-700 rounded text-xs hover:bg-amber-200"
                            >✏️</button>
                            {itemCount === 0 && (
                              <button 
                                onClick={async () => {
                                  if (!confirm(`¿Eliminar "${ub.nombre}"?`)) return;
                                  const { error } = await sb.from('stock_ubicaciones').delete().eq('id', ub.id);
                                  if (error) { showNotify("Error: " + error.message, "error"); return; }
                                  showNotify("Ubicación eliminada");
                                  loadData();
                                }} 
                                className="w-7 h-7 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                              >Eliminar</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                      </div>
                    );
                  });
                })()}
              </div>

              <p className="text-[10px] text-slate-400 text-center">Solo se pueden eliminar ubicaciones sin items</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ESTADÍSTICAS */}
      {showStats && canSeeStats() && (() => {
        // Turno efectivo para estadísticas: encargado forzado a su turno, admin/supervisor eligen
        const statsEffectiveTurno = canSeeAllTurnos() ? statsTurnoFilter : getUserTurno();
        const statsProfiles = statsEffectiveTurno === 0 
          ? profiles 
          : profiles.filter(p => p.turno === statsEffectiveTurno || p.permisos?.ver_todos_turnos);
        const currentStats = getFilteredStats(statsEffectiveTurno);
        
        return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "var(--bg-modal-overlay)", backdropFilter: "blur(12px)" }} onClick={() => { setShowStats(false); setSelectedUserStats(null); setStatsYear('todos'); setStatsTurnoFilter(0); }}>
          <div className="bg-white w-full max-w-lg rounded-[2rem] sm:rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 sm:p-8 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-black uppercase text-sm">📊 Estadísticas {statsEffectiveTurno > 0 ? `— ${TURNOS[statsEffectiveTurno]}` : ''}</h3>
              <div className="flex gap-2">
                <button onClick={() => {
                  const rows = statsProfiles.map(p => {
                    const s = getUserDetailedStats(p, statsYear);
                    return [p.nombre, p.role, p.turno || 1, s.informeActuacion.c + '/' + s.informeActuacion.a, s.informeCriminalistico.c + '/' + s.informeCriminalistico.a, s.informePericial.c + '/' + s.informePericial.a, s.croquis.c + '/' + s.croquis.a, s.totalComisiones, s.totalEventos, s.juicios, s.total, s.done, s.total > 0 ? Math.round((s.done / s.total) * 100) + '%' : '0%'];
                  });
                  const turnoLabel = statsEffectiveTurno > 0 ? `_${TURNOS[statsEffectiveTurno].replace(/\s/g, '')}` : '';
                  exportCSV(`estadisticas_${statsYear}${turnoLabel}.csv`, ['Nombre', 'Rol', 'Turno', 'Inf.Actuación', 'Criminalístico', 'Pericial', 'Croquis', 'Comisiones', 'Eventos', 'Juicios', 'Total', 'Completadas', '% Completado'], rows);
                  showNotify("CSV exportado");
                }} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs font-bold transition-all">📥 CSV</button>
                <button onClick={() => { setShowStats(false); setSelectedUserStats(null); setStatsYear('todos'); setStatsTurnoFilter(0); }} className="text-slate-500 hover:text-white">✕</button>
              </div>
            </div>
            <div className="p-5 sm:p-8 space-y-6">
              {/* Filtros: año + turno */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Año:</label>
                  <select 
                    value={statsYear} 
                    onChange={(e) => setStatsYear(e.target.value)}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="todos">Todos los años</option>
                    {getAvailableStatsYears().map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                {/* Filtro de turno: admin/supervisor pueden elegir, encargado ve solo su turno */}
                {canSeeAllTurnos() ? (
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Turno:</label>
                    <div className="flex gap-1.5 flex-1">
                      <button onClick={() => setStatsTurnoFilter(0)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statsTurnoFilter === 0 ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Todos</button>
                      {[1, 2, 3, 4].map(t => (
                        <button key={t} onClick={() => setStatsTurnoFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statsTurnoFilter === t ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{t === 4 ? 'ZO' : `T${t}`}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <span className="text-[10px] font-black text-indigo-600 uppercase">Turno: {TURNOS[getUserTurno()]}</span>
                  </div>
                )}
              </div>
              
              {/* Resumen general */}
              <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4">Resumen {statsYear !== 'todos' ? `(${statsYear})` : ''} {statsEffectiveTurno > 0 ? `— ${TURNOS[statsEffectiveTurno]}` : ''}</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <div className="bg-slate-100 p-3 rounded-2xl text-center">
                    <div className="text-2xl font-black text-slate-800">{currentStats.totalNovedades}</div>
                    <div className="text-[7px] uppercase font-black text-slate-500">Novedades</div>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-2xl text-center">
                    <div className="text-2xl font-black text-amber-700">{currentStats.pendientes}</div>
                    <div className="text-[7px] uppercase font-black text-amber-600">Pendientes</div>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-2xl text-center">
                    <div className="text-2xl font-black text-emerald-700">{currentStats.completadas}</div>
                    <div className="text-[7px] uppercase font-black text-emerald-600">Completadas</div>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-2xl text-center">
                    <div className="text-2xl font-black text-orange-700">{currentStats.comisiones}</div>
                    <div className="text-[7px] uppercase font-black text-orange-600">Comisiones</div>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-2xl text-center">
                    <div className="text-2xl font-black text-pink-700">{currentStats.eventos || 0}</div>
                    <div className="text-[7px] uppercase font-black text-pink-600">Eventos</div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-2xl text-center">
                    <div className="text-2xl font-black text-blue-700">{currentStats.totalJuicios}</div>
                    <div className="text-[7px] uppercase font-black text-blue-600">Juicios</div>
                  </div>
                </div>
              </div>
              
              {/* Por usuario */}
              <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4">
                  Por Usuario {statsEffectiveTurno > 0 ? `(${TURNOS[statsEffectiveTurno]})` : '(Todos)'} (clic para detalle)
                </h4>
                <div className="space-y-3">
                  {statsProfiles.map(p => {
                    const stats = getUserDetailedStats(p, statsYear);
                    const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
                    const isSel = selectedUserStats?.id === p.id;
                    return (
                      <div key={p.id} className={`bg-slate-100 p-4 rounded-2xl cursor-pointer ${isSel ? 'ring-2 ring-emerald-500' : 'hover:bg-slate-200'}`} onClick={() => setSelectedUserStats(isSel ? null : p)}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">{p.nombre?.charAt(0).toUpperCase()}</div>
                            <div>
                              <div className="font-black text-slate-800 text-sm">{p.nombre}</div>
                              <div className="text-[9px] text-slate-500 font-bold uppercase flex items-center gap-1">
                                {ROLES[p.role]?.label || p.role}
                                {canSeeAllTurnos() && !p.permisos?.ver_todos_turnos && (
                                  <span className="px-1 bg-indigo-200 text-indigo-700 rounded text-[8px]">{p.turno === 4 ? 'ZO' : `T${p.turno || 1}`}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-black text-indigo-600">{stats.novedadesConcurridas}</div>
                            <div className="text-[9px] text-indigo-500 font-bold uppercase">Concurridas</div>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-300 rounded-full overflow-hidden mb-3">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: pct + '%' }}></div>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                          <div className="bg-white p-2 rounded-xl">
                            <div className="text-lg font-black text-slate-700">{stats.total}</div>
                            <div className="text-[7px] text-slate-500 font-bold uppercase">Tareas</div>
                          </div>
                          <div className="bg-emerald-100 p-2 rounded-xl">
                            <div className="text-lg font-black text-emerald-700">{stats.done}</div>
                            <div className="text-[7px] text-emerald-600 font-bold uppercase">Hechas</div>
                          </div>
                          <div className="bg-red-100 p-2 rounded-xl">
                            <div className="text-lg font-black text-red-600">{stats.pending}</div>
                            <div className="text-[7px] text-red-500 font-bold uppercase">Pend.</div>
                          </div>
                          <div className="bg-orange-100 p-2 rounded-xl">
                            <div className="text-lg font-black text-orange-700">{stats.totalComisiones}</div>
                            <div className="text-[7px] text-orange-600 font-bold uppercase">Comis.</div>
                          </div>
                          <div className="bg-pink-100 p-2 rounded-xl">
                            <div className="text-lg font-black text-pink-700">{stats.totalEventos || 0}</div>
                            <div className="text-[7px] text-pink-600 font-bold uppercase">Eventos</div>
                          </div>
                          <div className="bg-blue-100 p-2 rounded-xl">
                            <div className="text-lg font-black text-blue-700">{stats.juicios}</div>
                            <div className="text-[7px] text-blue-600 font-bold uppercase">Juicios</div>
                          </div>
                        </div>
                        {isSel && (
                          <div className="mt-4 pt-4 border-t border-slate-300 animate-fadeIn">
                            <h5 className="text-[9px] font-black text-slate-600 uppercase mb-3">📋 Desglose ({stats.novedadesConcurridas} novedades):</h5>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white p-3 rounded-xl">
                                <div className="text-[10px] font-bold text-slate-600 mb-1">Inf. Actuación</div>
                                <div className="flex justify-between">
                                  <span className="text-emerald-600 font-black">{stats.informeActuacion.c} ✓</span>
                                  <span className="text-red-500 font-black">{stats.informeActuacion.a - stats.informeActuacion.c} ✗</span>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded-xl">
                                <div className="text-[10px] font-bold text-slate-600 mb-1">Criminalístico</div>
                                <div className="flex justify-between">
                                  <span className="text-emerald-600 font-black">{stats.informeCriminalistico.c} ✓</span>
                                  <span className="text-red-500 font-black">{stats.informeCriminalistico.a - stats.informeCriminalistico.c} ✗</span>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded-xl">
                                <div className="text-[10px] font-bold text-slate-600 mb-1">Pericial</div>
                                <div className="flex justify-between">
                                  <span className="text-emerald-600 font-black">{stats.informePericial.c} ✓</span>
                                  <span className="text-red-500 font-black">{stats.informePericial.a - stats.informePericial.c} ✗</span>
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded-xl">
                                <div className="text-[10px] font-bold text-slate-600 mb-1">Croquis</div>
                                <div className="flex justify-between">
                                  <span className="text-emerald-600 font-black">{stats.croquis.c} ✓</span>
                                  <span className="text-red-500 font-black">{stats.croquis.a - stats.croquis.c} ✗</span>
                                </div>
                              </div>
                            </div>
                            {stats.totalComisiones > 0 && (
                              <div className="mt-3">
                                <h5 className="text-[9px] font-black text-orange-600 uppercase mb-2">🚗 Comisiones:</h5>
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="bg-orange-50 p-2 rounded-xl text-center">
                                    <div className="text-lg font-black text-orange-700">{stats.comisiones.cargaSgsp}</div>
                                    <div className="text-[8px] text-orange-600 font-bold uppercase">Carga SGSP</div>
                                  </div>
                                  <div className="bg-orange-50 p-2 rounded-xl text-center">
                                    <div className="text-lg font-black text-orange-700">{stats.comisiones.chofer}</div>
                                    <div className="text-[8px] text-orange-600 font-bold uppercase">Chofer</div>
                                  </div>
                                  <div className="bg-orange-50 p-2 rounded-xl text-center">
                                    <div className="text-lg font-black text-orange-700">{stats.comisiones.acompanante}</div>
                                    <div className="text-[8px] text-orange-600 font-bold uppercase">Acompañante</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => { setShowStats(false); setSelectedUserStats(null); setStatsYear('todos'); setStatsTurnoFilter(0); }} className="w-full py-4 bg-slate-200 rounded-2xl font-black text-slate-600 uppercase text-[10px]">Cerrar</button>
            </div>
          </div>
        </div>
      );
      })()}

      {/* MODAL REPORTE */}
      {showReport && canEditAll() && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 no-print" style={{ background: "var(--bg-modal-overlay)", backdropFilter: "blur(12px)" }} onClick={() => { setShowReport(false); setPrintReady(false); setPrintUser('todos'); }}>
          <div className="bg-white w-full max-w-4xl rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10 print:hidden no-print">
              <h3 className="font-black uppercase text-sm">🖨️ Imprimir Reporte</h3>
              <div className="flex gap-2">
                {printReady && <button onClick={() => window.print()} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold text-sm">🖨️ Imprimir</button>}
                <button onClick={() => { setShowReport(false); setPrintReady(false); setPrintUser('todos'); }} className="text-slate-500 hover:text-white px-2">✕</button>
              </div>
            </div>
            
            {!printReady ? (
              <div className="p-5 sm:p-8 space-y-6">
                <h4 className="text-lg font-black text-slate-800">¿Qué querés imprimir?</h4>
                
                {/* Tipo de reporte */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'pendientes', label: '⏳ Pendientes', desc: 'Novedades sin completar' },
                    { id: 'completados', label: '✅ Completados', desc: 'Novedades finalizadas' },
                    { id: 'juicios', label: '⚖️ Juicios', desc: 'Citaciones programadas' },
                    { id: 'estadisticas', label: '📊 Estadísticas', desc: 'Resumen por usuario' },
                    { id: 'auditoria', label: '📜 Auditoría', desc: 'Últimos 100 logs' },
                    { id: 'todo', label: '📋 Todo', desc: 'Reporte completo' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPrintType(opt.id)}
                      className={`p-4 rounded-2xl text-left transition-all ${printType === opt.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 hover:bg-slate-200'}`}
                    >
                      <div className="font-black text-sm">{opt.label}</div>
                      <div className={`text-xs mt-1 ${printType === opt.id ? 'text-emerald-100' : 'text-slate-500'}`}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
                
                {/* Filtros */}
                <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                  <h5 className="text-sm font-black text-slate-600 uppercase">Filtros (opcional)</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Año</label>
                      <select 
                        value={printYear} 
                        onChange={(e) => setPrintYear(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold cursor-pointer"
                      >
                        <option value="todos">Todos los años</option>
                        {getAvailableStatsYears().map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Usuario</label>
                      <select 
                        value={printUser} 
                        onChange={(e) => setPrintUser(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold cursor-pointer"
                      >
                        <option value="todos">Todos los usuarios</option>
                        {profiles.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Desde</label>
                      <input 
                        type="date" 
                        value={printDateFrom}
                        onChange={(e) => setPrintDateFrom(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Hasta</label>
                      <input 
                        type="date" 
                        value={printDateTo}
                        onChange={(e) => setPrintDateTo(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                  
                  {(printDateFrom || printDateTo || printYear !== 'todos' || printUser !== 'todos') && (
                    <button 
                      onClick={() => { setPrintYear('todos'); setPrintDateFrom(''); setPrintDateTo(''); setPrintUser('todos'); }}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >
                      ✕ Limpiar filtros
                    </button>
                  )}
                </div>
                
                <button 
                  onClick={() => setPrintReady(true)}
                  className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-emerald-600"
                >
                  Generar Reporte
                </button>
              </div>
            ) : (
              <div id="report-content" className="p-8 bg-white">
                {(() => {
                  // Filtrar datos según opciones
                  let filteredNovedades = [...novedades, ...completedNov];
                  let filteredJuicios = juicios;
                  let filteredLogs = logs;
                  let filteredProfiles = profiles;
                  
                  // Filtrar por año
                  if (printYear !== 'todos') {
                    filteredNovedades = filteredNovedades.filter(n => n.anio?.toString() === printYear);
                    filteredJuicios = filteredJuicios.filter(j => {
                      const fecha = parseFechaJuicio(j.fecha_juicio);
                      return fecha && fecha.getFullYear().toString() === printYear;
                    });
                    filteredLogs = filteredLogs.filter(l => new Date(l.created_at).getFullYear().toString() === printYear);
                  }
                  
                  // Filtrar por fecha
                  if (printDateFrom) {
                    const from = new Date(printDateFrom);
                    from.setHours(0,0,0,0);
                    filteredNovedades = filteredNovedades.filter(n => new Date(n.created_at) >= from);
                    filteredJuicios = filteredJuicios.filter(j => {
                      const fecha = parseFechaJuicio(j.fecha_juicio);
                      return fecha && fecha >= from;
                    });
                    filteredLogs = filteredLogs.filter(l => new Date(l.created_at) >= from);
                  }
                  if (printDateTo) {
                    const to = new Date(printDateTo);
                    to.setHours(23,59,59,999);
                    filteredNovedades = filteredNovedades.filter(n => new Date(n.created_at) <= to);
                    filteredJuicios = filteredJuicios.filter(j => {
                      const fecha = parseFechaJuicio(j.fecha_juicio);
                      return fecha && fecha <= to;
                    });
                    filteredLogs = filteredLogs.filter(l => new Date(l.created_at) <= to);
                  }
                  
                  // Filtrar por usuario
                  if (printUser !== 'todos') {
                    // Novedades donde el usuario tiene alguna asignación
                    filteredNovedades = filteredNovedades.filter(n => 
                      (n.informe_actuacion || n.informeActuacion) === printUser ||
                      (n.informe_criminalistico || n.informeCriminalistico) === printUser ||
                      (n.informe_pericial || n.informePericial) === printUser ||
                      n.croquis === printUser
                    );
                    // Juicios donde el usuario está citado
                    filteredJuicios = filteredJuicios.filter(j => (j.citados || []).includes(printUser));
                    // Logs del usuario
                    filteredLogs = filteredLogs.filter(l => l.user_nombre === printUser);
                    // Solo mostrar ese usuario en estadísticas
                    filteredProfiles = filteredProfiles.filter(p => p.nombre === printUser);
                  }
                  
                  const filteredPending = filteredNovedades.filter(n => !isNovedadComplete(n));
                  const filteredCompleted = filteredNovedades.filter(n => isNovedadComplete(n));
                  
                  const filterText = [
                    printYear !== 'todos' ? `Año: ${printYear}` : null,
                    printUser !== 'todos' ? `Usuario: ${printUser}` : null,
                    printDateFrom ? `Desde: ${printDateFrom}` : null,
                    printDateTo ? `Hasta: ${printDateTo}` : null,
                  ].filter(Boolean).join(' | ') || 'Sin filtros';
                  
                  return (
                    <>
                      <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-slate-800">📋 REPORTE DE NOVEDADES</h1>
                        <p className="text-slate-500 text-sm">Generado: {new Date().toLocaleString()}</p>
                        <p className="text-slate-400 text-xs mt-1">{filterText}</p>
                      </div>
                      
                      {/* Botón volver */}
                      <button 
                        onClick={() => setPrintReady(false)}
                        className="mb-6 text-sm text-blue-500 font-bold hover:underline print:hidden"
                      >
                        ← Cambiar opciones
                      </button>
                      
                      {/* RESUMEN - siempre visible excepto auditoría sola */}
                      {printType !== 'auditoria' && (
                        <div className="mb-8">
                          <h2 className="text-lg font-black text-slate-700 border-b-2 border-slate-300 pb-2 mb-4">RESUMEN</h2>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-slate-100 p-4 rounded-xl text-center">
                              <div className="text-2xl font-black">{filteredNovedades.length}</div>
                              <div className="text-xs font-bold text-slate-500">TOTAL</div>
                            </div>
                            <div className="bg-amber-100 p-4 rounded-xl text-center">
                              <div className="text-2xl font-black text-amber-700">{filteredPending.length}</div>
                              <div className="text-xs font-bold text-amber-600">PENDIENTES</div>
                            </div>
                            <div className="bg-emerald-100 p-4 rounded-xl text-center">
                              <div className="text-2xl font-black text-emerald-700">{filteredCompleted.length}</div>
                              <div className="text-xs font-bold text-emerald-600">COMPLETADOS</div>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-xl text-center">
                              <div className="text-2xl font-black text-blue-700">{filteredJuicios.length}</div>
                              <div className="text-xs font-bold text-blue-600">JUICIOS</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* PENDIENTES */}
                      {(printType === 'pendientes' || printType === 'todo') && (
                        <div className="mb-8">
                          <h2 className="text-lg font-black text-amber-700 border-b-2 border-amber-300 pb-2 mb-4">⏳ PENDIENTES ({filteredPending.length})</h2>
                          {filteredPending.length === 0 ? <p className="text-slate-500 italic">Ninguno</p> : (
                            <table className="w-full text-sm">
                              <thead><tr className="bg-amber-50"><th className="p-2 text-left font-bold">N°</th><th className="p-2 text-left font-bold">Año</th><th className="p-2 text-left font-bold">SGSP</th><th className="p-2 text-left font-bold">Título</th><th className="p-2 text-left font-bold">Estado</th></tr></thead>
                              <tbody>{filteredPending.sort(sortByNumber).map(n => { const { completed, total } = getTaskCounts(n); return <tr key={n.id} className="border-b"><td className="p-2 font-bold">{n.numero_novedad}</td><td className="p-2">{n.anio || '-'}</td><td className="p-2">{n.numero_sgsp}</td><td className="p-2">{n.titulo || '-'}</td><td className="p-2"><span className="bg-amber-200 px-2 py-1 rounded text-xs font-bold">{completed}/{total}</span></td></tr>; })}</tbody>
                            </table>
                          )}
                        </div>
                      )}
                      
                      {/* COMPLETADOS */}
                      {(printType === 'completados' || printType === 'todo') && (
                        <div className="mb-8">
                          <h2 className="text-lg font-black text-emerald-700 border-b-2 border-emerald-300 pb-2 mb-4">✅ COMPLETADOS ({filteredCompleted.length})</h2>
                          {filteredCompleted.length === 0 ? <p className="text-slate-500 italic">Ninguno</p> : (
                            <table className="w-full text-sm">
                              <thead><tr className="bg-emerald-50"><th className="p-2 text-left font-bold">N°</th><th className="p-2 text-left font-bold">Año</th><th className="p-2 text-left font-bold">SGSP</th><th className="p-2 text-left font-bold">Título</th></tr></thead>
                              <tbody>{filteredCompleted.sort(sortByNumber).map(n => <tr key={n.id} className="border-b"><td className="p-2 font-bold">{n.numero_novedad}</td><td className="p-2">{n.anio || '-'}</td><td className="p-2">{n.numero_sgsp}</td><td className="p-2">{n.titulo || '-'}</td></tr>)}</tbody>
                            </table>
                          )}
                        </div>
                      )}
                      
                      {/* JUICIOS */}
                      {(printType === 'juicios' || printType === 'todo') && (
                        <div className="mb-8">
                          <h2 className="text-lg font-black text-blue-700 border-b-2 border-blue-300 pb-2 mb-4">⚖️ JUICIOS ({filteredJuicios.length})</h2>
                          {filteredJuicios.length === 0 ? <p className="text-slate-500 italic">Ninguno</p> : (
                            <table className="w-full text-sm">
                              <thead><tr className="bg-blue-50"><th className="p-2 text-left font-bold">Fecha</th><th className="p-2 text-left font-bold">N° Nov.</th><th className="p-2 text-left font-bold">SGSP</th><th className="p-2 text-left font-bold">IUE</th><th className="p-2 text-left font-bold">Descripción</th><th className="p-2 text-left font-bold">Citados</th></tr></thead>
                              <tbody>{filteredJuicios.sort((a,b) => {
                                const fechaA = parseFechaJuicio(a.fecha_juicio);
                                const fechaB = parseFechaJuicio(b.fecha_juicio);
                                return (fechaA || 0) - (fechaB || 0);
                              }).map(j => {
                                const fecha = parseFechaJuicio(j.fecha_juicio);
                                return <tr key={j.id} className="border-b"><td className="p-2 font-bold">{fecha ? fecha.toLocaleDateString() : '-'}</td><td className="p-2">{j.numero_novedad || '-'}</td><td className="p-2">{j.numero_sgsp || '-'}</td><td className="p-2">{j.iue || '-'}</td><td className="p-2">{j.descripcion || '-'}</td><td className="p-2 text-xs">{(j.citados || []).join(', ') || '-'}</td></tr>;
                              })}</tbody>
                            </table>
                          )}
                        </div>
                      )}
                      
                      {/* ESTADÍSTICAS */}
                      {(printType === 'estadisticas' || printType === 'todo') && (
                        <div className="mb-8">
                          <h2 className="text-lg font-black text-slate-700 border-b-2 border-slate-300 pb-2 mb-4">📊 ESTADÍSTICAS POR USUARIO {printUser !== 'todos' ? `(${printUser})` : ''}</h2>
                          <div className="space-y-4">
                            {filteredProfiles.map(p => { 
                              const stats = getUserDetailedStats(p, printYear); 
                              const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0; 
                              return (
                                <div key={p.id} className="bg-slate-50 p-4 rounded-xl">
                                  <div className="flex justify-between items-center mb-3">
                                    <div><span className="font-black text-slate-800">{p.nombre}</span><span className="text-xs text-slate-500 ml-2">{p.role}</span></div>
                                    <span className="font-black text-lg">{pct}%</span>
                                  </div>
                                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                                    <div className="bg-white p-2 rounded"><div className="font-bold">Inf. Actuación</div><div className="text-emerald-600">{stats.informeActuacion.c}/{stats.informeActuacion.a}</div></div>
                                    <div className="bg-white p-2 rounded"><div className="font-bold">Criminalístico</div><div className="text-emerald-600">{stats.informeCriminalistico.c}/{stats.informeCriminalistico.a}</div></div>
                                    <div className="bg-white p-2 rounded"><div className="font-bold">Pericial</div><div className="text-emerald-600">{stats.informePericial.c}/{stats.informePericial.a}</div></div>
                                    <div className="bg-white p-2 rounded"><div className="font-bold">Croquis</div><div className="text-emerald-600">{stats.croquis.c}/{stats.croquis.a}</div></div>
                                    <div className="bg-orange-50 p-2 rounded"><div className="font-bold text-orange-700">Comisiones</div><div className="text-orange-600">{stats.totalComisiones}</div></div>
                                    <div className="bg-white p-2 rounded"><div className="font-bold">Juicios</div><div className="text-blue-600">{stats.juicios}</div></div>
                                  </div>
                                  {stats.totalComisiones > 0 && (
                                    <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[10px]">
                                      <div className="bg-orange-100 p-1 rounded"><span className="font-bold text-orange-700">Carga SGSP: {stats.comisiones.cargaSgsp}</span></div>
                                      <div className="bg-orange-100 p-1 rounded"><span className="font-bold text-orange-700">Chofer: {stats.comisiones.chofer}</span></div>
                                      <div className="bg-orange-100 p-1 rounded"><span className="font-bold text-orange-700">Acompañante: {stats.comisiones.acompanante}</span></div>
                                    </div>
                                  )}
                                </div>
                              ); 
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* AUDITORÍA */}
                      {(printType === 'auditoria' || printType === 'todo') && (
                        <div className="mb-8">
                          <h2 className="text-lg font-black text-slate-700 border-b-2 border-slate-300 pb-2 mb-4">📜 AUDITORÍA ({filteredLogs.length} registros)</h2>
                          {filteredLogs.length === 0 ? <p className="text-slate-500 italic">Sin registros</p> : (
                            <table className="w-full text-xs">
                              <thead><tr className="bg-slate-100"><th className="p-2 text-left font-bold">Fecha</th><th className="p-2 text-left font-bold">Usuario</th><th className="p-2 text-left font-bold">Acción</th><th className="p-2 text-left font-bold">Detalle</th></tr></thead>
                              <tbody>{filteredLogs.map((l, i) => <tr key={l.id || i} className="border-b"><td className="p-2">{new Date(l.created_at).toLocaleString()}</td><td className="p-2 font-bold">{l.user_nombre || '-'}</td><td className="p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${l.action === 'LOGIN_FALLIDO' ? 'bg-red-200 text-red-700' : 'bg-slate-200'}`}>{l.action}</span></td><td className="p-2">{l.details || '-'}</td></tr>)}</tbody>
                            </table>
                          )}
                        </div>
                      )}
                      
                      <div className="text-center text-xs text-slate-400 mt-8 pt-4 border-t">Sistema de Novedades - Versión Segura</div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {showPendingModal && <PendingModal count={pendingCount} juiciosProximos={upcomingJuicios} recordatoriosProximos={upcomingRecordatorios} onClose={() => setShowPendingModal(false)} userName={userProfile?.nombre} />}
      
      {/* Modal de advertencia de timeout */}
      {showTimeoutWarning && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: "var(--bg-modal-overlay)", backdropFilter: "blur(12px)" }}>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden animate-slideUp" style={{ boxShadow: 'var(--shadow-modal)' }}>
            <div className="p-5 sm:p-8 bg-gradient-to-br from-amber-400 to-amber-600 text-white text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                <Icon name="clock" size={32} />
              </div>
              <h3 className="font-black uppercase tracking-widest text-lg">Sesión por expirar</h3>
            </div>
            <div className="p-8 text-center">
              <p className="text-slate-600 font-bold text-lg mb-2">Tu sesión se cerrará en 2 minutos</p>
              <p className="text-slate-500 text-sm mb-6">Por seguridad, la sesión se cierra automáticamente después de 30 minutos de inactividad.</p>
              <button 
                onClick={() => { resetSessionTimeout(); }} 
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl transition-all"
              >
                Continuar trabajando
              </button>
            </div>
          </div>
        </div>
      )}
      
      {notification && <Notification {...notification} />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
