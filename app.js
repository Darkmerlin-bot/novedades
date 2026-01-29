
const { useState, useEffect, useCallback, useMemo } = React;
const { createClient } = supabase;

// 1. CONFIGURACIÓN SUPABASE
const SUPABASE_URL = 'https://whfrenunfcrcrljithex.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZnJlbnVuZmNyY3Jsaml0aGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Njk5ODUsImV4cCI6MjA4NTI0NTk4NX0.MMbKQxmSL_7UPNcEh_F1NofVPa13Trz3sedDALvgvPs';
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. COMPONENTES INTERNOS
const Notification = ({ message, type }) => (
  <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideInRight border-l-4 ${
    type === 'success' ? 'bg-white border-emerald-500 text-slate-800' : 'bg-red-500 border-red-700 text-white'
  }`}>
    <span className="text-xl">{type === 'success' ? '✅' : '⚠️'}</span>
    <span className="font-bold text-sm">{message}</span>
  </div>
);

const Header = ({ user, currentView, setView, onLogout, onShowStats }) => (
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
            <span className="text-xs text-slate-400 capitalize bg-slate-800 px-2 py-0.5 rounded-full">{user.role}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onShowStats} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-300">📊</button>
            <button onClick={onLogout} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">🚪</button>
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-1 no-scrollbar border-t border-slate-800 pt-3">
        <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'list' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}>📁 Lista</button>
        <button onClick={() => setView('form')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'form' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}>➕ Nueva</button>
        {user.role === 'admin' && (
          <>
            <button onClick={() => setView('config')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'config' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}>⚙️ Config</button>
            <button onClick={() => setView('users')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'users' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}>👥 Usuarios</button>
            <button onClick={() => setView('logs')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'logs' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}>📜 Logs</button>
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
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = async () => {
    try {
      const { data: userData } = await sb.from('users').select('*');
      setUsers(userData || []);
      const { data: novData } = await sb.from('novedades').select('*').order('created_at', { ascending: false });
      setNovedades(novData || []);
      const { data: confData } = await sb.from('config').select('*').limit(1).single();
      if (confData) setConfig(confData.data);
      const { data: logData } = await sb.from('logs').select('*').order('created_at', { ascending: false }).limit(50);
      setLogs(logData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      document.getElementById('loading-screen').style.display = 'none';
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleLogin = (u, p) => {
    const user = users.find(usr => usr.username === u && usr.password === p);
    if (user) {
      setCurrentUser(user);
      showNotify(`Bienvenido ${user.nombre}`);
    } else {
      showNotify("Credenciales incorrectas", "error");
    }
  };

  if (isLoading) return null;

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-slideUp">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-2xl font-bold">Acceso al Sistema</h2>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(e.target.user.value, e.target.pass.value); }} className="space-y-4">
            <input name="user" placeholder="Usuario" className="w-full p-4 bg-slate-100 rounded-2xl outline-none" required />
            <input name="pass" type="password" placeholder="Contraseña" className="w-full p-4 bg-slate-100 rounded-2xl outline-none" required />
            <button className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold">Entrar</button>
          </form>
          {notification && <Notification {...notification} />}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <Header user={currentUser} currentView={currentView} setView={setCurrentView} onLogout={() => setCurrentUser(null)} onShowStats={() => {}} />
      <main className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
        {currentView === 'list' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Registros</h2>
              <button onClick={() => setCurrentView('form')} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm">+ Nueva</button>
            </div>
            {novedades.map(n => (
              <div key={n.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                  <div className="font-bold">{n.numero_novedad}</div>
                  <div className="text-xs text-slate-400">SGSP: {n.numero_sgsp}</div>
                </div>
                <div className="text-xs text-slate-400">{new Date(n.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
        {currentView === 'form' && (
           <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl mx-auto animate-slideUp">
             <h2 className="text-2xl font-bold mb-6">Nueva Novedad</h2>
             <form className="space-y-4" onSubmit={async (e) => {
               e.preventDefault();
               const payload = {
                 numero_novedad: e.target.nov.value,
                 numero_sgsp: e.target.sgsp.value,
                 creado_por: currentUser.username,
                 checks: { actuacionRealizada: false, criminalisticoRealizado: false, pericialRealizado: false, croquisRealizado: false }
               };
               const { data, error } = await sb.from('novedades').insert([payload]).select();
               if (!error) {
                 setNovedades([data[0], ...novedades]);
                 showNotify("Registro guardado");
                 setCurrentView('list');
               }
             }}>
               <input name="nov" placeholder="N° Novedad" className="w-full p-4 bg-slate-100 rounded-2xl" required />
               <input name="sgsp" placeholder="N° SGSP" className="w-full p-4 bg-slate-100 rounded-2xl" required />
               <div className="flex gap-4">
                 <button type="button" onClick={() => setCurrentView('list')} className="flex-1 p-4 bg-slate-100 rounded-2xl">Cancelar</button>
                 <button className="flex-1 p-4 bg-emerald-500 text-white font-bold rounded-2xl">Guardar</button>
               </div>
             </form>
           </div>
        )}
      </main>
      {notification && <Notification {...notification} />}
    </div>
  );
};

// Renderizado final
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
