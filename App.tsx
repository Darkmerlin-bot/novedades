
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
      const { data, error } = await supabase.from('logs').insert([{
        username: currentUser.username,
        nombre: currentUser.nombre,
        action,
        details
      }]).select();
      
      if (!error && data) {
        setLogs(prev => [data[0], ...prev].slice(0, 500));
      }
    } catch (e) {
      console.error("Error adding log:", e);
    }
  }, [currentUser]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Load Users
      const { data: userData, error: userError } = await supabase.from('users').select('*');
      if (userError) throw userError;
      
      if (userData.length === 0) {
        // Create default admin if no users exist
        const defaultAdmin = { username: 'admin', password: 'admin123', role: 'admin' as const, nombre: 'Administrador' };
        const { data: newAdmin, error: adminError } = await supabase.from('users').insert([defaultAdmin]).select();
        if (adminError) throw adminError;
        setUsers(newAdmin);
      } else {
        setUsers(userData);
      }

      // 2. Load Novedades
      const { data: novData, error: novError } = await supabase.from('novedades').select('*').order('created_at', { ascending: false });
      if (!novError) setNovedades(novData || []);

      // 3. Load Config
      const { data: confData, error: confError } = await supabase.from('config').select('*').single();
      if (!confError && confData) {
        setConfig(confData.data);
      } else {
        // Initial default config if missing
        const defaultConfig = {
          informeActuacion: ['Oficial 1', 'Oficial 2'],
          informeCriminalistico: ['Perito 1', 'Perito 2'],
          informePericial: ['Especialista 1', 'Especialista 2'],
          croquis: ['Dibujante 1']
        };
        await supabase.from('config').insert([{ data: defaultConfig }]);
        setConfig(defaultConfig);
      }

      // 4. Load Logs
      const { data: logData, error: logError } = await supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(200);
      if (!logError) setLogs(logData || []);

    } catch (error: any) {
      console.error("Database connection error:", error);
      showNotify("Error de conexión con Supabase. Verifique las tablas y RLS.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    addLog('LOGIN', 'Inicio de sesión exitoso');
    showNotify(`Bienvenido, ${user.nombre}`);
  };

  const handleLogout = () => {
    addLog('LOGOUT', 'Cierre de sesión');
    setCurrentUser(null);
    setCurrentView(View.LIST);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mb-4"></div>
        <p className="text-slate-400">Verificando conexión con Supabase...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header 
        user={currentUser} 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout}
        onShowStats={() => setShowStats(true)}
      />
      
      <main className="max-w-5xl mx-auto p-4 md:p-8">
        {currentView === View.LIST && (
          <NovedadesList 
            novedades={novedades} 
            setNovedades={setNovedades}
            onEdit={(n) => { setEditingNovedad(n); setCurrentView(View.FORM); }}
            onDelete={async (id) => {
              const { error } = await supabase.from('novedades').delete().eq('id', id);
              if (!error) {
                setNovedades(novedades.filter(n => n.id !== id));
                showNotify("Novedad eliminada");
                addLog('ELIMINAR_NOVEDAD', `ID: ${id}`);
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
                addLog('MARCAR_TAREA', `Tarea ${key} actualizada en Novedad ${nov.numero_novedad}`);
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
                const { error } = await supabase.from('novedades').update({ ...data, modificado_por: currentUser.username }).eq('id', editingNovedad.id);
                if (!error) {
                  setNovedades(novedades.map(n => n.id === editingNovedad.id ? { ...n, ...data } : n));
                  showNotify("Novedad actualizada");
                  addLog('EDITAR_NOVEDAD', `Novedad: ${data.numero_novedad}`);
                }
              } else {
                const { data: newNov, error } = await supabase.from('novedades').insert([{ ...data, creado_por: currentUser.username }]).select();
                if (!error && newNov) {
                  setNovedades([newNov[0], ...novedades]);
                  showNotify("Novedad creada exitosamente");
                  addLog('CREAR_NOVEDAD', `Novedad: ${data.numero_novedad}`);
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
              const { error } = await supabase.from('config').update({ data: newConfig }).neq('id', 0); // Update all or specific id
              if (!error) {
                setConfig(newConfig);
                showNotify("Configuración guardada");
                addLog('CONFIG_UPDATE', 'Nombres de personal actualizados');
              }
            }}
          />
        )}

        {currentView === View.USERS && currentUser.role === 'admin' && (
          <UsersView 
            users={users} 
            currentUser={currentUser}
            onSaveUser={async (user) => {
              if (user.id) {
                const { error } = await supabase.from('users').update(user).eq('id', user.id);
                if (!error) {
                  setUsers(users.map(u => u.id === user.id ? user : u));
                  showNotify("Usuario actualizado");
                }
              } else {
                const { data, error } = await supabase.from('users').insert([user]).select();
                if (!error && data) {
                  setUsers([...users, data[0]]);
                  showNotify("Nuevo usuario creado");
                }
              }
            }}
            onDeleteUser={async (id) => {
              const { error } = await supabase.from('users').delete().eq('id', id);
              if (!error) {
                setUsers(users.filter(u => u.id !== id));
                showNotify("Usuario eliminado");
              }
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
    </div>
  );
};

export default App;
