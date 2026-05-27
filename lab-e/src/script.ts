// Importowanie ścieżek do plików CSS przez Vite
import style1Url from './style1.css?url';
import style2Url from './style2.css?url';

// 1. Słownik dostępnych stylów
interface StyleDefinition {
    name: string;
    file: string;
}

const styles: Record<string, StyleDefinition> = {
    'light': { name: 'Tryb Jasny', file: style1Url },
    'dark': { name: 'Tryb Ciemny', file: style2Url }
};

// 2. Stan aplikacji
let currentStyleKey: string = '';

/**
 * Funkcja zmieniająca styl w dokumencie
 */
const switchStyle = (styleKey: string): void => {
    const head = document.querySelector('head');
    const oldLink = document.getElementById('dynamic-style');

    // Usuwamy stary styl jeśli istnieje
    if (oldLink) {
        oldLink.remove();
    }

    // Tworzymy i dodajemy nowy element <link>
    const newLink = document.createElement('link');
    newLink.id = 'dynamic-style';
    newLink.rel = 'stylesheet';
    newLink.href = styles[styleKey].file;

    head?.appendChild(newLink);
    currentStyleKey = styleKey;

    console.log(`Zmieniono styl na: ${styles[styleKey].name}`);
};

/**
 * Funkcja generująca przyciski do zmiany stylów
 */
const renderStyleSwitcher = (): void => {
    const container = document.getElementById('style-switcher');
    if (!container) return;

    // Czyścimy kontener
    container.innerHTML = '';

    // Generujemy przyciski na podstawie słownika
    Object.keys(styles).forEach(key => {
        const btn = document.createElement('button');
        btn.textContent = styles[key].name;
        btn.className = 'style-btn';
        btn.onclick = () => switchStyle(key);
        container.appendChild(btn);
    });
};

// 3. Inicjalizacja aplikacji
const init = () => {
    // Automatyczne podłączenie pierwszego stylu ze słownika
    const firstStyleKey = Object.keys(styles)[0];
    switchStyle(firstStyleKey);

    // Wygenerowanie interfejsu
    renderStyleSwitcher();
};

// Start po załadowaniu DOM
document.addEventListener('DOMContentLoaded', init);