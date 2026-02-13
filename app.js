
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
const Header = ({ userProfile, currentView, setView, onLogout, onShowStats, onShowPass, onShowReport, onBackup, pendingCount, completedCount }) => (
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
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">{userProfile?.role}</span>
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
      <nav className="flex gap-1 overflow-x-auto pb-1 no-scrollbar border-t border-slate-800 pt-3">
        <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${currentView === 'list' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          📁 Pendientes {pendingCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{pendingCount}</span>}
        </button>
        <button onClick={() => setView('completed')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${currentView === 'completed' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          ✅ Completados {completedCount > 0 && <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{completedCount}</span>}
        </button>
        <button onClick={() => setView('juicios')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'juicios' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>⚖️ Juicios</button>
        {userProfile?.role === 'admin' && (
          <>
            <button onClick={() => setView('form')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'form' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>➕ Nueva</button>
            <button onClick={() => setView('auditoria')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'auditoria' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>🔍 Auditar</button>
            <button onClick={() => setView('users')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'users' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>👥 Personal</button>
            <button onClick={() => setView('logs')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'logs' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>📜 Logs</button>
          </>
        )}
      </nav>
    </div>
  </header>
);

// MODAL PENDIENTES Y JUICIOS
const PendingModal = ({ count, juiciosProximos, onClose }) => (
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
            <p className="text-slate-600 font-bold text-lg mb-3 text-center">⚖️ Juicios próximos</p>
            <div className="space-y-3">
              {juiciosProximos.map(j => {
                const fecha = new Date(j.fecha_juicio);
                const hoy = new Date();
                hoy.setHours(0,0,0,0);
                fecha.setHours(0,0,0,0);
                const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
                const citados = j.citados || [];
                return (
                  <div key={j.id} className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-slate-800">Nov. {j.numero_novedad}</p>
                        <p className="text-xs text-slate-500">SGSP: {j.numero_sgsp}</p>
                        {j.descripcion && <p className="text-xs text-slate-600 mt-1">{j.descripcion}</p>}
                        {citados.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {citados.map((c, i) => (
                              <span key={i} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{c}</span>
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
  
  // Estados para Auditoría
  const [selectedAuditUser, setSelectedAuditUser] = useState(null);
  const [statsYear, setStatsYear] = useState('todos');
  
  // Estados para feedback y bloqueo optimista
  const [saving, setSaving] = useState(false);
  const [originalUpdatedAt, setOriginalUpdatedAt] = useState(null);

  const showNotify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Ocultar pantalla de carga inicial
  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) loadingScreen.style.display = 'none';
  }, []);

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
      await sb.from('logs').insert([{ action: 'LOGIN_FALLIDO', details: 'Intento fallido: ' + loginUsername }]);
      showNotify("Usuario o contraseña incorrectos", "error");
    } else {
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
    
    if (userProfile?.role === 'admin') {
      const { data: logData } = await sb.from('logs').select('*').order('created_at', { ascending: false }).limit(100);
      setLogs(logData || []);
    }
  };

  // Calcular juicios próximos (5 días) - filtrar por usuario citado
  useEffect(() => {
    if (!userProfile || juicios.length === 0) {
      setUpcomingJuicios([]);
      return;
    }
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const en5Dias = new Date(hoy);
    en5Dias.setDate(en5Dias.getDate() + 5);
    
    const proximos = juicios.filter(j => {
      const fechaJuicio = new Date(j.fecha_juicio);
      fechaJuicio.setHours(0, 0, 0, 0);
      const enRango = fechaJuicio >= hoy && fechaJuicio <= en5Dias;
      
      // Si es admin, ver todos. Si no, solo los que está citado
      const citados = j.citados || [];
      const estaCitado = citados.includes(userProfile.nombre);
      
      return enRango && (userProfile.role === 'admin' || estaCitado);
    });
    
    setUpcomingJuicios(proximos);
  }, [juicios, userProfile]);

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

  // Mostrar modal de pendientes/juicios después de cargar datos (solo una vez)
  useEffect(() => {
    if (session && userProfile && novedades.length > 0 && !modalShownOnce) {
      const pending = countUserPendingTasks(userProfile, novedades);
      const hasUpcoming = upcomingJuicios.length > 0;
      
      if (pending > 0 || hasUpcoming) {
        setPendingCount(pending);
        setShowPendingModal(true);
        setModalShownOnce(true);
      }
    }
  }, [novedades, upcomingJuicios, modalShownOnce]);

  // UTILIDADES
  const extractNumber = (str) => { if (!str) return 0; const m = str.match(/\d+/g); return m ? parseInt(m[m.length - 1], 10) : 0; };
  const extractYear = (n) => n.anio ? n.anio.toString() : n.created_at ? new Date(n.created_at).getFullYear().toString() : '';
  const sortByNumber = (a, b) => extractNumber(a.numero_novedad) - extractNumber(b.numero_novedad);

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
    await addLog('MARCA_CHECK', 'Cambió ' + checkKey + ' en ' + n.numero_novedad);
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
      const year = new Date(j.fecha_juicio).getFullYear().toString();
      return year === filterYear;
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
    juicios.forEach(j => { if (j.fecha_juicio) years.add(new Date(j.fecha_juicio).getFullYear().toString()); });
    return Array.from(years).sort((a, b) => b - a);
  };
  
  // Estadísticas filtradas por año
  const getFilteredStats = () => {
    const filteredNovedades = statsYear === 'todos' ? novedades : novedades.filter(n => n.anio?.toString() === statsYear);
    const filteredJuicios = statsYear === 'todos' ? juicios : juicios.filter(j => new Date(j.fecha_juicio).getFullYear().toString() === statsYear);
    
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
                  const canToggle = isMe || userProfile.role === 'admin';
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
      <Header userProfile={userProfile} currentView={currentView} setView={v => { setCurrentView(v); setEditingNovedad(null); setSearchTerm(''); setSelectedYear(''); if(v === 'logs' || v === 'users') loadData(); }} onLogout={handleLogout} onShowStats={() => setShowStats(true)} onShowPass={() => setShowPassModal(true)} onShowReport={() => setShowReport(true)} onBackup={handleBackup} pendingCount={totalPending} completedCount={totalCompleted} />
      
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-3xl shadow-md border border-slate-200 group hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">{p.nombre?.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="font-black text-slate-800">{p.nombre}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${p.role === 'admin' ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
                          {p.role} • {p.email?.split('@')[0]}
                        </div>
                      </div>
                    </div>
                    {p.id !== userProfile.id && (
                      <button onClick={() => setEditingProfile(p)} className="text-[10px] bg-slate-100 px-3 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200">✏️ Editar</button>
                    )}
                    {p.id === userProfile.id && (
                      <button onClick={() => setEditingProfile({...p, isSelf: true})} className="text-[10px] bg-slate-100 px-3 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200">✏️ Mi Perfil</button>
                    )}
                  </div>
                </div>
              ))}
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
                  <input value={editingProfile.email?.split('@')[0]} disabled className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-400" />
                  <p className="text-[9px] text-slate-400 ml-1">El usuario de login no se puede cambiar</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rol</label>
                  {editingProfile.isSelf ? (
                    <div>
                      <input value={editingProfile.role === 'admin' ? 'Administrador' : 'Usuario'} disabled className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-slate-400" />
                      <p className="text-[9px] text-slate-400 ml-1">No podés cambiar tu propio rol</p>
                    </div>
                  ) : (
                    <select name="role" defaultValue={editingProfile.role} onChange={async (e) => {
                      const newRole = e.target.value;
                      await sb.from('profiles').update({ role: newRole }).eq('id', editingProfile.id);
                      await addLog('CAMBIO_ROL', `${editingProfile.nombre} ahora es ${newRole}`);
                      showNotify("Rol actualizado");
                      loadData();
                    }} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold cursor-pointer">
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  )}
                </div>
                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs shadow-xl">Guardar Cambios</button>
              </form>
            </div>
          </div>
        )}

        {/* LOGS (Admin) */}
        {currentView === 'logs' && userProfile.role === 'admin' && (
          <div className="space-y-4">
            <div className="mb-8"><h2 className="text-3xl font-black text-slate-800">Auditoría</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">Últimos 100 registros</p></div>
            {logs.length === 0 ? <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200"><p className="text-slate-500 font-bold">Sin registros</p></div> : (
              <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-md">
                <div className="max-h-[600px] overflow-y-auto">
                  {logs.map((log, i) => {
                    const isFailed = log.action === 'LOGIN_FALLIDO';
                    return (
                      <div key={log.id || i} className={`p-5 border-b border-slate-100 last:border-0 flex items-start gap-4 ${isFailed ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0 ${isFailed ? 'bg-red-200' : 'bg-slate-200'}`}>{log.action === 'LOGIN' ? '🔓' : log.action === 'LOGOUT' ? '🚪' : isFailed ? '🚫' : '📝'}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-black text-sm ${isFailed ? 'text-red-700' : 'text-slate-800'}`}>{log.user_nombre || 'Sistema'}</span>
                            {isFailed && <span className="text-[9px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full">⚠️ ALERTA</span>}
                          </div>
                          <p className={`text-xs mt-1 ${isFailed ? 'text-red-600' : 'text-slate-600'}`}>{log.details}</p>
                          <span className="text-[9px] text-slate-400 font-bold uppercase mt-2 inline-block">{log.action} • {new Date(log.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* JUICIOS (Todos pueden acceder) */}
        {currentView === 'juicios' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-3xl font-black text-slate-800">⚖️ Juicios</h2><p className="text-xs text-slate-600 font-bold uppercase mt-1">{userProfile?.role === 'admin' ? 'Todas las citaciones' : 'Tus citaciones'}</p></div>
              <button onClick={() => { setEditingJuicio({}); setSelectedCitados([]); }} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl uppercase">+ Nuevo Juicio</button>
            </div>
            
            {/* Formulario de nuevo/editar juicio */}
            {editingJuicio && (
              <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-200 mb-6">
                <h3 className="text-lg font-black text-slate-800 mb-6">{editingJuicio.id ? 'Editar' : 'Nuevo'} Juicio</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (saving) return;
                  setSaving(true);
                  
                  const d = new FormData(e.target);
                  const payload = {
                    numero_novedad: d.get('nov'),
                    numero_sgsp: d.get('sgsp'),
                    descripcion: d.get('desc') || null,
                    fecha_juicio: d.get('fecha'),
                    citados: selectedCitados,
                    creado_por: userProfile.nombre
                  };
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
                      await addLog('EDITAR_JUICIO', 'Editó juicio Nov. ' + payload.numero_novedad);
                      showNotify("Juicio actualizado");
                    } else {
                      const { error } = await sb.from('juicios').insert([payload]);
                      if (error) { showNotify("Error: " + error.message, "error"); setSaving(false); return; }
                      await addLog('CREAR_JUICIO', 'Creó juicio Nov. ' + payload.numero_novedad);
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">N° Novedad *</label>
                      <input name="nov" defaultValue={editingJuicio.numero_novedad} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="001" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">N° SGSP *</label>
                      <input name="sgsp" defaultValue={editingJuicio.numero_sgsp} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="SGSP-XXX" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fecha *</label>
                      <input name="fecha" type="date" defaultValue={editingJuicio.fecha_juicio} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
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
                    const fecha = new Date(j.fecha_juicio);
                    const hoy = new Date();
                    hoy.setHours(0,0,0,0);
                    fecha.setHours(0,0,0,0);
                    const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
                    const isPast = diasRestantes < 0;
                    const isClose = diasRestantes >= 0 && diasRestantes <= 5;
                    const citados = j.citados || [];
                    const canEdit = userProfile?.role === 'admin' || j.creado_por === userProfile?.nombre;
                    const isMe = citados.includes(userProfile?.nombre);
                    
                    return (
                      <div key={j.id} className={`bg-white rounded-2xl p-6 shadow-md border-2 ${isPast ? 'border-slate-300 opacity-60' : isClose ? 'border-amber-400' : 'border-slate-200'} ${isMe && !isPast ? 'ring-2 ring-blue-400' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{isPast ? '📁' : isClose ? '⚠️' : '⚖️'}</span>
                              <div>
                                <h3 className="font-black text-slate-800 text-lg">Novedad {j.numero_novedad}</h3>
                                <p className="text-xs text-slate-500">SGSP: {j.numero_sgsp}</p>
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
                                    await addLog('BORRAR_JUICIO', 'Eliminó juicio Nov. ' + j.numero_novedad);
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
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 no-print" onClick={() => setShowReport(false)}>
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center sticky top-0 print:hidden no-print"><h3 className="font-black uppercase text-sm">🖨️ Reporte</h3><div className="flex gap-2"><button onClick={() => window.print()} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold text-sm">Imprimir</button><button onClick={() => setShowReport(false)} className="text-slate-500 hover:text-white px-2">✕</button></div></div>
            <div id="report-content" className="p-8 bg-white">
              <div className="text-center mb-8"><h1 className="text-2xl font-black text-slate-800">📋 REPORTE DE NOVEDADES</h1><p className="text-slate-500 text-sm">Generado: {new Date().toLocaleString()}</p></div>
              <div className="mb-8"><h2 className="text-lg font-black text-slate-700 border-b-2 border-slate-300 pb-2 mb-4">RESUMEN</h2><div className="grid grid-cols-3 gap-4"><div className="bg-slate-100 p-4 rounded-xl text-center"><div className="text-2xl font-black">{novedades.length}</div><div className="text-xs font-bold text-slate-500">TOTAL</div></div><div className="bg-amber-100 p-4 rounded-xl text-center"><div className="text-2xl font-black text-amber-700">{totalPending}</div><div className="text-xs font-bold text-amber-600">PENDIENTES</div></div><div className="bg-emerald-100 p-4 rounded-xl text-center"><div className="text-2xl font-black text-emerald-700">{totalCompleted}</div><div className="text-xs font-bold text-emerald-600">COMPLETADOS</div></div></div></div>
              <div className="mb-8"><h2 className="text-lg font-black text-emerald-700 border-b-2 border-emerald-300 pb-2 mb-4">✅ COMPLETADOS ({totalCompleted})</h2>{completedNovedades.length === 0 ? <p className="text-slate-500 italic">Ninguno</p> : <table className="w-full text-sm"><thead><tr className="bg-emerald-50"><th className="p-2 text-left font-bold">N°</th><th className="p-2 text-left font-bold">Año</th><th className="p-2 text-left font-bold">SGSP</th><th className="p-2 text-left font-bold">Título</th></tr></thead><tbody>{novedades.filter(n => isNovedadComplete(n)).sort(sortByNumber).map(n => <tr key={n.id} className="border-b"><td className="p-2 font-bold">{n.numero_novedad}</td><td className="p-2">{n.anio || '-'}</td><td className="p-2">{n.numero_sgsp}</td><td className="p-2">{n.titulo || '-'}</td></tr>)}</tbody></table>}</div>
              <div className="mb-8"><h2 className="text-lg font-black text-amber-700 border-b-2 border-amber-300 pb-2 mb-4">⏳ PENDIENTES ({totalPending})</h2>{pendingNovedades.length === 0 ? <p className="text-slate-500 italic">Ninguno</p> : <table className="w-full text-sm"><thead><tr className="bg-amber-50"><th className="p-2 text-left font-bold">N°</th><th className="p-2 text-left font-bold">Año</th><th className="p-2 text-left font-bold">SGSP</th><th className="p-2 text-left font-bold">Título</th><th className="p-2 text-left font-bold">Estado</th></tr></thead><tbody>{novedades.filter(n => !isNovedadComplete(n)).sort(sortByNumber).map(n => { const { completed, total } = getTaskCounts(n); return <tr key={n.id} className="border-b"><td className="p-2 font-bold">{n.numero_novedad}</td><td className="p-2">{n.anio || '-'}</td><td className="p-2">{n.numero_sgsp}</td><td className="p-2">{n.titulo || '-'}</td><td className="p-2"><span className="bg-amber-200 px-2 py-1 rounded text-xs font-bold">{completed}/{total}</span></td></tr>; })}</tbody></table>}</div>
              <div className="mb-8"><h2 className="text-lg font-black text-slate-700 border-b-2 border-slate-300 pb-2 mb-4">👥 POR USUARIO</h2><div className="space-y-4">{profiles.map(p => { const stats = getUserDetailedStats(p); const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0; return <div key={p.id} className="bg-slate-50 p-4 rounded-xl"><div className="flex justify-between items-center mb-3"><div><span className="font-black text-slate-800">{p.nombre}</span><span className="text-xs text-slate-500 ml-2">{p.role}</span></div><span className="font-black text-lg">{pct}%</span></div><div className="grid grid-cols-4 gap-2 text-center text-xs"><div className="bg-white p-2 rounded"><div className="font-bold">Inf. Actuación</div><div className="text-emerald-600">{stats.informeActuacion.c}/{stats.informeActuacion.a}</div></div><div className="bg-white p-2 rounded"><div className="font-bold">Criminalístico</div><div className="text-emerald-600">{stats.informeCriminalistico.c}/{stats.informeCriminalistico.a}</div></div><div className="bg-white p-2 rounded"><div className="font-bold">Pericial</div><div className="text-emerald-600">{stats.informePericial.c}/{stats.informePericial.a}</div></div><div className="bg-white p-2 rounded"><div className="font-bold">Croquis</div><div className="text-emerald-600">{stats.croquis.c}/{stats.croquis.a}</div></div></div></div>; })}</div></div>
              <div className="text-center text-xs text-slate-400 mt-8">Sistema de Novedades - Versión Segura</div>
            </div>
          </div>
        </div>
      )}

      {showPendingModal && <PendingModal count={pendingCount} juiciosProximos={upcomingJuicios} onClose={() => setShowPendingModal(false)} />}
      {notification && <Notification {...notification} />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
