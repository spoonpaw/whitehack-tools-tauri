// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemInfo {
    os: String,
    version: String,
    arch: String,
}


#[tauri::command]
async fn get_system_info() -> Result<SystemInfo, String> {
    Ok(SystemInfo {
        os: std::env::consts::OS.to_string(),
        version: "1.0".to_string(),
        arch: std::env::consts::ARCH.to_string(),
    })
}

#[tauri::command]
async fn greet(name: &str) -> Result<String, String> {
    Ok(format!("Bonjour, {}! Bienvenue dans votre app Tauri + SvelteKit.", name))
}

#[tauri::command]
async fn test_basic_operation() -> Result<String, String> {
    Ok("✅ Opération basique fonctionnelle".to_string())
}

#[tauri::command]
async fn test_math_operation(a: f64, b: f64) -> Result<f64, String> {
    Ok(a + b)
}

#[tauri::command]
async fn test_async_delay() -> Result<String, String> {
    tokio::time::sleep(tokio::time::Duration::from_millis(1000)).await;
    Ok("✅ Opération async terminée après 1 seconde".to_string())
}

#[tauri::command]
async fn test_error_handling() -> Result<String, String> {
    Err("❌ Erreur de test volontaire".to_string())
}

#[tauri::command]
async fn test_file_operations() -> Result<String, String> {
    use std::fs;
    // In a bundled app, the current working directory may be read-only (e.g. inside the .app bundle).
    // Use a guaranteed writable location instead.
    let temp_file_path = std::env::temp_dir().join("tauri_sveltekit_test_temp.txt");
    
    // Test écriture
    match fs::write(&temp_file_path, "Test de fichier") {
        Ok(_) => {},
        Err(e) => return Err(format!("Échec écriture: {}", e)),
    }
    
    // Test lecture
    let content = match fs::read_to_string(&temp_file_path) {
        Ok(c) => c,
        Err(e) => return Err(format!("Échec lecture: {}", e)),
    };
    
    // Nettoyage
    let _ = fs::remove_file(&temp_file_path);
    
    Ok(format!("✅ Fichier écrit/lu: {}", content))
}

#[tauri::command]
async fn test_json_parsing(json_str: String) -> Result<serde_json::Value, String> {
    match serde_json::from_str(&json_str) {
        Ok(value) => Ok(value),
        Err(e) => Err(format!("Erreur JSON: {}", e)),
    }
}

#[tauri::command]
async fn test_network_simulation() -> Result<String, String> {
    // Simule une requête réseau avec délai variable
    let delay_ms = (rand::random::<u64>() % 2000) + 500; // 500-2500ms
    tokio::time::sleep(tokio::time::Duration::from_millis(delay_ms)).await;
    Ok(format!("✅ Simulation réseau: {}ms", delay_ms))
}

#[tauri::command]
async fn test_memory_usage() -> Result<String, String> {
    // Crée temporairement des données en mémoire
    let _large_vec: Vec<u8> = vec![0; 1024 * 1024]; // 1MB
    Ok("✅ Test mémoire: 1MB alloué temporairement".to_string())
}

#[tauri::command]
async fn save_text_file(path: String, contents: String) -> Result<(), String> {
    std::fs::write(&path, contents).map_err(|e| format!("Failed to write file: {e}"))?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_system_info,
            test_basic_operation,
            test_math_operation,
            test_async_delay,
            test_error_handling,
            test_file_operations,
            test_json_parsing,
            test_network_simulation,
            test_memory_usage,
            save_text_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run();
}