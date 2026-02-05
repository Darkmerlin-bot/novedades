
const { useState, useEffect } = React;
const { createClient } = supabase;

// 1. CONFIGURACIÓN SUPABASE
const SUPABASE_URL = 'https://whfrenunfcrcrljithex.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZnJlbnVuZmNyY3Jsaml0aGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Njk5ODUsImV4cCI6MjA4NTI0NTk4NX0.MMbKQxmSL_7UPNcEh_F1NofVPa13Trz3sedDALvgvPs';
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const currentYear = new Date().getFullYear();
const availableYears = [];
for (let y = currentYear + 1; y >= 2020; y--) availableYears.push(y);

// 2. NOTIFICACIÓN
const Notification = ({ message, type }) => (
  <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideInRight border-l-4 ${type === 'success' ? 'bg-white border-emerald-500 text-slate-800' : 'bg-red-500 border-red-700 text-white'}`}>
    <span className="text-xl">{type === 'success' ? '✅' : '⚠️'}</span>
    <span className="font-bold text-sm">{message}</span>
  </div>
);

// 3. ENCABEZADO
const Header = ({ user, currentView, setView, onLogout, onShowStats, onShowPass, onShowReport, onBackup, pendingCount, completedCount }) => (
  <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 print:hidden">
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg text-xl shadow-lg shadow-emerald-500/20">📋</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Sistema Novedades</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Control Operativo</p>
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3">
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-emerald-400">{user.nombre}</span>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">{user.role}</span>
          </div>
          <div className="flex gap-1.5">
            <button onClick={onShowPass} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all" title="Seguridad">🔑</button>
            {user.role === 'admin' && (
              <>
                <button onClick={onShowStats} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all" title="Estadísticas">📊</button>
                <button onClick={onShowReport} className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all" title="Imprimir Reporte">🖨️</button>
                <button onClick={onBackup} className="p-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all" title="Descargar Respaldo">💾</button>
              </>
            )}
            <button onClick={onLogout} className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-bold text-sm flex items-center gap-2 shadow-lg" title="Cerrar Sesión">
              🚪 Salir
            </button>
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-1 no-scrollbar border-t border-slate-800 pt-3">
        <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${currentView === 'list' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          📁 Pendientes
          {pendingCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{pendingCount}</span>}
        </button>
        <button onClick={() => setView('completed')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${currentView === 'completed' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          ✅ Completados
          {completedCount > 0 && <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{completedCount}</span>}
        </button>
        <button onClick={() => setView('form')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'form' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>➕ Nueva</button>
        {user.role === 'admin' && (
          <>
            <button onClick={() => setView('users')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'users' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>👥 Personal</button>
            <button onClick={() => setView('logs')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'logs' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>📜 Auditoría</button>
          </>
        )}
      </nav>
    </div>
  </header>
);

// 4. MODAL PENDIENTES
const PendingModal = ({ count, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[150] flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
      <div className="p-8 bg-red-500 text-white text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="font-black uppercase tracking-widest text-lg">Atención</h3>
      </div>
      <div className="p-10 text-center">
        <p className="text-slate-600 font-bold text-lg mb-2">Tienes tareas pendientes</p>
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 my-6">
          <span className="text-5xl font-black text-red-500">{count}</span>
          <p className="text-red-400 font-bold text-sm mt-2 uppercase tracking-widest">{count === 1 ? 'Novedad asignada' : 'Novedades asignadas'}</p>
        </div>
        <button onClick={onClose} className="w-full mt-4 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Entendido</button>
      </div>
    </div>
  </div>
);

// 5. BÚSQUEDA Y FILTRO
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

// 6. APLICACIÓN PRINCIPAL
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [novedades, setNovedades] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [editingNovedad, setEditingNovedad] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedUserStats, setSelectedUserStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const showNotify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addLog = async (action, details) => {
    if (!currentUser) return;
    try { await sb.from('logs').insert([{ username: currentUser.username, nombre: currentUser.nombre, action, details }]); } catch (e) { console.error("Log error:", e); }
  };

  const loadData = async () => {
    try {
      const { data: userData } = await sb.from('users').select('*').order('nombre');
      setUsers(userData || []);
      const { data: novData } = await sb.from('novedades').select('*');
      setNovedades(novData || []);
      const { data: logData } = await sb.from('logs').select('*').order('created_at', { ascending: false }).limit(100);
      setLogs(logData || []);
    } catch (e) {
      console.error("Critical Load Error:", e);
      showNotify("Error al conectar con la base de datos", "error");
    } finally {
      setIsLoading(false);
      const loader = document.getElementById('loading-screen');
      if (loader) loader.style.display = 'none';
    }
  };

  useEffect(() => { loadData(); }, []);

  const extractNumber = (str) => {
    if (!str) return 0;
    const matches = str.match(/\d+/g);
    return matches ? parseInt(matches[matches.length - 1], 10) : 0;
  };

  const extractYear = (novedad) => {
    if (novedad.anio) return novedad.anio.toString();
    if (novedad.created_at) return new Date(novedad.created_at).getFullYear().toString();
    return '';
  };

  const sortByNovedadNumber = (a, b) => extractNumber(a.numero_novedad) - extractNumber(b.numero_novedad);

  const getAssignedTasks = (novedad) => {
    const tasks = [];
    if (novedad.informeActuacion) tasks.push({ field: 'informeActuacion', checkKey: 'actuacionRealizada', label: 'Informe Actuación', person: novedad.informeActuacion });
    if (novedad.informeCriminalistico) tasks.push({ field: 'informeCriminalistico', checkKey: 'criminalisticoRealizado', label: 'Criminalístico', person: novedad.informeCriminalistico });
    if (novedad.informePericial) tasks.push({ field: 'informePericial', checkKey: 'pericialRealizado', label: 'Pericial', person: novedad.informePericial });
    if (novedad.croquis) tasks.push({ field: 'croquis', checkKey: 'croquisRealizado', label: 'Croquis', person: novedad.croquis });
    return tasks;
  };

  const getTaskCounts = (novedad) => {
    const assignedTasks = getAssignedTasks(novedad);
    const total = assignedTasks.length;
    const completed = assignedTasks.filter(t => novedad.checks && novedad.checks[t.checkKey]).length;
    return { completed, total };
  };

  const getUserAssignment = (novedad, user) => {
    if (!user) return { isAssigned: false, assignments: [] };
    const userName = user.nombre;
    const assignments = [];
    if (novedad.informeActuacion === userName) assignments.push({ field: 'informeActuacion', checkKey: 'actuacionRealizada', label: 'Informe Actuación' });
    if (novedad.informeCriminalistico === userName) assignments.push({ field: 'informeCriminalistico', checkKey: 'criminalisticoRealizado', label: 'Criminalístico' });
    if (novedad.informePericial === userName) assignments.push({ field: 'informePericial', checkKey: 'pericialRealizado', label: 'Pericial' });
    if (novedad.croquis === userName) assignments.push({ field: 'croquis', checkKey: 'croquisRealizado', label: 'Croquis' });
    return { isAssigned: assignments.length > 0, assignments };
  };

  const areUserTasksComplete = (novedad, assignments) => {
    if (assignments.length === 0) return false;
    return assignments.every(a => novedad.checks && novedad.checks[a.checkKey]);
  };

  const isNovedadComplete = (novedad) => {
    const { completed, total } = getTaskCounts(novedad);
    return total > 0 && completed === total;
  };

  const countUserPendingTasks = (user, novedadesList) => {
    let count = 0;
    novedadesList.forEach(n => {
      const { isAssigned, assignments } = getUserAssignment(n, user);
      if (isAssigned && !areUserTasksComplete(n, assignments)) count++;
    });
    return count;
  };

  const filterNovedades = (list) => {
    let filtered = list;
    if (selectedYear) filtered = filtered.filter(n => extractYear(n) === selectedYear);
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(n => 
        (n.numero_novedad && n.numero_novedad.toLowerCase().includes(term)) ||
        (n.numero_sgsp && n.numero_sgsp.toLowerCase().includes(term)) ||
        (n.titulo && n.titulo.toLowerCase().includes(term))
      );
    }
    return filtered;
  };

  const sortNovedades = (list, user) => {
    return [...list].sort((a, b) => {
      const aAssigned = getUserAssignment(a, user).isAssigned;
      const bAssigned = getUserAssignment(b, user).isAssigned;
      const aComplete = areUserTasksComplete(a, getUserAssignment(a, user).assignments);
      const bComplete = areUserTasksComplete(b, getUserAssignment(b, user).assignments);
      if (aAssigned && !aComplete && !(bAssigned && !bComplete)) return -1;
      if (bAssigned && !bComplete && !(aAssigned && !aComplete)) return 1;
      return sortByNovedadNumber(a, b);
    });
  };

  const pendingNovedades = sortNovedades(filterNovedades(novedades.filter(n => !isNovedadComplete(n))), currentUser);
  const completedNovedades = filterNovedades(novedades.filter(n => isNovedadComplete(n))).sort(sortByNovedadNumber);
  const totalPending = novedades.filter(n => !isNovedadComplete(n)).length;
  const totalCompleted = novedades.filter(n => isNovedadComplete(n)).length;

  // Estadísticas detalladas por usuario
  const getUserDetailedStats = (user) => {
    const stats = {
      informeActuacion: { asignadas: 0, completadas: 0 },
      informeCriminalistico: { asignadas: 0, completadas: 0 },
      informePericial: { asignadas: 0, completadas: 0 },
      croquis: { asignadas: 0, completadas: 0 }
    };
    
    novedades.forEach(n => {
      if (n.informeActuacion === user.nombre) {
        stats.informeActuacion.asignadas++;
        if (n.checks && n.checks.actuacionRealizada) stats.informeActuacion.completadas++;
      }
      if (n.informeCriminalistico === user.nombre) {
        stats.informeCriminalistico.asignadas++;
        if (n.checks && n.checks.criminalisticoRealizado) stats.informeCriminalistico.completadas++;
      }
      if (n.informePericial === user.nombre) {
        stats.informePericial.asignadas++;
        if (n.checks && n.checks.pericialRealizado) stats.informePericial.completadas++;
      }
      if (n.croquis === user.nombre) {
        stats.croquis.asignadas++;
        if (n.checks && n.checks.croquisRealizado) stats.croquis.completadas++;
      }
    });
    
    const totalAsignadas = stats.informeActuacion.asignadas + stats.informeCriminalistico.asignadas + stats.informePericial.asignadas + stats.croquis.asignadas;
    const totalCompletadas = stats.informeActuacion.completadas + stats.informeCriminalistico.completadas + stats.informePericial.completadas + stats.croquis.completadas;
    
    return { ...stats, totalAsignadas, totalCompletadas, pendientes: totalAsignadas - totalCompletadas };
  };

  // Verificar si ya existe el número de novedad
  const checkDuplicateNovedad = (numeroNovedad, anio, excludeId = null) => {
    return novedades.some(n => 
      n.numero_novedad?.toLowerCase() === numeroNovedad?.toLowerCase() && 
      (n.anio || new Date(n.created_at).getFullYear()) === parseInt(anio) &&
      n.id !== excludeId
    );
  };

  const handleLogin = async (u, p) => {
    const user = users.find(usr => usr.username.toLowerCase() === u.toLowerCase() && usr.password === p);
    if (user) {
      setCurrentUser(user);
      addLog('LOGIN', 'Ingreso exitoso al sistema');
      showNotify('Bienvenido, ' + user.nombre);
      const pending = countUserPendingTasks(user, novedades);
      if (pending > 0) {
        setPendingCount(pending);
        setShowPendingModal(true);
      }
    } else {
      await sb.from('logs').insert([{ username: u || '(vacío)', nombre: '⛔ INTENTO FALLIDO', action: 'LOGIN_FALLIDO', details: 'Credenciales inválidas → Usuario: "' + (u || '') + '" | Contraseña: "' + (p || '') + '"' }]);
      showNotify("Usuario o contraseña incorrectos", "error");
    }
  };

  const handleToggleCheck = async (id, key) => {
    const nov = novedades.find(n => n.id === id);
    if (!nov) return;
    const newChecks = { ...nov.checks, [key]: !nov.checks[key] };
    const { error } = await sb.from('novedades').update({ checks: newChecks, modificado_por: currentUser.username }).eq('id', id);
    if (!error) {
      setNovedades(novedades.map(n => n.id === id ? { ...n, checks: newChecks } : n));
      addLog('MARCA_CHECK', 'Cambió estado de ' + key + ' en ' + nov.numero_novedad);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackup = async () => {
    try {
      showNotify("Generando respaldo...", "success");
      
      // Obtener todos los datos
      const { data: allNovedades } = await sb.from('novedades').select('*');
      const { data: allUsers } = await sb.from('users').select('*');
      const { data: allLogs } = await sb.from('logs').select('*').order('created_at', { ascending: false }).limit(500);
      
      // Crear objeto de respaldo
      const backup = {
        fecha_respaldo: new Date().toISOString(),
        generado_por: currentUser.nombre,
        version: '1.0',
        datos: {
          novedades: allNovedades || [],
          usuarios: allUsers || [],
          logs: allLogs || []
        },
        resumen: {
          total_novedades: (allNovedades || []).length,
          total_usuarios: (allUsers || []).length,
          total_logs: (allLogs || []).length
        }
      };
      
      // Convertir a JSON
      const jsonString = JSON.stringify(backup, null, 2);
      
      // Crear blob y descargar
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `respaldo_novedades_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addLog('RESPALDO', 'Descargó respaldo de la base de datos');
      showNotify("Respaldo descargado correctamente", "success");
    } catch (error) {
      console.error("Error al generar respaldo:", error);
      showNotify("Error al generar respaldo", "error");
    }
  };

  if (isLoading) return null;

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-800 p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-slideUp">
          <div className="text-center mb-8">
            <div className="inline-block p-5 bg-emerald-50 rounded-full text-5xl mb-4 border border-emerald-100 shadow-sm">📋</div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Acceso Operativo</h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">Control de Novedades y Auditoría</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(e.target.user.value, e.target.pass.value); }} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Usuario</label>
              <input name="user" placeholder="ej: j.perez" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
              <input name="pass" type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700" required />
            </div>
            <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all mt-4 uppercase tracking-widest text-sm">Entrar al Sistema</button>
          </form>
          {notification && <Notification {...notification} />}
        </div>
      </div>
    );
  }

  // Tarjeta de novedad
  const NovedadCard = ({ n, isCompletedView }) => {
    const { completed, total } = getTaskCounts(n);
    const isEx = expandedId === n.id;
    const { isAssigned, assignments } = getUserAssignment(n, currentUser);
    const userTasksComplete = areUserTasksComplete(n, assignments);
    const assignedTasks = getAssignedTasks(n);
    
    let borderColor = 'border-slate-200', bgColor = 'bg-white', leftBorder = '';
    if (!isCompletedView && isAssigned) {
      if (userTasksComplete) { borderColor = 'border-emerald-300'; bgColor = 'bg-emerald-50'; leftBorder = 'border-l-4 border-l-emerald-500'; }
      else { borderColor = 'border-red-300'; bgColor = 'bg-red-50'; leftBorder = 'border-l-4 border-l-red-500'; }
    }
    if (isCompletedView) { borderColor = 'border-emerald-300'; bgColor = 'bg-emerald-50'; leftBorder = 'border-l-4 border-l-emerald-500'; }
    
    return (
      <div className={`${bgColor} rounded-3xl shadow-md border ${borderColor} ${leftBorder} overflow-hidden transition-all hover:shadow-xl`}>
        <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isEx ? null : n.id)}>
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${completed === total && total > 0 ? 'bg-emerald-500 text-white' : total === 0 ? 'bg-slate-300 text-slate-500' : 'bg-amber-400 text-white'}`}>{total > 0 ? `${completed}/${total}` : 'N/A'}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-black text-slate-800 text-lg leading-none">{n.numero_novedad}</span>
                {n.anio && <span className="text-[10px] font-black text-slate-500 bg-slate-200 px-2 py-1 rounded-full">{n.anio}</span>}
                {n.titulo && <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">{n.titulo}</span>}
                {!isCompletedView && isAssigned && <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${userTasksComplete ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>{userTasksComplete ? '✓ Tu tarea lista' : '⚠ Pendiente'}</span>}
                {isCompletedView && <span className="text-[10px] font-black uppercase px-2 py-1 rounded-full bg-emerald-500 text-white">✓ Completado</span>}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">SGSP: {n.numero_sgsp}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] text-slate-500 font-black uppercase bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">{new Date(n.created_at).toLocaleDateString()}</span>
            <span className={`text-slate-400 text-xs transition-transform duration-300 ${isEx ? 'rotate-180' : ''}`}>▼</span>
          </div>
        </div>
        {isEx && (
          <div className="px-6 pb-6 border-t border-slate-100 animate-fadeIn bg-white/50">
             {n.titulo && <div className="py-4 border-b border-slate-100"><span className="text-[10px] font-black text-slate-400 uppercase">Título:</span><p className="text-slate-700 font-bold mt-1">{n.titulo}</p></div>}
             {!isCompletedView && isAssigned && (
               <div className="py-4 border-b border-slate-200 bg-slate-100 -mx-6 px-6 my-4">
                 <span className="text-[10px] font-black text-slate-600 uppercase">📌 Tus tareas asignadas:</span>
                 <div className="mt-3 space-y-2">
                   {assignments.map(a => (
                     <label key={a.checkKey} className="flex items-center gap-4 py-2 cursor-pointer group select-none">
                       <div onClick={() => handleToggleCheck(n.id, a.checkKey)} className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${n.checks && n.checks[a.checkKey] ? 'bg-emerald-500 border-emerald-500' : 'border-red-400 bg-red-100 group-hover:border-red-500'}`}>
                         {n.checks && n.checks[a.checkKey] && <span className="text-white text-sm">✓</span>}
                       </div>
                       <span className={`text-sm font-bold ${n.checks && n.checks[a.checkKey] ? 'text-emerald-600 line-through' : 'text-red-600'}`}>{a.label}</span>
                     </label>
                   ))}
                 </div>
               </div>
             )}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-slate-500 uppercase border-b border-slate-200 pb-2">Asignaciones</h4>
                  {[{ field: 'informeActuacion', label: 'Informe Actuación', checkKey: 'actuacionRealizada' },{ field: 'informeCriminalistico', label: 'Criminalístico', checkKey: 'criminalisticoRealizado' },{ field: 'informePericial', label: 'Pericial', checkKey: 'pericialRealizado' },{ field: 'croquis', label: 'Croquis', checkKey: 'croquisRealizado' }].map(item => {
                    const isMe = n[item.field] === currentUser.nombre;
                    const isDone = n.checks && n.checks[item.checkKey];
                    const hasAssignment = !!n[item.field];
                    return (
                      <div key={item.field} className={`flex justify-between items-center text-xs py-2 px-3 rounded-lg ${isMe ? (isDone ? 'bg-emerald-100' : 'bg-red-100') : 'bg-slate-50'}`}>
                        <span className="text-slate-600 font-bold">{item.label}:</span>
                        <span className={`font-black ${!hasAssignment ? 'text-slate-400 italic' : isMe ? (isDone ? 'text-emerald-600' : 'text-red-600') : 'text-slate-800'}`}>
                          {n[item.field] || 'Sin asignar'}{isMe && hasAssignment && <span className="ml-1">{isDone ? '✓' : '←'}</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-3">
                   <h4 className="text-[11px] font-black text-slate-500 uppercase border-b border-slate-200 pb-2">Checklist ({completed}/{total})</h4>
                   {assignedTasks.length === 0 ? <p className="text-slate-400 text-xs italic py-4 text-center bg-slate-50 rounded-xl">No hay tareas asignadas</p> : (
                     assignedTasks.map(task => {
                       const isMyTask = task.person === currentUser.nombre;
                       return (
                         <label key={task.checkKey} className={`flex items-center gap-4 py-2 cursor-pointer group select-none rounded-lg px-3 ${isMyTask ? 'bg-slate-100' : 'bg-slate-50'}`}>
                           <div onClick={() => handleToggleCheck(n.id, task.checkKey)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${n.checks && n.checks[task.checkKey] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white group-hover:border-slate-400'}`}>
                             {n.checks && n.checks[task.checkKey] && <span className="text-white text-[10px]">✓</span>}
                           </div>
                           <span className={`text-xs font-bold ${n.checks && n.checks[task.checkKey] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                             {task.label}{isMyTask && <span className="ml-1 text-[9px] text-emerald-600 font-black">(TÚ)</span>}
                             <span className="ml-2 text-[9px] text-slate-400">- {task.person}</span>
                           </span>
                         </label>
                       );
                     })
                   )}
                </div>
             </div>
             <div className="pt-6 flex justify-between items-center border-t border-slate-200">
               <div className="flex flex-col">
                 <span className="text-[9px] text-slate-400 font-bold uppercase">Cargado: {n.creado_por}</span>
                 {n.modificado_por && <span className="text-[9px] text-emerald-500 font-bold uppercase">Mod: {n.modificado_por}</span>}
               </div>
               <div className="flex gap-2">
                  <button onClick={() => { setEditingNovedad(n); setCurrentView('form'); }} className="text-[10px] bg-slate-200 px-4 py-2 rounded-xl font-black text-slate-700 hover:bg-slate-300 uppercase">Editar</button>
                  {currentUser.role === 'admin' && <button onClick={async () => { if(confirm("¿Eliminar?")){ await sb.from('novedades').delete().eq('id', n.id); addLog('BORRAR_REGISTRO', 'Eliminó ' + n.numero_novedad); loadData(); showNotify("Eliminado"); } }} className="text-[10px] bg-red-100 px-4 py-2 rounded-xl font-black text-red-600 hover:bg-red-200 uppercase">Eliminar</button>}
               </div>
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pb-20 min-h-screen bg-slate-300 font-sans">
      <Header user={currentUser} currentView={currentView} setView={v => { setCurrentView(v); setEditingNovedad(null); setEditingUser(null); setSearchTerm(''); setSelectedYear(''); if(v === 'logs' || v === 'users') loadData(); }} onLogout={() => { addLog('LOGOUT', 'Cierre de sesión'); setCurrentUser(null); }} onShowStats={() => setShowStats(true)} onShowPass={() => setShowPassModal(true)} onShowReport={() => setShowReport(true)} onBackup={handleBackup} pendingCount={totalPending} completedCount={totalCompleted} />
      
      <main className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
        
        {/* LISTA PENDIENTES */}
        {currentView === 'list' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-800">Pendientes</h2>
                <p className="text-xs text-slate-600 font-bold uppercase mt-1">Tus asignaciones primero</p>
              </div>
              <button onClick={() => setCurrentView('form')} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl hover:scale-105 transition-transform uppercase">+ Nuevo</button>
            </div>
            <SearchAndFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} selectedYear={selectedYear} onYearChange={setSelectedYear} />
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500"></div><span className="text-xs font-bold text-slate-600">Pendiente tuyo</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500"></div><span className="text-xs font-bold text-slate-600">Tu tarea lista</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-slate-300"></div><span className="text-xs font-bold text-slate-600">No asignado</span></div>
            </div>
            {pendingNovedades.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-300">
                <div className="text-5xl mb-4">{searchTerm || selectedYear ? '🔍' : '🎉'}</div>
                <p className="text-slate-500 font-bold">{searchTerm || selectedYear ? 'Sin resultados' : '¡No hay pendientes!'}</p>
              </div>
            ) : <div className="grid gap-4">{pendingNovedades.map(n => <NovedadCard key={n.id} n={n} isCompletedView={false} />)}</div>}
          </div>
        )}

        {/* COMPLETADOS */}
        {currentView === 'completed' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-800">Completados</h2>
                <p className="text-xs text-slate-600 font-bold uppercase mt-1">Todas las tareas finalizadas</p>
              </div>
            </div>
            <SearchAndFilter searchTerm={searchTerm} onSearchChange={setSearchTerm} selectedYear={selectedYear} onYearChange={setSelectedYear} />
            {completedNovedades.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-300">
                <div className="text-5xl mb-4">{searchTerm || selectedYear ? '🔍' : '📂'}</div>
                <p className="text-slate-500 font-bold">{searchTerm || selectedYear ? 'Sin resultados' : 'No hay completados'}</p>
              </div>
            ) : <div className="grid gap-4">{completedNovedades.map(n => <NovedadCard key={n.id} n={n} isCompletedView={true} />)}</div>}
          </div>
        )}

        {/* FORMULARIO */}
        {currentView === 'form' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-2xl mx-auto animate-slideUp border border-slate-200">
            <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black">{editingNovedad ? 'Editar Registro' : 'Nuevo Registro'}</h2>
                <p className="text-slate-400 text-xs mt-1 font-bold uppercase">Datos de la actuación</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
            <form className="p-10 space-y-8" onSubmit={async (e) => {
              e.preventDefault();
              const d = new FormData(e.target);
              const numeroNov = d.get('nov');
              const anioNov = d.get('anio');
              
              // Validar duplicado
              if (checkDuplicateNovedad(numeroNov, anioNov, editingNovedad?.id)) {
                showNotify("Ya existe una novedad con ese número en el año " + anioNov, "error");
                return;
              }
              
              const payload = {
                numero_novedad: numeroNov,
                numero_sgsp: d.get('sgsp'),
                anio: parseInt(anioNov) || currentYear,
                titulo: d.get('titulo') || null,
                informeActuacion: d.get('ia') || null,
                informeCriminalistico: d.get('ic') || null,
                informePericial: d.get('ip') || null,
                croquis: d.get('cr') || null,
                checks: editingNovedad ? editingNovedad.checks : { actuacionRealizada: false, criminalisticoRealizado: false, pericialRealizado: false, croquisRealizado: false }
              };
              
              if (editingNovedad) {
                await sb.from('novedades').update({ ...payload, modificado_por: currentUser.username }).eq('id', editingNovedad.id);
                addLog('EDITAR_REGISTRO', 'Editó ' + payload.numero_novedad);
                showNotify("Actualizado con éxito");
              } else {
                await sb.from('novedades').insert([{ ...payload, creado_por: currentUser.username }]);
                addLog('CREAR_REGISTRO', 'Creó ' + payload.numero_novedad);
                showNotify("Guardado correctamente");
              }
              loadData();
              setCurrentView('list');
            }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">N° Novedad *</label>
                  <input name="nov" defaultValue={editingNovedad?.numero_novedad} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" placeholder="Ej: 001" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Año *</label>
                  <select name="anio" defaultValue={editingNovedad?.anio || currentYear} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold cursor-pointer">
                    {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">N° SGSP *</label>
                  <input name="sgsp" defaultValue={editingNovedad?.numero_sgsp} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" placeholder="SGSP-XXXX" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Título / Descripción</label>
                <input name="titulo" defaultValue={editingNovedad?.titulo || ''} className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-700" placeholder="Ej: Robo, Accidente..." />
              </div>
              <div className="space-y-6 pt-4">
                <h3 className="text-[11px] font-black text-slate-400 uppercase border-b border-slate-100 pb-3">Personal Asignado</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {[{ name: 'ia', field: 'informeActuacion', label: 'Informe Actuación' },{ name: 'ic', field: 'informeCriminalistico', label: 'Criminalístico' },{ name: 'ip', field: 'informePericial', label: 'Pericial' },{ name: 'cr', field: 'croquis', label: 'Croquis' }].map(item => (
                     <div key={item.name} className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-500 uppercase ml-1">{item.label}</label>
                       <select name={item.name} defaultValue={editingNovedad ? editingNovedad[item.field] : ''} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm cursor-pointer">
                         <option value="">-- Sin asignar --</option>
                         {users.map(u => <option key={u.id} value={u.nombre}>{u.nombre}</option>)}
                       </select>
                     </div>
                   ))}
                </div>
              </div>
              <div className="flex gap-4 pt-10">
                 <button type="button" onClick={() => setCurrentView('list')} className="flex-1 p-5 bg-slate-200 rounded-[1.5rem] font-black text-slate-600 uppercase text-xs hover:bg-slate-300">Cancelar</button>
                 <button className="flex-1 p-5 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase text-xs shadow-xl hover:scale-[1.02] active:scale-[0.98]">Guardar</button>
              </div>
            </form>
          </div>
        )}

        {/* USUARIOS */}
        {currentView === 'users' && currentUser.role === 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-800">Personal</h2>
                <p className="text-xs text-slate-600 font-bold uppercase mt-1">Gestión de usuarios</p>
              </div>
              <button onClick={() => setEditingUser({ nombre: '', username: '', password: '', role: 'user' })} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg">+ Nuevo Usuario</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map(u => (
                <div key={u.id} className="bg-white p-5 rounded-3xl shadow-md border border-slate-200 flex items-center justify-between group hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-lg">{u.nombre.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="font-black text-slate-800">{u.nombre}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${u.role === 'admin' ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
                        {u.role} • @{u.username}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <button onClick={() => setEditingUser(u)} className="p-2.5 hover:bg-slate-100 rounded-xl">✏️</button>
                    {u.id !== currentUser.id && <button onClick={async () => { if(confirm("¿Eliminar usuario?")){ await sb.from('users').delete().eq('id', u.id); addLog('BORRAR_USUARIO', 'Eliminó @' + u.username); loadData(); } }} className="p-2.5 hover:bg-red-100 text-red-500 rounded-xl">🗑️</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOGS */}
        {currentView === 'logs' && currentUser.role === 'admin' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-800">Auditoría</h2>
              <p className="text-xs text-slate-600 font-bold uppercase mt-1">Registro de actividades</p>
            </div>
            {logs.length === 0 ? <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200"><p className="text-slate-500 font-bold">Sin registros</p></div> : (
              <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-md">
                <div className="max-h-[600px] overflow-y-auto">
                  {logs.map((log, i) => {
                    const isFailed = log.action === 'LOGIN_FALLIDO';
                    return (
                    <div key={log.id || i} className={`p-5 border-b border-slate-100 last:border-0 flex items-start gap-4 ${isFailed ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0 ${isFailed ? 'bg-red-200' : 'bg-slate-200'}`}>
                        {log.action === 'LOGIN' ? '🔓' : log.action === 'LOGOUT' ? '🚪' : log.action === 'LOGIN_FALLIDO' ? '🚫' : log.action.includes('CREAR') || log.action.includes('NUEVO') ? '➕' : log.action.includes('EDITAR') || log.action.includes('MOD') ? '✏️' : log.action.includes('BORRAR') ? '🗑️' : '📝'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-black text-sm ${isFailed ? 'text-red-700' : 'text-slate-800'}`}>{log.nombre}</span>
                          <span className={`text-[10px] font-bold ${isFailed ? 'text-red-500' : 'text-slate-500'}`}>@{log.username}</span>
                          {isFailed && <span className="text-[9px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full">⚠️ ALERTA</span>}
                        </div>
                        <p className={`text-xs mt-1 ${isFailed ? 'text-red-600 font-semibold' : 'text-slate-600'}`}>{log.details}</p>
                        <span className={`text-[9px] font-bold uppercase mt-2 inline-block ${isFailed ? 'text-red-400' : 'text-slate-400'}`}>{log.action} • {new Date(log.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL USUARIO */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
             <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="font-black uppercase text-sm">{editingUser.id ? 'Modificar Usuario' : 'Crear Usuario'}</h3>
               <button onClick={() => setEditingUser(null)} className="text-slate-500 hover:text-white">✕</button>
             </div>
             <form className="p-8 space-y-5" onSubmit={async (e) => {
               e.preventDefault();
               const f = new FormData(e.target);
               const data = { nombre: f.get('nom'), username: f.get('user'), password: f.get('pass'), role: f.get('role') };
               if (editingUser.id) {
                 await sb.from('users').update(data).eq('id', editingUser.id);
                 addLog('MOD_USUARIO', 'Modificó @' + data.username);
               } else {
                 await sb.from('users').insert([data]);
                 addLog('NUEVO_USUARIO', 'Creó @' + data.username);
               }
               loadData(); setEditingUser(null); showNotify("Usuario guardado");
             }}>
               <input name="nom" defaultValue={editingUser.nombre} placeholder="Nombre Completo" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" />
               <input name="user" defaultValue={editingUser.username} placeholder="Username" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" />
               <input name="pass" defaultValue={editingUser.password} placeholder="Contraseña" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" />
               <select name="role" defaultValue={editingUser.role} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm cursor-pointer">
                 <option value="user">Usuario</option>
                 <option value="admin">Administrador</option>
               </select>
               <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs shadow-xl mt-4">Guardar</button>
             </form>
           </div>
        </div>
      )}

      {/* MODAL PASSWORD */}
      {showPassModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
             <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="font-black uppercase text-sm">Cambiar Contraseña</h3>
               <button onClick={() => setShowPassModal(false)} className="text-slate-500 hover:text-white">✕</button>
             </div>
             <form className="p-8 space-y-5" onSubmit={async (e) => {
               e.preventDefault();
               const pass = e.target.pass.value;
               if(pass.length < 4) return alert("Mínimo 4 caracteres");
               await sb.from('users').update({ password: pass }).eq('id', currentUser.id);
               addLog('CAMBIO_PASS', 'Actualizó contraseña'); showNotify("Contraseña actualizada"); setShowPassModal(false);
             }}>
               <p className="text-[10px] text-slate-500 font-bold uppercase">Nueva clave para @{currentUser.username}</p>
               <input name="pass" type="password" placeholder="Nueva Contraseña..." required className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
               <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs shadow-xl">Guardar</button>
             </form>
           </div>
        </div>
      )}

      {/* MODAL STATS */}
      {showStats && currentUser.role === 'admin' && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => { setShowStats(false); setSelectedUserStats(null); }}>
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center sticky top-0">
              <h3 className="font-black uppercase text-sm">📊 Estadísticas</h3>
              <button onClick={() => { setShowStats(false); setSelectedUserStats(null); }} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <div className="p-8 space-y-8">
               <div>
                 <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4">Resumen General</h4>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-100 p-5 rounded-2xl text-center">
                      <div className="text-3xl font-black text-slate-800">{novedades.length}</div>
                      <div className="text-[9px] uppercase font-black text-slate-500">Total</div>
                    </div>
                    <div className="bg-amber-100 p-5 rounded-2xl text-center">
                      <div className="text-3xl font-black text-amber-700">{totalPending}</div>
                      <div className="text-[9px] uppercase font-black text-amber-600">Pendientes</div>
                    </div>
                    <div className="bg-emerald-100 p-5 rounded-2xl text-center">
                      <div className="text-3xl font-black text-emerald-700">{totalCompleted}</div>
                      <div className="text-[9px] uppercase font-black text-emerald-600">Completados</div>
                    </div>
                 </div>
               </div>

               <div>
                 <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4">Rendimiento por Usuario (clic para detalle)</h4>
                 <div className="space-y-3">
                   {users.map(u => {
                     const stats = getUserDetailedStats(u);
                     const porcentaje = stats.totalAsignadas > 0 ? Math.round((stats.totalCompletadas / stats.totalAsignadas) * 100) : 0;
                     const isSelected = selectedUserStats?.id === u.id;
                     return (
                       <div key={u.id} className={`bg-slate-100 p-4 rounded-2xl cursor-pointer transition-all ${isSelected ? 'ring-2 ring-emerald-500' : 'hover:bg-slate-200'}`} onClick={() => setSelectedUserStats(isSelected ? null : u)}>
                         <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">{u.nombre.charAt(0).toUpperCase()}</div>
                             <div>
                               <div className="font-black text-slate-800 text-sm">{u.nombre}</div>
                               <div className="text-[9px] text-slate-500 font-bold uppercase">@{u.username} • {u.role}</div>
                             </div>
                           </div>
                           <div className="text-right">
                             <div className="text-lg font-black text-slate-800">{porcentaje}%</div>
                             <div className="text-[9px] text-slate-500 font-bold uppercase">Completado</div>
                           </div>
                         </div>
                         <div className="h-2 bg-slate-300 rounded-full overflow-hidden mb-3">
                           <div className="h-full bg-emerald-500 rounded-full" style={{ width: porcentaje + '%' }}></div>
                         </div>
                         <div className="grid grid-cols-3 gap-2 text-center">
                           <div className="bg-white p-2 rounded-xl">
                             <div className="text-lg font-black text-slate-700">{stats.totalAsignadas}</div>
                             <div className="text-[8px] text-slate-500 font-bold uppercase">Asignadas</div>
                           </div>
                           <div className="bg-emerald-100 p-2 rounded-xl">
                             <div className="text-lg font-black text-emerald-700">{stats.totalCompletadas}</div>
                             <div className="text-[8px] text-emerald-600 font-bold uppercase">Hechas</div>
                           </div>
                           <div className="bg-red-100 p-2 rounded-xl">
                             <div className="text-lg font-black text-red-600">{stats.pendientes}</div>
                             <div className="text-[8px] text-red-500 font-bold uppercase">Pendientes</div>
                           </div>
                         </div>
                         
                         {/* DETALLE POR TIPO DE TAREA */}
                         {isSelected && (
                           <div className="mt-4 pt-4 border-t border-slate-300 animate-fadeIn">
                             <h5 className="text-[9px] font-black text-slate-600 uppercase mb-3">📋 Desglose por tipo de tarea:</h5>
                             <div className="grid grid-cols-2 gap-2">
                               <div className="bg-white p-3 rounded-xl">
                                 <div className="text-[10px] font-bold text-slate-600 mb-1">Informe Actuación</div>
                                 <div className="flex justify-between">
                                   <span className="text-emerald-600 font-black">{stats.informeActuacion.completadas} ✓</span>
                                   <span className="text-red-500 font-black">{stats.informeActuacion.asignadas - stats.informeActuacion.completadas} ✗</span>
                                 </div>
                               </div>
                               <div className="bg-white p-3 rounded-xl">
                                 <div className="text-[10px] font-bold text-slate-600 mb-1">Criminalístico</div>
                                 <div className="flex justify-between">
                                   <span className="text-emerald-600 font-black">{stats.informeCriminalistico.completadas} ✓</span>
                                   <span className="text-red-500 font-black">{stats.informeCriminalistico.asignadas - stats.informeCriminalistico.completadas} ✗</span>
                                 </div>
                               </div>
                               <div className="bg-white p-3 rounded-xl">
                                 <div className="text-[10px] font-bold text-slate-600 mb-1">Pericial</div>
                                 <div className="flex justify-between">
                                   <span className="text-emerald-600 font-black">{stats.informePericial.completadas} ✓</span>
                                   <span className="text-red-500 font-black">{stats.informePericial.asignadas - stats.informePericial.completadas} ✗</span>
                                 </div>
                               </div>
                               <div className="bg-white p-3 rounded-xl">
                                 <div className="text-[10px] font-bold text-slate-600 mb-1">Croquis</div>
                                 <div className="flex justify-between">
                                   <span className="text-emerald-600 font-black">{stats.croquis.completadas} ✓</span>
                                   <span className="text-red-500 font-black">{stats.croquis.asignadas - stats.croquis.completadas} ✗</span>
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

               <button onClick={() => { setShowStats(false); setSelectedUserStats(null); }} className="w-full py-4 bg-slate-200 rounded-2xl font-black text-slate-600 uppercase text-[10px] hover:bg-slate-300">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REPORTE IMPRIMIBLE */}
      {showReport && currentUser.role === 'admin' && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setShowReport(false)}>
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center sticky top-0 print:hidden">
              <h3 className="font-black uppercase text-sm">🖨️ Reporte del Sistema</h3>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold text-sm">Imprimir</button>
                <button onClick={() => setShowReport(false)} className="text-slate-500 hover:text-white px-2">✕</button>
              </div>
            </div>
            
            {/* CONTENIDO DEL REPORTE */}
            <div className="p-8 print:p-4" id="report-content">
              <div className="text-center mb-8 print:mb-4">
                <h1 className="text-2xl font-black text-slate-800">📋 REPORTE DE NOVEDADES</h1>
                <p className="text-slate-500 text-sm">Generado el {new Date().toLocaleString()}</p>
              </div>
              
              {/* RESUMEN */}
              <div className="mb-8 print:mb-4">
                <h2 className="text-lg font-black text-slate-700 border-b-2 border-slate-300 pb-2 mb-4">RESUMEN GENERAL</h2>
                <div className="grid grid-cols-3 gap-4 print:gap-2">
                  <div className="bg-slate-100 p-4 rounded-xl text-center print:p-2">
                    <div className="text-2xl font-black text-slate-800">{novedades.length}</div>
                    <div className="text-xs font-bold text-slate-500">TOTAL</div>
                  </div>
                  <div className="bg-amber-100 p-4 rounded-xl text-center print:p-2">
                    <div className="text-2xl font-black text-amber-700">{totalPending}</div>
                    <div className="text-xs font-bold text-amber-600">PENDIENTES</div>
                  </div>
                  <div className="bg-emerald-100 p-4 rounded-xl text-center print:p-2">
                    <div className="text-2xl font-black text-emerald-700">{totalCompleted}</div>
                    <div className="text-xs font-bold text-emerald-600">COMPLETADOS</div>
                  </div>
                </div>
              </div>

              {/* NOVEDADES COMPLETADAS */}
              <div className="mb-8 print:mb-4">
                <h2 className="text-lg font-black text-emerald-700 border-b-2 border-emerald-300 pb-2 mb-4">✅ NOVEDADES COMPLETADAS ({totalCompleted})</h2>
                {novedades.filter(n => isNovedadComplete(n)).length === 0 ? (
                  <p className="text-slate-500 italic">No hay novedades completadas</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-emerald-50">
                        <th className="p-2 text-left font-bold">N° Novedad</th>
                        <th className="p-2 text-left font-bold">Año</th>
                        <th className="p-2 text-left font-bold">SGSP</th>
                        <th className="p-2 text-left font-bold">Título</th>
                      </tr>
                    </thead>
                    <tbody>
                      {novedades.filter(n => isNovedadComplete(n)).sort(sortByNovedadNumber).map(n => (
                        <tr key={n.id} className="border-b border-slate-100">
                          <td className="p-2 font-bold">{n.numero_novedad}</td>
                          <td className="p-2">{n.anio || '-'}</td>
                          <td className="p-2">{n.numero_sgsp}</td>
                          <td className="p-2">{n.titulo || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* NOVEDADES PENDIENTES */}
              <div className="mb-8 print:mb-4">
                <h2 className="text-lg font-black text-amber-700 border-b-2 border-amber-300 pb-2 mb-4">⏳ NOVEDADES PENDIENTES ({totalPending})</h2>
                {novedades.filter(n => !isNovedadComplete(n)).length === 0 ? (
                  <p className="text-slate-500 italic">No hay novedades pendientes</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-amber-50">
                        <th className="p-2 text-left font-bold">N° Novedad</th>
                        <th className="p-2 text-left font-bold">Año</th>
                        <th className="p-2 text-left font-bold">SGSP</th>
                        <th className="p-2 text-left font-bold">Título</th>
                        <th className="p-2 text-left font-bold">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {novedades.filter(n => !isNovedadComplete(n)).sort(sortByNovedadNumber).map(n => {
                        const { completed, total } = getTaskCounts(n);
                        return (
                        <tr key={n.id} className="border-b border-slate-100">
                          <td className="p-2 font-bold">{n.numero_novedad}</td>
                          <td className="p-2">{n.anio || '-'}</td>
                          <td className="p-2">{n.numero_sgsp}</td>
                          <td className="p-2">{n.titulo || '-'}</td>
                          <td className="p-2"><span className="bg-amber-200 px-2 py-1 rounded text-xs font-bold">{completed}/{total}</span></td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                )}
              </div>

              {/* DESGLOSE POR USUARIO */}
              <div className="mb-8 print:mb-4">
                <h2 className="text-lg font-black text-slate-700 border-b-2 border-slate-300 pb-2 mb-4">👥 RENDIMIENTO POR USUARIO</h2>
                <div className="space-y-4">
                  {users.map(u => {
                    const stats = getUserDetailedStats(u);
                    const porcentaje = stats.totalAsignadas > 0 ? Math.round((stats.totalCompletadas / stats.totalAsignadas) * 100) : 0;
                    return (
                      <div key={u.id} className="bg-slate-50 p-4 rounded-xl print:p-2 print:border print:border-slate-200">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <span className="font-black text-slate-800">{u.nombre}</span>
                            <span className="text-xs text-slate-500 ml-2">@{u.username} • {u.role}</span>
                          </div>
                          <span className="font-black text-lg">{porcentaje}%</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-white p-2 rounded">
                            <div className="font-bold">Inf. Actuación</div>
                            <div className="text-emerald-600">{stats.informeActuacion.completadas}/{stats.informeActuacion.asignadas}</div>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <div className="font-bold">Criminalístico</div>
                            <div className="text-emerald-600">{stats.informeCriminalistico.completadas}/{stats.informeCriminalistico.asignadas}</div>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <div className="font-bold">Pericial</div>
                            <div className="text-emerald-600">{stats.informePericial.completadas}/{stats.informePericial.asignadas}</div>
                          </div>
                          <div className="bg-white p-2 rounded">
                            <div className="font-bold">Croquis</div>
                            <div className="text-emerald-600">{stats.croquis.completadas}/{stats.croquis.asignadas}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center text-xs text-slate-400 mt-8 print:mt-4">
                Sistema de Novedades • Reporte generado automáticamente
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PENDIENTES LOGIN */}
      {showPendingModal && <PendingModal count={pendingCount} onClose={() => setShowPendingModal(false)} />}

      {notification && <Notification {...notification} />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
