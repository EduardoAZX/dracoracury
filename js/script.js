/* Dora Cury Dermatologia — Landing Page JS */
(function () {
  'use strict';

  var WHATSAPP = '5517997022092';

  /* ---------- Navbar: estado ao rolar ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('navBurger');
  var links = document.getElementById('navLinks');
  function setMenu(open) {
    links.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () {
    setMenu(!links.classList.contains('open'));
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

    var ioSupported = "IntersectionObserver" in window;
  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  if (!ioSupported) { revealEls.forEach(function (el) { el.classList.add("in"); }); }
  revealEls.forEach(function (el, i) {
    el.style.setProperty('--d', Math.min(i % 4, 3) * 90 + 'ms');
    io.observe(el);
  });

  /* ---------- FAQ: só um item aberto por vez ---------- */
  document.querySelectorAll('.faq__item').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        document.querySelectorAll('.faq__item[open]').forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Modais: Termos & Privacidade ---------- */
  document.querySelectorAll('[data-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.getElementById('modal-' + btn.dataset.modal).classList.add('open');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(function (ov) {
    ov.addEventListener('click', function (e) {
      if (e.target === ov || e.target.closest('.modal__close')) {
        ov.classList.remove('open');
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(function (o) {
        o.classList.remove('open');
      });
    }
  });

  /* ---------- Formulário → WhatsApp ---------- */
  var form = document.getElementById('agendaForm');
  var chipField = document.querySelector('.chips');
  var chipsHint = document.getElementById('chipsHint');

  function maskPhone(input) {
    var v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 2) {
      var ddd = v.slice(0, 2);
      var rest = v.slice(2);
      if (rest.length > 5) {
        v = '(' + ddd + ') ' + rest.slice(0, 5) + '-' + rest.slice(5);
      } else {
        v = '(' + ddd + ') ' + rest;
      }
    } else if (v.length > 0) {
      v = '(' + v;
    }
    input.value = v;
  }
  var whatsInput = document.getElementById('f-whats');
  whatsInput.addEventListener('input', function () { maskPhone(whatsInput); });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();

    var nome = form.nome.value.trim();
    var whats = form.whatsapp.value.replace(/\D/g, '');
    var assunto = form.querySelector('input[name="assunto"]:checked');
    var msg = form.mensagem.value.trim();

    var ok = true;
    [form.nome, form.whatsapp, form.mensagem].forEach(function (f) { f.classList.remove('invalid'); });
    chipField.classList.remove('invalid-flag');
    if (chipsHint) chipsHint.classList.remove('show');

    if (!nome) { form.nome.classList.add('invalid'); ok = false; }
    if (whats.length < 10) { form.whatsapp.classList.add('invalid'); ok = false; }
    if (!assunto) { chipField.classList.add('invalid-flag'); if (chipsHint) chipsHint.classList.add('show'); ok = false; }
    if (!msg) { form.mensagem.classList.add('invalid'); ok = false; }

    if (!ok) {
      var firstInvalid = form.querySelector('.invalid') || chipField;
      if (firstInvalid.focus) firstInvalid.focus();
      return;
    }

    var texto = 'Olá Dra. Doramárcia Cury! Gostaria de agendar um atendimento.\n\n'
      + 'Nome: ' + nome + '\n'
      + 'WhatsApp: ' + form.whatsapp.value.trim() + '\n'
      + 'Assunto: ' + assunto.value + '\n'
      + 'Mensagem: ' + msg + '\n'
      + '\nAguardo o retorno. Obrigado(a)!';

    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
    window.open(url, '_blank', 'noopener');

    setTimeout(function () {
      window.location.href = 'obrigado.html';
    }, 900);
  });
})();