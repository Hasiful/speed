(() => {
  const assetRoot = '/assets/speed/';
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/speed-brand.css';
  document.head.append(link);

  document.documentElement.lang = 'en';
  document.title = 'Speed Energy Drink - Feel the Rush';

  const setMeta = (selector, content) => {
    const element = document.head.querySelector(selector);
    if (element) element.content = content;
  };
  const description = 'Speed is a bold 250 ml carbonated energy drink from Bangladesh with caffeine, taurine and vitamins.';
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', 'Speed Energy Drink - Feel the Rush');
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:image"]', assetRoot + 'speed-can.webp');
  setMeta('meta[name="twitter:title"]', 'Speed Energy Drink - Feel the Rush');
  setMeta('meta[name="twitter:description"]', description);

  const structuredData = document.querySelector('script[type="application/ld+json"]');
  if (structuredData) {
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Speed Energy Drink',
      description,
      image: assetRoot + 'speed-can.webp',
      brand: { '@type': 'Brand', name: 'Speed' },
      countryOfOrigin: { '@type': 'Country', name: 'Bangladesh' },
    });
  }

  document.querySelectorAll('.navbar_logo').forEach((logo) => {
    logo.src = assetRoot + 'speed-logo.svg';
    logo.alt = 'Speed Energy Drink';
  });

  const slides = [
    { title: ['Extra', 'Strength'], description: 'A bold carbonated energy drink built for the moments that demand more.' },
    { title: ['Instant', 'Energy'], description: 'Crack it cold and switch on when the pace rises and the day runs long.' },
    { title: ['Mental', 'Alertness'], description: 'Made to help you feel switched on when tiredness tries to slow you down.' },
    { title: ['Caffeine', '+ Taurine'], description: 'The classic energy-drink combination inside every unmistakable black can.' },
    { title: ['B', 'Vitamins'], description: 'A vitamin-powered formula made for your fast-moving everyday rhythm.' },
    { title: ['250', 'ML'], description: 'A compact single-serve can, made in Bangladesh and best enjoyed ice cold.' },
  ];

  const setAnimatedLines = (root, lines) => {
    const nodes = root?.querySelectorAll('[data-anim="chars-mask"]');
    if (!nodes?.length) return;
    nodes.forEach((node, index) => { node.textContent = lines[index] || ''; });
  };

  document.querySelectorAll('.carousel_list.is-hero .carousel_title').forEach((item, index) => {
    setAnimatedLines(item, slides[index].title);
  });
  document.querySelectorAll('.carousel_list.is-desc .carousel_title-b').forEach((item, index) => {
    setAnimatedLines(item, slides[index].title);
  });

  const descriptionCards = document.querySelectorAll('.carousel_desc');
  descriptionCards.forEach((card, index) => {
    setAnimatedLines(card, slides[index].title);
    const paragraph = card.querySelector('p[data-anim="lines-mask"]');
    if (paragraph) paragraph.textContent = slides[index].description;
  });

  document.querySelectorAll('.carousel_slide').forEach((slide, index) => {
    const reds = ['#e11b22', '#c81018', '#ff3131', '#b90f16', '#ea1e27', '#d4151c'];
    slide.dataset.tastePrimary = '#050505';
    slide.dataset.tasteSecondary = reds[index] || '#e11b22';
  });

  const benefitCopy = [
    ['X SLOW MODE', 'EXTRA<br>STRENGTH', 'A bold energy drink for long days, late nights and every high-tempo moment in between.'],
    ['X LOW CHARGE', 'CAFFEINE<br>BOOST', 'Caffeine is part of the formula designed to deliver the familiar lift people expect from an energy drink.'],
    ['X LOSING FOCUS', 'TAURINE<br>FORMULA', 'Taurine joins the energy blend in the signature black 250 ml Speed can.'],
    ['X RUNNING EMPTY', 'B<br>VITAMINS', 'Vitamins complete a fast, refreshing carbonated drink made to keep up with your pace.'],
  ];
  document.querySelectorAll('.section.is-benefits').forEach((section, index) => {
    const copy = benefitCopy[index];
    if (!copy) return;
    const subhead = section.querySelector('.subhead_text [data-anim="chars-mask"]');
    const heading = section.querySelector('h2[data-anim="chars-mask"]');
    const paragraph = section.querySelector('p[data-anim="lines-mask"]');
    if (subhead) subhead.textContent = copy[0];
    if (heading) heading.innerHTML = copy[1];
    if (paragraph) paragraph.textContent = copy[2];
  });

  const faqs = [
    ['What is Speed Energy Drink?', 'Speed is a 250 ml carbonated energy drink made in Bangladesh. It is designed for a quick energy boost and a more alert feeling.'],
    ['What is inside Speed?', 'The published product information lists caffeine, taurine and vitamins among the drink\'s key ingredients.'],
    ['Is Speed carbonated?', 'Yes. Speed is an extra-strength carbonated beverage with a bold, refreshing energy-drink taste.'],
    ['How should I serve it?', 'Speed is best enjoyed chilled. Refrigerate the can before opening for the coldest, sharpest refreshment.'],
    ['Where is Speed made?', 'Speed Energy Drink is a product of Bangladesh.'],
    ['What size is the can?', 'The can contains 250 ml, making it a compact single-serve energy drink.'],
    ['Who should be careful with energy drinks?', 'Energy drinks contain caffeine. Children, pregnant or breastfeeding people, and anyone sensitive to caffeine should avoid them or seek professional advice.'],
    ['When should I drink Speed?', 'Choose it when you need an energy lift, while keeping your total daily caffeine intake in mind.'],
    ['How should I store the can?', 'Keep unopened cans in a cool, dry place away from direct sunlight. Refrigerate after opening and consume promptly.'],
  ];
  document.querySelectorAll('.faq_list .w-dyn-item').forEach((item, index) => {
    const copy = faqs[index];
    if (!copy) return;
    const question = item.querySelector('.heading-style-h5');
    const answer = item.querySelector('.faq_answer p');
    if (question) question.textContent = copy[0];
    if (answer) answer.textContent = copy[1];
  });

  const faqHeading = document.querySelector('.heading-style-custom-2');
  if (faqHeading) faqHeading.innerHTML = 'FREQUENTLY ASKED<br>QUESTIONS';

  const exactText = new Map([
    ['Gamme', 'The Drink'],
    ['Benefits', 'The Boost'],
    ['FAQ', 'FAQ'],
    ['Newsletter', 'Stay Charged'],
    ['Scroll to discover', 'Scroll to feel the speed'],
    ['REJOIGNEZ-NOUS', 'STAY CHARGED'],
    ['VOTRE ADRESSE MAIL', 'YOUR EMAIL ADDRESS'],
    ['S\'INSCRIRE', 'SIGN UP'],
  ]);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let textNode;
  while ((textNode = walker.nextNode())) {
    const clean = textNode.nodeValue.trim();
    if (exactText.has(clean)) textNode.nodeValue = textNode.nodeValue.replace(clean, exactText.get(clean));
  }

  const newsletterHeading = document.querySelector('.sib-form .heading-style-h2');
  if (newsletterHeading) newsletterHeading.textContent = 'STAY CHARGED';
  const newsletterText = document.querySelector('.sib-form p.text-align-center');
  if (newsletterText) newsletterText.textContent = 'Join the Speed community for product news, drops and high-energy updates.';

  document.querySelectorAll('.text-size-tiny').forEach((node) => {
    if (node.textContent.includes('©')) node.textContent = '© 2026 SPEED ENERGY';
  });

  const hiddenH1 = document.querySelector('h1');
  if (hiddenH1) hiddenH1.textContent = 'Speed Energy Drink - Feel the Rush';

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.href = 'mailto:contact@speedenergy.com';
    if (link.textContent.includes('@')) {
      link.textContent = 'contact@speedenergy.com';
    }
  });

  document.querySelectorAll('a[href*="instagram.com"], a[href*="tiktok.com"], a[href*="youtube.com"]').forEach((link) => {
    link.href = '#gamme';
  });

  const loader = document.querySelector('.loader');
  if (loader && !loader.querySelector('.speed-loader-visual')) {
    const visual = document.createElement('div');
    visual.className = 'speed-loader-visual';
    visual.innerHTML = `
      <div class="speed-loader-wordmark">SPEED</div>
      <svg class="speed-loader-line" viewBox="0 0 1100 180" aria-hidden="true">
        <path d="M0 95h270l35-65 52 128 54-113 58 50h150l42-42 50 90 57-128 61 143 62-63h249" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <img class="speed-loader-can" src="${assetRoot}speed-can.webp" alt="Speed Energy Drink can">
    `;
    loader.insertBefore(visual, loader.querySelector('.loader_percent'));
  }
})();
