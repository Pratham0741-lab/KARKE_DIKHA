/* ═══════════════════════════════════════════════════════════════
   FinQuest Landing Page — FaultyTerminal WebGL Background
   ─────────────────────────────────────────────────────────────
   Ported from ReactBits FaultyTerminal (OGL/React → Vanilla WebGL)
   Multi-color tinting with full animations + mouse reactivity
   ═══════════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);


/* ═══════════════════════════════════════════════════════════════
   FAULTY TERMINAL BACKGROUND — WebGL Shader
   Config matches user request:
     scale=1.5  gridMul=[2,1]  digitSize=1.2  timeScale=0.5
     scanlineIntensity=0.5  glitchAmount=1  flickerAmount=1
     noiseAmp=1  chromaticAberration=0  dither=0  curvature=0.1
     mouseReact=true  mouseStrength=0.5  pageLoadAnimation=true
     brightness=0.6
   MULTI-COLOR: rainbow hue cycling replaces single tint
   ═══════════════════════════════════════════════════════════════ */

const TERMINAL_CONFIG = {
    scale: 1.5,
    gridMul: [2, 1],
    digitSize: 1.2,
    timeScale: 0.5,
    scanlineIntensity: 0.5,
    glitchAmount: 1,
    flickerAmount: 1,
    noiseAmp: 1,
    chromaticAberration: 0,
    dither: 0,
    curvature: 0.1,
    mouseReact: true,
    mouseStrength: 0.5,
    pageLoadAnimation: true,
    brightness: 0.6,
};

// ── Vertex Shader ──
const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// ── Fragment Shader (FaultyTerminal — MULTI-COLOR) ──
const fragmentShader = `
precision mediump float;

varying vec2 vUv;

uniform float iTime;
uniform vec3  iResolution;
uniform float uScale;

uniform vec2  uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;

float time;

/* ── Utility ─────────────────────────────────────── */
float hash21(vec2 p){
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p){
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2;
}

mat2 rotate(float angle){
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p){
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  mat2 m0 = rotate(time * 0.02);
  f += amp * noise(p);
  p = m0 * p * 2.0;
  amp *= 0.454545;
  mat2 m1 = rotate(time * 0.02);
  f += amp * noise(p);
  p = m1 * p * 2.0;
  amp *= 0.454545;
  mat2 m2 = rotate(time * 0.08);
  f += amp * noise(p);
  return f;
}

float pattern(vec2 p, out vec2 q, out vec2 r){
  vec2 offset1 = vec2(1.0);
  vec2 offset0 = vec2(0.0);
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1  = rotate(0.1);
  q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
  r = vec2(fbm(rot1  * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}

/* ── Digit ───────────────────────────────────────── */
float digit(vec2 p){
  vec2 grid = uGridMul * 15.0;
  vec2 s = floor(p * grid) / grid;
  p = p * grid;
  vec2 q, r;
  float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;

  if(uUseMouse > 0.5){
    vec2 mouseWorld = uMouse * uScale;
    float distToMouse = distance(s, mouseWorld);
    float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
    intensity += mouseInfluence;
    float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
    intensity += ripple;
  }

  if(uUsePageLoadAnimation > 0.5){
    float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
    float cellDelay  = cellRandom * 0.8;
    float cellProg   = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
    float fadeAlpha   = smoothstep(0.0, 1.0, cellProg);
    intensity *= fadeAlpha;
  }

  p = fract(p);
  p *= uDigitSize;

  float px5 = p.x * 5.0;
  float py5 = (1.0 - p.y) * 5.0;
  float x   = fract(px5);
  float y   = fract(py5);

  float i = floor(py5) - 2.0;
  float j = floor(px5) - 2.0;
  float n = i * i + j * j;
  float f = n * 0.0625;

  float isOn = step(0.1, intensity - f);
  float bright = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);

  return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * bright;
}

/* ── Flicker / Glitch helpers ────────────────────── */
float onOff(float a, float b, float c){
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}

float displace(vec2 look){
  float y = look.y - mod(iTime * 0.25, 1.0);
  float window1 = 1.0 / (1.0 + 50.0 * y * y);
  return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window1;
}

/* ── HSV → RGB for multi-color ───────────────────── */
vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

/* ── Color with multi-color tinting ──────────────── */
vec3 getColor(vec2 p){
  float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
  bar *= uScanlineIntensity;

  float displacement = displace(p);
  p.x += displacement;

  if(uGlitchAmount != 1.0){
    float extra = displacement * (uGlitchAmount - 1.0);
    p.x += extra;
  }

  float middle = digit(p);

  const float off = 0.002;
  float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
              digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
              digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));

  vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;

  /* ── MULTI-COLOR: rainbow hue based on position + time ── */
  float hue = fract(p.x * 0.15 + p.y * 0.1 + iTime * 0.08);
  vec3 rainbow = hsv2rgb(vec3(hue, 0.85, 1.0));
  baseColor *= rainbow;

  return baseColor;
}

/* ── Barrel Distortion ───────────────────────────── */
vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}

/* ── Main ────────────────────────────────────────── */
void main(){
  time = iTime * 0.333333;
  vec2 uv = vUv;

  if(uCurvature != 0.0){
    uv = barrel(uv);
  }

  vec2 p = uv * uScale;
  vec3 col = getColor(p);

  if(uChromaticAberration != 0.0){
    vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
    col.r = getColor(p + ca).r;
    col.b = getColor(p - ca).b;
  }

  col *= uBrightness;

  if(uDither > 0.0){
    float rnd = hash21(gl_FragCoord.xy);
    col += (rnd - 0.5) * (uDither * 0.003922);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;


/* ═══════════════════════════════════════════════════════════════
   WEBGL INIT — Vanilla port (no OGL dependency)
   ═══════════════════════════════════════════════════════════════ */

function initFaultyTerminal() {
    const container = document.getElementById('galaxy-canvas');
    // Replace the canvas placeholder with a container div
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    wrapper.id = 'terminal-wrapper';
    container.parentNode.replaceChild(wrapper, container);

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block;';
    wrapper.appendChild(canvas);

    // Allow mouse events to pass through but we track on document
    wrapper.style.pointerEvents = 'none';

    const gl = canvas.getContext('webgl', { alpha: false, premultipliedAlpha: false });
    if (!gl) {
        console.warn('WebGL not available, terminal background disabled');
        return;
    }
    gl.clearColor(0, 0, 0, 1);

    // ── Compile shaders ──
    function compileShader(src, type) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error('Shader error:', gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    }

    const vs = compileShader(vertexShader, gl.VERTEX_SHADER);
    const fs = compileShader(fragmentShader, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return;
    }
    gl.useProgram(program);

    // ── Full-screen triangle ──
    const positions = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const uvs       = new Float32Array([0, 0, 2, 0, 0, 2]);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const uvLoc = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    // ── Uniforms ──
    const u = {};
    const uniformNames = [
        'iTime', 'iResolution', 'uScale',
        'uGridMul', 'uDigitSize', 'uScanlineIntensity',
        'uGlitchAmount', 'uFlickerAmount', 'uNoiseAmp',
        'uChromaticAberration', 'uDither', 'uCurvature',
        'uMouse', 'uMouseStrength', 'uUseMouse',
        'uPageLoadProgress', 'uUsePageLoadAnimation', 'uBrightness'
    ];
    uniformNames.forEach(name => {
        u[name] = gl.getUniformLocation(program, name);
    });

    // ── Set static uniforms ──
    gl.uniform1f(u.uScale, TERMINAL_CONFIG.scale);
    gl.uniform2fv(u.uGridMul, new Float32Array(TERMINAL_CONFIG.gridMul));
    gl.uniform1f(u.uDigitSize, TERMINAL_CONFIG.digitSize);
    gl.uniform1f(u.uScanlineIntensity, TERMINAL_CONFIG.scanlineIntensity);
    gl.uniform1f(u.uGlitchAmount, TERMINAL_CONFIG.glitchAmount);
    gl.uniform1f(u.uFlickerAmount, TERMINAL_CONFIG.flickerAmount);
    gl.uniform1f(u.uNoiseAmp, TERMINAL_CONFIG.noiseAmp);
    gl.uniform1f(u.uChromaticAberration, TERMINAL_CONFIG.chromaticAberration);
    gl.uniform1f(u.uDither, TERMINAL_CONFIG.dither);
    gl.uniform1f(u.uCurvature, TERMINAL_CONFIG.curvature);
    gl.uniform1f(u.uMouseStrength, TERMINAL_CONFIG.mouseStrength);
    gl.uniform1f(u.uUseMouse, TERMINAL_CONFIG.mouseReact ? 1.0 : 0.0);
    gl.uniform1f(u.uUsePageLoadAnimation, TERMINAL_CONFIG.pageLoadAnimation ? 1.0 : 0.0);
    gl.uniform1f(u.uPageLoadProgress, TERMINAL_CONFIG.pageLoadAnimation ? 0.0 : 1.0);
    gl.uniform1f(u.uBrightness, TERMINAL_CONFIG.brightness);

    // ── Mouse tracking ──
    const targetMouse = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };

    document.addEventListener('mousemove', (e) => {
        // Map mouse position relative to viewport
        targetMouse.x = e.clientX / window.innerWidth;
        targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
    });

    // ── Resize handler ──
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
        canvas.width  = wrapper.offsetWidth  * dpr;
        canvas.height = wrapper.offsetHeight * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform3f(u.iResolution, canvas.width, canvas.height, canvas.width / canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    // ── Page-load animation state ──
    let loadAnimationStart = 0;
    const animationDuration = 2000; // ms
    const timeOffset = Math.random() * 100;

    // ── Render loop ──
    function loop(t) {
        requestAnimationFrame(loop);

        // Page load animation
        if (TERMINAL_CONFIG.pageLoadAnimation && loadAnimationStart === 0) {
            loadAnimationStart = t;
        }
        if (TERMINAL_CONFIG.pageLoadAnimation && loadAnimationStart > 0) {
            const elapsed = t - loadAnimationStart;
            const progress = Math.min(elapsed / animationDuration, 1.0);
            gl.uniform1f(u.uPageLoadProgress, progress);
        }

        // Time
        const elapsed = (t * 0.001 + timeOffset) * TERMINAL_CONFIG.timeScale;
        gl.uniform1f(u.iTime, elapsed);

        // Smooth mouse
        const dampingFactor = 0.08;
        smoothMouse.x += (targetMouse.x - smoothMouse.x) * dampingFactor;
        smoothMouse.y += (targetMouse.y - smoothMouse.y) * dampingFactor;
        gl.uniform2f(u.uMouse, smoothMouse.x, smoothMouse.y);

        // Draw
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    requestAnimationFrame(loop);
}

// Initialize terminal background on load
initFaultyTerminal();


/* ═══════════════════════════════════════════════════════════════
   NAVBAR SCROLL EFFECT
   ═══════════════════════════════════════════════════════════════ */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


/* ═══════════════════════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════════════════════ */
const hamburger = document.getElementById("nav-hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
});

mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        hamburger.classList.remove("active");
    });
});


/* ═══════════════════════════════════════════════════════════════
   GSAP SCROLL ANIMATIONS
   ═══════════════════════════════════════════════════════════════ */
function initScrollAnimations() {
    // Hero entrance
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
        .from(".hero__badge", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" })
        .from(".hero__title", { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" }, "-=0.3")
        .from(".hero__subtitle", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.4")
        .from(".hero__cta-group", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.3")
        .from(".hero__trust", { opacity: 0, y: 15, duration: 0.5, ease: "power2.out" }, "-=0.2")
        .from(".hero__card--main", { opacity: 0, y: 40, scale: 0.95, duration: 0.8, ease: "back.out(1.2)" }, "-=0.4")
        .from(".hero__card--xp", { opacity: 0, x: 30, scale: 0.8, duration: 0.6, ease: "back.out(1.5)" }, "-=0.4")
        .from(".hero__card--streak", { opacity: 0, x: -30, scale: 0.8, duration: 0.6, ease: "back.out(1.5)" }, "-=0.3");

    // Feature cards
    gsap.utils.toArray(".feature-card").forEach((card, i) => {
        gsap.to(card, {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: i * 0.1,
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
        });
    });

    // Step cards
    gsap.utils.toArray(".step").forEach((step, i) => {
        gsap.to(step, {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: i * 0.15,
            scrollTrigger: { trigger: step, start: "top 85%", toggleActions: "play none none none" },
        });
    });

    // Stat cards
    gsap.utils.toArray(".stat-card").forEach((card, i) => {
        gsap.to(card, {
            opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: i * 0.1,
            scrollTrigger: {
                trigger: card, start: "top 85%", toggleActions: "play none none none",
                onEnter: () => animateCounter(card.querySelector(".stat-card__number")),
            },
        });
    });

    // Stage cards
    gsap.utils.toArray(".stage-card").forEach((card, i) => {
        gsap.to(card, {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: i * 0.12,
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
        });
    });

    // Testimonial cards
    gsap.utils.toArray(".testimonial-card").forEach((card, i) => {
        gsap.to(card, {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: i * 0.12,
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
        });
    });

    // Final CTA
    gsap.from(".final-cta__content", {
        opacity: 0, y: 40, scale: 0.97, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ".final-cta", start: "top 80%", toggleActions: "play none none none" },
    });
}


/* ═══════════════════════════════════════════════════════════════
   COUNTER ANIMATION
   ═══════════════════════════════════════════════════════════════ */
const animatedCounters = new Set();
function animateCounter(el) {
    if (!el || animatedCounters.has(el)) return;
    animatedCounters.add(el);
    const target = parseInt(el.dataset.target, 10);
    const obj = { val: 0 };
    gsap.to(obj, {
        val: target, duration: 1.5, ease: "power2.out",
        onUpdate() { el.textContent = Math.round(obj.val); },
    });
}


/* ═══════════════════════════════════════════════════════════════
   SMOOTH SCROLL FOR ANCHOR LINKS
   ═══════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: "smooth" });
        }
    });
});


/* ═══════════════════════════════════════════════════════════════
   PARALLAX on hero cards (desktop only)
   ═══════════════════════════════════════════════════════════════ */
if (window.innerWidth > 768) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    document.addEventListener("mousemove", e => {
        const nx = (e.clientX / W - 0.5) * 2;
        const ny = (e.clientY / H - 0.5) * 2;

        const mainCard = document.querySelector(".hero__card--main");
        const xpCard = document.querySelector(".hero__card--xp");
        const streakCard = document.querySelector(".hero__card--streak");

        if (mainCard) {
            gsap.to(mainCard, {
                x: nx * 8, y: ny * 6, rotationY: nx * 3, rotationX: -ny * 3,
                duration: 0.8, ease: "power2.out",
            });
        }
        if (xpCard) {
            gsap.to(xpCard, { x: nx * 15, y: ny * 10, duration: 1, ease: "power2.out" });
        }
        if (streakCard) {
            gsap.to(streakCard, { x: nx * -12, y: ny * 8, duration: 1.1, ease: "power2.out" });
        }
    });
}


/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
initScrollAnimations();
