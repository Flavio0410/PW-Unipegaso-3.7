(function(){
  // ==============================
  // js/common.js
  // Comportamenti condivisi da più pagine (About/Report):
  // - Evidenziazione della voce di menu in base all'URL
  // - Sincronizzazione selettore lingua con localStorage
  // - Inoltro ricerca dalla navbar
  // - Pulsante “Torna su”
  // - Filtri lato client per la lista report
  // ==============================

  // Evidenzia nel menu la pagina corrente in base all'URL del browser
  function evidenziaMenuDaPercorso(){
    // Ottiene l'ultimo segmento del percorso (es. "report.html");
    const fileCorrente = location.pathname.split('/').pop() || 'index.html';

    // Scorre tutti i link della navbar e marca attivo quello corrispondente
    $$('.navbar .nav-link').forEach(link => {
      // href relativo del link (es. "report.html")
      const href = link.getAttribute('href');
      // attivo = corrispondenza esatta del file corrente
      const attivo = href === fileCorrente;
      // Aggiunge/rimuove la classe .active per styling
      link.classList.toggle('active', attivo);
      // Aggiorna attributo ARIA per accessibilità
      if(attivo) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // Mantiene sincronizzata la select della lingua con localStorage
  function avviaCambioLinguaBase(){
    // Individua la select lingua nella navbar
    const select = $('#langSelect');
    // Se non esiste sulla pagina, termina subito
    if(!select) return;
    // Recupera l'eventuale preferenza salvata
    const salvata = localStorage.getItem('site.lang');
    // Se presente, imposta il valore della select coerentemente
    if(salvata) select.value = salvata;
    // Quando l'utente cambia lingua, persistiamo la scelta
    select.addEventListener('change', () => {
      localStorage.setItem('site.lang', select.value);
      // Log utile in dev: non influisce sull'UI
      console.log('Lingua impostata:', select.value);
    });
  }

  // Inoltra la ricerca della navbar alla pagina report, aggiungendo ?q=...
  // Nota: in report.html ci sono anche filtri lato client, quindi la query
  // iniziale viene precompilata nel campo di ricerca dalla funzione sotto.
  function avviaInoltroRicercaNavbar(){
    // Form di ricerca presente in navbar
    const form = $('#siteSearchForm');
    // Se assente in questa pagina, non facciamo nulla
    if(!form) return;
    // Intercetta il submit per eseguire un redirect “pulito”
    form.addEventListener('submit', (e) => {
      // Evita il submit di default del browser
      e.preventDefault();
      // Estrae il valore del campo "q" (testo libero)
      const q = new FormData(form).get('q')?.toString().trim();
      // Costruisce l'URL di destinazione: report.html + eventuale ?q=...
      const destinazione = 'report.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
      // Naviga verso la pagina Report con la query
      location.href = destinazione;
    });
  }

  // Pulsante "Torna su": appare dopo 200px di scroll
  function avviaScrollToTop(){
    // Riferimento al pulsante fluttuante
    const pulsante = $('#scrollToTop');
    // Se non presente nella pagina, termina
    if(!pulsante) return;
    // Al variare dello scroll, mostra/nasconde il pulsante
    window.addEventListener('scroll', () => {
      // show = vero oltre i 200px
      pulsante.classList.toggle('show', window.scrollY > 200);
    });
    // Clicca il pulsante: scroll dolce verso l'alto
    pulsante.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Filtri client-side per l'elenco report (nessun backend)
  // Usa gli attributi data-year e data-title definiti nel markup delle card
  function avviaFiltriReportStatici(){
    // Contenitore grid della lista report (pagina report.html)
    const contenitore = $('#reportList');
    // Se non è presente, i filtri non si applicano in questa pagina
    if(!contenitore) return;

    // Riferimenti a input testuale, select anno e pulsante “pulisci”
    const inputTesto = $('#filterText');
    const selectAnno = $('#filterYear');
    const btnPulisci  = $('#clearFilters');

    // Pre-compila il campo testo dalla query ?q=... se presente in URL
    const url = new URL(location.href);
    const qUrl = url.searchParams.get('q');
    if(qUrl && inputTesto) inputTesto.value = qUrl;

    // Funzione che applica i filtri a tutte le card
    function applicaFiltri(){
      // Normalizza il testo in minuscolo per un confronto case-insensitive
      const testo = (inputTesto?.value || '').toLowerCase();
      // Anno scelto o stringa vuota (nessun filtro anno)
      const anno  = selectAnno?.value || '';

      // Itera ciascun elemento .report-item
      $$('.report-item').forEach(card => {
        // Titolo da data-title, già predisposto nel markup
        const titolo   = (card.dataset.title || '').toLowerCase();
        // Anno da data-year
        const annoCard = card.dataset.year || '';
        // Verifica testo: passa se vuoto o se il titolo contiene la query
        const okTesto  = !testo || titolo.includes(testo);
        // Verifica anno: passa se non filtrato o se coincide
        const okAnno   = !anno  || anno === annoCard;
        // Mostra card solo se entrambi i filtri sono soddisfatti
        card.style.display = (okTesto && okAnno) ? '' : 'none';
      });
    }

    // Ricollega i filtri agli eventi
    inputTesto && inputTesto.addEventListener('input', applicaFiltri);
    selectAnno && selectAnno.addEventListener('change', applicaFiltri);
    btnPulisci && btnPulisci.addEventListener('click', () => {
      // Reset campi
      if(inputTesto) inputTesto.value = '';
      if(selectAnno) selectAnno.value = '';
      // Riapplica filtri con stato pulito
      applicaFiltri();
    });

    // Applica subito i filtri per riflettere lo stato iniziale
    applicaFiltri();
  }

  // Avvio dei comportamenti comuni quando il DOM è pronto
  document.addEventListener('DOMContentLoaded', () => {
    // Evidenzia la voce di menu corretta
    evidenziaMenuDaPercorso();
    // Attiva pulsante “torna su”
    avviaScrollToTop();
    // Sincronizza select lingua con preferenza salvata
    avviaCambioLinguaBase();
    // Avvia i18n (sostituzione testi) se il modulo è caricato
    if(typeof avviaI18n === 'function') avviaI18n();
    // Inoltra la ricerca della navbar a report.html?q=...
    avviaInoltroRicercaNavbar();
    // Abilita i filtri statici nella pagina Report
    avviaFiltriReportStatici();
  });
})();
