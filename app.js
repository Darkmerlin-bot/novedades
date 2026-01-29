
const { useState, useEffect, useCallback, useMemo } = React;
const { createClient } = supabase;

// 1. CONFIGURACIÓN SUPABASE
const SUPABASE_URL = 'https://whfrenunfcrcrljithex.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZnJlbnVuZmNyY3Jsaml0aGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Njk5ODUsImV4cCI6MjA4NTI0NTk4NX0.MMbKQxmSL_7UPNcEh_F1NofVPa13Trz3sedDALvgvPs';
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. COMPONENTE DE NOTIFICACIÓN
const Notification = ({ message, type }) => (
  <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideInRight border-l-4 ${
    type === 'success' ? 'bg-white border-emerald-500 text-slate-800' : 'bg-red-500 border-red-700 text-white'
  }`}>
    <span className="text-xl">{type === 'success' ? '✅' : '⚠️'}</span>
    <span className="font-bold text-sm">{message}</span>
  </div>
);

// 3. ENCABEZADO MEJORADO
const Header = ({ user, currentView, setView, onLogout, onShowStats, onShowPass }) => (
  <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
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
            <button onClick={onShowStats} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all" title="Estadísticas">📊</button>
            <button onClick={onLogout} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all" title="Salir">🚪</button>
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-1 no-scrollbar border-t border-slate-800 pt-3">
        <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'list' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>📁 Lista</button>
        <button onClick={() => setView('form')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'form' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>➕ Nueva</button>
        {user.role === 'admin' && (
          <>
            <button onClick={() => setView('config')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'config' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>⚙️ Listas</button>
            <button onClick={() => setView('users')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'users' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>👥 Personal</button>
            <button onClick={() => setView('logs')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${currentView === 'logs' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>📜 Auditoría</button>
          </>
        )}
      </nav>
    </div>
  </header>
);

// 4. APLICACIÓN PRINCIPAL
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [novedades, setNovedades] = useState([]);
  const [config, setConfig] = useState({ informeActuacion: [], informeCriminalistico: [], informePericial: [], croquis: [] });
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [editingNovedad, setEditingNovedad] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const showNotify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addLog = async (action, details) => {
    if (!currentUser) return;
    try {
      await sb.from('logs').insert([{ username: currentUser.username, nombre: currentUser.nombre, action, details }]);
    } catch (e) { console.error("Log error:", e); }
  };

  const loadData = async () => {
    try {
      // Cargamos usuarios
      const { data: userData } = await sb.from('users').select('*').order('nombre');
      setUsers(userData || []);

      // Cargamos novedades
      const { data: novData } = await sb.from('novedades').select('*').order('created_at', { ascending: false });
      setNovedades(novData || []);

      // Cargamos configuración con maybeSingle para evitar errores si está vacía
      const { data: confData } = await sb.from('config').select('*').limit(1).maybeSingle();
      if (confData && confData.data) {
        setConfig(confData.data);
      } else {
        // Valores iniciales si la tabla config está vacía
        const initialCfg = { informeActuacion: [], informeCriminalistico: [], informePericial: [], croquis: [] };
        setConfig(initialCfg);
      }

      // Cargamos logs
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

  const handleLogin = (u, p) => {
    const user = users.find(usr => usr.username.toLowerCase() === u.toLowerCase() && usr.password === p);
    if (user) {
      setCurrentUser(user);
      addLog('LOGIN', 'Ingreso exitoso al sistema');
      showNotify(`Bienvenido, ${user.nombre}`);
    } else {
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
      addLog('MARCA_CHECK', `Cambió estado de ${key} en ${nov.numero_novedad}`);
    }
  };

  if (isLoading) return null;

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4 font-sans">
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
            <button className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all transform active:scale-[0.98] mt-4 uppercase tracking-widest text-sm">Entrar al Sistema</button>
          </form>
          {notification && <Notification {...notification} />}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-slate-50 font-sans">
      <Header 
        user={currentUser} 
        currentView={currentView} 
        setView={v => { setCurrentView(v); setEditingNovedad(null); setEditingUser(null); if(v === 'logs' || v === 'users') loadData(); }} 
        onLogout={() => { addLog('LOGOUT', 'Cierre de sesión manual'); setCurrentUser(null); }} 
        onShowStats={() => setShowStats(true)} 
        onShowPass={() => setShowPassModal(true)}
      />
      
      <main className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
        
        {/* VISTA LISTA DE NOVEDADES */}
        {currentView === 'list' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Registros</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Historial de Actuaciones</p>
              </div>
              <button onClick={() => setCurrentView('form')} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl shadow-slate-900/20 hover:scale-105 transition-transform uppercase tracking-widest">+ Nuevo</button>
            </div>
            
            {novedades.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="text-5xl mb-4 grayscale opacity-30">📂</div>
                <p className="text-slate-400 font-bold">No se encontraron registros activos.</p>
              </div>
            )}

            <div className="grid gap-4">
              {novedades.map(n => {
                const compCount = Object.values(n.checks || {}).filter(Boolean).length;
                const isEx = expandedId === n.id;
                return (
                  <div key={n.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-lg">
                    <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isEx ? null : n.id)}>
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${compCount === 4 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {compCount}/4
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-lg leading-none mb-1">{n.numero_novedad}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SGSP: {n.numero_sgsp}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="hidden sm:inline text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                          {new Date(n.created_at).toLocaleDateString()}
                        </span>
                        <span className={`text-slate-300 text-xs transition-transform duration-300 ${isEx ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                    </div>
                    {isEx && (
                      <div className="px-6 pb-6 border-t border-slate-50 animate-fadeIn">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                            <div className="space-y-3">
                              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-50 pb-2">Asignaciones Personal</h4>
                              <div className="flex justify-between items-center text-xs py-1.5"><span className="text-slate-500 font-bold">Informe Actuación:</span><span className="font-black text-slate-800">{n.informeActuacion || '---'}</span></div>
                              <div className="flex justify-between items-center text-xs py-1.5"><span className="text-slate-500 font-bold">Criminalístico:</span><span className="font-black text-slate-800">{n.informeCriminalistico || '---'}</span></div>
                              <div className="flex justify-between items-center text-xs py-1.5"><span className="text-slate-500 font-bold">Pericial:</span><span className="font-black text-slate-800">{n.informePericial || '---'}</span></div>
                              <div className="flex justify-between items-center text-xs py-1.5"><span className="text-slate-500 font-bold">Croquis:</span><span className="font-black text-slate-800">{n.croquis || '---'}</span></div>
                            </div>
                            <div className="space-y-3">
                               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-50 pb-2">Checklist de Tareas</h4>
                               {['actuacionRealizada', 'criminalisticoRealizado', 'pericialRealizado', 'croquisRealizado'].map(key => (
                                 <label key={key} className="flex items-center gap-4 py-2 cursor-pointer group select-none">
                                   <div onClick={() => handleToggleCheck(n.id, key)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${n.checks[key] ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-200' : 'border-slate-200 bg-slate-50 group-hover:border-slate-300'}`}>
                                     {n.checks[key] && <span className="text-white text-[10px]">✓</span>}
                                   </div>
                                   <span className={`text-xs font-bold transition-all ${n.checks[key] ? 'text-slate-300 line-through' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                     {key.replace(/([A-Z])/g, ' $1').replace('Realizado', ' Realizada').replace('actuacion', 'Actuación')}
                                   </span>
                                 </label>
                               ))}
                            </div>
                         </div>
                         <div className="pt-6 flex justify-between items-center border-t border-slate-50">
                           <div className="flex flex-col">
                             <span className="text-[9px] text-slate-300 font-bold uppercase">Cargado por: {n.creado_por}</span>
                             {n.modificado_por && <span className="text-[9px] text-emerald-400 font-bold uppercase">Últ. Mod: {n.modificado_por}</span>}
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => { setEditingNovedad(n); setCurrentView('form'); }} className="text-[10px] bg-slate-100 px-4 py-2 rounded-xl font-black text-slate-600 hover:bg-slate-200 uppercase tracking-widest transition-colors">Editar</button>
                              <button onClick={async () => { if(confirm("¿Eliminar este registro permanentemente?")){ await sb.from('novedades').delete().eq('id', n.id); addLog('BORRAR_REGISTRO', `Eliminó registro ${n.numero_novedad}`); loadData(); showNotify("Registro eliminado"); } }} className="text-[10px] bg-red-50 px-4 py-2 rounded-xl font-black text-red-500 hover:bg-red-100 uppercase tracking-widest transition-colors">Eliminar</button>
                           </div>
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VISTA FORMULARIO CREAR/EDITAR */}
        {currentView === 'form' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-2xl mx-auto animate-slideUp border border-slate-100">
            <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight">{editingNovedad ? 'Editar Registro' : 'Nuevo Registro'}</h2>
                <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">Ingrese los datos de la actuación operativa</p>
              </div>
              <div className="text-4xl filter drop-shadow-md">📝</div>
            </div>
            <form className="p-10 space-y-8" onSubmit={async (e) => {
              e.preventDefault();
              const d = new FormData(e.target);
              const payload = {
                numero_novedad: d.get('nov'),
                numero_sgsp: d.get('sgsp'),
                informeActuacion: d.get('ia'),
                informeCriminalistico: d.get('ic'),
                informePericial: d.get('ip'),
                croquis: d.get('cr'),
                checks: editingNovedad ? editingNovedad.checks : { actuacionRealizada: false, criminalisticoRealizado: false, pericialRealizado: false, croquisRealizado: false }
              };
              
              if (editingNovedad) {
                await sb.from('novedades').update({ ...payload, modificado_por: currentUser.username }).eq('id', editingNovedad.id);
                addLog('EDITAR_REGISTRO', `Editó registro ${payload.numero_novedad}`);
                showNotify("Información actualizada con éxito");
              } else {
                await sb.from('novedades').insert([{ ...payload, creado_por: currentUser.username }]);
                addLog('CREAR_REGISTRO', `Creó registro ${payload.numero_novedad}`);
                showNotify("Registro guardado en la base de datos");
              }
              loadData();
              setCurrentView('list');
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">N° Novedad *</label>
                  <input name="nov" defaultValue={editingNovedad?.numero_novedad} required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold" placeholder="NOV-XXXX" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">N° SGSP *</label>
                  <input name="sgsp" defaultValue={editingNovedad?.numero_sgsp} required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold" placeholder="SGSP-XXXX" />
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50 pb-3">Personal Asignado</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {['ia', 'ic', 'ip', 'cr'].map((f, i) => {
                      const names = ['informeActuacion', 'informeCriminalistico', 'informePericial', 'croquis'];
                      const labels = ['Informe Actuación', 'Criminalístico', 'Pericial', 'Croquis'];
                      return (
                        <div key={f} className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase ml-1">{labels[i]}</label>
                          <select name={f} defaultValue={editingNovedad ? editingNovedad[names[i]] : ''} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-sm cursor-pointer">
                            <option value="">-- Seleccionar --</option>
                            {(config[names[i]] || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      );
                   })}
                </div>
              </div>

              <div className="flex gap-4 pt-10">
                 <button type="button" onClick={() => setCurrentView('list')} className="flex-1 p-5 bg-slate-100 rounded-[1.5rem] font-black text-slate-500 uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors">Cancelar</button>
                 <button className="flex-1 p-5 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Guardar Datos</button>
              </div>
            </form>
          </div>
        )}

        {/* VISTA GESTIÓN USUARIOS (Solo Admin) */}
        {currentView === 'users' && currentUser.role === 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Personal</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Gestión de Accesos al Sistema</p>
              </div>
              <button onClick={() => setEditingUser({ nombre: '', username: '', password: '', role: 'user' })} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">+ Nuevo Usuario</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map(u => (
                <div key={u.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-lg">
                      {u.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-black text-slate-800">{u.nombre}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${u.role === 'admin' ? 'bg-purple-400' : 'bg-emerald-400'}`}></span>
                        {u.role} • @{u.username}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingUser(u)} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors">✏️</button>
                    {u.id !== currentUser.id && (
                      <button onClick={async () => { if(confirm("¿Eliminar acceso para este usuario?")){ await sb.from('users').delete().eq('id', u.id); addLog('BORRAR_USUARIO', `Eliminó acceso de @${u.username}`); loadData(); } }} className="p-2.5 hover:bg-red-50 text-red-400 rounded-xl transition-colors">🗑️</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA AUDITORÍA LOGS (Solo Admin) */}
        {currentView === 'logs' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Auditoría</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Historial de Acciones Recientes</p>
              </div>
              <button onClick={loadData} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">🔄</button>
            </div>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-xs">
                   <thead className="bg-slate-900 text-white font-black uppercase tracking-widest">
                     <tr>
                       <th className="p-5">Fecha y Hora</th>
                       <th className="p-5">Personal</th>
                       <th className="p-5">Acción</th>
                       <th className="p-5">Detalles</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {logs.map(l => (
                       <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="p-5 text-slate-400 font-mono text-[10px]">{new Date(l.created_at).toLocaleString()}</td>
                         <td className="p-5 font-black text-slate-700">{l.nombre} <span className="text-[9px] text-slate-300 ml-1 font-bold">@{l.username}</span></td>
                         <td className="p-5"><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-black text-[9px] border border-emerald-100 uppercase tracking-tighter">{l.action}</span></td>
                         <td className="p-5 text-slate-500 font-medium">{l.details}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* VISTA CONFIG LISTAS (Solo Admin) */}
        {currentView === 'config' && currentUser.role === 'admin' && (
          <div className="space-y-8 animate-fadeIn">
             <div>
               <h2 className="text-3xl font-black text-slate-800 tracking-tight">Listas Maestras</h2>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Configuración de Desplegables</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {['informeActuacion', 'informeCriminalistico', 'informePericial', 'croquis'].map(key => (
                  <div key={key} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-full">
                    <h3 className="font-black text-slate-800 mb-5 uppercase tracking-widest text-xs border-b border-slate-50 pb-3">{key.replace(/([A-Z])/g, ' $1').replace('informe', 'Personal')}</h3>
                    <div className="space-y-2 mb-6 flex-1 max-h-48 overflow-y-auto no-scrollbar pr-2">
                      {(config[key] || []).map((name, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-2xl group border border-slate-100">
                          <span className="text-xs font-bold text-slate-600">{name}</span>
                          <button onClick={async () => {
                            const newCfg = { ...config, [key]: config[key].filter((_, idx) => idx !== i) };
                            await sb.from('config').upsert({ id: 1, data: newCfg });
                            setConfig(newCfg);
                          }} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">✕</button>
                        </div>
                      ))}
                      {(config[key] || []).length === 0 && <p className="text-[10px] text-slate-300 italic py-4">Sin personal registrado.</p>}
                    </div>
                    <div className="flex gap-2">
                       <input id={`in-${key}`} placeholder="Agregar nombre..." className="flex-1 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500" />
                       <button onClick={async () => {
                         const val = document.getElementById(`in-${key}`).value.trim();
                         if(!val) return;
                         const newCfg = { ...config, [key]: [...(config[key] || []), val] };
                         await sb.from('config').upsert({ id: 1, data: newCfg });
                         setConfig(newCfg);
                         document.getElementById(`in-${key}`).value = '';
                         showNotify("Lista actualizada");
                       }} className="bg-emerald-500 text-white w-12 h-12 rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform">+</button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* MODAL GESTIÓN USUARIO */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
             <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="font-black uppercase tracking-widest text-sm">{editingUser.id ? 'Modificar Usuario' : 'Crear Usuario'}</h3>
               <button onClick={() => setEditingUser(null)} className="text-slate-500 hover:text-white transition-colors">✕</button>
             </div>
             <form className="p-8 space-y-5" onSubmit={async (e) => {
               e.preventDefault();
               const f = new FormData(e.target);
               const data = { nombre: f.get('nom'), username: f.get('user'), password: f.get('pass'), role: f.get('role') };
               if (editingUser.id) {
                 await sb.from('users').update(data).eq('id', editingUser.id);
                 addLog('MOD_USUARIO', `Modificó cuenta de @${data.username}`);
               } else {
                 await sb.from('users').insert([data]);
                 addLog('NUEVO_USUARIO', `Creó cuenta para @${data.username}`);
               }
               loadData();
               setEditingUser(null);
               showNotify("Datos de usuario guardados");
             }}>
               <input name="nom" defaultValue={editingUser.nombre} placeholder="Nombre Completo" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" />
               <input name="user" defaultValue={editingUser.username} placeholder="Username (ej: j.gonzalez)" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" />
               <input name="pass" defaultValue={editingUser.password} placeholder="Contraseña de acceso" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" />
               <select name="role" defaultValue={editingUser.role} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm cursor-pointer">
                 <option value="user">Personal Estándar</option>
                 <option value="admin">Administrador General</option>
               </select>
               <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl mt-4">Confirmar y Guardar</button>
             </form>
           </div>
        </div>
      )}

      {/* MODAL CAMBIO PASSWORD PERSONAL */}
      {showPassModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
             <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="font-black uppercase tracking-widest text-sm">Seguridad de Cuenta</h3>
               <button onClick={() => setShowPassModal(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
             </div>
             <form className="p-8 space-y-5" onSubmit={async (e) => {
               e.preventDefault();
               const pass = e.target.pass.value;
               if(pass.length < 4) return alert("La contraseña debe tener al menos 4 caracteres");
               const { error } = await sb.from('users').update({ password: pass }).eq('id', currentUser.id);
               if(!error) {
                 addLog('CAMBIO_PASS', 'Actualizó su propia clave de acceso');
                 showNotify("Tu contraseña ha sido actualizada");
                 setShowPassModal(false);
               }
             }}>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Establezca una nueva clave privada para su perfil operativo (@{currentUser.username})</p>
               <input name="pass" type="password" placeholder="Nueva Clave..." required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
               <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Actualizar Clave</button>
             </form>
           </div>
        </div>
      )}

      {/* MODAL ESTADÍSTICAS RÁPIDAS */}
      {showStats && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setShowStats(false)}>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest text-sm">Rendimiento Operativo</h3>
              <button onClick={() => setShowStats(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
            </div>
            <div className="p-10 space-y-8 text-center">
               <div className="grid grid-cols-2 gap-5">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-4xl font-black text-slate-800 leading-none mb-1">{novedades.length}</div>
                    <div className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Registros</div>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
                    <div className="text-4xl font-black text-emerald-600 leading-none mb-1">
                      {novedades.filter(n => {
                        try { return Object.values(n.checks || {}).every(v => v); } catch(e) { return false; }
                      }).length}
                    </div>
                    <div className="text-[9px] uppercase font-black text-emerald-500 tracking-widest">Terminados</div>
                  </div>
               </div>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                   <span>Progreso Global</span>
                   <span className="text-emerald-500">
                     {novedades.length ? Math.round((novedades.filter(n => {
                       try { return Object.values(n.checks || {}).every(v => v); } catch(e) { return false; }
                     }).length / novedades.length) * 100) : 0}%
                   </span>
                 </div>
                 <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                   <div 
                     className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                     style={{ width: `${novedades.length ? (novedades.filter(n => {
                        try { return Object.values(n.checks || {}).every(v => v); } catch(e) { return false; }
                      }).length / novedades.length) * 100 : 0}%` }}
                   ></div>
                 </div>
               </div>
               <button onClick={() => setShowStats(false)} className="w-full py-4 bg-slate-100 rounded-2xl font-black text-slate-400 uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors">Cerrar Reporte</button>
            </div>
          </div>
        </div>
      )}

      {notification && <Notification {...notification} />}
    </div>
  );
};

// Renderizado final
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
