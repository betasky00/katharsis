/* ============================================================
   KATHARSIS — interacciones (versión sobria)
   ============================================================ */
(function(){
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* NAV móvil */
  var toggle = document.querySelector('.nav-toggle');
  var links  = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){ links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ links.classList.remove('open'); });
    });
  }

  /* REVEAL al hacer scroll */
  function initReveal(){
    var items = document.querySelectorAll('.reveal');
    if(RM || !('IntersectionObserver' in window)){
      items.forEach(function(el){ el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var d = e.target.getAttribute('data-delay') || 0;
          setTimeout(function(){ e.target.classList.add('in'); }, d*80);
          io.unobserve(e.target);
        }
      });
    },{threshold:.14, rootMargin:'0px 0px -6% 0px'});
    items.forEach(function(el){ io.observe(el); });
  }

  /* QUIZ (test oveja negra) */
  var quiz = document.getElementById('quiz');
  if(quiz){
    var qs = quiz.querySelectorAll('.q');
    var bar = document.querySelector('.quiz-bar i');
    var result = document.getElementById('quiz-result');
    var scoreEl = document.getElementById('quiz-score');
    var idx = 0, score = 0, finished = false;
    function show(n){
      qs.forEach(function(q,i){ q.classList.toggle('active', i===n); });
      if(bar) bar.style.width = (n/qs.length*100) + '%';
    }
    quiz.querySelectorAll('.opt').forEach(function(o){
      o.addEventListener('click', function(){
        if(finished) return;
        score += parseInt(o.getAttribute('data-v')||'0',10);
        idx++;
        if(idx < qs.length){ show(idx); }
        else {
          finished = true;
          if(bar) bar.style.width='100%';
          quiz.style.display='none';
          if(result){
            result.classList.add('show');
            var pct = Math.round(score/(qs.length*3)*100);
            if(scoreEl) scoreEl.textContent = pct + '%';
            var verdict = result.querySelector('#quiz-verdict');
            if(verdict){
              verdict.textContent = pct>=66 ? '¡Eres una Oveja Negra!' : pct>=40 ? 'Oveja Negra en potencia' : 'Tu oveja negra está dormida';
            }
          }
        }
      });
    });
    show(0);
  }

  /* CONTADOR de estadísticas (cuenta hasta el número al hacer scroll) */
  function fmt(n){ // separador de miles con punto (es-CO)
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function runCounter(el){
    var nums = el.querySelectorAll('.n[data-target]');
    var DUR = 2200;
    nums.forEach(function(node){
      var target = parseFloat(node.getAttribute('data-target')) || 0;
      var prefix = node.getAttribute('data-prefix') || '';
      if(RM){ node.textContent = prefix + fmt(target); return; }
      node.textContent = prefix + fmt(0); // arranca en 0 al entrar en pantalla
      var t0 = null;
      function step(ts){
        if(t0===null) t0 = ts;
        var p = Math.min((ts - t0)/DUR, 1);
        var eased = 1 - Math.pow(1 - p, 3); // ease-out
        node.textContent = prefix + fmt(target * eased);
        if(p < 1) requestAnimationFrame(step);
        else node.textContent = prefix + fmt(target);
      }
      requestAnimationFrame(step);
    });
  }
  var stats = document.getElementById('stats');
  if(stats){
    if(RM || !('IntersectionObserver' in window)){ runCounter(stats); }
    else {
      var sio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ runCounter(stats); sio.unobserve(stats); } });
      },{threshold:.4});
      sio.observe(stats);
    }
  }

  /* FORMULARIO de contacto */
  var form = document.getElementById('kform');
  if(form){
    var msg = document.getElementById('form-msg');
    function setMsg(text, ok){ if(!msg) return; msg.textContent = text; msg.className = 'form-msg ' + (ok?'ok':'err'); }
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      // honeypot: si está lleno, es un bot -> descartar silenciosamente
      var hp = form.querySelector('[name="_gotcha"]');
      if(hp && hp.value){ return; }
      // validación nativa
      if(!form.checkValidity()){ setMsg('Por favor completa los campos obligatorios.', false); form.reportValidity(); return; }

      var data = new FormData(form);
      var endpoint = form.getAttribute('data-endpoint') || '';
      var configured = endpoint && endpoint.indexOf('TU_ID_FORMSPREE') === -1;

      // Fallback sin backend configurado: abre el correo con los datos ya escritos
      if(!configured){
        var body = 'Nombre: '+(data.get('nombre')||'')+'\nEmpresa: '+(data.get('empresa')||'')+
                   '\nEmail: '+(data.get('email')||'')+'\nCelular: '+(data.get('celular')||'')+
                   '\n\nMensaje:\n'+(data.get('mensaje')||'');
        window.location.href = 'mailto:admin@katharsis.com.co?subject='+
          encodeURIComponent('Contacto web — '+(data.get('empresa')||'')) + '&body=' + encodeURIComponent(body);
        setMsg('Abrimos tu correo para enviar el mensaje. (Configura Formspree para envío automático.)', true);
        return;
      }

      var btn = form.querySelector('button[type=submit]');
      var label = btn ? btn.innerHTML : '';
      if(btn){ btn.disabled = true; btn.textContent = 'Enviando…'; }
      fetch(endpoint, { method:'POST', body:data, headers:{ 'Accept':'application/json' } })
        .then(function(r){
          if(r.ok){ form.reset(); setMsg('¡Gracias! Tu mensaje fue enviado. Te responderemos pronto.', true); }
          else { setMsg('No pudimos enviar el mensaje. Escríbenos a admin@katharsis.com.co.', false); }
        })
        .catch(function(){ setMsg('Error de conexión. Escríbenos a admin@katharsis.com.co.', false); })
        .finally(function(){ if(btn){ btn.disabled = false; btn.innerHTML = label; } });
    });
  }

  if(document.readyState!=='loading') initReveal();
  else document.addEventListener('DOMContentLoaded', initReveal);
})();
