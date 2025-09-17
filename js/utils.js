// ======================================
// js/utils.js – Utility leggere per il DOM
// - $:   querySelector shorthand
// - $$:  querySelectorAll -> Array
// - ritarda: debounce per funzioni ad alta frequenza (es. input)
// ======================================

// $: seleziona il primo elemento che corrisponde al selettore CSS
//   - sel: stringa tipo '.classe', '#id', 'tag'
//   - root: nodo radice (default document) per scoping
//   Restituisce: Element | null
window.$ = (sel, root = document) => root.querySelector(sel);

// $$: seleziona tutti gli elementi; restituisce un array reale (non NodeList)
//   - sel/root: come sopra
//   Restituisce: Element[]
window.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ritarda: debounce semplice
//   - fn: funzione da eseguire in ritardo rispetto all'ultimo trigger
//   - wait: tempo di inattività in ms dopo l'ultima chiamata prima di eseguire fn
//   Uso tipico: input text, resize, scroll
window.ritarda = (fn, wait = 300) => {
  // timer condiviso nel closure per cancellare/ricreare il timeout
  let t;
  return (...args) => {
    // Annulla eventuale timeout in corso
    clearTimeout(t);
    // Pianifica l'esecuzione differita
    t = setTimeout(() => fn(...args), wait);
  };
};
