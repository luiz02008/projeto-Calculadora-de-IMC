/* ============================================================
   CALCULADORA DE IMC — script.js
   Animações: contagem do número, shake de erro, pulse no badge,
   ripple no botão, particles de confetti, fade staggerado nos
   campos, glow no input focus, typewriter no personInfo.
   ============================================================ */

var campos = ['nome', 'peso', 'altura', 'idade'];

/* ----------------------------------------------------------
   INICIALIZAÇÃO — adiciona listeners e efeitos de entrada
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  animarEntradaDosInputs();

  campos.forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', verificarCampos);
    el.addEventListener('focus', onFocusGlow);
    el.addEventListener('blur',  onBlurGlow);
  });
});

/* ----------------------------------------------------------
   ANIMAÇÃO DE ENTRADA — inputs aparecem em cascata
   ---------------------------------------------------------- */
function animarEntradaDosInputs() {
  var fields = document.querySelectorAll('.field');
  fields.forEach(function (field, i) {
    field.style.opacity   = '0';
    field.style.transform = 'translateY(20px)';
    field.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    setTimeout(function () {
      field.style.opacity   = '1';
      field.style.transform = 'translateY(0)';
    }, 120 * i + 200);
  });
}

/* ----------------------------------------------------------
   GLOW NO FOCUS
   ---------------------------------------------------------- */
function onFocusGlow(e) {
  var wrap = e.target.closest('.input-wrap');
  if (!wrap) return;
  wrap.style.transition = 'filter 0.3s ease';
  wrap.style.filter = 'drop-shadow(0 0 8px rgba(200,245,80,0.35))';
}

function onBlurGlow(e) {
  var wrap = e.target.closest('.input-wrap');
  if (!wrap) return;
  wrap.style.filter = 'none';
}

/* ----------------------------------------------------------
   VERIFICAR CAMPOS
   ---------------------------------------------------------- */
function verificarCampos() {
  var peso   = document.getElementById('peso').value;
  var altura = document.getElementById('altura').value;
  var idade  = document.getElementById('idade').value;
  var hint   = document.getElementById('hint');

  if (peso && altura && idade) {
    fadeOut(hint, 300);
  } else {
    hint.style.display  = 'block';
    hint.style.opacity  = '1';
    hint.textContent = 'Preencha todos os campos para calcular';
  }
}

/* ----------------------------------------------------------
   RESETAR com animação de saída
   ---------------------------------------------------------- */
function resetar() {
  var r = document.getElementById('result');

  if (r.classList.contains('show')) {
    r.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    r.style.opacity    = '0';
    r.style.transform  = 'translateY(-10px)';

    setTimeout(function () {
      r.classList.remove('show');
      r.style.opacity   = '';
      r.style.transform = '';
    }, 320);
  }

  campos.forEach(function (id) {
    var el = document.getElementById(id);
    el.style.transition = 'opacity 0.25s ease';
    el.style.opacity    = '0.3';
    setTimeout(function () {
      el.value         = '';
      el.style.opacity = '1';
    }, 200);
  });

  var hint = document.getElementById('hint');
  hint.style.display  = 'block';
  hint.style.opacity  = '1';
  hint.textContent = 'Preencha todos os campos para calcular';
}

/* ----------------------------------------------------------
   CALCULAR com sequência completa de animações
   ---------------------------------------------------------- */
function calcular() {
  var nome   = document.getElementById('nome').value.trim();
  var peso   = parseFloat(document.getElementById('peso').value);
  var altura = parseFloat(document.getElementById('altura').value);
  var idade  = parseInt(document.getElementById('idade').value);
  var anoNascimento = idade ? (2026 - idade) : null;

  if (!peso || !altura || altura <= 0) {
    shakeErro(['peso', 'altura']);
    return;
  }

  var imc = peso / (altura * altura);
  var categoria, cor, bgCor, pct;

  if (imc < 18.5) {
    categoria = 'Abaixo do peso';
    cor       = '#50f5c0';
    bgCor     = 'rgba(80,245,192,0.1)';
    pct       = Math.min((imc / 18.5) * 20, 20);
  } else if (imc < 25) {
    categoria = 'Peso normal';
    cor       = '#c8f550';
    bgCor     = 'rgba(200,245,80,0.1)';
    pct       = 20 + ((imc - 18.5) / 6.5) * 30;
  } else if (imc < 30) {
    categoria = 'Sobrepeso';
    cor       = '#f5a550';
    bgCor     = 'rgba(245,165,80,0.1)';
    pct       = 50 + ((imc - 25) / 5) * 25;
  } else {
    categoria = 'Obesidade';
    cor       = '#f55060';
    bgCor     = 'rgba(245,80,96,0.1)';
    pct       = Math.min(75 + ((imc - 30) / 10) * 25, 97);
  }

  /* 1 — Ripple no botão */
  rippleBotao(document.querySelector('.btn-calcular'), cor);

  /* 2 — Exibe o card de resultado */
  var r = document.getElementById('result');
  r.classList.remove('show');
  void r.offsetWidth;
  r.classList.add('show');

  /* 3 — Contador animado do IMC */
  animarContagem('imcValor', 0, imc, 900, cor);

  /* 4 — Agulha desliza até a posição */
  setTimeout(function () {
    document.getElementById('needle').style.left = pct + '%';
  }, 200);

  /* 5 — Badge aparece com pulse */
  setTimeout(function () {
    var badge = document.getElementById('categoriaBadge');
    badge.style.color       = cor;
    badge.style.borderColor = cor;
    badge.style.background  = bgCor;
    document.getElementById('categoriaDot').style.background = cor;
    document.getElementById('categoriaTexto').textContent    = categoria;
    pulseBadge(badge);
  }, 500);

  /* 6 — Typewriter no resumo da pessoa */
  var infoTexto = '';
  if (nome)  infoTexto += nome + ' — ';
  if (idade) infoTexto += idade + ' anos  |  ';
  infoTexto += peso + ' kg  |  ' + altura + ' m';
  if (anoNascimento) infoTexto += '  |  Nascido em ' + anoNascimento;

  setTimeout(function () {
    typewriter('personInfo', infoTexto, 28);
  }, 700);

  /* 7 — Confetti somente para peso normal */
  if (imc >= 18.5 && imc < 25) {
    setTimeout(function () { lancarConfetti(cor); }, 1000);
  }
}

/* ----------------------------------------------------------
   ANIMAÇÃO DE CONTAGEM (counter roll-up)
   ---------------------------------------------------------- */
function animarContagem(id, inicio, fim, duracao, cor) {
  var el = document.getElementById(id);
  el.style.color = cor;
  var startTime  = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progresso = Math.min((timestamp - startTime) / duracao, 1);
    var eased     = easeOutExpo(progresso);
    var atual     = inicio + (fim - inicio) * eased;
    el.textContent = atual.toFixed(2);

    if (progresso < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = fim.toFixed(2);
    }
  }

  requestAnimationFrame(step);
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* ----------------------------------------------------------
   SHAKE NOS CAMPOS COM ERRO
   ---------------------------------------------------------- */
function shakeErro(ids) {
  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el.value) {
      el.style.borderColor = '#f55060';
      el.style.boxShadow   = '0 0 0 3px rgba(245,80,96,0.2)';

      el.animate([
        { transform: 'translateX(0)'  },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)'  },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)'  },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(0)'  }
      ], { duration: 400, easing: 'ease-in-out' });

      setTimeout(function () {
        el.style.borderColor = '';
        el.style.boxShadow   = '';
      }, 1500);
    }
  });
}

/* ----------------------------------------------------------
   PULSE NO BADGE DA CATEGORIA
   ---------------------------------------------------------- */
function pulseBadge(el) {
  el.animate([
    { transform: 'scale(1)',    opacity: '0.5' },
    { transform: 'scale(1.12)', opacity: '1'   },
    { transform: 'scale(0.97)', opacity: '1'   },
    { transform: 'scale(1)',    opacity: '1'   }
  ], { duration: 500, easing: 'ease-out' });
}

/* ----------------------------------------------------------
   RIPPLE NO BOTÃO CALCULAR
   ---------------------------------------------------------- */
function rippleBotao(btn, cor) {
  var circle = document.createElement('span');
  var rect   = btn.getBoundingClientRect();
  var size   = Math.max(rect.width, rect.height);

  circle.style.cssText = [
    'position:absolute',
    'border-radius:50%',
    'background:' + (cor || 'rgba(255,255,255,0.4)'),
    'width:'  + size + 'px',
    'height:' + size + 'px',
    'top:50%',
    'left:50%',
    'transform:translate(-50%,-50%) scale(0)',
    'opacity:0.5',
    'pointer-events:none',
    'transition:transform 0.5s ease, opacity 0.5s ease'
  ].join(';');

  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(circle);

  requestAnimationFrame(function () {
    circle.style.transform = 'translate(-50%,-50%) scale(2.5)';
    circle.style.opacity   = '0';
  });

  setTimeout(function () { circle.remove(); }, 600);
}

/* ----------------------------------------------------------
   TYPEWRITER NO personInfo
   ---------------------------------------------------------- */
function typewriter(id, texto, velocidade) {
  var el    = document.getElementById(id);
  el.textContent = '';
  el.style.opacity = '1';
  var i = 0;

  function escrever() {
    if (i < texto.length) {
      el.textContent += texto.charAt(i);
      i++;
      setTimeout(escrever, velocidade);
    }
  }

  escrever();
}

/* ----------------------------------------------------------
   CONFETTI (canvas temporário) — somente para peso normal
   ---------------------------------------------------------- */
function lancarConfetti(corBase) {
  var canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100%',
    'height:100%',
    'pointer-events:none',
    'z-index:9999'
  ].join(';');
  document.body.appendChild(canvas);

  var ctx  = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  var cores      = [corBase, '#ffffff', '#c8f550', '#50f5c0', '#f5a550'];
  var particulas = [];

  for (var i = 0; i < 80; i++) {
    particulas.push({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height - canvas.height,
      w:    Math.random() * 10 + 4,
      h:    Math.random() * 6  + 3,
      cor:  cores[Math.floor(Math.random() * cores.length)],
      rot:  Math.random() * 360,
      vx:   (Math.random() - 0.5) * 3,
      vy:   Math.random() * 4 + 2,
      vrot: (Math.random() - 0.5) * 8,
      alpha: 1
    });
  }

  var startTime = null;
  var duracao   = 2200;

  function desenhar(timestamp) {
    if (!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particulas.forEach(function (p) {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.vrot;
      p.vy  += 0.08;              /* gravidade suave */
      p.alpha = Math.max(0, 1 - (elapsed / duracao));

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.cor;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (elapsed < duracao) {
      requestAnimationFrame(desenhar);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(desenhar);
}

/* ----------------------------------------------------------
   UTILITÁRIOS
   ---------------------------------------------------------- */
function fadeOut(el, duracao) {
  el.style.transition = 'opacity ' + duracao + 'ms ease';
  el.style.opacity    = '0';
  setTimeout(function () { el.style.display = 'none'; }, duracao);
}

/* ----------------------------------------------------------
   TECLA ENTER
   ---------------------------------------------------------- */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') calcular();
});