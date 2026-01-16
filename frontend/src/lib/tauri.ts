import { invoke } from '@tauri-apps/api/core';

export interface SystemInfo {
  os: string;
  version: string;
  arch: string;
}

export async function getSystemPorts(): Promise<string[]> {
  return await invoke('get_system_ports');
}

export async function getSystemInfo(): Promise<SystemInfo> {
  return await invoke('get_system_info');
}