
export type Role = 'admin' | 'user';

export interface User {
  id?: number;
  username: string;
  password?: string;
  role: Role;
  nombre: string;
  created_at?: string;
}

export interface NovedadChecks {
  actuacionRealizada: boolean;
  criminalisticoRealizado: boolean;
  pericialRealizado: boolean;
  croquisRealizado: boolean;
}

export interface Novedad {
  id: number;
  numero_novedad: string;
  numero_sgsp: string;
  informeActuacion: string;
  informeCriminalistico: string;
  informePericial: string;
  croquis: string;
  checks: NovedadChecks;
  creado_por: string;
  modificado_por?: string;
  created_at?: string;
}

export interface ConfigData {
  informeActuacion: string[];
  informeCriminalistico: string[];
  informePericial: string[];
  croquis: string[];
}

export interface LogEntry {
  id: number;
  username: string;
  nombre: string;
  action: string;
  details: string;
  created_at: string;
}

export enum View {
  LIST = 'list',
  FORM = 'form',
  CONFIG = 'config',
  USERS = 'users',
  LOGS = 'logs'
}
