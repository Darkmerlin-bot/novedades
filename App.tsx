import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { User, Novedad, ConfigData, LogEntry, View, NovedadChecks } from './types';
import Login from './components/Login';
import Header from './components/Header';
import NovedadesList from './components/NovedadesList';
import NovedadForm from './components/NovedadForm';
import ConfigView from './components/ConfigView';
import UsersView from './components/UsersView';
import LogsView from './components/LogsView';
import StatsModal from './components/StatsModal';
import Notification from './components/Notification';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [config, setConfig] = useState<ConfigData>({
    informeActuacion: [],
    informeCriminalistico: [],
    informePericial: [],
    croquis: []
  });
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentView, setCurrentView] = useState<View>(View.LIST);
  const [editingNovedad, setEditingNovedad] = useState<Novedad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showStats, setShowStats] = useState(false);

  const showNotify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addLog = useCallback(async (action: string, details: string) => {
    if (!currentUser) return;
    try {
      await supabase.from('logs').insert([{
        username: currentUser.username,
        nombre: currentUser.nombre,
        action,
        details
      }]);
      
      const { data } = await supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(10);
      if (data) setLogs(data);
    } catch (e) {
      console.error("Error log:", e);
    }
  }, [currentUser]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.from('users').select('*');
      if (userError) throw userError;
      setUsers(userData || []);

      const { data: novData } = await supabase.from('novedades').select('*').order('created_at', { ascending: false });
      setNovedades(novData || []);

      const { data: confData } = await supabase.from('config').select('*').limit(1).single();
      if (confData) {
        setConfig(confData.data);
      } else {
        const def = {
          informeActuacion: ['Personal 1'],
          informeCriminalistico: ['Personal 1'],
          informePericial: ['Personal 1'],
          croquis: ['Personal 1']
        };
        setConfig(def);
      }

      const { data: logData } = await supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(100);
      setLogs(logData || []);

    } catch (error: any) {
      console.error("Error Supabase:", error);
      showNotify("Error de conexión. Verifica las tablas.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    addLog('LOGIN', 'Ingreso al sistema');
    showNotify(`Hola, ${user.nombre}`);
  };

  const handleLogout = () => {
    addLog('LOGOUT', 'Salida del sistema');
    setCurrentUser(null);
    setCurrentView(View.LIST);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-bold tracking-widest animate-pulse">SISTEMA OPERATIVO</p>
        <p className="text-slate-500 mt-2 text-sm uppercase tracking-tighter">Conectando con Supabase Cloud</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        user={currentUser} 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout}
        onShowStats={() => setShowStats(true)}
      />
      
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 animate-fadeIn">
        {currentView === View.LIST && (
          <NovedadesList 
            novedades={novedades} 
            setNovedades={setNovedades}
            onEdit={(n) => { setEditingNovedad(n); setCurrentView(View.FORM); }}
            onDelete={async (id) => {
              if (!confirm("¿Eliminar este registro?")) return;
              const { error } = await supabase.from('novedades').delete().eq('id', id);
              if (!error) {
                setNovedades(novedades.filter(n => n.id !== id));
                showNotify("Registro eliminado");
                addLog('ELIMINAR', `ID: ${id}`);
              }
            }}
            onToggleCheck={async (id, key) => {
              const nov = novedades.find(n => n.id === id);
              if (!nov) return;
              const newChecks = { ...nov.checks, [key]: !nov.checks[key as keyof NovedadChecks] };
              const { error } = await supabase.from('novedades').update({ 
                checks: newChecks, 
                modificado_por: currentUser.username 
              }).eq('id', id);
              
              if (!error) {
                setNovedades(novedades.map(n => n.id === id ? { ...n, checks: newChecks } : n));
              }
            }}
            setView={setCurrentView}
          />
        )}

        {currentView === View.FORM && (
          <NovedadForm 
            editingNovedad={editingNovedad} 
            config={config}
            currentUser={currentUser}
            onSave={async (data) => {
              if (editingNovedad) {
                const { error } = await supabase.from('novedades').update({ 
                  ...data, 
                  modificado_por: currentUser.username 
                }).eq('id', editingNovedad.id);
                if (!error) {
                  setNovedades(novedades.map(n => n.id === editingNovedad.id ? { ...n, ...data, modificado_por: currentUser.username } : n));
                  showNotify("Actualizado");
                }
              } else {
                const { data: newItems, error } = await supabase.from('novedades').insert([{ 
                  ...data, 
                  creado_por: currentUser.username 
                }]).select();
                if (!error && newItems) {
                  setNovedades([newItems[0], ...novedades]);
                  showNotify("Guardado correctamente");
                }
              }
              setEditingNovedad(null);
              setCurrentView(View.LIST);
            }}
            onCancel={() => { setEditingNovedad(null); setCurrentView(View.LIST); }}
          />
        )}

        {currentView === View.CONFIG && currentUser.role === 'admin' && (
          <ConfigView 
            config={config} 
            onUpdate={async (newConfig) => {
              const { data: existing } = await supabase.from('config').select('id').limit(1).single();
              if (existing) {
                await supabase.from('config').update({ data: newConfig }).eq('id', existing.id);
              } else {
                await supabase.from('config').insert([{ data: newConfig }]);
              }
              setConfig(newConfig);
              showNotify("Configuración guardada");
            }}
          />
        )}

        {currentView === View.USERS && currentUser.role === 'admin' && (
          <UsersView 
            users={users} 
            currentUser={currentUser}
            onSaveUser={async (user) => {
              if (user.id) {
                await supabase.from('users').update(user).eq('id', user.id);
                setUsers(users.map(u => u.id === user.id ? user : u));
              } else {
                const { data } = await supabase.from('users').insert([user]).select();
                if (data) setUsers([...users, data[0]]);
              }
              showNotify("Usuario actualizado");
            }}
            onDeleteUser={async (id) => {
              await supabase.from('users').delete().eq('id', id);
              setUsers(users.filter(u => u.id !== id));
              showNotify("Usuario eliminado");
            }}
          />
        )}

        {currentView === View.LOGS && currentUser.role === 'admin' && (
          <LogsView logs={logs} />
        )}
      </main>

      {showStats && (
        <StatsModal novedades={novedades} onClose={() => setShowStats(false)} />
      )}

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      
      <footer className="bg-white border-t border-slate-200 p-4 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Sistema de Gestión Operativa &bull; <span className="text-emerald-500 font-bold">Supabase Cloud Ready</span>
      </footer>
    </div>
  );
};

export default App;