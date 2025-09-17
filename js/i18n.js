(function(){
  // ======================================
  // js/i18n.js – Localizzazione front-end
  // Gestisce:
  // 1) Dizionari IT/EN
  // 2) Inizializzazione lingua da localStorage/HTML
  // 3) Sostituzione testi con attributi data-i18n e data-i18n-placeholder
  // ======================================

  // Dizionari traduzioni (IT/EN)
  // - Chiave: stringa semantica usata negli attributi data-i18n
  // - Valore: testo localizzato da inserire nel DOM
  window.I18N = {
    it: {
      'meta.title': 'Webuild – Report di sostenibilità',
      'nav.home': 'Home',
      'nav.about': 'Chi siamo',
      'nav.report': 'Report',
      'nav.search': 'Cerca report…',
      'nav.langlabel': 'Lingua',
      'home.title': 'Costruiamo in modo sostenibile',
      'home.subtitle': 'Report trasparenti. Impatti misurabili. Innovazione responsabile.',
      'home.cta': 'Scarica i report',
      'home.cta2': 'Scopri di più',
      'about.title': 'Chi siamo',
      'about.lead': 'La nostra identità è centrata sul Ponte sullo Stretto di Messina: un programma infrastrutturale strategico che unisce Sicilia e continente con innovazione, sicurezza e sostenibilità.',
      'about.stats.countries.label': 'Paesi',
      'about.stats.countries.sub': 'Presenza globale',
      'about.stats.employees.label': 'Dipendenti',
      'about.stats.employees.sub': 'Team mondiale',
      'about.stats.co2.label': 'CO₂ 2030',
      'about.stats.co2.sub': 'Target riduzione',
      'about.stats.green.label': 'Energia verde',
      'about.stats.green.sub': 'Entro 2025',
      'about.mission.title': 'La Nostra Missione',
      'about.mission.lead': 'Mettere al centro il progetto dello Stretto come esempio di ingegneria responsabile: prestazioni strutturali d’eccellenza, tutela ambientale e benefici socio‑economici misurabili per i territori coinvolti.',
      'about.commitments': 'Impegni chiave',
      'about.commitlist.1.title': 'Decarbonizzazione completa',
      'about.commitlist.1.text': 'Net Zero entro il 2050 con milestone verificabili',
      'about.commitlist.2.title': 'Sicurezza Zero Infortuni',
      'about.commitlist.2.text': 'Programmi di formazione continua e tecnologie avanzate',
      'about.commitlist.3.title': 'Supply Chain Responsabile',
      'about.commitlist.3.text': '100% fornitori certificati per sostenibilità',
      'about.commitlist.4.title': 'Innovazione Digitale',
      'about.commitlist.4.text': 'BIM, AI e IoT in tutti i progetti entro 2026',
      'about.c1': 'Decarbonizzazione dei cantieri e delle opere',
      'about.c2': 'Salute e sicurezza dei lavoratori',
      'about.c3': 'Gestione responsabile della catena di fornitura',
      'about.standards': 'Standard e KPI',
      'about.kpi': 'Allineamento a ESRS/GRI, obiettivi annuali e metriche verificate per garantire trasparenza e accountability.',
      'about.kpi.scope12': 'Emissioni Scope 1+2',
      'about.kpi.scope12.value': '-35% dal 2020',
      'about.kpi.ltifr': 'Tasso infortuni LTIFR',
      'about.kpi.ltifr.value': '0.18 (best in class)',
      'about.kpi.water': 'Acqua riciclata',
      'about.kpi.water.value': '75% nei cantieri',
      'about.kpi.materials': 'Materiali sostenibili',
      'about.kpi.materials.value': '60% certificati',
      'about.kpi.training': 'Formazione annua',
      'about.kpi.training.value': '40h per dipendente',
      'report.title': 'Tutti i report',
      'report.hint': 'Cerca nel titolo. I link indicano formato e dimensione.',
      'report.year': 'Anno',
      'report.item1.title': 'Dichiarazione consolidata 2024',
      'report.item1.text': 'Allineata agli ESRS. Sintesi performance clima, acqua, sicurezza.',
      'report.item2.title': 'Report di sostenibilità 2023',
      'report.item2.text': 'Progressi su energia rinnovabile e supply chain.',
      'report.item3.title': 'Report di sostenibilità 2022',
      'report.item3.text': 'Aggiornamento materialità e target 2025.',
      'report.item4.title': 'Report di sostenibilità 2021',
      'report.item4.text': 'Focus su riduzione emissioni e biodiversità.',
      'report.item5.title': 'Report di sostenibilità 2020',
      'report.item5.text': 'Resilienza durante la pandemia e sostenibilità.',
      'report.item6.title': 'Report di sostenibilità 2019',
      'report.item6.text': 'Espansione internazionale e sostenibilità.',
      'report.item7.title': 'Report di sostenibilità 2018',
      'report.item7.text': 'Integrazione standard GRI e nuovi obiettivi.',
      'report.item8.title': 'Report di sostenibilità 2017',
      'report.item8.text': 'Consolidamento approccio sostenibile.',
      'report.item9.title': 'Report di sostenibilità 2016',
      'report.item9.text': 'Innovazione tecnologica e ambiente.',
      'report.item10.title': 'Report di sostenibilità 2015',
      'report.item10.text': 'Sviluppo strategia sostenibilità integrata.',
      'report.item11.title': 'Report di sostenibilità 2014',
      'report.item11.text': 'Espansione mercati emergenti e CSR.',
      'report.item12.title': 'Report di sostenibilità 2013',
      'report.item12.text': 'Prime iniziative strutturate di sostenibilità.',
      'report.badge.new': 'Nuovo',
      'report.download': 'Scarica',
      'report.source': "Fonte: Sito ufficiale dell'azienda. I file sono collegamenti diretti a PDF.",
      'filters.all': 'Tutti gli anni',
      'filters.search': 'Cerca…',
      'filters.clear': 'Pulisci',
      'footer.contact': 'Contatti',
      'footer.social': 'Social',
      'footer.copyright': '© 2025 Webuild S.p.A. - Tutti i diritti riservati',
      'footer.tagline': 'Sito demo per report di sostenibilità'
    },
    en: {
      'meta.title': 'Webuild – Sustainability Reports',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.report': 'Report',
      'nav.search': 'Search reports…',
      'nav.langlabel': 'Language',
      'home.title': 'We build sustainably',
      'home.subtitle': 'Transparent reporting. Measurable impacts. Responsible innovation.',
      'home.cta': 'Download reports',
      'home.cta2': 'Learn more',
      'about.title': 'About us',
      'about.lead': 'Our identity focuses on the Strait of Messina Bridge: a strategic infrastructure program connecting Sicily and the mainland with innovation, safety and sustainability.',
      'about.stats.countries.label': 'Countries',
      'about.stats.countries.sub': 'Global presence',
      'about.stats.employees.label': 'Employees',
      'about.stats.employees.sub': 'Worldwide team',
      'about.stats.co2.label': 'CO₂ 2030',
      'about.stats.co2.sub': 'Reduction target',
      'about.stats.green.label': 'Green energy',
      'about.stats.green.sub': 'By 2025',
      'about.mission.title': 'Our Mission',
      'about.mission.lead': 'Put the Strait project at the center as an example of responsible engineering: outstanding structural performance, environmental protection and measurable socio‑economic benefits for the territories involved.',
      'about.commitments': 'Key commitments',
      'about.commitlist.1.title': 'Full decarbonization',
      'about.commitlist.1.text': 'Net Zero by 2050 with verifiable milestones',
      'about.commitlist.2.title': 'Zero-Accident Safety',
      'about.commitlist.2.text': 'Continuous training programs and advanced technologies',
      'about.commitlist.3.title': 'Responsible Supply Chain',
      'about.commitlist.3.text': '100% suppliers certified for sustainability',
      'about.commitlist.4.title': 'Digital Innovation',
      'about.commitlist.4.text': 'BIM, AI and IoT in all projects by 2026',
      'about.c1': 'Decarbonizing construction sites and works',
      'about.c2': 'Worker health and safety',
      'about.c3': 'Responsible supply chain management',
      'about.standards': 'Standards and KPIs',
      'about.kpi': 'Aligned to ESRS/GRI, yearly goals and verified metrics for transparency and accountability.',
      'about.kpi.scope12': 'Scope 1+2 emissions',
      'about.kpi.scope12.value': '-35% since 2020',
      'about.kpi.ltifr': 'LTIFR incident rate',
      'about.kpi.ltifr.value': '0.18 (best in class)',
      'about.kpi.water': 'Recycled water',
      'about.kpi.water.value': '75% on sites',
      'about.kpi.materials': 'Sustainable materials',
      'about.kpi.materials.value': '60% certified',
      'about.kpi.training': 'Annual training',
      'about.kpi.training.value': '40h per employee',
      'report.title': 'All reports',
      'report.hint': 'Search by title. Links show format and size.',
      'report.year': 'Year',
      'report.item1.title': 'Consolidated Statement 2024',
      'report.item1.text': 'Aligned with ESRS. Climate, water and safety performance highlights.',
      'report.item2.title': 'Sustainability Report 2023',
      'report.item2.text': 'Progress on renewables and supply chain.',
      'report.item3.title': 'Sustainability Report 2022',
      'report.item3.text': 'Updated materiality and 2025 targets.',
      'report.item4.title': 'Sustainability Report 2021',
      'report.item4.text': 'Focus on emissions reduction and biodiversity.',
      'report.item5.title': 'Sustainability Report 2020',
      'report.item5.text': 'Resilience during the pandemic and sustainability.',
      'report.item6.title': 'Sustainability Report 2019',
      'report.item6.text': 'International expansion and sustainability.',
      'report.item7.title': 'Sustainability Report 2018',
      'report.item7.text': 'GRI standards integration and new targets.',
      'report.item8.title': 'Sustainability Report 2017',
      'report.item8.text': 'Consolidation of the sustainable approach.',
      'report.item9.title': 'Sustainability Report 2016',
      'report.item9.text': 'Technological innovation and environment.',
      'report.item10.title': 'Sustainability Report 2015',
      'report.item10.text': 'Development of integrated sustainability strategy.',
      'report.item11.title': 'Sustainability Report 2014',
      'report.item11.text': 'Expansion into emerging markets and CSR.',
      'report.item12.title': 'Sustainability Report 2013',
      'report.item12.text': 'First structured sustainability initiatives.',
      'report.badge.new': 'New',
      'report.download': 'Download',
      'report.source': 'Source: Official company website. Files are direct links to PDFs.',
      'filters.all': 'All years',
      'filters.search': 'Search…',
      'filters.clear': 'Clear',
      'footer.contact': 'Contact',
      'footer.social': 'Social',
      'footer.copyright': '© 2025 Webuild S.p.A. — All rights reserved',
      'footer.tagline': 'Demo site for sustainability reports',
      'about.messina.title': 'Strait of Messina Bridge',
      'about.messina.lead': 'A landmark infrastructure combining advanced design, low‑emission construction, and continuous digital monitoring.',
      'about.messina.a1.title': 'Vision and territorial value',
      'about.messina.a1.text': 'Stable link integrated into European corridors, cutting crossing times and enabling national logistics cohesion.',
      'about.messina.a2.title': 'Engineering and safety',
      'about.messina.a2.text': 'Solutions for wind and seismicity, system redundancy, and a digital twin for predictive control.',
      'about.messina.a3.title': 'Environmental sustainability',
      'about.messina.a3.text': 'Electrified site, reduced emissions, material reuse, and biodiversity/landscape plans.',
      'about.messina.a4.title': 'Socio‑economic impact',
      'about.messina.a4.text': 'Direct/indirect jobs, local supply chain, and new opportunities for mobility, tourism, and research.',
      'about.iconic': 'Iconic Projects',
      'about.iconic.genova.title': 'Genoa Bridge',
      'about.iconic.genova.text': 'Record reconstruction in 2 years with innovative technologies and maximum safety',
      'about.iconic.riyadh.title': 'Riyadh Metro',
      'about.iconic.riyadh.text': '176 km metro network, one of the largest mobility projects worldwide',
      'about.iconic.gerd.title': 'GERD Dam',
      'about.iconic.gerd.text': 'Africa’s largest hydropower dam for clean energy and sustainable development',
      'about.badge.casestudy': 'Case study',
      'about.cta.report': 'Explore our Sustainability Reports',
      'about.iconic.messina.title': 'Strait of Messina Bridge',
      'about.iconic.messina.text': 'Stable link between Sicily and the mainland, with focus on safety, sustainability, and digital monitoring.'
    }
  };

  // Inizializza e collega lo switcher della lingua (select in navbar)
  window.avviaI18n = function avviaI18n(){
    // Select presente nella navbar per cambiare lingua
    const langSelect = $('#langSelect');
    // Recupera lingua salvata, oppure quella del documento, oppure 'it'
    const saved = localStorage.getItem('site.lang') || document.documentElement.lang || 'it';

    // Imposta inizialmente la lingua salvata o di default
    setLang(saved);

    // Aggiorna la lingua al cambio della select
    if(langSelect){
      langSelect.value = saved;
      langSelect.addEventListener('change', () => setLang(langSelect.value));
    }

    // Applica le traduzioni al DOM per la lingua richiesta
    function setLang(lang){
      // Sceglie il dizionario richiesto; fallback su IT se mancante
      const dict = window.I18N[lang] || window.I18N.it;

      // Aggiorna lang sul tag <html> e persiste scelta
      document.documentElement.lang = lang;
      localStorage.setItem('site.lang', lang);

      // Titolo del documento (se marcato con data-i18n)
      const titleEl = document.querySelector('title[data-i18n="meta.title"]');
      if(titleEl && dict['meta.title']) {
        titleEl.textContent = dict['meta.title'];
      }

      // Contenuti testuali marcati con data-i18n
      $$('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if(dict[k]){
          // Piccolo fade per rendere il cambio meno brusco
          el.style.opacity = '0.7';
          setTimeout(() => {
            el.textContent = dict[k];
            el.style.opacity = '';
          }, 100);
        }
      });

      // Placeholder ed etichette accessibili per gli input (ricerca, ecc.)
      $$('[data-i18n-placeholder]').forEach(el => {
        const k = el.getAttribute('data-i18n-placeholder');
        if(dict[k]){
          el.setAttribute('placeholder', dict[k]);
          el.setAttribute('aria-label', dict[k]);
        }
      });
    }

    // Espone setLang globalmente per testing in console
    window.setLang = setLang;
  };
})();
