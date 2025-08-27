const images = ['/resources/images/background1.webp','/resources/images/background2.webp','/resources/images/background3.webp'];  
let i = 0;
const a = document.getElementById('bg1');
const b = document.getElementById('bg2');
let topLayer = a;
let bottomLayer = b;

images.forEach(src => { const im = new Image(); im.src = src; });

function swap() {
  bottomLayer.style.backgroundImage = `url('${images[i]}')`;
  bottomLayer.classList.add('visible');
  topLayer.classList.remove('visible');

  [topLayer, bottomLayer] = [bottomLayer, topLayer];
  i = (i + 1) % images.length;
}

topLayer.style.backgroundImage = `url('${images[0]}')`;
topLayer.classList.add('visible');
i = 1;
setInterval(swap, 8000);