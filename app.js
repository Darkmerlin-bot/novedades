
const { useState, useEffect } = React;
const { createClient } = supabase;

// CONFIGURACIÓN
const SUPABASE_URL = 'https://whfrenunfcrcrljithex.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZnJlbnVuZmNyY3Jsaml0aGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Njk5ODUsImV4cCI6MjA4NTI0NTk4NX0.MMbKQxmSL_7UPNcEh_F1NofVPa13Trz3sedDALvgvPs';
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const currentYear = new Date().getFullYear();
const availableYears = [];
for (let y = currentYear + 1; y >= 2020; y--) availableYears.push(y);

// NOTIFICACIÓN
const Notification = ({ message, type }) => (
  <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideInRight border-l-4 ${type === 'success' ? 'bg-white border-emerald-500 text-slate-800' : 'bg-red-500 border-red-700 text-white'}`}>
    <span className="text-xl">{type === 'success' ? '✅' : '⚠️'}</span>
    <span className="font-bold text-sm">{message}</span>
  </div>
);

// HEADER
const Header = ({ userProfile, currentView, setView, onLogout, onShowStats, onShowPass, onShowReport, onBackup, pendingCount, completedCount, juiciosCount, recordatoriosCount }) => (
  <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 print:hidden">
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg text-xl shadow-lg shadow-emerald-500/20">📋</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Sistema Novedades</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">🔒 Versión Segura</p>
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3">
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-emerald-400">{userProfile?.nombre}</span>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">{userProfile?.role === 'admin' ? 'Admin' : userProfile?.role === 'moderator' ? 'Moderador' : 'Usuario'}</span>
          </div>
          <div className="flex gap-1.5">
            <button onClick={onShowPass} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all" title="Cambiar Contraseña">🔑</button>
            {userProfile?.role === 'admin' && (
              <>
                <button onClick={onShowStats} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all" title="Estadísticas">📊</button>
                <button onClick={onShowReport} className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all" title="Imprimir Reporte">🖨️</button>
                <button onClick={onBackup} className="p-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all" title="Descargar Respaldo">💾</button>
              </>
            )}
            <button onClick={onLogout} className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-bold text-sm flex items-center gap-2 shadow-lg">🚪 Salir</button>
          </div>
        </div>
      </div>
      <nav className="flex flex-wrap gap-1 pb-1 border-t border-slate-800 pt-3">
        <button onClick={() => setView('list')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${currentView === 'list' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          📁 Pend. {pendingCount > 0 && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">{pendingCount}</span>}
        </button>
        <button onClick={() => setView('completed')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${currentView === 'completed' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          ✅ Compl. {completedCount > 0 && <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">{completedCount}</span>}
        </button>
        <button onClick={() => setView('juicios')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${currentView === 'juicios' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          ⚖️ Juicios {juiciosCount > 0 && <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">{juiciosCount}</span>}
        </button>
        <button onClick={() => setView('recordatorios')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${currentView === 'recordatorios' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          🔔 Recor. {recordatoriosCount > 0 && <span className="bg-purple-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">{recordatoriosCount}</span>}
        </button>
        <button onClick={() => setView('calendario')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${currentView === 'calendario' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          📅 Licencias
        </button>
        {userProfile?.role === 'admin' && (
          <>
            <button onClick={() => setView('form')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${currentView === 'form' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>➕ Nueva</button>
            <button onClick={() => setView('auditoria')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${currentView === 'auditoria' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>🔍 Auditar</button>
            <button onClick={() => setView('users')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${currentView === 'users' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>👥 Personal</button>
            <button onClick={() => setView('logs')} className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${currentView === 'logs' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>📜 Logs</button>
          </>
        )}
      </nav>
    </div>
  </header>
);

// MODAL PENDIENTES Y JUICIOS
const PendingModal = ({ count, juiciosProximos, recordatoriosProximos, onClose, userName }) => (
  <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[150] flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto">
      <div className="p-8 bg-red-500 text-white text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="font-black uppercase tracking-widest text-lg">Atención</h3>
      </div>
      <div className="p-8">
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
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><span className="text-slate-400">🔍</span></div>
      <input type="text" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar por N° Novedad, SGSP o Título..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 placeholder-slate-400 shadow-sm" />
      {searchTerm && <button onClick={() => onSearchChange('')} className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600">✕</button>}
    </div>
    <select value={selectedYear} onChange={(e) => onYearChange(e.target.value)} className="appearance-none w-full sm:w-40 px-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 cursor-pointer shadow-sm">
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
  const [novedades, setNovedades] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [editingNovedad, setEditingNovedad] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [modalShownOnce, setModalShownOnce] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);
  const [selectedUserStats, setSelectedUserStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [newUserData, setNewUserData] = useState({ nombre: '', password: '' });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCountPending, setTotalCountPending] = useState(0);
  const [totalCountCompleted, setTotalCountCompleted] = useState(0);
  const PAGE_SIZE = 50;
  
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
  const [calendarioMonth, setCalendarioMonth] = useState(new Date().getMonth());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  
  // Estados para Auditoría
  const [selectedAuditUser, setSelectedAuditUser] = useState(null);
  const [statsYear, setStatsYear] = useState('todos');
  
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

  // TIMEOUT DE SESIÓN POR INACTIVIDAD (30 minutos)
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos en milisegundos
  const timeoutRef = React.useRef(null);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  
  const resetSessionTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTimeoutWarning(false);
    
    if (session) {
      // Mostrar advertencia 2 minutos antes
      timeoutRef.current = setTimeout(() => {
        setShowTimeoutWarning(true);
        // Cerrar sesión después de 2 minutos más si no hay actividad
        timeoutRef.current = setTimeout(async () => {
          await sb.auth.signOut();
          setShowTimeoutWarning(false);
          showNotify("Sesión cerrada por inactividad", "error");
        }, 2 * 60 * 1000);
      }, SESSION_TIMEOUT - 2 * 60 * 1000);
    }
  };
  
  useEffect(() => {
    if (!session) return;
    
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    const handleActivity = () => resetSessionTimeout();
    
    events.forEach(event => window.addEventListener(event, handleActivity));
    resetSessionTimeout();
    
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
      else setUserProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    const { data } = await sb.from('profiles').select('*').eq('id', userId).single();
    if (data) setUserProfile(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const email = loginUsername.toLowerCase().trim() + '@local.com';
    const { data, error } = await sb.auth.signInWithPassword({ email, password: loginPassword });
    if (error) {
      await sb.from('logs').insert([{ action: 'LOGIN_FALLIDO', details: 'Usuario: ' + loginUsername + ' | Contraseña: ' + loginPassword }]);
      showNotify("Usuario o contraseña incorrectos", "error");
    } else {
      // Registrar login exitoso
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
    await sb.auth.signOut();
  };

  // DATOS
  const addLog = async (action, details) => {
    if (!session || !userProfile) return;
    await sb.from('logs').insert([{ user_id: session.user.id, user_email: session.user.email, user_nombre: userProfile.nombre, action, details }]);
  };

  const loadData = async () => {
    if (!session) return;
    
    const { data: novData } = await sb.from('novedades').select('*').order('created_at', { ascending: false });
    setNovedades(novData || []);
    
    const { data: profilesData } = await sb.from('profiles').select('*').order('nombre');
    setProfiles(profilesData || []);
    
    // Cargar juicios
    const { data: juiciosData } = await sb.from('juicios').select('*').order('fecha_juicio', { ascending: true });
    setJuicios(juiciosData || []);
    
    // Cargar recordatorios
    const { data: recordatoriosData } = await sb.from('recordatorios').select('*').eq('completado', false).order('fecha_hora', { ascending: true });
    setRecordatorios(recordatoriosData || []);
    
    // Cargar licencias
    const { data: licenciasData } = await sb.from('licencias').select('*').order('fecha', { ascending: true });
    setLicencias(licenciasData || []);
    
    if (userProfile?.role === 'admin') {
      const { data: logData } = await sb.from('logs').select('*').order('created_at', { ascending: false }).limit(500);
      setLogs(logData || []);
    }
  };

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

  // Calcular recordatorios próximos (24 horas)
  useEffect(() => {
    if (!recordatorios || recordatorios.length === 0) {
      setUpcomingRecordatorios([]);
      return;
    }
    
    try {
      const ahora = new Date();
      const en24Horas = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
      
      const proximos = recordatorios.filter(r => {
        if (!r || !r.fecha_hora || r.completado) return false;
        const fecha = new Date(r.fecha_hora);
        return fecha <= en24Horas;
      });
      
      setUpcomingRecordatorios(proximos);
    } catch (e) {
      console.error('Error en cálculo de recordatorios próximos:', e);
      setUpcomingRecordatorios([]);
    }
  }, [recordatorios]);

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
  const sortByNumber = (a, b) => extractNumber(a.numero_novedad) - extractNumber(b.numero_novedad);
  
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
    if (n.informe_actuacion || n.informeActuacion) tasks.push({ field: 'informe_actuacion', checkKey: 'actuacion_realizada', checkKeyOld: 'actuacionRealizada', label: 'Informe Actuación', person: n.informe_actuacion || n.informeActuacion });
    if (n.informe_criminalistico || n.informeCriminalistico) tasks.push({ field: 'informe_criminalistico', checkKey: 'criminalistico_realizado', checkKeyOld: 'criminalisticoRealizado', label: 'Criminalístico', person: n.informe_criminalistico || n.informeCriminalistico });
    if (n.informe_pericial || n.informePericial) tasks.push({ field: 'informe_pericial', checkKey: 'pericial_realizado', checkKeyOld: 'pericialRealizado', label: 'Pericial', person: n.informe_pericial || n.informePericial });
    if (n.croquis) tasks.push({ field: 'croquis', checkKey: 'croquis_realizado', checkKeyOld: 'croquisRealizado', label: 'Croquis', person: n.croquis });
    return tasks;
  };

  const isTaskDone = (n, task) => n[task.checkKey] || (n.checks && n.checks[task.checkKeyOld]);

  const getTaskCounts = (n) => {
    const tasks = getAssignedTasks(n);
    return { completed: tasks.filter(t => isTaskDone(n, t)).length, total: tasks.length };
  };

  const getUserAssignment = (n, profile) => {
    if (!profile) return { isAssigned: false, assignments: [] };
    const name = profile.nombre;
    const assignments = [];
    if ((n.informe_actuacion || n.informeActuacion) === name) assignments.push({ checkKey: 'actuacion_realizada', checkKeyOld: 'actuacionRealizada', label: 'Informe Actuación' });
    if ((n.informe_criminalistico || n.informeCriminalistico) === name) assignments.push({ checkKey: 'criminalistico_realizado', checkKeyOld: 'criminalisticoRealizado', label: 'Criminalístico' });
    if ((n.informe_pericial || n.informePericial) === name) assignments.push({ checkKey: 'pericial_realizado', checkKeyOld: 'pericialRealizado', label: 'Pericial' });
    if (n.croquis === name) assignments.push({ checkKey: 'croquis_realizado', checkKeyOld: 'croquisRealizado', label: 'Croquis' });
    return { isAssigned: assignments.length > 0, assignments };
  };

  const areUserTasksComplete = (n, assignments) => assignments.length > 0 && assignments.every(a => n[a.checkKey] || (n.checks && n.checks[a.checkKeyOld]));
  const isNovedadComplete = (n) => { const { completed, total } = getTaskCounts(n); return total > 0 && completed === total; };
  const countUserPendingTasks = (profile, list) => list.filter(n => { const { isAssigned, assignments } = getUserAssignment(n, profile); return isAssigned && !areUserTasksComplete(n, assignments); }).length;

  const filterNovedades = (list) => {
    let f = list;
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

  const pendingNovedades = sortNovedades(filterNovedades(novedades.filter(n => !isNovedadComplete(n))), userProfile);
  const completedNovedades = filterNovedades(novedades.filter(n => isNovedadComplete(n))).sort(sortByNumber);
  const totalPending = novedades.filter(n => !isNovedadComplete(n)).length;
  const totalCompleted = novedades.filter(n => isNovedadComplete(n)).length;

  const checkDuplicate = checkDuplicateServer;

  const handleToggleCheck = async (id, checkKey, checkKeyOld) => {
    const n = novedades.find(x => x.id === id);
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
  };

  const handleBackup = async () => {
    showNotify("Generando respaldo...");
    const { data: allNov } = await sb.from('novedades').select('*');
    const { data: allProf } = await sb.from('profiles').select('*');
    const { data: allLogs } = await sb.from('logs').select('*').limit(500);
    const backup = { fecha: new Date().toISOString(), generado_por: userProfile?.nombre, novedades: allNov, profiles: allProf, logs: allLogs };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `respaldo_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    await addLog('RESPALDO', 'Descargó respaldo');
    showNotify("Respaldo descargado");
  };

  const getUserDetailedStats = (profile, filterYear = 'todos') => {
    const stats = { informeActuacion: { a: 0, c: 0 }, informeCriminalistico: { a: 0, c: 0 }, informePericial: { a: 0, c: 0 }, croquis: { a: 0, c: 0 }, juicios: 0 };
    
    // Filtrar novedades por año
    const filteredNovedades = filterYear === 'todos' ? novedades : novedades.filter(n => n.anio?.toString() === filterYear);
    
    filteredNovedades.forEach(n => {
      if ((n.informe_actuacion || n.informeActuacion) === profile.nombre) { stats.informeActuacion.a++; if (isTaskDone(n, { checkKey: 'actuacion_realizada', checkKeyOld: 'actuacionRealizada' })) stats.informeActuacion.c++; }
      if ((n.informe_criminalistico || n.informeCriminalistico) === profile.nombre) { stats.informeCriminalistico.a++; if (isTaskDone(n, { checkKey: 'criminalistico_realizado', checkKeyOld: 'criminalisticoRealizado' })) stats.informeCriminalistico.c++; }
      if ((n.informe_pericial || n.informePericial) === profile.nombre) { stats.informePericial.a++; if (isTaskDone(n, { checkKey: 'pericial_realizado', checkKeyOld: 'pericialRealizado' })) stats.informePericial.c++; }
      if (n.croquis === profile.nombre) { stats.croquis.a++; if (isTaskDone(n, { checkKey: 'croquis_realizado', checkKeyOld: 'croquisRealizado' })) stats.croquis.c++; }
    });
    
    // Contar juicios donde el usuario está citado
    const filteredJuicios = filterYear === 'todos' ? juicios : juicios.filter(j => {
      const fecha = parseFechaJuicio(j.fecha_juicio);
      return fecha && fecha.getFullYear().toString() === filterYear;
    });
    stats.juicios = filteredJuicios.filter(j => (j.citados || []).includes(profile.nombre)).length;
    
    const total = stats.informeActuacion.a + stats.informeCriminalistico.a + stats.informePericial.a + stats.croquis.a;
    const done = stats.informeActuacion.c + stats.informeCriminalistico.c + stats.informePericial.c + stats.croquis.c;
    return { ...stats, total, done, pending: total - done };
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
  const getFilteredStats = () => {
    const filteredNovedades = statsYear === 'todos' ? novedades : novedades.filter(n => n.anio?.toString() === statsYear);
    const filteredJuicios = statsYear === 'todos' ? juicios : juicios.filter(j => {
      const fecha = parseFechaJuicio(j.fecha_juicio);
      return fecha && fecha.getFullYear().toString() === statsYear;
    });
    
    return {
      totalNovedades: filteredNovedades.length,
      pendientes: filteredNovedades.filter(n => !isNovedadComplete(n)).length,
      completadas: filteredNovedades.filter(n => isNovedadComplete(n)).length,
      totalJuicios: filteredJuicios.length
    };
  };

  // PANTALLA CARGA
  if (authLoading) return <div className="flex items-center justify-center min-h-screen bg-slate-800"><div className="text-white text-xl font-bold animate-pulse">🔒 Verificando sesión...</div></div>;

  // PANTALLA LOGIN
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-800 p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-slideUp">
          <div className="text-center mb-8">
            <div className="inline-block p-5 bg-emerald-50 rounded-full text-5xl mb-4">📋</div>
            <h2 className="text-3xl font-black text-slate-800">Acceso Seguro</h2>
            <p className="text-slate-400 text-sm mt-2">Sistema de Novedades</p>
            <div className="mt-2 inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">🔒 Autenticación Segura</div>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Usuario</label>
              <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Tu nombre de usuario" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Contraseña</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700" required />
            </div>
            <button type="submit" disabled={loginLoading} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black shadow-xl hover:bg-slate-800 mt-4 uppercase text-sm disabled:opacity-50">
              {loginLoading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
          {notification && <Notification {...notification} />}
        </div>
      </div>
    );
  }

  if (!userProfile) return <div className="flex items-center justify-center min-h-screen bg-slate-800"><div className="text-white text-xl font-bold animate-pulse">Cargando perfil...</div></div>;

  // TARJETA NOVEDAD
  const NovedadCard = ({ n, isCompletedView }) => {
    const { completed, total } = getTaskCounts(n);
    const isEx = expandedId === n.id;
    const { isAssigned, assignments } = getUserAssignment(n, userProfile);
    const userDone = areUserTasksComplete(n, assignments);
    const tasks = getAssignedTasks(n);
    
    let border = 'border-slate-200', bg = 'bg-white', left = '';
    if (!isCompletedView && isAssigned) {
      if (userDone) { border = 'border-emerald-300'; bg = 'bg-emerald-50'; left = 'border-l-4 border-l-emerald-500'; }
      else { border = 'border-red-300'; bg = 'bg-red-50'; left = 'border-l-4 border-l-red-500'; }
    }
    if (isCompletedView) { border = 'border-emerald-300'; bg = 'bg-emerald-50'; left = 'border-l-4 border-l-emerald-500'; }

    return (
      <div className={`${bg} rounded-3xl shadow-md border ${border} ${left} overflow-hidden transition-all hover:shadow-xl`}>
        <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isEx ? null : n.id)}>
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${completed === total && total > 0 ? 'bg-emerald-500 text-white' : total === 0 ? 'bg-slate-300 text-slate-500' : 'bg-amber-400 text-white'}`}>{total > 0 ? `${completed}/${total}` : 'N/A'}</div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-black text-slate-800 text-lg">{n.numero_novedad}</span>
                {n.anio && <span className="text-[10px] font-black text-slate-500 bg-slate-200 px-2 py-1 rounded-full">{n.anio}</span>}
                {n.titulo && <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{n.titulo}</span>}
                {!isCompletedView && isAssigned && <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${userDone ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>{userDone ? '✓ Listo' : '⚠ Pendiente'}</span>}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">SGSP: {n.numero_sgsp}</div>
            </div>
          </div>
          <span className={`text-slate-400 text-xs transition-transform ${isEx ? 'rotate-180' : ''}`}>▼</span>
        </div>
        {isEx && (
          <div className="px-6 pb-6 border-t border-slate-100 animate-fadeIn bg-white/50">
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
              </div>
              <div className="space-y-3">
                <h4 className="text-[11px] font-black text-slate-500 uppercase border-b border-slate-200 pb-2">Checklist ({completed}/{total})</h4>
                {tasks.length === 0 ? <p className="text-slate-400 text-xs italic py-4 text-center bg-slate-50 rounded-xl">Sin tareas</p> : tasks.map(task => {
                  const isMe = task.person === userProfile.nombre;
                  const done = isTaskDone(n, task);
                  // Admin puede todo, moderator solo sus tareas, user no puede nada
                  const canToggle = userProfile.role === 'admin' || (userProfile.role === 'moderator' && isMe);
                  return (
                    <label key={task.checkKey} className={`flex items-center gap-4 py-2 ${canToggle ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} group select-none rounded-lg px-3 ${isMe ? 'bg-slate-100' : 'bg-slate-50'}`}>
                      <div onClick={() => canToggle && handleToggleCheck(n.id, task.checkKey, task.checkKeyOld)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'} ${!canToggle && 'opacity-50'}`}>{done && <span className="text-white text-[10px]">✓</span>}</div>
                      <span className={`text-xs font-bold ${done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.label}{isMe && <span className="ml-1 text-[9px] text-emerald-600">(TÚ)</span>} <span className="text-[9px] text-slate-400">- {task.person}</span></span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="pt-6 flex justify-between items-center border-t border-slate-200">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Cargado: {n.creado_por}</span>
                {n.modificado_por && <span className="text-[9px] text-emerald-500 font-bold uppercase">Mod: {n.modificado_por}</span>}
              </div>
              {userProfile.role === 'admin' && (
                <div className="flex gap-2">
                  <button onClick={() => { setEditingNovedad(n); setOriginalUpdatedAt(n.updated_at); setCurrentView('form'); }} className="text-[10px] bg-slate-200 px-4 py-2 rounded-xl font-black text-slate-700 hover:bg-slate-300 uppercase">Editar</button>
                  <button onClick={async () => { if(confirm("¿Eliminar?")){ await sb.from('novedades').delete().eq('id', n.id); await addLog('BORRAR', 'Eliminó ' + n.numero_novedad); loadData(); showNotify("Eliminado"); } }} className="text-[10px] bg-red-100 px-4 py-2 rounded-xl font-black text-red-600 hover:bg-red-200 uppercase">Eliminar</button>
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
      <Header userProfile={userProfile} currentView={currentView} setView={v => { setCurrentView(v); setEditingNovedad(null); setSearchTerm(''); setSelectedYear(''); if(v === 'logs' || v === 'users' || v === 'recordatorios') loadData(); }} onLogout={handleLogout} onShowStats={() => setShowStats(true)} onShowPass={() => setShowPassModal(true)} onShowReport={() => setShowReport(true)} onBackup={handleBackup} pendingCount={totalPending} completedCount={totalCompleted} juiciosCount={juicios.filter(j => { const fecha = parseFechaJuicio(j.fecha_juicio); if (!fecha) return false; const hoy = new Date(); hoy.setHours(0,0,0,0); return fecha >= hoy; }).length} recordatoriosCount={recordatorios.filter(r => !r.completado).length} />
      
      <main className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
        {/* PENDIENTES */}
        {currentView === 'list' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-3xl font-black text-slate-800">Pendientes</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Tus tareas primero</p></div>
              {userProfile?.role === 'admin' && <button onClick={() => setCurrentView('form')} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl uppercase">+ Nuevo</button>}
            </div>
            <SearchAndFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} selectedYear={selectedYear} onYearChange={setSelectedYear} />
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500"></div><span className="text-xs font-bold text-slate-600">Pendiente tuyo</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500"></div><span className="text-xs font-bold text-slate-600">Tu tarea lista</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-slate-300"></div><span className="text-xs font-bold text-slate-600">No asignado</span></div>
            </div>
            {pendingNovedades.length === 0 ? <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-300"><div className="text-5xl mb-4">{searchTerm || selectedYear ? '🔍' : '🎉'}</div><p className="text-slate-500 font-bold">{searchTerm || selectedYear ? 'Sin resultados' : '¡No hay pendientes!'}</p></div> : <div className="grid gap-4">{pendingNovedades.map(n => <NovedadCard key={n.id} n={n} isCompletedView={false} />)}</div>}
          </div>
        )}

        {/* COMPLETADOS */}
        {currentView === 'completed' && (
          <div className="space-y-4">
            <div className="mb-6"><h2 className="text-3xl font-black text-slate-800">Completados</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Tareas finalizadas</p></div>
            <SearchAndFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} selectedYear={selectedYear} onYearChange={setSelectedYear} />
            {completedNovedades.length === 0 ? <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-300"><div className="text-5xl mb-4">📂</div><p className="text-slate-500 font-bold">Sin completados</p></div> : <div className="grid gap-4">{completedNovedades.map(n => <NovedadCard key={n.id} n={n} isCompletedView={true} />)}</div>}
          </div>
        )}

        {/* FORMULARIO (Solo Admin) */}
        {currentView === 'form' && userProfile?.role === 'admin' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-2xl mx-auto border border-slate-200">
            <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
              <div><h2 className="text-3xl font-black">{editingNovedad ? 'Editar' : 'Nueva'} Novedad</h2><p className="text-slate-400 text-xs mt-1 font-bold uppercase">Datos de la actuación</p></div>
              <div className="text-4xl">📝</div>
            </div>
            <form className="p-10 space-y-8" onSubmit={async (e) => {
              e.preventDefault();
              if (saving) return;
              setSaving(true);
              
              const d = new FormData(e.target);
              const num = d.get('nov'), anio = d.get('anio');
              const isDuplicate = await checkDuplicate(num, anio, editingNovedad?.id);
              if (isDuplicate) { showNotify("Ya existe esa novedad en " + anio, "error"); setSaving(false); return; }
              
              const payload = { numero_novedad: num, numero_sgsp: d.get('sgsp'), anio: parseInt(anio), titulo: d.get('titulo') || null, informe_actuacion: d.get('ia') || null, informe_criminalistico: d.get('ic') || null, informe_pericial: d.get('ip') || null, croquis: d.get('cr') || null };
              
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
                  const { error } = await sb.from('novedades').insert([{ ...payload, creado_por: userProfile.nombre, actuacion_realizada: false, criminalistico_realizado: false, pericial_realizado: false, croquis_realizado: false }]);
                  if (error) { showNotify("Error al crear: " + error.message, "error"); setSaving(false); return; }
                  await addLog('CREAR', 'Creó ' + num); showNotify("Guardado");
                }
                setEditingNovedad(null);
                setOriginalUpdatedAt(null);
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
              <div className="space-y-6 pt-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase border-b border-slate-100 pb-3">Asignaciones</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[{ n: 'ia', f: 'informe_actuacion', fOld: 'informeActuacion', l: 'Informe Actuación' }, { n: 'ic', f: 'informe_criminalistico', fOld: 'informeCriminalistico', l: 'Criminalístico' }, { n: 'ip', f: 'informe_pericial', fOld: 'informePericial', l: 'Pericial' }, { n: 'cr', f: 'croquis', fOld: 'croquis', l: 'Croquis' }].map(item => (
                    <div key={item.n} className="space-y-1.5"><label className="text-[10px] font-black text-slate-500 uppercase ml-1">{item.l}</label><select name={item.n} defaultValue={editingNovedad ? (editingNovedad[item.f] || editingNovedad[item.fOld]) : ''} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm cursor-pointer"><option value="">-- Sin asignar --</option>{profiles.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}</select></div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-10">
                <button type="button" onClick={() => { setCurrentView('list'); setOriginalUpdatedAt(null); }} disabled={saving} className="flex-1 p-5 bg-slate-200 rounded-[1.5rem] font-black text-slate-600 uppercase text-xs disabled:opacity-50">Cancelar</button>
                <button disabled={saving} className="flex-1 p-5 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase text-xs shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Guardando...</> : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* USUARIOS (Admin) */}
        {currentView === 'users' && userProfile.role === 'admin' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
              <div><h2 className="text-3xl font-black text-slate-800">Personal</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Usuarios del sistema</p></div>
              <button onClick={() => setShowNewUser(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-xl uppercase">+ Nuevo Usuario</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map(p => {
                const roleColor = p.role === 'admin' ? 'bg-purple-500' : p.role === 'moderator' ? 'bg-blue-500' : 'bg-emerald-500';
                const roleLabel = p.role === 'admin' ? 'Admin' : p.role === 'moderator' ? 'Moderador' : 'Usuario';
                return (
                  <div key={p.id} className="bg-white p-5 rounded-3xl shadow-md border border-slate-200 group hover:shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center font-black text-lg ${p.role === 'admin' ? 'bg-purple-600' : p.role === 'moderator' ? 'bg-blue-600' : 'bg-slate-700'}`}>{p.nombre?.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="font-black text-slate-800">{p.nombre}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${roleColor}`}></span>
                            {roleLabel} • {p.email?.split('@')[0]}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {p.id !== userProfile.id && (
                          <>
                            <button onClick={() => setEditingProfile(p)} className="text-[10px] bg-slate-100 px-3 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200">✏️ Editar</button>
                            <button onClick={async () => {
                              if (!confirm(`¿Eliminar usuario "${p.nombre}"?\n\nEsta acción no se puede deshacer.`)) return;
                              try {
                                const { error } = await sb.rpc('admin_delete_user', { target_user_id: p.id });
                                if (error) {
                                  showNotify("Error: " + error.message, "error");
                                  return;
                                }
                                await addLog('ELIMINAR_USUARIO', `Eliminó usuario: ${p.nombre}`);
                                showNotify("Usuario eliminado");
                                loadData();
                              } catch (err) {
                                showNotify("Error: " + err.message, "error");
                              }
                            }} className="text-[10px] bg-red-100 px-3 py-2 rounded-xl font-bold text-red-600 hover:bg-red-200">🗑️</button>
                          </>
                        )}
                        {p.id === userProfile.id && (
                          <button onClick={() => setEditingProfile({...p, isSelf: true})} className="text-[10px] bg-slate-100 px-3 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200">✏️ Mi Perfil</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL EDITAR USUARIO */}
        {editingProfile && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setEditingProfile(null)}>
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                <h3 className="font-black uppercase text-sm">✏️ Editar Usuario</h3>
                <button onClick={() => setEditingProfile(null)} className="text-slate-500 hover:text-white">✕</button>
              </div>
              <form className="p-8 space-y-5" onSubmit={async (e) => {
                e.preventDefault();
                const nombre = e.target.nombre.value.trim();
                if (!nombre) return;
                await sb.from('profiles').update({ nombre }).eq('id', editingProfile.id);
                await addLog('EDITAR_USUARIO', `Cambió nombre de ${editingProfile.nombre} a ${nombre}`);
                showNotify("Usuario actualizado");
                setEditingProfile(null);
                loadData();
              }}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nombre</label>
                  <input name="nombre" defaultValue={editingProfile.nombre} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Usuario (login)</label>
                  {editingProfile.isSelf ? (
                    <>
                      <input value={editingProfile.email?.split('@')[0]} disabled className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-400" />
                      <p className="text-[9px] text-slate-400 ml-1">No podés cambiar tu propio usuario</p>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input 
                          name="login" 
                          defaultValue={editingProfile.email?.split('@')[0]} 
                          className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" 
                          placeholder="usuario"
                        />
                        <button 
                          type="button"
                          onClick={async (e) => {
                            const input = e.target.parentElement.querySelector('input[name="login"]');
                            const newLogin = input.value.trim().toLowerCase();
                            if (!newLogin) { showNotify("Ingresá un usuario", "error"); return; }
                            if (newLogin === editingProfile.email?.split('@')[0]) { showNotify("El usuario es el mismo", "error"); return; }
                            
                            const newEmail = newLogin + '@local.com';
                            const userId = editingProfile.user_id || editingProfile.id;
                            if (!userId) {
                              showNotify("Error: No se encontró el ID del usuario", "error");
                              return;
                            }
                            try {
                              const { error } = await sb.rpc('admin_update_user_email', { 
                                user_id: userId, 
                                new_email: newEmail 
                              });
                              if (error) { 
                                showNotify("Error: " + error.message, "error"); 
                                return; 
                              }
                              // Actualizar también en profiles
                              await sb.from('profiles').update({ email: newEmail }).eq('id', editingProfile.id);
                              await addLog('CAMBIO_LOGIN', `${editingProfile.nombre}: ${editingProfile.email?.split('@')[0]} → ${newLogin}`);
                              showNotify("Usuario de login actualizado");
                              loadData();
                            } catch (err) {
                              showNotify("Error: " + err.message, "error");
                            }
                          }}
                          className="px-6 py-4 bg-blue-500 text-white rounded-2xl font-black text-xs uppercase hover:bg-blue-600"
                        >
                          Cambiar
                        </button>
                      </div>
                      <p className="text-[9px] text-slate-400 ml-1">Solo letras y números, sin espacios</p>
                    </>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rol</label>
                  {editingProfile.isSelf ? (
                    <div>
                      <input value={editingProfile.role === 'admin' ? 'Administrador' : editingProfile.role === 'moderator' ? 'Moderador' : 'Usuario'} disabled className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-400" />
                      <p className="text-[9px] text-slate-400 ml-1">No podés cambiar tu propio rol</p>
                    </div>
                  ) : (
                    <select name="role" defaultValue={editingProfile.role} onChange={async (e) => {
                      const newRole = e.target.value;
                      try {
                        const { error } = await sb.from('profiles').update({ role: newRole }).eq('id', editingProfile.id);
                        if (error) {
                          showNotify("Error al cambiar rol: " + error.message, "error");
                          e.target.value = editingProfile.role; // Revertir
                          return;
                        }
                        await addLog('CAMBIO_ROL', `${editingProfile.nombre} ahora es ${newRole}`);
                        showNotify("Rol actualizado");
                        setEditingProfile({...editingProfile, role: newRole});
                        loadData();
                      } catch (err) {
                        showNotify("Error: " + err.message, "error");
                        e.target.value = editingProfile.role;
                      }
                    }} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold cursor-pointer">
                      <option value="user">Usuario (solo lectura)</option>
                      <option value="moderator">Moderador (puede completar tareas)</option>
                      <option value="admin">Administrador (acceso total)</option>
                    </select>
                  )}
                </div>
                {!editingProfile.isSelf && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nueva Contraseña</label>
                    <div className="flex gap-2">
                      <input 
                        name="newpass" 
                        type="password" 
                        placeholder="Mínimo 6 caracteres"
                        className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" 
                      />
                      <button 
                        type="button"
                        onClick={async (e) => {
                          const input = e.target.parentElement.querySelector('input[name="newpass"]');
                          const newPass = input.value;
                          if (!newPass || newPass.length < 6) { 
                            showNotify("La contraseña debe tener al menos 6 caracteres", "error"); 
                            return; 
                          }
                          const userId = editingProfile.user_id || editingProfile.id;
                          if (!userId) {
                            showNotify("Error: No se encontró el ID del usuario", "error");
                            return;
                          }
                          try {
                            const { error } = await sb.rpc('admin_update_user_password', { 
                              target_user_id: userId, 
                              new_password: newPass 
                            });
                            if (error) { 
                              showNotify("Error: " + error.message, "error"); 
                              return; 
                            }
                            await addLog('CAMBIO_PASS_ADMIN', `Cambió contraseña de ${editingProfile.nombre}`);
                            showNotify("Contraseña actualizada");
                            input.value = '';
                          } catch (err) {
                            showNotify("Error: " + err.message, "error");
                          }
                        }}
                        className="px-6 py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase hover:bg-amber-600"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>
                )}
                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs shadow-xl">Guardar Cambios</button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL NUEVO USUARIO */}
        {showNewUser && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setShowNewUser(false)}>
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
              <div className="p-8 bg-emerald-600 text-white flex justify-between items-center">
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
                  
                  await addLog('CREAR_USUARIO', `Creó usuario: ${nombre} (${role})`);
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
                    <option value="user">Usuario (solo lectura)</option>
                    <option value="moderator">Moderador (puede completar tareas)</option>
                    <option value="admin">Administrador (acceso total)</option>
                  </select>
                </div>
                <button type="submit" disabled={saving} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Creando...</> : 'Crear Usuario'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* LOGS (Admin) */}
        {currentView === 'logs' && userProfile.role === 'admin' && (
          <div className="space-y-4">
            <div className="flex justify-between items-start mb-6">
              <div><h2 className="text-3xl font-black text-slate-800">Auditoría</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Registro de actividad</p></div>
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
                        {profiles.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
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
                    
                    const roleColor = p.role === 'admin' ? 'bg-purple-600' : p.role === 'moderator' ? 'bg-blue-600' : 'bg-slate-700';
                    
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
              <div><h2 className="text-3xl font-black text-slate-800">⚖️ Juicios</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">{userProfile?.role === 'admin' ? 'Todas las citaciones' : 'Tus citaciones'}</p></div>
              {(userProfile?.role === 'admin' || userProfile?.role === 'moderator') && (
                <button onClick={() => { setEditingJuicio({}); setSelectedCitados([]); }} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl uppercase">+ Nuevo Juicio</button>
              )}
            </div>
            
            {/* Formulario de nuevo/editar juicio */}
            {editingJuicio && (userProfile?.role === 'admin' || userProfile?.role === 'moderator') && (
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
                    creado_por: userProfile.nombre
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
                        {profiles.map(p => {
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
              // Filtrar juicios: admin ve todos, usuario solo donde está citado
              const juiciosVisibles = userProfile?.role === 'admin' 
                ? juicios 
                : juicios.filter(j => (j.citados || []).includes(userProfile?.nombre));
              
              if (juiciosVisibles.length === 0) {
                return (
                  <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-300">
                    <div className="text-5xl mb-4">⚖️</div>
                    <p className="text-slate-500 font-bold">{userProfile?.role === 'admin' ? 'No hay juicios programados' : 'No tienes citaciones pendientes'}</p>
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
                    const canEdit = userProfile?.role === 'admin' || (userProfile?.role === 'moderator' && j.creado_por === userProfile?.nombre);
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
              <div><h2 className="text-3xl font-black text-slate-800">🔔 Recordatorios</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Tareas y eventos pendientes</p></div>
              <button onClick={() => setEditingRecordatorio({})} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl uppercase">+ Nuevo</button>
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
                    creado_por_nombre: userProfile.nombre
                  };
                  
                  try {
                    if (editingRecordatorio.id) {
                      const { error } = await sb.from('recordatorios').update(payload).eq('id', editingRecordatorio.id);
                      if (error) { showNotify("Error: " + error.message, "error"); setSaving(false); return; }
                      await addLog('EDITAR_RECORDATORIO', 'Editó recordatorio: ' + titulo);
                    } else {
                      const { error } = await sb.from('recordatorios').insert([payload]);
                      if (error) { showNotify("Error: " + error.message, "error"); setSaving(false); return; }
                      await addLog('CREAR_RECORDATORIO', 'Creó recordatorio: ' + titulo);
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
                  <div className="flex gap-3 pt-4">
                    <button type="submit" disabled={saving} className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-black uppercase text-xs disabled:opacity-50">{saving ? 'Guardando...' : (editingRecordatorio.id ? 'Actualizar' : 'Crear')}</button>
                    <button type="button" onClick={() => setEditingRecordatorio(null)} className="px-8 py-4 bg-slate-200 text-slate-600 rounded-xl font-black uppercase text-xs">Cancelar</button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Lista de recordatorios */}
            {recordatorios.length === 0 ? (
              <div className="bg-white rounded-[2rem] shadow-xl p-12 text-center">
                <div className="text-6xl mb-4">🔔</div>
                <p className="text-slate-500 font-bold">No hay recordatorios pendientes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recordatorios.map(r => {
                  const fecha = new Date(r.fecha_hora);
                  const ahora = new Date();
                  const diffMs = fecha - ahora;
                  const vencido = diffMs < 0;
                  const diffHoras = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
                  const diffDias = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
                  
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
                          {(r.creado_por === session.user.id || userProfile?.role === 'admin') && (
                            <>
                              <button onClick={() => setEditingRecordatorio(r)} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200" title="Editar">✏️</button>
                              <button onClick={async () => {
                                if (!confirm('¿Eliminar este recordatorio?')) return;
                                const { error } = await sb.from('recordatorios').delete().eq('id', r.id);
                                if (error) { showNotify("Error: " + error.message, "error"); return; }
                                await addLog('ELIMINAR_RECORDATORIO', 'Eliminó: ' + r.titulo);
                                showNotify("Recordatorio eliminado");
                                loadData();
                              }} className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200" title="Eliminar">🗑️</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ALMANAQUE ANUAL DE LICENCIAS */}
        {currentView === 'calendario' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div><h2 className="text-3xl font-black text-slate-800">📅 Almanaque de Licencias</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Registro anual de ausencias</p></div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedCalendarDate('nueva')} className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 shadow-lg">➕ Agregar</button>
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
            
            {/* Almanaque - 12 meses */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((mesNombre, mesIndex) => {
                const firstDay = new Date(calendarioYear, mesIndex, 1).getDay();
                const daysInMonth = new Date(calendarioYear, mesIndex + 1, 0).getDate();
                const monthStr = `${calendarioYear}-${String(mesIndex + 1).padStart(2, '0')}`;
                const mesLicencias = licencias.filter(l => l.fecha?.startsWith(monthStr));
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
                        if (dayLicencias.length > 0) {
                          const tipo = dayLicencias[0].tipo;
                          if (tipo === 'licencia') bgColor = 'bg-blue-500 text-white';
                          else if (tipo === 'enfermedad') bgColor = 'bg-red-500 text-white';
                          else if (tipo === 'estudio') bgColor = 'bg-purple-500 text-white';
                          else if (tipo === 'descanso') bgColor = 'bg-amber-500 text-white';
                          textColor = 'text-white';
                        }
                        if (isToday) bgColor = 'bg-emerald-500 text-white ring-2 ring-emerald-300';
                        
                        return (
                          <div 
                            key={day}
                            onClick={() => setSelectedCalendarDate(dateStr)}
                            className={`text-center py-1 rounded cursor-pointer hover:ring-2 hover:ring-slate-400 ${bgColor} ${textColor} ${selectedCalendarDate === dateStr ? 'ring-2 ring-slate-800' : ''} ${dayLicencias.length > 1 ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
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
                  const dayLicencias = selectedCalendarDate !== 'nueva' ? licencias.filter(l => l.fecha === selectedCalendarDate) : [];
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
                                {(l.user_id === session?.user?.id || userProfile?.role === 'admin') && (
                                  <button onClick={async () => {
                                    if (!confirm(`¿Eliminar licencia de ${l.user_nombre}?`)) return;
                                    const { error } = await sb.from('licencias').delete().eq('id', l.id);
                                    if (error) { showNotify("Error: " + error.message, "error"); return; }
                                    await addLog('ELIMINAR_LICENCIA', `Eliminó licencia de ${l.user_nombre} el ${selectedCalendarDate}`);
                                    showNotify("Licencia eliminada");
                                    loadData();
                                  }} className="p-3 bg-white rounded-xl hover:bg-red-50 text-red-500 font-bold">🗑️</button>
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
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          const d = new FormData(e.target);
                          const accion = d.get('accion');
                          const tipo = d.get('tipo');
                          const descripcion = d.get('descripcion');
                          const fechaDesde = d.get('fechaDesde');
                          const fechaHasta = d.get('fechaHasta') || fechaDesde;
                          const targetUserId = userProfile?.role === 'admin' ? d.get('usuario') : session.user.id;
                          const targetUserNombre = userProfile?.role === 'admin' 
                            ? profiles.find(p => p.id === targetUserId)?.nombre 
                            : userProfile.nombre;
                          
                          if (!fechaDesde) {
                            showNotify("Selecciona una fecha", "error");
                            return;
                          }
                          
                          const inicio = new Date(fechaDesde + 'T12:00:00');
                          const fin = new Date(fechaHasta + 'T12:00:00');
                          
                          if (fin < inicio) {
                            showNotify("Fecha hasta debe ser >= fecha desde", "error");
                            return;
                          }
                          
                          if (accion === 'eliminar') {
                            // Eliminar licencias en rango
                            const fechasEliminar = [];
                            let current = new Date(inicio);
                            while (current <= fin) {
                              fechasEliminar.push(current.toISOString().split('T')[0]);
                              current.setDate(current.getDate() + 1);
                            }
                            
                            const { error } = await sb.from('licencias').delete()
                              .eq('user_id', targetUserId)
                              .in('fecha', fechasEliminar);
                            
                            if (error) { showNotify("Error: " + error.message, "error"); return; }
                            await addLog('ELIMINAR_LICENCIAS', `Eliminó licencias de ${targetUserNombre}: ${fechaDesde} a ${fechaHasta}`);
                            showNotify(`Licencias eliminadas: ${fechasEliminar.length} días`);
                          } else {
                            // Agregar licencias en rango
                            const fechas = [];
                            let current = new Date(inicio);
                            while (current <= fin) {
                              const fechaStr = current.toISOString().split('T')[0];
                              const existe = licencias.find(l => l.fecha === fechaStr && l.user_id === targetUserId);
                              if (!existe) {
                                fechas.push({ user_id: targetUserId, user_nombre: targetUserNombre, fecha: fechaStr, tipo, descripcion: descripcion || null });
                              }
                              current.setDate(current.getDate() + 1);
                            }
                            
                            if (fechas.length === 0) {
                              showNotify("Todas las fechas ya tienen licencia", "error");
                              return;
                            }
                            
                            const { error } = await sb.from('licencias').insert(fechas);
                            if (error) { showNotify("Error: " + error.message, "error"); return; }
                            await addLog('AGREGAR_LICENCIA', `Agregó ${tipo} para ${targetUserNombre}: ${fechas.length} días`);
                            showNotify(`Agregado: ${fechas.length} días`);
                          }
                          e.target.reset();
                          setSelectedCalendarDate(null);
                          loadData();
                        }} className="space-y-2">
                          <div className="flex flex-wrap gap-2 items-end">
                            {userProfile?.role === 'admin' && (
                              <select name="usuario" className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold flex-1 min-w-[120px]" required>
                                {profiles.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                              </select>
                            )}
                            <input name="fechaDesde" type="date" defaultValue={selectedCalendarDate !== 'nueva' ? selectedCalendarDate : ''} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" required />
                            <span className="text-slate-400 text-sm">a</span>
                            <input name="fechaHasta" type="date" defaultValue={selectedCalendarDate !== 'nueva' ? selectedCalendarDate : ''} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                            <select name="tipo" className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" required>
                              <option value="licencia">📋 Licencia</option>
                              <option value="enfermedad">🏥 Enfermedad</option>
                              <option value="estudio">📚 Estudio</option>
                              <option value="descanso">😴 Descanso</option>
                            </select>
                            <input name="descripcion" placeholder="Nota..." className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm flex-1 min-w-[100px]" />
                          </div>
                          <div className="flex gap-2">
                            <button type="submit" name="accion" value="agregar" className="flex-1 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm hover:bg-emerald-600">➕ Agregar</button>
                            {userProfile?.role === 'admin' && (
                              <button type="submit" name="accion" value="eliminar" className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600" onClick={(e) => { if (!confirm('¿Eliminar licencias en este rango?')) e.preventDefault(); }}>🗑️ Eliminar rango</button>
                            )}
                          </div>
                        </form>
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
                      const yearLicencias = licencias.filter(l => l.fecha?.startsWith(String(calendarioYear)));
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
        )}

        {/* AUDITORÍA DE USUARIOS (Admin) */}
        {currentView === 'auditoria' && userProfile?.role === 'admin' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-slate-800">🔍 Auditar Usuario</h2>
              <p className="text-xs text-slate-600 font-bold uppercase mt-1">Ver pendientes por persona</p>
            </div>
            
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
                {profiles.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.role})</option>)}
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
                      <p className="text-slate-400 text-sm uppercase font-bold">{selectedAuditUser.role}</p>
                    </div>
                  </div>
                </div>

                {(() => {
                  const userPendingNovedades = novedades.filter(n => {
                    const { isAssigned, assignments } = getUserAssignment(n, selectedAuditUser);
                    return isAssigned && !areUserTasksComplete(n, assignments);
                  });
                  
                  const stats = getUserDetailedStats(selectedAuditUser);
                  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

                  return (
                    <>
                      {/* Estadísticas */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-2xl text-center shadow-md border border-slate-200">
                          <div className="text-3xl font-black text-slate-800">{stats.total}</div>
                          <div className="text-[9px] text-slate-500 font-bold uppercase">Asignadas</div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-2xl text-center shadow-md border border-emerald-200">
                          <div className="text-3xl font-black text-emerald-700">{stats.done}</div>
                          <div className="text-[9px] text-emerald-600 font-bold uppercase">Completadas</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-2xl text-center shadow-md border border-red-200">
                          <div className="text-3xl font-black text-red-600">{stats.pending}</div>
                          <div className="text-[9px] text-red-500 font-bold uppercase">Pendientes</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-2xl text-center shadow-md border border-blue-200">
                          <div className="text-3xl font-black text-blue-700">{pct}%</div>
                          <div className="text-[9px] text-blue-600 font-bold uppercase">Avance</div>
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
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL CAMBIAR CONTRASEÑA */}
      {showPassModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center"><h3 className="font-black uppercase text-sm">Cambiar Contraseña</h3><button onClick={() => setShowPassModal(false)} className="text-slate-500 hover:text-white">✕</button></div>
            <form className="p-8 space-y-5" onSubmit={async (e) => { e.preventDefault(); const pass = e.target.pass.value; if(pass.length < 6) return alert("Mínimo 6 caracteres"); const { error } = await sb.auth.updateUser({ password: pass }); if(error) showNotify("Error: " + error.message, "error"); else { await addLog('CAMBIO_PASS', 'Actualizó contraseña'); showNotify("Contraseña actualizada"); setShowPassModal(false); } }}>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Mínimo 6 caracteres</p>
              <input name="pass" type="password" placeholder="Nueva contraseña..." required className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
              <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs shadow-xl">Actualizar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ESTADÍSTICAS */}
      {showStats && userProfile.role === 'admin' && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => { setShowStats(false); setSelectedUserStats(null); setStatsYear('todos'); }}>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-black uppercase text-sm">📊 Estadísticas</h3>
              <button onClick={() => { setShowStats(false); setSelectedUserStats(null); setStatsYear('todos'); }} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <div className="p-8 space-y-8">
              {/* Selector de año */}
              <div className="flex items-center gap-4">
                <label className="text-[10px] font-black text-slate-500 uppercase">Filtrar por año:</label>
                <select 
                  value={statsYear} 
                  onChange={(e) => setStatsYear(e.target.value)}
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  <option value="todos">Todos los años</option>
                  {getAvailableStatsYears().map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              
              {/* Resumen general */}
              <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4">Resumen {statsYear !== 'todos' && `(${statsYear})`}</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-slate-100 p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-slate-800">{getFilteredStats().totalNovedades}</div>
                    <div className="text-[8px] uppercase font-black text-slate-500">Novedades</div>
                  </div>
                  <div className="bg-amber-100 p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-amber-700">{getFilteredStats().pendientes}</div>
                    <div className="text-[8px] uppercase font-black text-amber-600">Pendientes</div>
                  </div>
                  <div className="bg-emerald-100 p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-emerald-700">{getFilteredStats().completadas}</div>
                    <div className="text-[8px] uppercase font-black text-emerald-600">Completadas</div>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-2xl text-center">
                    <div className="text-2xl font-black text-blue-700">{getFilteredStats().totalJuicios}</div>
                    <div className="text-[8px] uppercase font-black text-blue-600">Juicios</div>
                  </div>
                </div>
              </div>
              
              {/* Por usuario */}
              <div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4">Por Usuario (clic para detalle)</h4>
                <div className="space-y-3">
                  {profiles.map(p => {
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
                              <div className="text-[9px] text-slate-500 font-bold uppercase">{p.role}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-black text-slate-800">{pct}%</div>
                            <div className="text-[9px] text-slate-500 font-bold uppercase">Completado</div>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-300 rounded-full overflow-hidden mb-3">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: pct + '%' }}></div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="bg-white p-2 rounded-xl">
                            <div className="text-lg font-black text-slate-700">{stats.total}</div>
                            <div className="text-[8px] text-slate-500 font-bold uppercase">Tareas</div>
                          </div>
                          <div className="bg-emerald-100 p-2 rounded-xl">
                            <div className="text-lg font-black text-emerald-700">{stats.done}</div>
                            <div className="text-[8px] text-emerald-600 font-bold uppercase">Hechas</div>
                          </div>
                          <div className="bg-red-100 p-2 rounded-xl">
                            <div className="text-lg font-black text-red-600">{stats.pending}</div>
                            <div className="text-[8px] text-red-500 font-bold uppercase">Pend.</div>
                          </div>
                          <div className="bg-blue-100 p-2 rounded-xl">
                            <div className="text-lg font-black text-blue-700">{stats.juicios}</div>
                            <div className="text-[8px] text-blue-600 font-bold uppercase">Juicios</div>
                          </div>
                        </div>
                        {isSel && (
                          <div className="mt-4 pt-4 border-t border-slate-300 animate-fadeIn">
                            <h5 className="text-[9px] font-black text-slate-600 uppercase mb-3">📋 Desglose de tareas:</h5>
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
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => { setShowStats(false); setSelectedUserStats(null); setStatsYear('todos'); }} className="w-full py-4 bg-slate-200 rounded-2xl font-black text-slate-600 uppercase text-[10px]">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REPORTE */}
      {showReport && userProfile.role === 'admin' && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 no-print" onClick={() => { setShowReport(false); setPrintReady(false); setPrintUser('todos'); }}>
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10 print:hidden no-print">
              <h3 className="font-black uppercase text-sm">🖨️ Imprimir Reporte</h3>
              <div className="flex gap-2">
                {printReady && <button onClick={() => window.print()} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold text-sm">🖨️ Imprimir</button>}
                <button onClick={() => { setShowReport(false); setPrintReady(false); setPrintUser('todos'); }} className="text-slate-500 hover:text-white px-2">✕</button>
              </div>
            </div>
            
            {!printReady ? (
              <div className="p-8 space-y-6">
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
                  let filteredNovedades = novedades;
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
                          <div className="grid grid-cols-4 gap-4">
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
                                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                                    <div className="bg-white p-2 rounded"><div className="font-bold">Inf. Actuación</div><div className="text-emerald-600">{stats.informeActuacion.c}/{stats.informeActuacion.a}</div></div>
                                    <div className="bg-white p-2 rounded"><div className="font-bold">Criminalístico</div><div className="text-emerald-600">{stats.informeCriminalistico.c}/{stats.informeCriminalistico.a}</div></div>
                                    <div className="bg-white p-2 rounded"><div className="font-bold">Pericial</div><div className="text-emerald-600">{stats.informePericial.c}/{stats.informePericial.a}</div></div>
                                    <div className="bg-white p-2 rounded"><div className="font-bold">Croquis</div><div className="text-emerald-600">{stats.croquis.c}/{stats.croquis.a}</div></div>
                                    <div className="bg-white p-2 rounded"><div className="font-bold">Juicios</div><div className="text-blue-600">{stats.juicios}</div></div>
                                  </div>
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
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 bg-amber-500 text-white text-center">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="font-black uppercase tracking-widest text-lg">Sesión por expirar</h3>
            </div>
            <div className="p-8 text-center">
              <p className="text-slate-600 font-bold text-lg mb-2">Tu sesión se cerrará en 2 minutos</p>
              <p className="text-slate-500 text-sm mb-6">Por seguridad, la sesión se cierra automáticamente después de 30 minutos de inactividad.</p>
              <button 
                onClick={() => { resetSessionTimeout(); }} 
                className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs shadow-xl"
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
