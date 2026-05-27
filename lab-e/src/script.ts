import style1Url from '/style-1.css?url';
import style2Url from '/style-2.css?url';
import style3Url from '/style-3.css?url';

interface StyleDefinition {
    name: string;
    file: string;
}

const stylesDict: Record<string, StyleDefinition> = {
    'style1': { name: 'Styl 1', file: style1Url },
    'style2': { name: 'Styl 2', file: style2Url },
    'style3': { name: 'Styl 3', file: style3Url }
};

let currentStyleKey: string = '';
const changeStyle = (styleKey: string): void => {
    const head = document.head;
    const oldLink = document.getElementById('dynamic-css');
    if (oldLink) {
        oldLink.remove();
    }
    const newLink = document.createElement('link');
    newLink.id = 'dynamic-css';
    newLink.rel = 'stylesheet';
    newLink.href = stylesDict[styleKey].file;

    head.appendChild(newLink);
    currentStyleKey = styleKey;
    console.log("Zmieniono na:", styleKey);
};
const renderMenu = (): void => {
    const container = document.getElementById('style-switcher');
    if (!container) return;

    container.innerHTML = '';

    container.style.cssText = `
        position: absolute; 
        top: 10px; 
        left: 10px; 
        z-index: 99999; 
        display: flex; 
        gap: 10px;
        `;
    Object.keys(stylesDict).forEach(key => {
        const button = document.createElement('button');
        button.textContent = stylesDict[key].name;
        button.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            background: white;
            color: black;
            border: 2px solid black;
            font-weight: bold;
            box-shadow: 2px 2px 0px rgba(0,0,0,0.2);
        `;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            changeStyle(key);
        });
        container.appendChild(button);
    });
};
const init = () => {
    const keys = Object.keys(stylesDict);
    if (keys.length > 0) {
        changeStyle(keys[0]);
    }
    renderMenu();
};
init();