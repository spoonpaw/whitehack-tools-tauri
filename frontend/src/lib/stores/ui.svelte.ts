/**
 * ui.ts - UI state management (navigation, modals, theme)
 */

// ============================================
// VIEW STATE TYPES
// ============================================

export type DetailTab = 'info' | 'combat' | 'equipment';
export type FormTab = 'info' | 'combat' | 'equipment';

export type ViewState =
  | { type: 'list' }
  | { type: 'detail'; characterId: string; tab: DetailTab }
  | { type: 'form'; characterId: string | null; tab: FormTab };

export type Theme = 'light' | 'dark' | 'system';

// ============================================
// STATE
// ============================================

let currentView = $state<ViewState>({ type: 'list' });
let showImportModal = $state(false);
let showExportModal = $state(false);
let deleteConfirmId = $state<string | null>(null);
let theme = $state<Theme>('dark');

// ============================================
// GETTERS
// ============================================

export function getCurrentView(): ViewState {
  return currentView;
}

export function getShowImportModal(): boolean {
  return showImportModal;
}

export function getShowExportModal(): boolean {
  return showExportModal;
}

export function getDeleteConfirmId(): string | null {
  return deleteConfirmId;
}

export function getTheme(): Theme {
  return theme;
}

// ============================================
// NAVIGATION ACTIONS
// ============================================

/**
 * Navigate to the character list view
 */
export function navigateToList(): void {
  currentView = { type: 'list' };
}

/**
 * Navigate to character detail view
 */
export function navigateToDetail(characterId: string, tab: DetailTab = 'info'): void {
  currentView = { type: 'detail', characterId, tab };
}

/**
 * Navigate to character form (create or edit)
 */
export function navigateToForm(characterId: string | null = null, tab: FormTab = 'info'): void {
  currentView = { type: 'form', characterId, tab };
}

/**
 * Change the current tab (works for both detail and form views)
 */
export function setTab(tab: DetailTab | FormTab): void {
  if (currentView.type === 'detail') {
    currentView = { ...currentView, tab: tab as DetailTab };
  } else if (currentView.type === 'form') {
    currentView = { ...currentView, tab: tab as FormTab };
  }
}

// ============================================
// MODAL ACTIONS
// ============================================

/**
 * Open the import modal
 */
export function openImportModal(): void {
  showImportModal = true;
}

/**
 * Close the import modal
 */
export function closeImportModal(): void {
  showImportModal = false;
}

/**
 * Open the export modal
 */
export function openExportModal(): void {
  showExportModal = true;
}

/**
 * Close the export modal
 */
export function closeExportModal(): void {
  showExportModal = false;
}

/**
 * Show delete confirmation for a character
 */
export function showDeleteConfirm(characterId: string): void {
  deleteConfirmId = characterId;
}

/**
 * Hide delete confirmation
 */
export function hideDeleteConfirm(): void {
  deleteConfirmId = null;
}

// ============================================
// THEME ACTIONS
// ============================================

/**
 * Set the theme
 */
export function setTheme(newTheme: Theme): void {
  theme = newTheme;
  applyTheme(newTheme);
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme(): void {
  const newTheme = theme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

/**
 * Apply theme to the document
 */
export function applyTheme(themeValue: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  if (themeValue === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
    root.classList.toggle('light', !prefersDark);
  } else if (themeValue === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}

/**
 * Initialize theme from saved preference
 */
export function initTheme(savedTheme?: string): void {
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    theme = savedTheme as Theme;
  }
  applyTheme(theme);
}
