(function(){
  // ======================================
  // js/home.js – Logiche specifiche homepage
  // - Router ad anchor (#home/#about/#report)
  // - Navbar trasparente su hero in home
  // - Filtri SPA per la sezione report
  // - Interruttore audio sul video di sfondo
  // ======================================

  // Alias brevi per selettori DOM: li definisco in utils.js normalmente,
  // ma qui assumo che siano già presenti a livello globale:
  //   const $  = (sel) => document.querySelector(sel)
  //   const $$ = (sel) => Array.from(document.querySelectorAll(sel))
  // Nel caso non fossero definiti, il codice più sotto usa anche document.getElementById.

  // Elenco delle "pagine" (in realtà sezioni) gestite tramite anchor.
  // Questi id corrispondono a <section id="home">, <section id="about">, ecc.
  const PAGINE = ['home','about','report']; // ID sezioni gestite tramite anchor

  // Gestisce la dissolvenza e poi la rimozione del loader a pieno schermo (se presente nel DOM)
  function avviaLoader(){
    const loader = $('#loader');   // prendo il container del loader
    if(!loader) return;            // se non esiste, esco subito

    const STORAGE_KEY = 'webuild:loaderShown'; // uso sessionStorage per non riproporlo oltre il primo caricamento

    // piccola funzione interna che nasconde il loader,
    // con opzione "immediato" (senza animazione) o con fade-out (con transizione CSS)
    const nascondi = (immediato = false) => {
      loader.classList.add('fade-out');  // attivo la classe che gestisce l’opacità/visibilità
      if(immediato){
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        loader.style.display = 'none';   // lo tolgo dal flusso
        return;
      }
      // se non immediato, attendo la durata della transizione (0.5s) e poi display:none
      setTimeout(() => { loader.style.display = 'none'; }, 500);
    };

    let giaMostrato = false;  // flag: ho già mostrato il loader in questa sessione?
    try {
      // Uso la Navigation Timing API per capire se sono tornato indietro/avanti nella history (back/forward),
      // in quel caso non ha senso rivedere il loader
      const navEntry = performance.getEntriesByType('navigation')[0];
      const daCache = navEntry ? navEntry.type === 'back_forward' : false;

      // vero se ho già salvato in sessione o se arrivo da back/forward
      giaMostrato = sessionStorage.getItem(STORAGE_KEY) === '1' || daCache;
    } catch(_){ /* in ambienti senza API, ignoro */ }

    if(giaMostrato){
      nascondi(true);   // lo nascondo subito, niente animazioni
      return;
    }

    // Se è la prima volta: lo lascio visibile un attimo e poi lo dissolvo
    setTimeout(() => nascondi(), 3000);

    // Segno in sessione che l’ho già mostrato
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch(_){ }

    // Se la pagina viene ripristinata da BFCache (persisted), nascondo tutto immediatamente
    window.addEventListener('pageshow', (evt) => {
      if(evt.persisted){ nascondi(true); }
    }, { once: true });
  }

  // Attiva il pulsante “torna su”: si mostra dopo 200px di scroll e scrolla in smooth
  function avviaScrollToTop(){
    const pulsante = $('#scrollToTop');  // prendo il bottone
    if(!pulsante) return;                // se non c’è, esco

    window.addEventListener('scroll', () => {
      // toggle della classe .show in base allo scroll verticale
      pulsante.classList.toggle('show', window.scrollY > 200);
    });

    pulsante.addEventListener('click', () => {
      // scroll fluido verso l’alto
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Rende la navbar più “glassy/trasparente” quando sono sulla hero della homepage
  // e aggiunge/rimuove una classe "scrolled" quando supero una piccola soglia
  function avviaScrollNavbar(){
    const navbar = $('#mainNavbar'); // riferimento alla navbar
    if(!navbar) return;             // se non esiste, esco

    window.addEventListener('scroll', () => {
      const sceso  = window.scrollY > 50;                       // soglia estetica per ombra e compattezza
      const pagina = location.hash.replace('#','') || 'home';   // anchor corrente (default: home)

      if(pagina === 'home'){
        navbar.classList.toggle('scrolled', sceso);  // applica/rimuove ombra
        navbar.classList.add('navbar-transparent');  // glassy su hero in home
      } else {
        navbar.classList.toggle('scrolled', sceso);  // in altre sezioni, solo l’ombra
        navbar.classList.remove('navbar-transparent');
      }
    });
  }

  // Router minimale basato su hash: mostra/nasconde le sezioni e aggiorna i link attivi in navbar
  function instrada(){
    // 1) Deduco la "pagina" corrente dall’anchor (home se vuoto)
    const pagina = location.hash.replace('#','') || 'home';

    // 2) Nascondo tutte le sezioni note
    PAGINE.forEach(id => {
      const el = $('#' + id);
      if(el) el.classList.remove('active');     // tolgo lo stato visible
    });

    // 3) Mostro la sezione target, con un piccolo delay per permettere la transizione .fade-in
    setTimeout(() => {
      const target = $('#' + pagina);
      if(target){ target.classList.add('active','fade-in'); }
    }, 50);

    // 4) Aggiorno la navbar: metto .active al link corrente + aria-current="page"
    $$('.navbar .nav-link').forEach(a => {
      const href = a.getAttribute('href') || '';
      // condizione: href = #pagina oppure (siamo in home) href punta a index.html
      const attivo = (href === ('#' + pagina)) || (pagina === 'home' && /(^|\/)index\.html$/.test(href));
      a.classList.toggle('active', attivo);
      if(attivo) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    // 5) Classi di contesto per layout: in home nascondo il footer, rendo trasparente la navbar,
    //    blocco lo scroll del body (per il full-hero), e mostro il toggle audio
    const navbar = $('#mainNavbar');
    const footer = $('#mainFooter');
    const body   = document.body;
    const html   = document.documentElement;
    const toggleAudio = document.getElementById('toggleAudio');

    if(pagina === 'home'){
      navbar && navbar.classList.add('navbar-transparent');
      footer && footer.classList.add('footer-hidden');
      body.classList.add('homepage-active');
      html.classList.add('homepage-lock');
      if(toggleAudio) toggleAudio.style.display = '';   // visibile
    } else {
      navbar && navbar.classList.remove('navbar-transparent');
      footer && footer.classList.remove('footer-hidden');
      body.classList.remove('homepage-active');
      html.classList.remove('homepage-lock');
      // piccolo comfort: se l’utente è già sceso, torno su per mostrare l’header della nuova sezione
      if(window.scrollY > 100){ window.scrollTo({ top: 0, behavior: 'smooth' }); }
      if(toggleAudio) toggleAudio.style.display = 'none'; // nascondo il toggle audio fuori da home
    }
  }

  // Integrazione della barra di ricerca navbar con il router SPA:
  // se la sezione #report è presente, filtro in-place; altrimenti vado alla pagina report.html con ?q=
  function avviaRicercaSpa(){
    const form = $('#siteSearchForm');
    if(!form) return;  // senza form, niente da fare

    form.addEventListener('submit', (e) => {
      e.preventDefault();  // evito submit tradizionale
      const q = new FormData(form).get('q')?.toString().trim() || ''; // estraggo la query

      // se non ho la sezione #report nella pagina corrente, navigo alla pagina report dedicata
      if(!$('#report')){
        const target = 'html/report.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
        location.href = target;  // page load classico
        return;
      }

      // altrimenti, passo alla sezione report e inietto la query nel campo filtro
      location.hash = '#report';
      setTimeout(() => {
        const ft = $('#filterText');
        if(ft){ ft.value = q; ft.focus(); applicaFiltriSpa(); } // aggiorno i filtri subito
      }, 50);
    });
  }

  // Applica i filtri client-side alla lista report (per testo e per anno)
  function applicaFiltriSpa(){
    // Riferimenti ai controlli e al container della lista
    const qInput  = $('#filterText');         // input testo
    const ySelect = $('#filterYear');         // select anno (potrebbe non esserci)
    const clearBtn= $('#clearFilters');       // bottone reset
    const list    = $('#reportList');         // griglia delle card
    if(!list) return; // se la lista non esiste, non filtro qui

    // Valori correnti dei filtri
    const q = (qInput?.value || '').toLowerCase(); // normalizzo lowercase
    const y = ySelect?.value || '';
    let visibili = 0; // contatore di quante card restano visibili

    // Per ogni card con classe .report-item confronto data-* con i filtri
    $$('.report-item').forEach(card => {
      const title = (card.dataset.title || '').toLowerCase();
      const year  = card.dataset.year || '';
      const okText= !q || title.includes(q);  // se q vuoto, passa; altrimenti match substring
      const okYear= !y || y === year;         // se anno vuoto, passa; altrimenti equality strict
      const show  = okText && okYear;

      // Mostro/nascondo via display (semplice e performante)
      card.style.display = show ? '' : 'none';
      if(show) visibili++;
    });

    // Se non ho risultati, mostro/creo un blocco “nessun risultato”
    let noResults = $('#noResults');
    if(!visibili){
      if(!noResults){
        noResults = document.createElement('div');
        noResults.id = 'noResults';
        noResults.className = 'col-12';
        noResults.innerHTML = `
          <div class="text-center text-muted p-5 border rounded-3">
            <i class="bi bi-search display-1 mb-3 d-block"></i>
            <h4>Nessun risultato trovato</h4>
            <p>Prova a modificare i filtri di ricerca</p>
          </div>`;
        list.appendChild(noResults);
      }
      noResults.style.display='';   // visibile
    } else if(noResults){ noResults.style.display='none'; }  // nascondo se tornano risultati

    // Collego gli handler ai controlli SOLO una volta, usando un flag custom __bound
    if(qInput && !qInput.__bound){
      qInput.addEventListener('input', ritarda(applicaFiltriSpa, 300)); // debounce 300ms
      qInput.__bound = true;
    }
    if(ySelect && !ySelect.__bound){
      ySelect.addEventListener('change', applicaFiltriSpa);
      ySelect.__bound = true;
    }
    if(clearBtn && !clearBtn.__bound){
      clearBtn.addEventListener('click', () => {
        if(qInput)  qInput.value='';
        if(ySelect) ySelect.value='';
        applicaFiltriSpa();  // ricalcolo
      });
      clearBtn.__bound = true;
    }
  }

  // Piccolo helper "ritarda" (debounce): ritorna una funzione che ritarda l’esecuzione di fn
  // Nota: qui assumo che ritarda sia definito in utils.js; se non c’è, andrebbe aggiunto:
  //   const ritarda = (fn, ms=200) => { let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), ms); } }
  // In caso contrario, l’handler sopra continuerebbe comunque a funzionare se rimuovo il debounce.

  // Aggiunge la classe .fade-in quando elementi entrano nel viewport (IntersectionObserver)
  function avviaAnimazioni(){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(v => { if(v.isIntersecting){ v.target.classList.add('fade-in'); } });
    }, { threshold: 0.1 }); // scatta quando circa il 10% è visibile

    // aspetto mezzo secondo per non saturare all’avvio, poi osservo .card e .section
    setTimeout(() => { $$('.card, .section').forEach(el => obs.observe(el)); }, 500);
  }

  // Scorciatoie da tastiera: Alt+H/A/R per spostarsi tra sezioni; ESC pulisce il filtro testo
  function avviaScorciatoieTastiera(){
    document.addEventListener('keydown', (e) => {
      if(e.altKey && e.key === 'h'){ e.preventDefault(); location.hash='#home'; }
      if(e.altKey && e.key === 'a'){ e.preventDefault(); location.hash='#about'; }
      if(e.altKey && e.key === 'r'){ e.preventDefault(); location.hash='#report'; }

      // ESC: se sono su un input, lo bluro; se è il filtro testo, svuoto e triggero click su “pulisci”
      if(e.key === 'Escape'){
        const attivo = document.activeElement;
        if(attivo && attivo.tagName === 'INPUT'){
          attivo.blur();
          if(attivo.id === 'filterText'){
            attivo.value='';
            const clearBtn = $('#clearFilters');
            clearBtn && clearBtn.click();
          }
        }
      }
    });
  }

  // Interruttore audio per il video di sfondo in homepage
  // Supporto sia <video id="bgVideo"> che <iframe id="bgVideo"> (YouTube embed API postMessage)
  function avviaAudioSfondoHome(){
    const el = document.getElementById('bgVideo');          // elemento video o iframe
    const toggle = document.getElementById('toggleAudio');  // bottone glassy “audio”
    if(!el || !toggle) return;

    let audioAttivo = false; // stato interno: audio on/off

    if(el.tagName === 'VIDEO'){
      const video = el;

      // Provo a partire in autoplay (muted by default via HTML/CSS); eventuali errori silenziati
      try{ video.play().catch(()=>{}); }catch(_){ }

      // Disabilito tutte le tracce testuali (sottotitoli) per evitare overlay sullo sfondo
      const disabilitaTracce = () => {
        try{
          const tracks = video.textTracks || [];
          for(let i=0;i<tracks.length;i++){ tracks[i].mode='disabled'; }
        }catch(_){ }
      };
      disabilitaTracce();
      try{ video.addEventListener('loadedmetadata', disabilitaTracce); }catch(_){ }
      try{
        video.textTracks && video.textTracks.addEventListener &&
        video.textTracks.addEventListener('addtrack', (e)=>{ try{ e.track.mode='disabled'; }catch(_){ } });
      }catch(_){ }

      // Toggle click: attivo/disattivo audio e aggiorno l’icona + ARIA
      toggle.addEventListener('click', () => {
        audioAttivo = !audioAttivo;
        if(audioAttivo){
          video.muted = false; video.volume = 1;
          try{ video.play(); }catch(_){ }
          toggle.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
          toggle.setAttribute('aria-label','Disattiva audio');
          toggle.title = 'Disattiva audio';
        } else {
          video.muted = true;
          toggle.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
          toggle.setAttribute('aria-label','Attiva audio');
          toggle.title = 'Attiva audio';
        }
      });
      return; // finito il ramo <video>
    }

    // Ramo <iframe> (YouTube): controllo via postMessage API “event: command”
    const iframe = el;

    // Cerco di forzare la qualità alta e l’avvio
    inviaComandoYT('setPlaybackQuality', ['highres']);
    setTimeout(() => inviaComandoYT('setPlaybackQuality', ['highres']), 1500);
    inviaComandoYT('playVideo');

    // Toggle audio: mando i comandi mute/unMute + setVolume
    toggle.addEventListener('click', () => {
      audioAttivo = !audioAttivo;
      if(audioAttivo){
        inviaComandoYT('unMute'); inviaComandoYT('setVolume', [100]);
        toggle.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
        toggle.setAttribute('aria-label','Disattiva audio');
        toggle.title = 'Disattiva audio';
      } else {
        inviaComandoYT('mute');
        toggle.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
        toggle.setAttribute('aria-label','Attiva audio');
        toggle.title = 'Attiva audio';
      }
    });

    // Utility local per mandare messaggi al player YouTube
    function inviaComandoYT(func, args=[]){
      try{
        iframe.contentWindow && iframe.contentWindow.postMessage(
          JSON.stringify({ event:'command', func, args }), '*'
        );
      }catch(_){ }
    }
  }

  // Avvio di tutte le funzionalità quando il DOM è pronto
  document.addEventListener('DOMContentLoaded', () => {
    avviaLoader();                 // gestisco loader (se presente)
    avviaScrollToTop();            // bottone “torna su”
    avviaScrollNavbar();           // navbar glassy/ombra su scroll
    avviaRicercaSpa();             // submit della ricerca integrato col router
    applicaFiltriSpa();            // applico subito filtri (se c’è la lista)
    if(typeof avviaI18n === 'function') avviaI18n();  // inizializzo i18n se disponibile
    avviaAnimazioni();             // fade-in su section/card a vista
    avviaScorciatoieTastiera();    // Alt+H/A/R, ESC
    avviaAudioSfondoHome();        // toggle audio per hero

    // Router: ascolto cambio hash e sincronizzo subito lo stato iniziale
    window.addEventListener('hashchange', instrada);
    instrada();

    // Supporto a link con data-router (es. <a data-router href="#about">):
    // evito il comportamento default e aggiorno direttamente location.hash
    $$('[data-router]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        location.hash = el.getAttribute('href');
      });
    });
  });
})();
