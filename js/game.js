// js/game.js

const MODE     = sessionStorage.getItem('mode') || 'defuser';
const errorsEl = document.getElementById('errors');
const finishBtn= document.getElementById('finish-btn');
const tick     = document.getElementById('tick');
const boom     = document.getElementById('boom');
const success  = document.getElementById('success');
const errorS   = document.getElementById('error');

let errors   = 0;
let solved   = 0;
let timeLeft = 240; // 4 minutos
let timerInt;

// Cada módulo con instrucciones para el experto y render() para el defusor
const modulesData = [
  {
    id:'m1', title:'Cadenas del Patriarca',
    expertHTML: `<h3>Cadenas del Patriarca</h3>
      <p>Busca en la Biblia el orden cronológico de Noé, Abraham, Rut, David, Ester y Pablo.</p>`,
    render() {
      const m = document.createElement('div'); m.id=this.id; m.className='module';
      m.innerHTML=`
        <h3>${this.title}</h3>
        <p>Pulsa los nombres en orden cronológico:</p>
        <div class="options"></div>
        <div class="sequence" id="${this.id}-seq"></div>
        <button class="verify btn">Verificar</button>`;
      const optsEl = m.querySelector('.options');
      const seqEl  = m.querySelector(`#${this.id}-seq`);
      const seq    = [];
      ['Noé','Abraham','Rut','David','Ester','Pablo']
        .sort(() => Math.random() - .5)
        .forEach(name => {
          const b = document.createElement('button');
          b.className='option-btn'; b.textContent=name;
          b.onclick = () => {
            if (seq.length<6 && !seq.includes(name)) {
              seq.push(name);
              b.classList.add('active');
              seqEl.textContent = seq.join(' → ');
            }
          };
          optsEl.appendChild(b);
        });
      m.querySelector('.verify').onclick=()=>
        seq.join()===['Noé','Abraham','Rut','David','Ester','Pablo'].join() ? pass(this.id) : fail(this.id);
      return m;
    }
  },
  {
    id:'m2', title:'Frutos del Panel',
    expertHTML:`<h3>Frutos del Espíritu</h3>
      <p>Consulta Gálatas 5:22–23 y selecciona solo los siete frutos allí listados.</p>`,
    render() {
      const m=document.createElement('div'); m.id=this.id; m.className='module';
      m.innerHTML=`
        <h3>${this.title}</h3>
        <p>Selecciona solo los frutos válidos:</p>
        <div class="options"></div>
        <button class="verify btn">Verificar</button>`;
      const optsEl = m.querySelector('.options');
      const sel    = new Set();
      ['Amor','Odio','Gozo','Envidia','Paz','Paciencia','Egoísmo','Bondad','Benignidad','Fe','Orgullo']
        .sort(()=>Math.random()-.5)
        .forEach(txt=>{
          const b=document.createElement('button');
          b.className='option-btn'; b.textContent=txt;
          b.onclick=()=>{
            b.classList.toggle('active');
            sel.has(txt)?sel.delete(txt):sel.add(txt);
          };
          optsEl.appendChild(b);
        });
      m.querySelector('.verify').onclick=()=>{
        const need=['Amor','Gozo','Paz','Paciencia','Benignidad','Bondad','Fe'];
        need.every(n=>sel.has(n))&&sel.size===need.length ? pass(this.id) : fail(this.id);
      };
      return m;
    }
  },
  {
    id:'m3', title:'Cifrado de los Salmos',
    expertHTML:`<h3>Salmo 23:1</h3>
      <p>Encuentra Salmo y versículo, luego multiplica sus números.</p>`,
    render() {
      const m=document.createElement('div'); m.id=this.id; m.className='module';
      m.innerHTML=`
        <h3>${this.title}</h3>
        <p>Introduce Salmo (X) y versículo (Y):</p>
        <input type="number" id="${this.id}-x" placeholder="Salmo" class="option-input"/>
        <input type="number" id="${this.id}-y" placeholder="Versículo" class="option-input"/>
        <button class="verify btn">Verificar</button>`;
      m.querySelector('.verify').onclick=()=>{
        const x=+m.querySelector(`#${this.id}-x`).value;
        const y=+m.querySelector(`#${this.id}-y`).value;
        (x===23 && y===1) ? pass(this.id) : fail(this.id);
      };
      return m;
    }
  },
  {
    id:'m4', title:'Bienaventuranzas Desordenadas',
    expertHTML:`<h3>Bienaventuranzas</h3>
      <p>Filtra en Mateo 5:3–10 solo las promesas de bendición espiritual.</p>`,
    render() {
      const m=document.createElement('div'); m.id=this.id; m.className='module';
      m.innerHTML=`
        <h3>${this.title}</h3>
        <p>Marca solo los correctos:</p>
        <div class="options"></div>
        <button class="verify btn">Verificar</button>`;
      const optsEl=m.querySelector('.options'), sel=new Set();
      ['B1','B2','B3','B4','B5','B6','B7','B8']
        .sort(()=>Math.random()-.5)
        .forEach((t,i)=>{
          const lbl=document.createElement('label');
          lbl.innerHTML=`<input type="checkbox" value="${i+1}" class="option-check"/> ${t}`;
          lbl.querySelector('input').onchange=e=>{
            e.target.checked?sel.add(i+1):sel.delete(i+1);
          };
          optsEl.appendChild(lbl);
        });
      m.querySelector('.verify').onclick=()=>{
        const ok=[3,5,8];
        ok.every(n=>sel.has(n))&&sel.size===ok.length ? pass(this.id) : fail(this.id);
      };
      return m;
    }
  },
  {
    id:'m5', title:'Visión de los Profetas',
    expertHTML:`<h3>Profetas y símbolos</h3>
      <p>Relaciona cada símbolo con su libro profético en secuencia.</p>`,
    render() {
      const m=document.createElement('div'); m.id=this.id; m.className='module';
      m.innerHTML=`
        <h3>${this.title}</h3>
        <p>Pulsa en secuencia simbólica:</p>
        <div class="options"></div>
        <button class="verify btn">Verificar</button>`;
      const optsEl=m.querySelector('.options'), seq=[];
      ['🦁','🦅','🐑'].sort(()=>Math.random()-.5).forEach(sym=>{
        const b=document.createElement('button');
        b.className='option-btn'; b.textContent=sym;
        b.onclick=()=>{
          seq.push(sym);
          b.classList.add('active');
        };
        optsEl.appendChild(b);
      });
      m.querySelector('.verify').onclick=()=>{
        seq.join('')==='🦁🦅🐑' ? pass(this.id) : fail(this.id);
      };
      return m;
    }
  },
  {
    id:'m6', title:'Ruta de la Fe',
    expertHTML:`<h3>Fe, Esperanza y Amor</h3>
      <p>Identifica la secuencia de flechas inspirada en 1 Corintios 13:13.</p>`,
    render() {
      const m=document.createElement('div'); m.id=this.id; m.className='module';
      m.innerHTML=`
        <h3>${this.title}</h3>
        <p>Pulsa flechas ↑, → y ↓ en orden:</p>
        <div class="options"></div>
        <button class="verify btn">Verificar</button>`;
      const optsEl=m.querySelector('.options'), seq=[];
      [['up','↑'],['right','→'],['down','↓']].sort(()=>Math.random()-.5)
        .forEach(([d,i])=>{
          const b=document.createElement('button');
          b.className='option-btn'; b.textContent=i;
          b.onclick=()=>{
            seq.push(d);
            b.classList.add('active');
          };
          optsEl.appendChild(b);
        });
      m.querySelector('.verify').onclick=()=>{
        seq.join()===['up','right','down'].join() ? pass(this.id) : fail(this.id);
      };
      return m;
    }
  }
];

function init() {
  if (MODE==='expert') {
    document.body.className='expert-screen';
    modulesData.forEach(m=>{
      const c=document.getElementById('main-content');
      const div=document.createElement('div');
      div.className='module';
      div.innerHTML=m.expertHTML;
      c.appendChild(div);
    });
    return;
  }

  tick.play();
  const container=document.getElementById('main-content');
  modulesData.sort(()=>Math.random()-.5).forEach(m=>container.appendChild(m.render()));
  finishBtn.onclick=()=>finishGame(true);
  startTimer();
}

function startTimer() {
  const leds=document.getElementById('led-timer');
  for (let i=0; i<4; i++) {
    const led=document.createElement('div');
    led.className='led';
    leds.appendChild(led);
  }
  // enciende el primero al iniciar
  leds.children[0].classList.add('fill');
  let idx = 1;
  timerInt = setInterval(() => {
    timeLeft--;
    if (timeLeft % 60 === 0 && idx < 4) {
      leds.children[idx++].classList.add('fill');
    }
    if (timeLeft <= 0) finishGame(false);
  }, 1000);
}

function pass(id) {
  success.play();
  solved++;
  document.getElementById(id).classList.add('done');
  if (solved === modulesData.length) finishGame(true);
}

function fail(id) {
  errorS.play();
  errors++;
  errorsEl.textContent = errors;
  const mod = document.getElementById(id);
  mod.classList.add('shake');
  setTimeout(() => mod.classList.remove('shake'), 300);
  timeLeft = Math.max(0, timeLeft - 30);
  if (errors >= 3) finishGame(false);
}

function finishGame(win) {
  clearInterval(timerInt);
  tick.pause();
  if (!win) {
    boom.play();
    const ov = document.createElement('div');
    ov.style = `
      position:fixed;top:0;left:0;width:100%;height:100%;
      background:red;opacity:.7;z-index:9999;animation:fadeOut 1s forwards`;
    document.body.appendChild(ov);
  }
  setTimeout(() => {
    alert(win ? '¡Bomba desactivada!' : '¡BOOM! La bomba explotó.');
    location.href = 'index.html';
  }, 800);
}

window.addEventListener('DOMContentLoaded', init);

// Animación fadeOut
const style = document.createElement('style');
style.textContent = `
@keyframes fadeOut {
  from { opacity: .7; }
  to   { opacity: 0; }
}`;
document.head.appendChild(style);
