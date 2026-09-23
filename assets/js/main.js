(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const updateThemeLabel = () => themeButton?.setAttribute('aria-label', `Switch to ${root.classList.contains('dark') ? 'light' : 'dark'} mode`);
  updateThemeLabel();
  themeButton?.addEventListener('click', () => {
    root.classList.toggle('dark');
    try { localStorage.setItem('namahnest-theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (e) {}
    updateThemeLabel();
  });
  const menuButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const closeMenu = () => { if (!menu) return; menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); };
  menuButton?.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    menuButton.setAttribute('aria-expanded', String(!menu.hidden));
    menuButton.setAttribute('aria-label', menu.hidden ? 'Open navigation' : 'Close navigation');
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu && !menu.hidden) { closeMenu(); menuButton.focus(); } });
  const filters = [...document.querySelectorAll('[data-filter]')];
  const filterPlans = category => {
    if (!filters.some(button => button.dataset.filter === category)) category = 'all';
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    let count = 0;
    document.querySelectorAll('[data-plan-category]').forEach(card => {
      card.hidden = category !== 'all' && card.dataset.planCategory !== category;
      if (!card.hidden) count++;
    });
    const status = document.querySelector('[data-filter-status]');
    if (status) status.textContent = `${count} ${count === 1 ? 'plan' : 'plans'} shown`;
  };
  filters.forEach(button => button.addEventListener('click', () => {
    filterPlans(button.dataset.filter);
    const url = new URL(location.href);
    if (button.dataset.filter === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', button.dataset.filter);
    history.replaceState(null, '', url);
  }));
  if (filters.length) filterPlans(new URLSearchParams(location.search).get('category') || 'all');
  document.getElementById('docs-search')?.addEventListener('input', e => {
    const query = e.target.value.trim().toLowerCase();
    let count = 0;
    document.querySelectorAll('[data-doc-card]').forEach(card => {
      card.hidden = !card.dataset.docSearch.includes(query);
      if (!card.hidden) count++;
    });
    document.getElementById('docs-search-status').textContent = `${count} ${count === 1 ? 'guide' : 'guides'} found`;
    document.getElementById('docs-no-results').hidden = count !== 0;
  });
  document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-gallery]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    document.querySelectorAll('[data-gallery-panel]').forEach(panel => panel.hidden = panel.dataset.galleryPanel !== button.dataset.gallery);
  }));
  document.querySelectorAll('[data-billing]').forEach(button => button.addEventListener('click', () => {
    const monthly = button.dataset.billing === 'monthly';
    document.querySelectorAll('[data-billing]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    document.querySelectorAll('[data-once-price]').forEach(price => {
      const value = monthly ? price.dataset.monthlyPrice : price.dataset.oncePrice;
      price.textContent = value === 'Custom' ? value : `$${value}`;
      price.nextElementSibling.textContent = value === 'Custom' ? "let's talk" : monthly ? '/ month' : 'one-time';
    });
    document.querySelector('[data-billing-note]').textContent = monthly ? 'Optional ongoing support. A one-time kit purchase is required.' : 'One-time purchase. Optional support sold separately.';
    document.querySelectorAll('[data-once-price]').forEach(price => {
      if (price.dataset.oncePrice === 'Custom') return;
      const card = price.closest('article');
      const link = card.querySelector('a');
      const url = new URL(link.href);
      if (monthly) url.searchParams.set('support', 'yes'); else url.searchParams.delete('support');
      link.href = url.href;
    });
  }));
  const support = document.querySelector('[data-support-toggle]');
  support?.addEventListener('change', () => {
    document.querySelector('[data-total]').textContent = `$${support.dataset.price} one-time${support.checked ? ` + $${support.dataset.support}/month support` : ' · no subscription'}`;
    const link = document.querySelector('[data-buy-link]');
    const url = new URL(link.href);
    if (support.checked) url.searchParams.set('support', 'yes'); else url.searchParams.delete('support');
    link.href = url.href;
  });
  const form = document.getElementById('contact-form');
  if (form) {
    const params = new URLSearchParams(location.search);
    const interest = document.getElementById('interest');
    if ([...interest.options].some(option => option.value === params.get('plan'))) interest.value = params.get('plan');
    if (params.get('support') === 'yes') document.getElementById('message').value = 'I would like to purchase this kit with the optional monthly support add-on.';
    if (form.hasAttribute('data-web3forms')) {
      let submitting = false;
      form.addEventListener('submit', async e => {
        e.preventDefault();
        if (submitting || !form.reportValidity() || document.getElementById('website').value || form.elements.namedItem('botcheck').checked) return;
        const status = document.getElementById('contact-status');
        const button = form.querySelector('button[type="submit"]');
        const originalLabel = button.innerHTML;
        const data = Object.fromEntries(new FormData(form));
        delete data.website;
        delete data.redirect;
        data.subject = `NamahNest enquiry: ${data.interest}`;
        submitting = true;
        button.disabled = true;
        button.textContent = 'Sending…';
        form.setAttribute('aria-busy', 'true');
        status.textContent = 'Sending your message…';
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        try {
          const response = await fetch(form.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data),
            signal: controller.signal
          });
          const result = await response.json();
          if (!response.ok || result.success !== true) throw new Error('Submission failed');
          form.reset();
          status.textContent = "Thanks! Your message has been sent. We'll get back to you by email.";
        } catch (error) {
          status.textContent = error.name === 'AbortError'
            ? 'The request timed out, so we could not confirm delivery. Your details are still here. Please try again later or use the email link.'
            : 'We could not confirm that your message was sent. Your details are still here. Please try again or use the email link.';
        } finally {
          clearTimeout(timeout);
          submitting = false;
          button.disabled = false;
          button.innerHTML = originalLabel;
          form.removeAttribute('aria-busy');
        }
      });
    }
    if (!form.hasAttribute('action')) form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity() || document.getElementById('website').value) return;
      const data = new FormData(form);
      const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company')}\nInterest: ${data.get('interest')}\n\n${data.get('message')}`;
      location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(`NamahNest enquiry: ${data.get('interest')}`)}&body=${encodeURIComponent(body)}`;
      document.getElementById('contact-status').textContent = 'Your email draft is ready. Send it from your email app to complete your enquiry.';
    });
  }
  document.querySelector('[data-newsletter]')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    const contactEmail = document.getElementById('contact-form')?.dataset.email || document.documentElement.dataset.contactEmail;
    if (!contactEmail) return;
    location.href = `mailto:${contactEmail}?subject=Newsletter%20signup&body=${encodeURIComponent(`Please send occasional NamahNest updates to ${email}.`)}`;
    document.querySelector('[data-newsletter-status]').textContent = 'Send the signup request from your email app to subscribe.';
  });
})();
