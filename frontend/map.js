/* ═══════════════════════════════════════════════════════════════
   FinQuest — Candy-Crush-Style Map Engine  v3
   ───────────────────────────────────────────────────────────────
   PATH-FIRST approach: the winding curve is defined FIRST,
   then nodes are placed AT exact positions on the path.
   This guarantees perfect alignment.
   ═══════════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/* ── GAME STATE ─────────────────────────────────────────────── */
const G = {
    currentLevel: parseInt(localStorage.getItem("finquest_currentLevel")) || 0,
    xp: parseInt(localStorage.getItem("finquest_xp")) || 0, 
    streak: parseInt(localStorage.getItem("finquest_streak")) || 0, 
    gems: parseInt(localStorage.getItem("finquest_gems")) || 0,
    levels: [
        { id:0,  title:"What is Money?",       stage:1, stars:0, color:"green" },
        { id:1,  title:"Earning & Income",      stage:1, stars:0, color:"blue" },
        { id:2,  title:"Budgeting 101",         stage:1, stars:0, color:"teal" },
        { id:3,  title:"Saving Strategies",     stage:1, stars:0, color:"orange" },
        { id:4,  title:"Banking Basics",        stage:1, stars:0, color:"dark", boss:true },
        { id:5,  title:"Intro to Investing",    stage:2, stars:0, color:"green" },
        { id:6,  title:"Stocks & Bonds",        stage:2, stars:0, color:"blue" },
        { id:7,  title:"Compound Interest",     stage:2, stars:0, color:"teal" },
        { id:8,  title:"Risk & Return",         stage:2, stars:0, color:"orange" },
        { id:9,  title:"Portfolio Building",    stage:2, stars:0, color:"dark", boss:true },
        { id:10, title:"Understanding Debt",    stage:3, stars:0, color:"green" },
        { id:11, title:"Credit Scores",         stage:3, stars:0, color:"blue" },
        { id:12, title:"Tax Basics",            stage:3, stars:0, color:"teal" },
        { id:13, title:"Insurance 101",         stage:3, stars:0, color:"orange" },
        { id:14, title:"Financial Planning",    stage:3, stars:0, color:"dark", boss:true },
    ],
    stages: [
        { id:1, name:"Money Basics",          icon:"book" },
        { id:2, name:"Investing & Wealth",    icon:"chartUp" },
        { id:3, name:"Debt, Taxes & Planning",icon:"trophy" },
    ],
    status(id){ return id < this.currentLevel ? "completed" : id === this.currentLevel ? "current" : "locked" }
};

/* ── STAGE THEMES ───────────────────────────────────────────── */
const STAGE_THEMES = {
    1: { top:"#87CEEB", mid:"#8DD66D", bottom:"#5DAE3B", cloud:"rgba(255,255,255,.12)", ground:"#4CA02E", accent:"#58CC02", deco:["miniFlower","sun","sunflower","sparkle","clover","sprout"] },
    2: { top:"#B3E5FC", mid:"#F8BBD0", bottom:"#F48FB1", cloud:"rgba(255,182,193,.12)", ground:"#E91E90", accent:"#FF69B4", deco:["lightning","heart","rocket","arrowUp","ribbon","diamond"] },
    3: { top:"#81D4FA", mid:"#29B6F6", bottom:"#0277BD", cloud:"rgba(129,212,250,.1)",  ground:"#01579B", accent:"#1CB0F6", deco:["compass","gem","wave","anchor","shield","flag"] },
};

/* ── SVG ICONS ──────────────────────────────────────────────── */
const SVG = {
    check:   `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    lock:    `<svg viewBox="0 0 24 24" fill="rgba(255,255,255,.55)"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/></svg>`,
    star:    `<svg viewBox="0 0 24 24" fill="#FFD700"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    starOff: `<svg viewBox="0 0 24 24" fill="rgba(0,0,0,.12)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    crown:   `<svg viewBox="0 0 24 24" fill="#FFD700" filter="drop-shadow(0 2px 2px rgba(0,0,0,.3))"><path d="M5 16L3 5l5.5 5L12 3l3.5 7L21 5l-2 11H5z"/><rect x="5" y="17" width="14" height="3" rx="1"/></svg>`,
};

/* ── FULL SVG ICON LIBRARY (replaces all emojis) ───────────── */
const SVG_ICONS = {
    // ── Financial ──
    coin:       `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#D4920A" stroke-width="1.5"/><text x="12" y="16.5" text-anchor="middle" font-size="13" font-weight="bold" fill="#B07A00" font-family="sans-serif">$</text></svg>`,
    banknote:   `<svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" fill="#85BB65" stroke="#5D8A3C" stroke-width="1"/><circle cx="12" cy="12" r="3" fill="none" stroke="#5D8A3C" stroke-width="1"/><text x="12" y="14.5" text-anchor="middle" font-size="7" font-weight="bold" fill="#3D6A1C" font-family="sans-serif">$</text></svg>`,
    creditCard: `<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" fill="#4A90D9" stroke="#2E5FA1" stroke-width="1"/><rect x="2" y="8" width="20" height="3" fill="#2E5FA1"/><rect x="5" y="14" width="6" height="2" rx="1" fill="rgba(255,255,255,.5)"/></svg>`,
    bank:       `<svg viewBox="0 0 24 24" fill="#8B7355"><path d="M3 21h18v-2H3v2zm0-4h2v-5H3v5zm4 0h2v-5H7v5zm4 0h2v-5h-2v5zm4 0h2v-5h-2v5zm4 0h2v-5h-2v5zM2 9l10-7 10 7v2H2V9z"/></svg>`,
    chartUp:    `<svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    piggyBank:  `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="13" rx="8" ry="7" fill="#FFB6C1"/><circle cx="16" cy="11" r="1.2" fill="#333"/><path d="M20 13c1 0 2 1 2 2s-1 2-2 2" fill="none" stroke="#E91E63" stroke-width="1.5"/><path d="M8 18l-1 3h2l1-3m4 0l1 3h2l-1-3" fill="#FF8A80" stroke="#E91E63" stroke-width=".5"/><ellipse cx="10" cy="15" rx="2" ry="1.5" fill="#FF8A80"/><path d="M7 8c-1-3 2-5 5-5s6 2 5 5" fill="#FFB6C1" stroke="#E91E63" stroke-width=".5"/></svg>`,
    gem:        `<svg viewBox="0 0 24 24"><path d="M6 3h12l4 6-10 13L2 9z" fill="#1CB0F6" stroke="#0D8ECF" stroke-width="1"/><path d="M2 9h20M8.5 3 6 9l6 13M15.5 3 18 9l-6 13" fill="none" stroke="#0D8ECF" stroke-width=".8"/></svg>`,
    coinStack:  `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="18" rx="8" ry="3" fill="#FFD700" stroke="#D4920A" stroke-width="1"/><ellipse cx="12" cy="14" rx="8" ry="3" fill="#FFEB3B" stroke="#D4920A" stroke-width="1"/><ellipse cx="12" cy="10" rx="8" ry="3" fill="#FFF176" stroke="#D4920A" stroke-width="1"/></svg>`,
    barChart:   `<svg viewBox="0 0 24 24" fill="#7C4DFF"><rect x="4" y="12" width="4" height="8" rx="1"/><rect x="10" y="6" width="4" height="14" rx="1"/><rect x="16" y="9" width="4" height="11" rx="1"/></svg>`,
    dollarSign: `<svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    target:     `<svg viewBox="0 0 24 24" fill="none" stroke="#FF5722" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="#FF5722"/></svg>`,
    key:        `<svg viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="15" r="4"/><line x1="11.5" y1="11.5" x2="21" y2="2"/><line x1="18" y1="2" x2="21" y2="5"/></svg>`,
    // ── Stage icons ──
    book:       `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="17" y2="7"/><line x1="9" y1="11" x2="14" y2="11"/></svg>`,
    trophy:     `<svg viewBox="0 0 24 24" fill="#FFD700" stroke="#D4920A" stroke-width="1"><path d="M6 9V4h12v5a6 6 0 0 1-12 0z"/><path d="M6 5H3.5C2.67 5 2 5.67 2 6.5S2.67 8 3.5 8H6" fill="#FFEB3B"/><path d="M18 5h2.5c.83 0 1.5.67 1.5 1.5S21.33 8 20.5 8H18" fill="#FFEB3B"/><rect x="10" y="15" width="4" height="4"/><rect x="8" y="19" width="8" height="2" rx="1"/></svg>`,
    // ── Stage 1 decorations (nature) ──
    miniFlower: `<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="3" fill="#FF69B4"/><circle cx="17" cy="9" r="3" fill="#FF69B4"/><circle cx="15" cy="15" r="3" fill="#FF69B4"/><circle cx="9" cy="15" r="3" fill="#FF69B4"/><circle cx="7" cy="9" r="3" fill="#FF69B4"/><circle cx="12" cy="10" r="2.5" fill="#FFD700"/></svg>`,
    sun:        `<svg viewBox="0 0 24 24" fill="none" stroke="#FFC107" stroke-width="2"><circle cx="12" cy="12" r="5" fill="#FFEB3B"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    sunflower:  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="#5D4037"/><ellipse cx="12" cy="4" rx="2.5" ry="3" fill="#FFC107"/><ellipse cx="18" cy="7" rx="2.5" ry="3" fill="#FFC107" transform="rotate(45 18 7)"/><ellipse cx="20" cy="12" rx="3" ry="2.5" fill="#FFC107"/><ellipse cx="18" cy="17" rx="2.5" ry="3" fill="#FFC107" transform="rotate(-45 18 17)"/><ellipse cx="12" cy="20" rx="2.5" ry="3" fill="#FFC107"/><ellipse cx="6" cy="17" rx="2.5" ry="3" fill="#FFC107" transform="rotate(45 6 17)"/><ellipse cx="4" cy="12" rx="3" ry="2.5" fill="#FFC107"/><ellipse cx="6" cy="7" rx="2.5" ry="3" fill="#FFC107" transform="rotate(-45 6 7)"/></svg>`,
    sparkle:    `<svg viewBox="0 0 24 24" fill="#FFD700"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>`,
    clover:     `<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" fill="#4CAF50"/><circle cx="7" cy="13" r="4" fill="#66BB6A"/><circle cx="17" cy="13" r="4" fill="#43A047"/><line x1="12" y1="11" x2="12" y2="22" stroke="#2E7D32" stroke-width="2"/></svg>`,
    sprout:     `<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round"><path d="M12 20v-8" stroke="#4CAF50" stroke-width="2"/><path d="M12 12c-3-4-7-3-7 0s4 4 7 0z" fill="#81C784"/><path d="M12 12c3-4 7-3 7 0s-4 4-7 0z" fill="#66BB6A"/><line x1="7" y1="20" x2="17" y2="20" stroke="#795548" stroke-width="2"/></svg>`,
    // ── Stage 2 decorations (investing/growth) ──
    arrowUp:    `<svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
    heart:      `<svg viewBox="0 0 24 24" fill="#FF69B4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    diamond:    `<svg viewBox="0 0 24 24"><path d="M12 2L2 9l10 13L22 9z" fill="#CE82FF" stroke="#A855F7" stroke-width="1"/></svg>`,
    ribbon:     `<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5" fill="#FF69B4" stroke="#E91E63" stroke-width="1"/><path d="M7 12l-3 10 8-4 8 4-3-10" fill="#E91E63"/></svg>`,
    lightning:  `<svg viewBox="0 0 24 24" fill="#FFC107"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>`,
    rocket:     `<svg viewBox="0 0 24 24"><path d="M12 2C8 6 6 10 6 15l6 4 6-4c0-5-2-9-6-13z" fill="#FF7043" stroke="#BF360C" stroke-width="1"/><circle cx="12" cy="12" r="2" fill="#fff"/><path d="M6 15l-2 4 4-1m8 1l2 4-4-1" fill="#FFC107"/><path d="M10 19h4l-2 3z" fill="#F44336"/></svg>`,
    // ── Stage 3 decorations (planning/ocean) ──
    anchor:     `<svg viewBox="0 0 24 24" fill="none" stroke="#0277BD" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="21"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`,
    compass:    `<svg viewBox="0 0 24 24" fill="none" stroke="#0277BD" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" fill="#29B6F6"/></svg>`,
    wave:       `<svg viewBox="0 0 24 24" fill="none" stroke="#29B6F6" stroke-width="2" stroke-linecap="round"><path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/><path d="M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" opacity=".5"/></svg>`,
    shield:     `<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#29B6F6" stroke="#0277BD" stroke-width="1"/><path d="M9 12l2 2 4-4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
    flag:       `<svg viewBox="0 0 24 24"><line x1="4" y1="2" x2="4" y2="22" stroke="#01579B" stroke-width="2" stroke-linecap="round"/><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" fill="#0277BD"/></svg>`,
    // ── Characters ──
    investor:   `<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="4" fill="#FFB74D"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="#1565C0"/><rect x="9" y="13" width="6" height="3" rx="1" fill="#1E88E5"/><path d="M8 4h8l.5 1.5H7.5z" fill="#333"/><path d="M7.5 5.5h9v1h-9z" fill="#555"/></svg>`,
    piggy:      `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="13" rx="8" ry="7" fill="#FFB6C1"/><circle cx="16" cy="11" r="1.2" fill="#333"/><ellipse cx="10" cy="15" rx="2" ry="1.5" fill="#FF8A80"/><path d="M7 8c-1-3 2-5 5-5s6 2 5 5" fill="#FFB6C1" stroke="#E91E63" stroke-width=".8"/><path d="M20 13c1 0 2 1 2 2s-1 2-2 2" fill="none" stroke="#E91E63" stroke-width="1.5"/><path d="M8 18l-1 3h2l1-3m4 0l1 3h2l-1-3" fill="#FF8A80"/></svg>`,
    fox:        `<svg viewBox="0 0 24 24"><path d="M4 3l4 7h8l4-7" fill="#FF8A65"/><path d="M8 10c-3 0-5 3-5 6s3 5 9 5 9-2 9-5-2-6-5-6H8z" fill="#FF7043"/><circle cx="10" cy="13" r="1.2" fill="#333"/><circle cx="14" cy="13" r="1.2" fill="#333"/><polygon points="12 15 11 16.5 13 16.5" fill="#333"/><path d="M7 10c-1.5 0-3-1.5-3-3" fill="none" stroke="#fff" stroke-width="1"/><path d="M17 10c1.5 0 3-1.5 3-3" fill="none" stroke="#fff" stroke-width="1"/></svg>`,
};

/** Render an SVG icon by key name, returns HTML string */
function svgIconHTML(key, size){
    const svg = SVG_ICONS[key];
    if(!svg) return '';
    return `<span class="svg-icon" style="width:${size||16}px;height:${size||16}px;display:inline-block">${svg}</span>`;
}


/* ═══════════════════════════════════════════════════════════════
   MASTER WINDING PATH
   ─────────────────────────────────────────────────────────────
   Define control points for the S-curve, evaluate cubic beziers
   to get both the continuous path AND the exact node positions.
   ═══════════════════════════════════════════════════════════════ */
const MAP_W = 480;                         // px width of map
const PAD_X = 70;                          // horizontal padding
const NODE_SPACING_Y = 110;               // vertical distance between nodes
const HUD_OFFSET = 0;                     // no extra offset — map-inner CSS padding handles the HUD
const BANNER_H = 80;                      // stage banner height slot

// Winding X pattern (repeats every 5 nodes): center → right → mid-right → left → center
const X_PATTERN = [
    0.50 * MAP_W,  // center
    0.80 * MAP_W,  // far right
    0.65 * MAP_W,  // mid right
    0.20 * MAP_W,  // left
    0.50 * MAP_W,  // center (boss)
];

// Returns {nodePositions[], totalHeight, stageBannerPositions[]}
function computeLayout(){
    const nodes = [];
    const banners = [];
    let y = HUD_OFFSET + 30;
    let lastStage = 0;

    G.levels.forEach((lvl, i) => {
        // Stage banner insertion
        if(lvl.stage !== lastStage){
            lastStage = lvl.stage;
            y += (i === 0 ? 10 : 30); // extra gap between stages
            banners.push({ stage: lvl.stage, y: y + 10 });
            y += BANNER_H;
        }

        const localIdx = i % X_PATTERN.length;
        const x = X_PATTERN[localIdx];
        y += NODE_SPACING_Y;

        nodes.push({ x, y, level: lvl, idx: i });
    });

    return { nodes, banners, totalHeight: y + 120 };
}

// Build smooth cubic bezier path between two points
function bezierPath(from, to, steps){
    const pts = [];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    // Control points: gentle S-curve
    const cp1x = from.x;
    const cp1y = from.y + dy * 0.4;
    const cp2x = to.x;
    const cp2y = from.y + dy * 0.6;

    for(let t = 0; t <= 1; t += 1/steps){
        const it = 1 - t;
        const x = it*it*it*from.x + 3*it*it*t*cp1x + 3*it*t*t*cp2x + t*t*t*to.x;
        const y = it*it*it*from.y + 3*it*it*t*cp1y + 3*it*t*t*cp2y + t*t*t*to.y;
        pts.push({x, y});
    }
    return pts;
}


/* ═══════════════════════════════════════════════════════════════
   BACKGROUND CANVAS — per-stage gradient bands
   ═══════════════════════════════════════════════════════════════ */
const bgCanvas  = document.getElementById("bg-canvas");
const bgCtx     = bgCanvas.getContext("2d");
let stageBands  = [];

function computeStageBands(layout, canvasH){
    const bands = [];
    let curStage = 1, bandStart = 0;
    layout.nodes.forEach(n => {
        if(n.level.stage !== curStage){
            bands.push({ y0: bandStart, y1: n.y - NODE_SPACING_Y/2, stage: curStage });
            curStage = n.level.stage;
            bandStart = n.y - NODE_SPACING_Y/2;
        }
    });
    // Extend last band to full canvas height to prevent dark gap at bottom
    const endY = canvasH || layout.totalHeight;
    bands.push({ y0: bandStart, y1: endY, stage: curStage });
    stageBands = bands;
}

function drawFullBackground(layout){
    const W = bgCanvas.width, H = bgCanvas.height;
    bgCtx.clearRect(0,0,W,H);

    stageBands.forEach(band => {
        const theme = STAGE_THEMES[band.stage];
        const h = band.y1 - band.y0;
        const grad = bgCtx.createLinearGradient(0, band.y0, 0, band.y1);
        grad.addColorStop(0,   theme.top);
        grad.addColorStop(0.3, theme.mid);
        grad.addColorStop(0.7, theme.mid);
        grad.addColorStop(1,   theme.bottom);
        bgCtx.fillStyle = grad;
        bgCtx.fillRect(0, band.y0, W, h);

        // Cloud shapes
        bgCtx.fillStyle = theme.cloud;
        for(let c = 0; c < 4; c++){
            const cx = W * (c + 0.5) / 4 + Math.sin(band.stage*3+c)*40;
            const cy = band.y0 + h * 0.1 + Math.cos(band.stage*2+c)*30;
            drawCloud(bgCtx, cx, cy, 50 + Math.random()*35);
        }

        // Subtle dots
        bgCtx.globalAlpha = 1;
        for(let d = 0; d < h/20; d++){
            bgCtx.beginPath();
            bgCtx.arc(Math.random()*W, band.y0+Math.random()*h, 1+Math.random()*2.5, 0, Math.PI*2);
            bgCtx.fillStyle = `rgba(255,255,255,${0.04+Math.random()*0.06})`;
            bgCtx.fill();
        }
    });

    // Smooth blend transitions between stages
    for(let i = 1; i < stageBands.length; i++){
        const y = stageBands[i].y0;
        const bH = 100;
        const prev = STAGE_THEMES[stageBands[i-1].stage];
        const next = STAGE_THEMES[stageBands[i].stage];
        const grad = bgCtx.createLinearGradient(0, y - bH/2, 0, y + bH/2);
        grad.addColorStop(0, prev.bottom);
        grad.addColorStop(1, next.top);
        bgCtx.fillStyle = grad;
        bgCtx.fillRect(0, y - bH/2, W, bH);
    }
}

function drawCloud(ctx, x, y, w){
    ctx.beginPath(); ctx.ellipse(x, y, w, w*0.4, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x-w*.5, y+5, w*.55, w*.35, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+w*.45, y+3, w*.5, w*.3, 0, 0, Math.PI*2); ctx.fill();
}


/* ═══════════════════════════════════════════════════════════════
   CANDY-STRIPE PATH CANVAS
   ═══════════════════════════════════════════════════════════════ */
const pathCanvas = document.getElementById("path-canvas");
const pathCtx    = pathCanvas.getContext("2d");

function drawAllPaths(layout){
    const W = pathCanvas.width, H = pathCanvas.height;
    pathCtx.clearRect(0, 0, W, H);

    for(let i = 0; i < layout.nodes.length - 1; i++){
        const from = layout.nodes[i];
        const to   = layout.nodes[i+1];
        const status = G.status(to.level.id);
        const pts  = bezierPath(from, to, 80);
        drawStripe(pathCtx, pts, status);
    }
}

function drawStripe(ctx, path, status){
    const isActive = status === "completed" || status === "current";
    const W = 16;

    // Shadow
    ctx.save();
    ctx.strokeStyle = isActive ? "rgba(200,50,120,.22)" : "rgba(0,0,0,.05)";
    ctx.lineWidth = W + 6; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y + 4);
    for(let i=1;i<path.length;i++) ctx.lineTo(path[i].x, path[i].y + 4);
    ctx.stroke(); ctx.restore();

    // Base
    ctx.save();
    ctx.strokeStyle = isActive ? "#FFD1DC" : "#ddd";
    ctx.lineWidth = W; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y);
    for(let i=1;i<path.length;i++) ctx.lineTo(path[i].x, path[i].y);
    ctx.stroke(); ctx.restore();

    // Stripes
    let dist = 0;
    ctx.save(); ctx.lineCap = "round"; ctx.lineWidth = W - 3;
    for(let i = 1; i < path.length; i++){
        const sx = path[i].x - path[i-1].x, sy = path[i].y - path[i-1].y;
        dist += Math.sqrt(sx*sx + sy*sy);
        const stripe = Math.floor(dist / 14) % 2 === 0;
        if(isActive){
            ctx.strokeStyle = stripe ? "#FF69B4" : "#FFB6C1";
            ctx.globalAlpha = stripe ? 0.7 : 0.35;
        } else {
            ctx.strokeStyle = stripe ? "#bbb" : "#d5d5d5";
            ctx.globalAlpha = stripe ? 0.5 : 0.25;
        }
        ctx.beginPath();
        ctx.moveTo(path[i-1].x, path[i-1].y);
        ctx.lineTo(path[i].x, path[i].y);
        ctx.stroke();
    }
    ctx.restore();

    // Highlight
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.22)";
    ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(path[0].x - 2, path[0].y - 2);
    for(let i=1;i<path.length;i++) ctx.lineTo(path[i].x - 2, path[i].y - 2);
    ctx.stroke(); ctx.restore();

    // Locked dashes
    if(status === "locked"){
        ctx.save();
        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = "rgba(120,120,120,.12)"; ctx.lineWidth = 2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y);
        for(let i=1;i<path.length;i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.stroke(); ctx.restore();
    }

    // Stars along active path
    if(isActive){
        let sd = 0;
        for(let i=1;i<path.length;i++){
            const sx = path[i].x-path[i-1].x, sy = path[i].y-path[i-1].y;
            sd += Math.sqrt(sx*sx+sy*sy);
            if(sd > 55){ sd = 0;
                ctx.save(); ctx.translate(path[i].x+(Math.random()-.5)*18, path[i].y+(Math.random()-.5)*18);
                ctx.fillStyle = "#FFD700"; ctx.globalAlpha = 0.25+Math.random()*.15;
                drawStarShape(ctx, 3+Math.random()*2.5, 5);
                ctx.restore();
            }
        }
    }
}

function drawStarShape(ctx, r, points){
    ctx.beginPath();
    for(let i=0;i<points*2;i++){
        const a = (i*Math.PI)/points - Math.PI/2;
        const rad = i%2===0 ? r : r*0.45;
        if(i===0) ctx.moveTo(Math.cos(a)*rad, Math.sin(a)*rad);
        else      ctx.lineTo(Math.cos(a)*rad, Math.sin(a)*rad);
    }
    ctx.closePath(); ctx.fill();
}


/* ═══════════════════════════════════════════════════════════════
   DOM RENDERING  — nodes placed at exact path coordinates
   ═══════════════════════════════════════════════════════════════ */
function renderMap(layout){
    const inner = document.getElementById("map-inner");
    // Preserve path canvas — remove it before clearing, then re-append
    const pc = document.getElementById("path-canvas");
    if(pc && pc.parentNode === inner) inner.removeChild(pc);
    inner.innerHTML = "";
    if(pc) inner.appendChild(pc);
    inner.style.height = layout.totalHeight + "px";

    // Stage banners
    layout.banners.forEach(b => {
        const banner = document.createElement("div");
        banner.className = `stage-banner stage-banner--${b.stage}`;
        banner.style.position = "absolute";
        banner.style.left = "50%";
        banner.style.transform = "translateX(-50%)";
        banner.style.top = b.y + "px";
        banner.innerHTML = `<div class="stage-banner__ribbon">${G.stages[b.stage-1].icon} ${G.stages[b.stage-1].name}</div>`;
        inner.appendChild(banner);
    });

    // Nodes — placed at exact computed coordinates
    layout.nodes.forEach(n => {
        const level  = n.level;
        const status = G.status(level.id);

        const wrap = document.createElement("div");
        wrap.className = `node-wrap ${status === "locked" ? "node-wrap--locked" : ""}`;
        wrap.style.left = n.x + "px";
        wrap.style.top  = n.y + "px";
        wrap.dataset.level  = level.id;
        wrap.dataset.status = status;

        const node  = document.createElement("div");
        const label = document.createElement("div");

        if(status === "completed"){
            const boss = level.boss ? " node--boss" : "";
            node.className = `node node--completed c-${level.color}${boss}`;
            node.innerHTML = `
                <span>${level.id+1}</span>
                <div class="node__check">${SVG.check}</div>
                ${level.boss ? `<div class="node__crown">${SVG.crown}</div>` : ""}
                ${level.stars > 0 ? starsHTML(level.stars) : ""}
            `;
            wrap.addEventListener("click", () => openModal(level, status));
            label.className = "node-label";
            label.textContent = level.title;
        } else if(status === "current"){
            node.className = "node node--current";
            node.innerHTML = `
                <span>${level.id+1}</span>
                <div class="node__ring"></div>
                <div class="node__ring node__ring--2"></div>
            `;
            wrap.addEventListener("click", () => openModal(level, status));
            label.className = "node-label node-label--active";
            label.textContent = level.title;
        } else {
            node.className = "node node--locked";
            node.innerHTML = `<div class="node__lock">${SVG.lock}</div>`;
            label.className = "node-label";
            label.textContent = level.title;
        }

        wrap.appendChild(node);
        wrap.appendChild(label);
        inner.appendChild(wrap);
    });

    // Scatter decorations
    addDecorations(inner, layout);

    // Financial-themed floating decorations
    addFinancialDecorations(inner, layout);

    // Animated mascots that walk along the path
    addPathCharacters(inner, layout);
}

function starsHTML(n){
    let h = '<div class="node__stars">';
    for(let i=0;i<3;i++) h += i < n ? SVG.star : SVG.starOff;
    return h + '</div>';
}

function addDecorations(container, layout){
    layout.nodes.forEach(n => {
        const theme = STAGE_THEMES[n.level.stage];
        const count = 1 + Math.floor(Math.random()*3);
        for(let d=0;d<count;d++){
            const el = document.createElement("div");
            el.className = "deco";
            el.style.left     = (n.x + (Math.random()-.5)*MAP_W*0.6) + "px";
            el.style.top      = (n.y + (Math.random()-.5)*80) + "px";
            el.style.opacity  = 0.25 + Math.random()*0.35;
            const iconKey = theme.deco[Math.floor(Math.random()*theme.deco.length)];
            const iconSize = 10 + Math.floor(Math.random()*16);
            el.innerHTML = svgIconHTML(iconKey, iconSize);
            container.appendChild(el);
        }
    });
}


/* ═══════════════════════════════════════════════════════════════
   FINANCIAL DECORATIONS — floating money-themed elements
   ═══════════════════════════════════════════════════════════════ */
const FIN_ITEMS = [
    { icon:'coin',       w:3 }, { icon:'banknote',   w:3 }, { icon:'creditCard', w:2 },
    { icon:'bank',       w:1 }, { icon:'chartUp',    w:2 }, { icon:'piggyBank',  w:2 },
    { icon:'gem',        w:2 }, { icon:'coinStack',  w:3 }, { icon:'barChart',   w:1 },
    { icon:'dollarSign', w:2 }, { icon:'target',     w:1 }, { icon:'key',        w:1 },
];

function pickFinIcon(size){
    const total = FIN_ITEMS.reduce((s,i) => s + i.w, 0);
    let r = Math.random() * total;
    for(const item of FIN_ITEMS){ r -= item.w; if(r <= 0) return svgIconHTML(item.icon, size || 20); }
    return svgIconHTML(FIN_ITEMS[0].icon, size || 20);
}

function addFinancialDecorations(container, layout){
    const count = Math.min(35, 15 + Math.floor(layout.totalHeight / 200));

    for(let i = 0; i < count; i++){
        const el = document.createElement('div');
        el.className = 'fin-deco';
        const iconSize = 14 + Math.floor(Math.random() * 16);
        el.innerHTML = pickFinIcon(iconSize);

        // Random position, avoid overlapping nodes
        let x, y, attempts = 0;
        do {
            x = 15 + Math.random() * (MAP_W - 30);
            y = 30 + Math.random() * (layout.totalHeight - 60);
            attempts++;
        } while(attempts < 20 && layout.nodes.some(n => {
            const dx = n.x - x, dy = n.y - y;
            return Math.sqrt(dx*dx + dy*dy) < 55;
        }));

        el.style.left = x + 'px';
        el.style.top  = y + 'px';
        container.appendChild(el);

        const baseOp = 0.12 + Math.random() * 0.18;
        gsap.set(el, { opacity: baseOp });

        // Three animation styles for variety
        const style = Math.floor(Math.random() * 3);

        if(style === 0){
            // Gentle float
            gsap.to(el, {
                y: `+=${6 + Math.random()*12}`,
                x: `+=${(Math.random()-.5)*14}`,
                rotation: (Math.random()-.5)*20,
                duration: 3 + Math.random()*3,
                ease:'sine.inOut', yoyo:true, repeat:-1,
                delay: Math.random()*4,
            });
        } else if(style === 1){
            // Pulse glow
            gsap.to(el, {
                opacity: baseOp + 0.15, scale: 1.25,
                duration: 1.5 + Math.random()*2,
                ease:'sine.inOut', yoyo:true, repeat:-1,
                delay: Math.random()*3,
            });
            gsap.to(el, {
                y: `+=${4 + Math.random()*8}`,
                duration: 2.5 + Math.random()*2,
                ease:'sine.inOut', yoyo:true, repeat:-1,
            });
        } else {
            // Rising bubbles
            gsap.to(el, {
                y: `-=${20 + Math.random()*30}`,
                opacity: 0,
                duration: 4 + Math.random()*4,
                ease:'power1.out',
                repeat:-1,
                repeatDelay: 2 + Math.random()*4,
                onRepeat(){ gsap.set(el, { opacity: baseOp }) },
            });
            gsap.to(el, {
                x: `+=${(Math.random()-.5)*30}`,
                duration: 3 + Math.random()*2,
                ease:'sine.inOut', yoyo:true, repeat:-1,
            });
        }
    }

    // Gold coin sparkles near completed nodes
    layout.nodes.forEach(n => {
        if(G.status(n.level.id) !== 'completed') return;
        for(let c = 0; c < 3; c++){
            const coin = document.createElement('div');
            coin.className = 'fin-coin';
            coin.style.left = (n.x + (Math.random()-.5)*80) + 'px';
            coin.style.top  = (n.y - 10 + Math.random()*20) + 'px';
            container.appendChild(coin);

            gsap.set(coin, { opacity: 0.5 + Math.random()*0.3 });
            gsap.to(coin, {
                y: -(20 + Math.random()*25),
                opacity: 0, scale: 0.4,
                duration: 1.5 + Math.random()*2,
                ease:'power1.out',
                repeat:-1,
                repeatDelay: 2 + Math.random()*5,
            });
        }
    });

    // Profit arrows near boss nodes
    layout.nodes.forEach(n => {
        if(!n.level.boss) return;
        for(let a = 0; a < 2; a++){
            const arrow = document.createElement('div');
            arrow.className = 'fin-arrow';
            arrow.innerHTML = svgIconHTML('chartUp', 22);
            arrow.style.left = (n.x + (a === 0 ? -60 : 60)) + 'px';
            arrow.style.top  = n.y + 'px';
            container.appendChild(arrow);

            gsap.to(arrow, {
                y: -15, opacity: 0.5,
                duration: 1.8 + Math.random(),
                ease:'sine.inOut', yoyo:true, repeat:-1,
            });
            gsap.to(arrow, {
                rotation: (a === 0 ? -15 : 15),
                duration: 2, ease:'sine.inOut', yoyo:true, repeat:-1,
            });
        }
    });
}


/* ═══════════════════════════════════════════════════════════════
   PATH CHARACTERS — animated mascots that walk the map
   ═══════════════════════════════════════════════════════════════ */
function addPathCharacters(container, layout){
    const mascots = [
        { icon:'investor', size:30, dur:14, label:'Investor' },
        { icon:'piggy',    size:26, dur:18, label:'Piggy' },
        { icon:'fox',      size:24, dur:11, label:'Trader' },
    ];

    // Build full bezier path from all nodes
    const allPts = [];
    for(let i = 0; i < layout.nodes.length - 1; i++){
        const pts = bezierPath(layout.nodes[i], layout.nodes[i+1], 60);
        if(i > 0) pts.shift();   // avoid duplicate junction point
        allPts.push(...pts);
    }
    if(allPts.length < 20) return;

    mascots.forEach((m, mi) => {
        const el = document.createElement('div');
        el.className = 'path-character';
        el.innerHTML = `
            <div class="path-character__shadow"></div>
            <span class="path-character__emoji">${svgIconHTML(m.icon, m.size)}</span>
            <span class="path-character__label">${m.label}</span>
        `;
        container.appendChild(el);

        const emojiSpan = el.querySelector('.path-character__emoji');

        // Smooth path-following via GSAP progress tween
        const prog = { t: mi * 0.25 }; // stagger start positions
        gsap.to(prog, {
            t: 1,
            duration: m.dur,
            ease: 'none',
            repeat: -1,
            yoyo: true,
            delay: mi * 2,
            onUpdate(){
                const maxIdx = allPts.length - 1;
                const rawIdx = prog.t * maxIdx;
                const idx = Math.min(Math.floor(rawIdx), maxIdx - 1);
                const frac = rawIdx - idx;
                const p1 = allPts[idx];
                const p2 = allPts[Math.min(idx + 1, maxIdx)];

                const px = p1.x + (p2.x - p1.x) * frac;
                const py = p1.y + (p2.y - p1.y) * frac;

                gsap.set(el, { left: px, top: py });

                // Flip emoji based on horizontal direction
                const scaleX = p2.x < p1.x ? -1 : 1;
                gsap.set(emojiSpan, { scaleX });
            }
        });

        // Continuous bounce on the emoji
        gsap.to(emojiSpan, {
            y: -7,
            duration: 0.3 + mi * 0.05,
            ease:'sine.inOut',
            yoyo:true, repeat:-1,
        });

        // Subtle shadow pulse
        const shadow = el.querySelector('.path-character__shadow');
        gsap.to(shadow, {
            scaleX: 1.3, opacity: 0.12,
            duration: 0.3 + mi * 0.05,
            ease:'sine.inOut',
            yoyo:true, repeat:-1,
        });
    });
}


/* ═══════════════════════════════════════════════════════════════
   GSAP ANIMATIONS
   ═══════════════════════════════════════════════════════════════ */
function animateNodes(){
    gsap.from(".node-wrap", {
        scale: 0, opacity: 0,
        duration: 0.6, ease: "back.out(1.7)",
        stagger: { each: 0.07, from: "end" },
    });
    gsap.from(".stage-banner", {
        y: -30, opacity: 0,
        duration: 0.8, ease: "elastic.out(1, .5)",
        stagger: 0.12, delay: 0.3,
    });
    const cur = document.querySelector(".node--current");
    if(cur) gsap.to(cur, { y: -8, duration:.8, ease:"sine.inOut", yoyo:true, repeat:-1 });

    document.querySelectorAll(".node--completed").forEach(n => {
        n.addEventListener("mouseenter", () => gsap.to(n, { scale:1.15, y:-5, duration:.25, ease:"back.out(2)" }));
        n.addEventListener("mouseleave", () => gsap.to(n, { scale:1, y:0, duration:.3, ease:"power2.out" }));
    });
    document.querySelectorAll(".node--locked").forEach(n => {
        n.parentElement.addEventListener("click", () => {
            gsap.to(n, { x:6, duration:.07, yoyo:true, repeat:5, ease:"power1.inOut", onComplete(){ gsap.set(n,{x:0}) } });
        });
    });
    gsap.utils.toArray(".deco").forEach(d => {
        gsap.to(d, {
            y: `+=${5+Math.random()*8}`, x: `+=${(Math.random()-.5)*10}`,
            duration: 2+Math.random()*2, ease:"sine.inOut", yoyo:true, repeat:-1, delay:Math.random()*2,
        });
    });
}


/* ═══════════════════════════════════════════════════════════════
   VIEWPORT PARTICLES
   ═══════════════════════════════════════════════════════════════ */
const decoCanvas = document.getElementById("deco-canvas");
const decoCtx    = decoCanvas.getContext("2d");
let particles = [];

function resizeDecoCanvas(){
    decoCanvas.width  = window.innerWidth;
    decoCanvas.height = window.innerHeight;
}
function spawnParticles(){
    particles = [];
    const w = decoCanvas.width, h = decoCanvas.height;
    for(let i=0; i < (w<500?16:30); i++){
        particles.push({
            type:["sparkle","coin","butterfly","heart"][Math.floor(Math.random()*4)],
            x:Math.random()*w, y:Math.random()*h,
            vx:(Math.random()-.5)*.5, vy:-(0.12+Math.random()*.35),
            size:3+Math.random()*5, opacity:0.12+Math.random()*.3,
            phase:Math.random()*Math.PI*2, speed:.015+Math.random()*.02,
            rot:Math.random()*Math.PI*2, rotV:(Math.random()-.5)*.03,
        });
    }
}
function tickParticles(time){
    decoCtx.clearRect(0,0,decoCanvas.width,decoCanvas.height);
    particles.forEach(p => {
        p.x += p.vx + Math.sin(time*p.speed+p.phase)*.2;
        p.y += p.vy; p.rot += p.rotV;
        if(p.y<-20){p.y=decoCanvas.height+10;p.x=Math.random()*decoCanvas.width}
        if(p.x<-20)p.x=decoCanvas.width+10;
        if(p.x>decoCanvas.width+20)p.x=-10;
        decoCtx.save();decoCtx.translate(p.x,p.y);decoCtx.rotate(p.rot);
        decoCtx.globalAlpha=p.opacity*(.5+.5*Math.sin(time*.003+p.phase));
        if(p.type==="sparkle")drawSparkle(decoCtx,p.size);
        else if(p.type==="coin")drawCoinP(decoCtx,p.size);
        else if(p.type==="butterfly")drawBfly(decoCtx,p.size,time);
        else drawHeartP(decoCtx,p.size);
        decoCtx.restore();
    });
}
function drawSparkle(c,s){c.fillStyle="#fff";c.shadowColor="#fff";c.shadowBlur=s*2;for(let i=0;i<4;i++){c.save();c.rotate(i*Math.PI/4);c.fillRect(-.5,-s,1,s*2);c.restore()}c.shadowBlur=0}
function drawCoinP(c,s){c.beginPath();c.arc(0,0,s,0,Math.PI*2);const g=c.createRadialGradient(-s*.3,-s*.3,0,0,0,s);g.addColorStop(0,"#FFE082");g.addColorStop(1,"#FFA000");c.fillStyle=g;c.fill();c.strokeStyle="#D4920A";c.lineWidth=1;c.stroke();c.fillStyle="#D4920A";c.font=`bold ${s}px sans-serif`;c.textAlign="center";c.textBaseline="middle";c.fillText("$",0,0)}
function drawBfly(c,s,t){const wa=Math.sin(t*.008)*.4;const col=["#FF69B4","#CE82FF","#FF9800","#4FC3F7"][Math.floor(Math.abs(s*100)%4)];c.save();c.scale(Math.cos(wa),1);c.beginPath();c.ellipse(-s*.6,0,s*.8,s*.5,-.3,0,Math.PI*2);c.fillStyle=col;c.globalAlpha*=.7;c.fill();c.restore();c.save();c.scale(Math.cos(-wa),1);c.beginPath();c.ellipse(s*.6,0,s*.8,s*.5,.3,0,Math.PI*2);c.fillStyle=col;c.globalAlpha*=.7;c.fill();c.restore();c.beginPath();c.ellipse(0,0,s*.15,s*.5,0,0,Math.PI*2);c.fillStyle="#333";c.fill()}
function drawHeartP(c,s){c.beginPath();c.moveTo(0,s*.3);c.bezierCurveTo(-s,-s*.5,-s*.5,-s,0,-s*.4);c.bezierCurveTo(s*.5,-s,s,-s*.5,0,s*.3);c.fillStyle="#FF69B4";c.fill()}


/* ═══════════════════════════════════════════════════════════════
   MODAL
   ═══════════════════════════════════════════════════════════════ */
function openModal(level, status){
    const o = document.getElementById("level-modal");
    document.getElementById("modal-title").textContent = `Level ${level.id+1}`;
    document.getElementById("modal-desc").textContent = `${G.stages[level.stage-1].name} — ${level.title}`;
    document.getElementById("modal-node").textContent = level.id+1;
    let s = ""; const sc = status==="completed"?level.stars:0;
    for(let i=0;i<3;i++) s += i<sc?SVG.star:SVG.starOff;
    document.getElementById("modal-stars").innerHTML = s;
    const btn = document.getElementById("modal-start");
    btn.textContent = status==="completed"?"REPLAY":"START";
    btn.onclick = ()=>{ closeModal(); window.location.href=`lesson.html?level=${level.id}`; };
    o.classList.add("active");
    gsap.from("#modal-card",{scale:.7,y:50,duration:.5,ease:"back.out(1.7)"});
    gsap.from("#modal-node",{scale:0,rotation:-180,duration:.6,ease:"elastic.out(1,.5)",delay:.15});
    gsap.from(document.querySelectorAll("#modal-stars svg"),{scale:0,duration:.4,ease:"back.out(2)",stagger:.1,delay:.3});
}
function closeModal(){document.getElementById("level-modal").classList.remove("active")}
document.getElementById("level-modal").addEventListener("click",e=>{if(e.target===e.currentTarget)closeModal()});
document.getElementById("modal-close").addEventListener("click",closeModal);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});


/* ═══════════════════════════════════════════════════════════════
   HUD & LOOP
   ═══════════════════════════════════════════════════════════════ */
function updateHUD(){
    document.getElementById("streak-value").textContent = G.streak;
    document.getElementById("xp-value").textContent     = G.xp;
    document.getElementById("gems-value").textContent    = G.gems;
}
function loop(time){ tickParticles(time); requestAnimationFrame(loop); }


/* ═══════════════════════════════════════════════════════════════
   INIT — single source of truth for all positions
   ═══════════════════════════════════════════════════════════════ */
function fullBuild(){
    const layout = computeLayout();
    const scroll = document.getElementById("map-scroll");
    const inner  = document.getElementById("map-inner");

    // Move bg canvas into scroll container (background behind everything)
    scroll.insertBefore(bgCanvas, scroll.firstChild);
    bgCanvas.style.position = "absolute";
    bgCanvas.style.top = "0"; bgCanvas.style.left = "0";
    bgCanvas.style.width = "100%"; bgCanvas.style.pointerEvents = "none";
    bgCanvas.style.zIndex = "0";

    // Compute full height including map-inner's CSS padding
    const innerStyle = getComputedStyle(inner);
    const padTop = parseFloat(innerStyle.paddingTop) || 0;
    const padBot = parseFloat(innerStyle.paddingBottom) || 0;
    const fullH = layout.totalHeight + padTop + padBot;

    // Size bg canvas to cover entire scroll area
    bgCanvas.width  = MAP_W;
    bgCanvas.height = fullH;
    bgCanvas.style.height = fullH + "px";

    // Path canvas lives inside map-inner — same coordinate space as nodes
    pathCanvas.width  = MAP_W;
    pathCanvas.height = layout.totalHeight;
    pathCanvas.style.height = layout.totalHeight + "px";

    // Render everything using single layout
    computeStageBands(layout, fullH);
    drawFullBackground(layout);
    renderMap(layout);
    drawAllPaths(layout);
    animateNodes();

    // Scroll to current
    setTimeout(() => {
        const cur = document.querySelector('[data-status="current"]');
        if(cur) cur.scrollIntoView({ behavior:"smooth", block:"center" });
    }, 800);
}

window.addEventListener("resize", () => {
    resizeDecoCanvas(); spawnParticles();
    clearTimeout(window._r); window._r = setTimeout(fullBuild, 200);
});

document.addEventListener("DOMContentLoaded", () => {
    resizeDecoCanvas(); spawnParticles(); updateHUD();
    ScrollTrigger.defaults({ scroller: "#map-scroll" });
    requestAnimationFrame(() => setTimeout(fullBuild, 100));
    loop(0);

    // Reset Progress Button Interaction
    const resetBtn = document.getElementById("reset-progress-btn");
    if (resetBtn) {
        resetBtn.addEventListener("mousedown", () => {
            resetBtn.style.transform = "translateY(3px)";
            resetBtn.style.boxShadow = "0 0 0 #CC3D3D";
        });
        resetBtn.addEventListener("mouseup", () => {
            resetBtn.style.transform = "translateY(0)";
            resetBtn.style.boxShadow = "0 3px 0 #CC3D3D";
        });
        resetBtn.addEventListener("mouseleave", () => {
            resetBtn.style.transform = "translateY(0)";
            resetBtn.style.boxShadow = "0 3px 0 #CC3D3D";
        });
        resetBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to reset all your learning progress? This cannot be undone!")) {
                localStorage.removeItem("finquest_currentLevel");
                localStorage.removeItem("finquest_xp");
                localStorage.removeItem("finquest_streak");
                localStorage.removeItem("finquest_gems");
                localStorage.removeItem("finquest_weak_levels");
                location.reload();
            }
        });
    }
});
