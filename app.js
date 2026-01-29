
const { useState, useEffect, useCallback, useMemo } = React;
const { createClient } = supabase;

// 1. CONFIGURACIÓN SUPABASE
const SUPABASE_URL = 'https://whfrenunfcrcrljithex.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZnJlbnVuZmNyY3Jsaml0aGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Njk5ODUsImV4cCI6MjA4NTI0NTk4NX0.MMbKQxmSL_7UPNcEh_F1NofVPa13Trz3sedDALvgvPs';
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. COMPONENTES DE APOYO
const Notification = ({ message, type }) => (
  <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideInRight border-l-4 ${
    type === 'success' ? 'bg-white border-emerald-500 text-slate-800' : 'bg-red-500 border-red-700 text-white'
  }`}>
    <span className="text-xl">{type === 'success' ? '✅' : '⚠️'}</span>
    <span className="font-bold text-sm">{message}</span>
  </div>
);

const Header = ({ user, currentView, setView, onLogout, onShowStats, onShowPass }) => (
  <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg text-xl">📋</div>
          <h1 className="text-xl font-bold tracking-tight">Sistema de Novedades</h1>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">{user.nombre}</span>
            <span className="text-[10px] text-slate-400 capitalize bg-slate-800 px-2 py-0.5 rounded-full font-bold tracking-widest">{user.role}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowPass} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-300" title="Cambiar Contraseña">🔑</button>
            <button onClick={onShowStats} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-300" title="Estadísticas">📊</button>
            <button onClick={onLogout} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Cerrar Sesión">🚪</button>
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-1 no-scrollbar border-t border-slate-800 pt-3">
        <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${currentView === 'list' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>📁 Lista</button>
        <button onClick={() => setView('form')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${currentView === 'form' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>➕ Nueva</button>
        {user.role === 'admin' && (
          <>
            <button onClick={() => setView('config')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${currentView === 'config' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>⚙️ Config</button>
            <button onClick={() => setView('users')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${currentView === 'users' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>👥 Usuarios</button>
            <button onClick={() => setView('logs')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${currentView === 'logs' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>📜 Logs</button>
          </>
        )}
      </nav>
    </div>
  </header>
);

// 3. APLICACIÓN PRINCIPAL
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
    await sb.from('logs').insert([{ username: currentUser.username, nombre: currentUser.nombre, action, details }]);
  };

  const loadData = async () => {
    try {
      const { data: userData } = await sb.from('users').select('*').order('nombre');
      setUsers(userData || []);
      const { data: novData } = await sb.from('novedades').select('*').order('created_at', { ascending: false });
      setNovedades(novData || []);
      const { data: confData } = await sb.from('config').select('*').limit(1).single();
      if (confData) setConfig(confData.data);
      const { data: logData } = await sb.from('logs').select('*').order('created_at', { ascending: false }).limit(100);
      setLogs(logData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      const loader = document.getElementById('loading-screen');
      if (loader) loader.style.display = 'none';
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleLogin = (u, p) => {
    const user = users.find(usr => usr.username === u && usr.password === p);
    if (user) {
      setCurrentUser(user);
      addLog('LOGIN', 'Ingreso al sistema');
      showNotify(`Bienvenido ${user.nombre}`);
    } else {
      showNotify("Credenciales incorrectas", "error");
    }
  };

  const handleToggleCheck = async (id, key) => {
    const nov = novedades.find(n => n.id === id);
    if (!nov) return;
    const newChecks = { ...nov.checks, [key]: !nov.checks[key] };
    const { error } = await sb.from('novedades').update({ checks: newChecks, modificado_por: currentUser.username }).eq('id', id);
    if (!error) {
      setNovedades(novedades.map(n => n.id === id ? { ...n, checks: newChecks } : n));
      addLog('CHECKLIST', `Cambio en ${key} de novedad ${nov.numero_novedad}`);
    }
  };

  if (isLoading) return null;

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-slideUp">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-emerald-100 rounded-full text-4xl mb-4">📋</div>
            <h2 className="text-2xl font-bold">Acceso Pro</h2>
            <p className="text-slate-400 text-sm mt-1">Gestión de Novedades Operativas</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(e.target.user.value, e.target.pass.value); }} className="space-y-4">
            <input name="user" placeholder="Usuario" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" required />
            <input name="pass" type="password" placeholder="Contraseña" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" required />
            <button className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all transform active:scale-95">Iniciar Sesión</button>
          </form>
          {notification && <Notification {...notification} />}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 min-h-screen bg-slate-50">
      <Header 
        user={currentUser} 
        currentView={currentView} 
        setView={v => { setCurrentView(v); setEditingNovedad(null); setEditingUser(null); if(v === 'logs') loadData(); }} 
        onLogout={() => { addLog('LOGOUT', 'Salida del sistema'); setCurrentUser(null); }} 
        onShowStats={() => setShowStats(true)} 
        onShowPass={() => setShowPassModal(true)}
      />
      
      <main className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
        
        {/* VISTA LISTA */}
        {currentView === 'list' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Registros Recientes</h2>
              <button onClick={() => setCurrentView('form')} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">+ Nueva</button>
            </div>
            {novedades.map(n => {
              const compCount = Object.values(n.checks).filter(Boolean).length;
              const isEx = expandedId === n.id;
              return (
                <div key={n.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md mb-3">
                  <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isEx ? null : n.id)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${compCount === 4 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {compCount}/4
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{n.numero_novedad}</div>
                        <div className="text-xs text-slate-400">SGSP: {n.numero_sgsp}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hidden sm:inline text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(n.created_at).toLocaleDateString()}</span>
                      <span className={`text-slate-300 transition-transform ${isEx ? 'rotate-180' : ''}`}>▼</span>
                    </div>
                  </div>
                  {isEx && (
                    <div className="px-4 pb-4 border-t border-slate-50 animate-fadeIn">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Asignaciones</h4>
                            <div className="flex justify-between text-xs py-1 border-b border-slate-50"><span className="text-slate-500">Actuación:</span><span className="font-bold">{n.informeActuacion || '---'}</span></div>
                            <div className="flex justify-between text-xs py-1 border-b border-slate-50"><span className="text-slate-500">Criminalístico:</span><span className="font-bold">{n.informeCriminalistico || '---'}</span></div>
                            <div className="flex justify-between text-xs py-1 border-b border-slate-50"><span className="text-slate-500">Pericial:</span><span className="font-bold">{n.informePericial || '---'}</span></div>
                            <div className="flex justify-between text-xs py-1 border-b border-slate-50"><span className="text-slate-500">Croquis:</span><span className="font-bold">{n.croquis || '---'}</span></div>
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Checklist Tareas</h4>
                             {['actuacionRealizada', 'criminalisticoRealizado', 'pericialRealizado', 'croquisRealizado'].map(key => (
                               <label key={key} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                                 <input type="checkbox" checked={n.checks[key]} onChange={() => handleToggleCheck(n.id, key)} className="w-4 h-4 rounded text-emerald-500" />
                                 <span className={`text-xs ${n.checks[key] ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                                   {key.replace(/([A-Z])/g, ' $1').replace('Realizado', ' Realizada')}
                                 </span>
                               </label>
                             ))}
                          </div>
                       </div>
                       <div className="pt-4 flex justify-between items-center border-t border-slate-50">
                         <span className="text-[10px] text-slate-300">Cargado por: {n.creado_por}</span>
                         <div className="flex gap-2">
                            <button onClick={() => { setEditingNovedad(n); setCurrentView('form'); }} className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg font-bold text-slate-600 hover:bg-slate-200">Editar</button>
                            <button onClick={async () => { if(confirm("¿Borrar?")){ await sb.from('novedades').delete().eq('id', n.id); addLog('BORRAR', `Novedad ${n.numero_novedad}`); loadData(); showNotify("Eliminado"); } }} className="text-xs bg-red-50 px-3 py-1.5 rounded-lg font-bold text-red-500 hover:bg-red-100">Borrar</button>
                         </div>
                       </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* VISTA FORMULARIO */}
        {currentView === 'form' && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-2xl mx-auto animate-slideUp">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{editingNovedad ? 'Editar Registro' : 'Nueva Novedad'}</h2>
                <p className="text-slate-400 text-xs mt-1">Complete los datos de la actuación</p>
              </div>
              <div className="text-3xl">📝</div>
            </div>
            <form className="p-8 space-y-6" onSubmit={async (e) => {
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
                addLog('EDITAR', `Novedad ${payload.numero_novedad}`);
                showNotify("Actualizado");
              } else {
                await sb.from('novedades').insert([{ ...payload, creado_por: currentUser.username }]);
                addLog('CREAR', `Novedad ${payload.numero_novedad}`);
                showNotify("Guardado");
              }
              loadData();
              setCurrentView('list');
            }}>
              <div className="grid grid-cols-2 gap-4">
                <input name="nov" defaultValue={editingNovedad?.numero_novedad} required className="w-full p-4 bg-slate-50 border rounded-xl" placeholder="N° Novedad" />
                <input name="sgsp" defaultValue={editingNovedad?.numero_sgsp} required className="w-full p-4 bg-slate-50 border rounded-xl" placeholder="N° SGSP" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['ia', 'ic', 'ip', 'cr'].map((f, i) => {
                  const labels = ['Informe Actuación', 'Criminalístico', 'Pericial', 'Croquis'];
                  const configKeys = ['informeActuacion', 'informeCriminalistico', 'informePericial', 'croquis'];
                  return (
                    <div key={f} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">{labels[i]}</label>
                      <select name={f} defaultValue={editingNovedad ? editingNovedad[Object.keys(editingNovedad)[i+3]] : ''} className="w-full p-3 bg-slate-50 border rounded-xl text-sm">
                        <option value="">Seleccionar...</option>
                        {config[configKeys[i]].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 pt-6">
                 <button type="button" onClick={() => setCurrentView('list')} className="flex-1 p-4 bg-slate-100 rounded-2xl font-bold text-slate-600">Cancelar</button>
                 <button className="flex-1 p-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20">Guardar</button>
              </div>
            </form>
          </div>
        )}

        {/* VISTA USUARIOS */}
        {currentView === 'users' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
              <button onClick={() => setEditingUser({ username: '', password: '', nombre: '', role: 'user' })} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">+ Nuevo Usuario</button>
            </div>
            <div className="grid gap-3">
              {users.map(u => (
                <div key={u.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">{u.nombre.charAt(0)}</div>
                    <div>
                      <div className="font-bold text-sm">{u.nombre}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest">{u.role} • @{u.username}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingUser(u)} className="p-2 hover:bg-slate-100 rounded-lg">✏️</button>
                    {u.id !== currentUser.id && (
                      <button onClick={async () => { if(confirm("¿Eliminar usuario?")){ await sb.from('users').delete().eq('id', u.id); addLog('USUARIO_BORRADO', `Usuario @${u.username}`); loadData(); } }} className="p-2 hover:bg-red-50 text-red-400 rounded-lg">🗑️</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA LOGS */}
        {currentView === 'logs' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Registro de Auditoría</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-xs">
                   <thead className="bg-slate-900 text-white font-bold uppercase tracking-widest">
                     <tr>
                       <th className="p-4">Fecha</th>
                       <th className="p-4">Usuario</th>
                       <th className="p-4">Acción</th>
                       <th className="p-4">Detalle</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {logs.map(l => (
                       <tr key={l.id} className="hover:bg-slate-50">
                         <td className="p-4 text-slate-400 font-mono">{new Date(l.created_at).toLocaleString()}</td>
                         <td className="p-4 font-bold">{l.nombre}</td>
                         <td className="p-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded font-black">{l.action}</span></td>
                         <td className="p-4 text-slate-500">{l.details}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* VISTA CONFIG (Administración de listas) */}
        {currentView === 'config' && currentUser.role === 'admin' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold">Listas de Personal</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['informeActuacion', 'informeCriminalistico', 'informePericial', 'croquis'].map(key => (
                  <div key={key} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto no-scrollbar">
                      {config[key].map((name, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-lg group">
                          <span className="text-sm">{name}</span>
                          <button onClick={async () => {
                            const newCfg = { ...config, [key]: config[key].filter((_, idx) => idx !== i) };
                            await sb.from('config').update({ data: newCfg }).eq('id', 1);
                            setConfig(newCfg);
                          }} className="text-red-400 opacity-0 group-hover:opacity-100">✕</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                       <input id={`in-${key}`} placeholder="Nuevo nombre..." className="flex-1 p-2 bg-slate-50 border rounded-lg text-sm" />
                       <button onClick={async () => {
                         const val = document.getElementById(`in-${key}`).value;
                         if(!val) return;
                         const newCfg = { ...config, [key]: [...config[key], val] };
                         await sb.from('config').upsert({ id: 1, data: newCfg });
                         setConfig(newCfg);
                         document.getElementById(`in-${key}`).value = '';
                       }} className="bg-emerald-500 text-white px-3 rounded-lg font-bold">+</button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {/* MODAL USUARIO (Crear/Editar) */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
             <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="font-bold">{editingUser.id ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
               <button onClick={() => setEditingUser(null)}>✕</button>
             </div>
             <form className="p-6 space-y-4" onSubmit={async (e) => {
               e.preventDefault();
               const f = new FormData(e.target);
               const data = { nombre: f.get('nom'), username: f.get('user'), password: f.get('pass'), role: f.get('role') };
               if (editingUser.id) {
                 await sb.from('users').update(data).eq('id', editingUser.id);
                 addLog('USUARIO_EDITADO', `Usuario @${data.username}`);
               } else {
                 await sb.from('users').insert([data]);
                 addLog('USUARIO_CREADO', `Usuario @${data.username}`);
               }
               loadData();
               setEditingUser(null);
               showNotify("Usuario guardado");
             }}>
               <input name="nom" defaultValue={editingUser.nombre} placeholder="Nombre Completo" required className="w-full p-3 bg-slate-50 border rounded-xl" />
               <input name="user" defaultValue={editingUser.username} placeholder="Username" required className="w-full p-3 bg-slate-50 border rounded-xl" />
               <input name="pass" defaultValue={editingUser.password} placeholder="Password" required className="w-full p-3 bg-slate-50 border rounded-xl" />
               <select name="role" defaultValue={editingUser.role} className="w-full p-3 bg-slate-50 border rounded-xl">
                 <option value="user">Usuario Estándar</option>
                 <option value="admin">Administrador</option>
               </select>
               <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl">Guardar Usuario</button>
             </form>
           </div>
        </div>
      )}

      {/* MODAL CAMBIO PASSWORD */}
      {showPassModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
             <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
               <h3 className="font-bold">Cambiar Contraseña</h3>
               <button onClick={() => setShowPassModal(false)}>✕</button>
             </div>
             <form className="p-6 space-y-4" onSubmit={async (e) => {
               e.preventDefault();
               const pass = e.target.pass.value;
               if(pass.length < 4) return alert("Muy corta");
               const { error } = await sb.from('users').update({ password: pass }).eq('id', currentUser.id);
               if(!error) {
                 addLog('PASSWORD_CHANGE', 'Cambio de contraseña propio');
                 showNotify("Contraseña actualizada");
                 setShowPassModal(false);
               }
             }}>
               <p className="text-xs text-slate-400">Ingrese su nueva clave de acceso para @{currentUser.username}</p>
               <input name="pass" type="password" placeholder="Nueva Contraseña" required className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" />
               <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">Actualizar Clave</button>
             </form>
           </div>
        </div>
      )}

      {/* MODAL ESTADÍSTICAS */}
      {showStats && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowStats(false)}>
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">Resumen Operativo</h3>
              <button onClick={() => setShowStats(false)}>✕</button>
            </div>
            <div className="p-8 space-y-6 text-center">
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="text-2xl font-black">{novedades.length}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl">
                    <div className="text-2xl font-black text-emerald-600">
                      {novedades.filter(n => Object.values(n.checks).every(v => v)).length}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-emerald-400">Listos</div>
                  </div>
               </div>
               <button onClick={() => setShowStats(false)} className="w-full py-4 bg-slate-100 rounded-2xl font-bold text-slate-500">Cerrar</button>
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
