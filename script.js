// ── EMAIL OBFUSCATION ─────────────────────────────────────────────────────────
const user = "carterqberry";
const domain = "gmail.com";
const email = user + "@" + domain;

document.getElementById("emailLink").href = "mailto:" + email;
document.getElementById("emailText").href = "mailto:" + email;
document.getElementById("emailText").textContent = email;

    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
        });
    }, { threshold: 0.08 });
    reveals.forEach(el => obs.observe(el));

    // Portfolio drag scroll
    const row = document.getElementById('portfolioRow');
    const thumb = document.getElementById('psThumb');
    const track = thumb.parentElement;
    let isDown = false, startX, scrollLeft;
    let thumbDown = false, thumbStartX, thumbStartScroll;

    function updateThumb() {
        const maxScroll = row.scrollWidth - row.clientWidth;
        if (maxScroll <= 0) return;
        const pct = row.scrollLeft / maxScroll;
        const maxLeft = track.clientWidth - thumb.clientWidth;
        thumb.style.left = (pct * maxLeft) + 'px';
    }

    // Row drag scroll
    row.addEventListener('mousedown', e => {
        isDown = true; startX = e.pageX - row.offsetLeft;
        scrollLeft = row.scrollLeft; row.style.userSelect = 'none';
        row.style.cursor = 'grabbing';
    });
    ['mouseleave','mouseup'].forEach(ev => row.addEventListener(ev, () => {
        isDown = false; row.style.userSelect = ''; row.style.cursor = '';
    }));
    row.addEventListener('mousemove', e => {
        if (!isDown) return; e.preventDefault();
        row.scrollLeft = scrollLeft - (e.pageX - row.offsetLeft - startX) * 1.4;
    });
    row.addEventListener('scroll', updateThumb);

    // Prevent thumb clicks from bubbling to the track click handler
    thumb.addEventListener('click', e => e.stopPropagation());

    // Thumb drag
    thumb.addEventListener('mousedown', e => {
        e.preventDefault(); e.stopPropagation();
        thumbDown = true;
        thumbStartX = e.pageX;
        thumbStartScroll = row.scrollLeft;
        thumb.style.transition = 'none';
        document.body.style.userSelect = 'none';
        thumb.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
        if (!thumbDown) return;
        const dx = e.pageX - thumbStartX;
        const maxLeft = track.clientWidth - thumb.clientWidth;
        const scrollRange = row.scrollWidth - row.clientWidth;
        row.scrollLeft = thumbStartScroll + (dx / maxLeft) * scrollRange;
    });
    document.addEventListener('mouseup', () => {
        if (!thumbDown) return;
        thumbDown = false;
        thumb.style.transition = '';
        document.body.style.userSelect = '';
        thumb.style.cursor = '';
    });

    // Track click to jump to position
    track.addEventListener('click', e => {
        if (e.target === thumb) return;
        const rect = track.getBoundingClientRect();
        const clickPct = (e.clientX - rect.left) / rect.width;
        const scrollRange = row.scrollWidth - row.clientWidth;
        row.scrollTo({ left: clickPct * scrollRange, behavior: 'smooth' });
    });

    // Header scroll state
    const hdr = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => {
        hdr.classList.toggle('scrolled', window.scrollY > 40);
    });

    // ── 3D GLOBE ──────────────────────────────────────────────────────────────
    (function() {
        const canvas = document.getElementById('globeCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const SIZE = 580;
        const R = SIZE / 2;
        canvas.width = SIZE; canvas.height = SIZE;

        const TW = 1024, TH = 512;

        // ── Helper ──
        function ll2tx(lon, lat) {
            return [(lon + 180) / 360 * TW, (90 - lat) / 180 * TH];
        }
        function texPoly(tc, rings, fill, stroke, lw) {
            tc.beginPath();
            for (const ring of rings) {
                ring.forEach(([lon, lat], i) => {
                    const [px, py] = ll2tx(lon, lat);
                    i === 0 ? tc.moveTo(px, py) : tc.lineTo(px, py);
                });
                tc.closePath();
            }
            if (fill)   { tc.fillStyle = fill; tc.fill('evenodd'); }
            if (stroke) { tc.strokeStyle = stroke; tc.lineWidth = lw||1.2; tc.stroke(); }
        }

        // ══════════════════════════════════════════════════════════
        // LAND TEXTURE
        // ══════════════════════════════════════════════════════════
        const tex = document.createElement('canvas');
        tex.width = TW; tex.height = TH;
        const tc = tex.getContext('2d');

        // Deep ocean
        const oceanG = tc.createLinearGradient(0,0,0,TH);
        oceanG.addColorStop(0,   '#1b4a70');
        oceanG.addColorStop(0.5, '#163d5e');
        oceanG.addColorStop(1,   '#0e2740');
        tc.fillStyle = oceanG;
        tc.fillRect(0, 0, TW, TH);

        const lF = 'rgba(58,155,78,0.88)';
        const lS = 'rgba(130,220,140,0.55)';
        const lW = 1.0;

        // ── North America ──
        texPoly(tc, [[
            [-168,72],[-163,70],[-156,72],[-148,70],[-140,60],[-138,58],[-134,56],
            [-130,54],[-126,50],[-124,46],[-124,38],[-118,34],[-110,24],[-106,20],
            [-98,20],[-94,18],[-90,18],[-86,20],[-84,24],[-80,26],[-80,32],
            [-76,34],[-74,38],[-70,42],[-66,44],[-60,46],[-56,48],[-58,52],
            [-62,56],[-66,60],[-68,64],[-70,68],[-68,72],[-80,74],[-100,76],
            [-120,74],[-140,70],[-152,68],[-160,68],[-165,66],[-168,64],[-168,72]
        ]], lF, lS, lW);
        texPoly(tc, [[[-172,64],[-168,62],[-164,60],[-160,58],[-156,58],[-152,58],[-150,60],[-152,62],[-156,64],[-160,65],[-165,66],[-168,66],[-172,64]]], lF, lS, lW);
        texPoly(tc, [[[-118,32],[-116,30],[-114,28],[-112,26],[-110,24],[-108,24],[-110,28],[-112,30],[-116,32],[-118,32]]], lF, lS, lW);
        texPoly(tc, [[[-90,18],[-88,16],[-86,14],[-84,10],[-80,8],[-78,8],[-80,10],[-82,12],[-84,14],[-86,16],[-88,18],[-90,18]]], lF, lS, lW);
        texPoly(tc, [[[-85,23],[-82,22],[-78,22],[-76,20],[-78,20],[-82,20],[-85,22],[-85,23]]], lF, lS, lW);
        texPoly(tc, [[[-58,76],[-46,78],[-34,82],[-22,84],[-18,78],[-20,74],[-26,70],[-36,68],[-46,68],[-54,70],[-58,74],[-58,76]]], 'rgba(210,230,250,0.7)', 'rgba(220,238,255,0.6)', 1);
        texPoly(tc, [[[-24,64],[-18,64],[-14,66],[-16,66],[-20,66],[-24,66],[-24,64]]], lF, lS, lW);

        // ── South America ──
        texPoly(tc, [[
            [-80,12],[-76,10],[-74,10],[-70,12],[-66,12],[-62,12],[-58,8],
            [-52,4],[-50,0],[-48,-4],[-44,-8],[-40,-10],[-36,-10],[-36,-14],
            [-40,-20],[-44,-24],[-48,-28],[-52,-32],[-56,-38],[-60,-42],
            [-64,-46],[-68,-52],[-72,-50],[-70,-44],[-68,-40],[-68,-34],
            [-72,-30],[-74,-24],[-74,-18],[-76,-14],[-78,-8],[-80,-4],
            [-80,0],[-80,6],[-80,10],[-80,12]
        ]], lF, lS, lW);

        // ── Europe ──
        texPoly(tc, [[
            [-10,36],[-6,36],[-2,38],[0,40],[2,42],[4,44],[8,44],[10,44],
            [14,44],[16,42],[20,40],[24,38],[26,40],[28,42],[30,44],[28,48],
            [26,52],[24,56],[22,58],[20,60],[18,62],[16,64],[14,68],[18,70],
            [22,70],[26,70],[28,68],[26,66],[24,64],[26,62],[28,60],[30,58],
            [28,56],[26,54],[22,54],[18,54],[14,54],[12,56],[10,58],[8,56],
            [6,54],[4,52],[2,50],[0,48],[-2,46],[-2,44],[-4,42],[-6,40],
            [-8,38],[-10,36]
        ]], lF, lS, lW);
        texPoly(tc, [[
            [4,58],[6,58],[8,58],[10,58],[12,58],[14,60],[16,62],[18,64],
            [20,66],[22,68],[24,70],[26,70],[28,70],[30,68],[28,66],[26,64],
            [24,62],[22,60],[20,58],[18,58],[16,58],[14,58],[12,58],[10,58],
            [8,58],[6,58],[4,58]
        ]], lF, lS, lW);
        texPoly(tc, [[[-6,50],[-4,50],[-2,52],[0,52],[0,54],[-2,56],[-4,58],[-6,58],[-6,56],[-4,54],[-4,52],[-6,52],[-6,50]]], lF, lS, lW);
        texPoly(tc, [[[-10,52],[-8,52],[-6,54],[-8,54],[-10,54],[-10,52]]], lF, lS, lW);

        // ── Africa ──
        texPoly(tc, [[
            [-18,16],[-16,20],[-14,24],[-10,28],[-6,30],[-2,32],[2,34],
            [8,38],[10,38],[12,36],[14,34],[16,34],[18,36],[20,38],[22,38],
            [24,36],[26,36],[28,34],[30,32],[32,30],[34,28],[36,24],[38,20],
            [40,14],[42,12],[44,10],[44,8],[42,4],[40,0],[38,-4],[38,-8],
            [36,-12],[34,-18],[30,-24],[26,-30],[22,-34],[18,-34],[14,-30],
            [12,-26],[10,-22],[8,-18],[6,-12],[4,-8],[2,-2],[0,4],[0,8],
            [-2,10],[-4,10],[-8,8],[-12,8],[-14,10],[-16,14],[-18,16]
        ]], lF, lS, lW);
        texPoly(tc, [[[44,-14],[46,-16],[48,-18],[50,-20],[50,-22],[48,-24],[46,-22],[44,-20],[44,-16],[44,-14]]], lF, lS, lW);

        // ── Asia ──
        texPoly(tc, [[
            [26,42],[28,42],[30,42],[34,38],[36,36],[38,36],[40,36],[42,38],
            [44,40],[46,42],[48,42],[50,40],[52,36],[54,32],[56,26],[58,22],
            [60,22],[62,22],[64,22],[66,24],[68,24],[70,22],[72,20],[74,16],
            [76,10],[78,8],[80,10],[80,14],[80,18],[78,20],[76,22],[76,28],
            [72,34],[68,36],[66,38],[64,40],[62,40],[60,38],[58,38],[56,40],
            [54,42],[52,44],[50,46],[48,48],[46,48],[44,46],[42,44],[40,44],
            [38,42],[36,42],[34,42],[32,42],[30,42],[28,42],[26,42]
        ]], lF, lS, lW);
        texPoly(tc, [[
            [26,68],[30,70],[40,70],[50,72],[60,74],[70,74],[80,74],[90,76],
            [100,76],[110,76],[120,74],[130,72],[140,70],[150,68],[160,64],
            [168,62],[168,56],[164,52],[160,48],[156,48],[152,48],[148,48],
            [144,46],[140,44],[136,42],[134,40],[130,38],[126,36],[124,32],
            [122,30],[120,28],[118,24],[116,22],[114,22],[112,22],[110,20],
            [108,18],[106,16],[104,14],[104,10],[106,10],[108,10],[110,12],
            [112,14],[114,16],[116,18],[118,22],[120,24],[122,30],[124,34],
            [126,38],[128,40],[130,42],[134,44],[138,44],[140,42],[142,46],
            [144,50],[144,54],[146,56],[148,58],[152,58],[156,54],[158,52],
            [160,54],[160,58],[158,62],[154,64],[150,66],[144,66],[138,64],
            [132,62],[126,60],[120,58],[114,56],[108,54],[104,54],[100,56],
            [94,58],[88,60],[82,60],[76,62],[70,68],[60,70],[50,68],[40,66],
            [34,64],[30,64],[26,66],[26,68]
        ]], lF, lS, lW);
        texPoly(tc, [[
            [66,24],[68,24],[70,22],[72,20],[74,18],[76,14],[78,10],[80,8],
            [80,10],[78,14],[78,18],[76,20],[74,22],[72,24],[70,24],[68,24],[66,24]
        ]], lF, lS, lW);
        texPoly(tc, [[[98,22],[100,20],[102,18],[104,12],[104,10],[106,10],[106,14],[104,18],[102,20],[100,22],[98,22]]], lF, lS, lW);
        texPoly(tc, [[[100,6],[102,4],[104,2],[104,4],[102,6],[100,8],[100,6]]], lF, lS, lW);
        texPoly(tc, [[[108,2],[110,4],[114,6],[116,6],[118,4],[118,2],[116,0],[114,-2],[110,0],[108,2]]], lF, lS, lW);
        texPoly(tc, [[[96,4],[98,4],[102,2],[106,0],[106,-4],[104,-4],[100,-2],[96,2],[96,4]]], lF, lS, lW);
        texPoly(tc, [[[106,-6],[108,-6],[112,-8],[114,-8],[110,-8],[106,-8],[106,-6]]], lF, lS, lW);
        texPoly(tc, [[[120,16],[122,16],[122,14],[120,12],[118,12],[118,14],[120,16]]], lF, lS, lW);
        texPoly(tc, [[[122,10],[124,10],[124,8],[122,8],[122,10]]], lF, lS, lW);
        texPoly(tc, [[[130,32],[132,34],[134,36],[136,38],[138,38],[140,40],[142,40],[140,38],[138,36],[136,34],[134,32],[132,32],[130,32]]], lF, lS, lW);
        texPoly(tc, [[[140,42],[142,44],[144,44],[144,42],[142,42],[140,42]]], lF, lS, lW);
        texPoly(tc, [[[144,44],[146,44],[146,42],[144,44]]], lF, lS, lW);
        texPoly(tc, [[[126,36],[128,36],[130,34],[128,34],[126,34],[126,36]]], lF, lS, lW);
        texPoly(tc, [[[80,8],[82,8],[82,6],[80,6],[80,8]]], lF, lS, lW);
        texPoly(tc, [[[120,26],[122,26],[122,24],[120,24],[120,26]]], lF, lS, lW);

        // ── Australia ──
        texPoly(tc, [[
            [114,-22],[116,-20],[118,-18],[122,-18],[126,-16],[130,-14],
            [132,-12],[136,-12],[138,-14],[140,-18],[142,-20],[144,-20],
            [146,-22],[148,-22],[150,-24],[152,-26],[154,-26],[154,-28],
            [152,-30],[150,-34],[148,-38],[146,-40],[144,-38],[142,-38],
            [140,-36],[136,-36],[132,-34],[130,-32],[126,-32],[122,-30],
            [118,-28],[116,-26],[114,-24],[114,-22]
        ]], lF, lS, lW);
        texPoly(tc, [[[144,-42],[146,-42],[146,-44],[144,-44],[144,-42]]], lF, lS, lW);
        texPoly(tc, [[[172,-36],[174,-36],[176,-38],[174,-40],[172,-38],[172,-36]]], lF, lS, lW);
        texPoly(tc, [[[168,-44],[170,-44],[172,-46],[170,-48],[168,-46],[168,-44]]], lF, lS, lW);

        // ── Antarctica ──
        const antY = TH * (90 - (-68)) / 180;
        const antG = tc.createLinearGradient(0, antY, 0, TH);
        antG.addColorStop(0, 'rgba(200,220,245,0.0)');
        antG.addColorStop(0.15, 'rgba(210,228,250,0.75)');
        antG.addColorStop(1, 'rgba(230,242,255,0.95)');
        tc.fillStyle = antG;
        tc.fillRect(0, antY, TW, TH - antY);

        const arcticY = TH * (90 - 75) / 180;
        const arcticG = tc.createLinearGradient(0, 0, 0, arcticY + 20);
        arcticG.addColorStop(0, 'rgba(220,236,255,0.9)');
        arcticG.addColorStop(1, 'rgba(200,224,248,0.0)');
        tc.fillStyle = arcticG;
        tc.fillRect(0, 0, TW, arcticY + 20);

        // ── Lat/lon grid ──
        tc.strokeStyle = 'rgba(255,255,255,0.06)';
        tc.lineWidth = 0.8;
        for (let lat = -60; lat <= 60; lat += 30) {
            const [,py] = ll2tx(0, lat);
            tc.beginPath(); tc.moveTo(0, py); tc.lineTo(TW, py); tc.stroke();
        }
        for (let lon = -150; lon <= 180; lon += 30) {
            const [px] = ll2tx(lon, 0);
            tc.beginPath(); tc.moveTo(px, 0); tc.lineTo(px, TH); tc.stroke();
        }

        const texData = tc.getImageData(0, 0, TW, TH).data;

        function sampleTex(lon, lat) {
            lon = ((lon % 360) + 360) % 360 - 180;
            let tx = Math.floor((lon + 180) / 360 * TW) % TW;
            let ty = Math.max(0, Math.min(TH - 1, Math.floor((90 - lat) / 180 * TH)));
            const i = (ty * TW + tx) * 4;
            return [texData[i], texData[i+1], texData[i+2]];
        }

        // ══════════════════════════════════════════════════════════
        // CLOUD NOISE
        // ══════════════════════════════════════════════════════════
        function hash3(x, y, z) {
            let h = Math.sin(x * 127.1 + y * 311.7 + z * 74.3) * 43758.545;
            h = h - Math.floor(h);
            return h;
        }
        function vnoise3(x, y, z) {
            const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
            const fx = x-ix, fy = y-iy, fz = z-iz;
            const ux = fx*fx*(3-2*fx), uy = fy*fy*(3-2*fy), uz = fz*fz*(3-2*fz);
            return (
                hash3(ix,   iy,   iz  ) * (1-ux)*(1-uy)*(1-uz) +
                hash3(ix+1, iy,   iz  ) *    ux *(1-uy)*(1-uz) +
                hash3(ix,   iy+1, iz  ) * (1-ux)*   uy *(1-uz) +
                hash3(ix+1, iy+1, iz  ) *    ux *   uy *(1-uz) +
                hash3(ix,   iy,   iz+1) * (1-ux)*(1-uy)*   uz  +
                hash3(ix+1, iy,   iz+1) *    ux *(1-uy)*   uz  +
                hash3(ix,   iy+1, iz+1) * (1-ux)*   uy *   uz  +
                hash3(ix+1, iy+1, iz+1) *    ux *   uy *   uz
            );
        }
        function fbm3(x, y, z) {
            let v = 0, amp = 0.5, freq = 1, max = 0;
            for (let i = 0; i < 6; i++) {
                v   += vnoise3(x*freq, y*freq, z*freq) * amp;
                max += amp;
                amp  *= 0.52;
                freq *= 2.1;
            }
            return v / max;
        }

        function cloudNoise(lonDeg, latDeg) {
            const phi = latDeg * Math.PI / 180;
            const lam = lonDeg * Math.PI / 180;
            const scale = 2.8;
            const sx = Math.cos(phi) * Math.cos(lam) * scale;
            const sy = Math.sin(phi)                 * scale;
            const sz = Math.cos(phi) * Math.sin(lam) * scale;
            const warp = 0.7;
            const wx = sx + fbm3(sx+1.7, sy+9.2, sz+3.4) * warp;
            const wy = sy + fbm3(sy+8.3, sz+2.8, sx+5.1) * warp;
            const wz = sz + fbm3(sz+5.1, sx+4.4, sy+7.6) * warp;
            return fbm3(wx, wy, wz);
        }

        const CW = 1024, CH = 512;
        const cloudBake = new Float32Array(CW * CH);
        for (let cy2 = 0; cy2 < CH; cy2++) {
            const lat = 90 - cy2 / CH * 180;
            for (let cx2 = 0; cx2 < CW; cx2++) {
                const lon = cx2 / CW * 360 - 180;
                let n = cloudNoise(lon, lat);
                const t = Math.max(0, (n - 0.46) / 0.30);
                cloudBake[cy2 * CW + cx2] = Math.min(1, t * t * 1.9);
            }
        }

        function sampleCloud(lon, lat) {
            lon = ((lon % 360) + 360) % 360 - 180;
            const tx = Math.floor((lon + 180) / 360 * CW) % CW;
            const ty = Math.max(0, Math.min(CH - 1, Math.floor((90 - lat) / 180 * CH)));
            return cloudBake[ty * CW + tx];
        }

        const offscreen = document.createElement('canvas');
        offscreen.width = SIZE; offscreen.height = SIZE;
        const offCtx = offscreen.getContext('2d');

        let rotation = 0;
        let cloudRot = 0;
        const SPEED = 0.0025;
        const CLOUD_SPEED = 0.0035;

        function drawGlobe() {
            const imgData = offCtx.createImageData(SIZE, SIZE);
            const d = imgData.data;

            const cosR  = Math.cos(-rotation);
            const sinR  = Math.sin(-rotation);
            const cosRC = Math.cos(-cloudRot);
            const sinRC = Math.sin(-cloudRot);

            for (let py = 0; py < SIZE; py++) {
                for (let px = 0; px < SIZE; px++) {
                    const nx = (px - R) / (R - 1);
                    const ny = (R - py) / (R - 1);
                    const r2 = nx * nx + ny * ny;
                    if (r2 > 1) continue;

                    const nz = Math.sqrt(1 - r2);

                    const wx = nx * cosR  - nz * sinR;
                    const wz = nx * sinR  + nz * cosR;
                    const lat = Math.asin(Math.max(-1, Math.min(1, ny))) * 180 / Math.PI;
                    const lon = Math.atan2(wz, wx) * 180 / Math.PI;

                    const cwx = nx * cosRC - nz * sinRC;
                    const cwz = nx * sinRC + nz * cosRC;
                    const clon = Math.atan2(cwz, cwx) * 180 / Math.PI;

                    const [r, g, b] = sampleTex(lon, lat);

                    const lx = -0.35, ly = 0.5, lz = 0.8;
                    const diff   = Math.max(0, nx * lx + ny * ly + nz * lz);
                    const diffuse = 0.42 + 0.58 * diff;
                    const rim    = Math.pow(1 - nz, 2.0) * 0.9;
                    const spec   = Math.pow(Math.max(0, diff), 22) * 0.3;

                    const cloudAlpha = sampleCloud(clon, lat);
                    const shadowClon = clon + 2.5;
                    const shadowAlpha = sampleCloud(shadowClon, lat) * 0.28;

                    let sr = r * diffuse * (1 - shadowAlpha);
                    let sg = g * diffuse * (1 - shadowAlpha);
                    let sb = b * diffuse * (1 - shadowAlpha);

                    const cl = (200 + diff * 55) * diffuse;
                    sr = sr * (1 - cloudAlpha) + cl * cloudAlpha;
                    sg = sg * (1 - cloudAlpha) + cl * cloudAlpha;
                    sb = sb * (1 - cloudAlpha) + cl * cloudAlpha;

                    const idx = (py * SIZE + px) * 4;
                    d[idx]   = Math.min(255, sr + rim * 170 + spec * 255);
                    d[idx+1] = Math.min(255, sg + rim * 195 + spec * 255);
                    d[idx+2] = Math.min(255, sb + rim * 255 + spec * 255);
                    d[idx+3] = 255;
                }
            }

            offCtx.putImageData(imgData, 0, 0);

            ctx.clearRect(0, 0, SIZE, SIZE);
            ctx.save();
            ctx.beginPath();
            ctx.arc(R, R, R - 1, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(offscreen, 0, 0);

            const atmGrad = ctx.createRadialGradient(R * 0.6, R * 0.42, 0, R * 0.6, R * 0.42, R * 0.75);
            atmGrad.addColorStop(0, 'rgba(255,255,255,0.05)');
            atmGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = atmGrad;
            ctx.fillRect(0, 0, SIZE, SIZE);
            ctx.restore();

            const glowGrad = ctx.createRadialGradient(R, R, R * 0.87, R, R, R * 1.06);
            glowGrad.addColorStop(0, 'rgba(140,200,255,0.22)');
            glowGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(R, R, R * 1.06, 0, Math.PI * 2);
            ctx.fill();

            rotation  += SPEED;
            cloudRot  += CLOUD_SPEED;
            requestAnimationFrame(drawGlobe);
        }

        drawGlobe();
    })();

    // ── 3D MOON ──────────────────────────────────────────────────────────────
    (function() {
        const canvas = document.getElementById('moonCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Moon renders at 2× for sharpness inside a 44×44 CSS element
        const SIZE = 88;
        const R = SIZE / 2;
        canvas.width = SIZE;
        canvas.height = SIZE;

        // ── Moon surface texture (grey/tan with craters) ──
        const TW = 256, TH = 128;
        const moonTex = document.createElement('canvas');
        moonTex.width = TW; moonTex.height = TH;
        const mt = moonTex.getContext('2d');

        // Base lunar grey
        const moonGrad = mt.createLinearGradient(0, 0, 0, TH);
        moonGrad.addColorStop(0,   '#c8d4e0');
        moonGrad.addColorStop(0.3, '#a8b8c8');
        moonGrad.addColorStop(0.7, '#8898aa');
        moonGrad.addColorStop(1,   '#607080');
        mt.fillStyle = moonGrad;
        mt.fillRect(0, 0, TW, TH);

        // Soft color-variation blotches (no distinct craters — just texture)
        const blotches = [
            { x: 0.28, y: 0.38, rx: 0.18, ry: 0.13, alpha: 0.28 },
            { x: 0.50, y: 0.50, rx: 0.14, ry: 0.10, alpha: 0.22 },
            { x: 0.70, y: 0.40, rx: 0.12, ry: 0.09, alpha: 0.20 },
            { x: 0.35, y: 0.62, rx: 0.11, ry: 0.08, alpha: 0.18 },
            { x: 0.15, y: 0.48, rx: 0.10, ry: 0.07, alpha: 0.16 },
            { x: 0.80, y: 0.55, rx: 0.09, ry: 0.07, alpha: 0.15 },
            { x: 0.60, y: 0.22, rx: 0.08, ry: 0.06, alpha: 0.14 },
            { x: 0.45, y: 0.72, rx: 0.10, ry: 0.06, alpha: 0.13 },
        ];

        blotches.forEach(b => {
            const gx = b.x * TW, gy = b.y * TH;
            const maxR = Math.max(b.rx, b.ry) * TW;
            const g = mt.createRadialGradient(gx, gy, 0, gx, gy, maxR);
            g.addColorStop(0, `rgba(55,70,88,${b.alpha})`);
            g.addColorStop(0.6, `rgba(60,75,90,${b.alpha * 0.5})`);
            g.addColorStop(1, 'transparent');
            mt.save();
            mt.translate(gx, gy);
            mt.scale(b.rx * TW / maxR, b.ry * TH / maxR);
            mt.translate(-gx, -gy);
            mt.fillStyle = g;
            mt.beginPath(); mt.ellipse(gx, gy, maxR, maxR, 0, 0, Math.PI*2); mt.fill();
            mt.restore();
        });

        // Lighter highland patches
        const highlands = [
            { x: 0.60, y: 0.68, rx: 0.13, ry: 0.09, alpha: 0.18 },
            { x: 0.20, y: 0.25, rx: 0.10, ry: 0.07, alpha: 0.14 },
            { x: 0.85, y: 0.22, rx: 0.09, ry: 0.06, alpha: 0.12 },
        ];
        highlands.forEach(h => {
            const gx = h.x * TW, gy = h.y * TH;
            const maxR = Math.max(h.rx, h.ry) * TW;
            const g = mt.createRadialGradient(gx, gy, 0, gx, gy, maxR);
            g.addColorStop(0, `rgba(200,215,228,${h.alpha})`);
            g.addColorStop(1, 'transparent');
            mt.save();
            mt.translate(gx, gy);
            mt.scale(h.rx * TW / maxR, h.ry * TH / maxR);
            mt.translate(-gx, -gy);
            mt.fillStyle = g;
            mt.beginPath(); mt.ellipse(gx, gy, maxR, maxR, 0, 0, Math.PI*2); mt.fill();
            mt.restore();
        });

        // Fine-grain surface noise (subtle speckle)
        for (let i = 0; i < 1200; i++) {
            const hx = Math.random() * TW;
            const hy = Math.random() * TH;
            const hr = Math.random() * 2.5 + 0.3;
            const bright = Math.random() > 0.45;
            mt.fillStyle = bright
                ? `rgba(195,208,220,${Math.random() * 0.07})`
                : `rgba(45,58,72,${Math.random() * 0.055})`;
            mt.beginPath(); mt.arc(hx, hy, hr, 0, Math.PI*2); mt.fill();
        }

        const moonTexData = mt.getImageData(0, 0, TW, TH).data;

        function sampleMoonTex(lon, lat) {
            lon = ((lon % 360) + 360) % 360 - 180;
            const tx = Math.floor((lon + 180) / 360 * TW) % TW;
            const ty = Math.max(0, Math.min(TH - 1, Math.floor((90 - lat) / 180 * TH)));
            const i = (ty * TW + tx) * 4;
            return [moonTexData[i], moonTexData[i+1], moonTexData[i+2]];
        }

        const offscreen = document.createElement('canvas');
        offscreen.width = SIZE; offscreen.height = SIZE;
        const offCtx = offscreen.getContext('2d');

        let moonRot = 0;
        const MOON_SPEED = 0.004; // slightly faster spin for visual interest

        function drawMoon() {
            const imgData = offCtx.createImageData(SIZE, SIZE);
            const d = imgData.data;

            const cosR = Math.cos(-moonRot);
            const sinR = Math.sin(-moonRot);

            for (let py = 0; py < SIZE; py++) {
                for (let px = 0; px < SIZE; px++) {
                    const nx = (px - R) / (R - 1);
                    const ny = (R - py) / (R - 1);
                    const r2 = nx * nx + ny * ny;
                    if (r2 > 1) continue;

                    const nz = Math.sqrt(1 - r2);

                    const wx = nx * cosR - nz * sinR;
                    const wz = nx * sinR + nz * cosR;
                    const lat = Math.asin(Math.max(-1, Math.min(1, ny))) * 180 / Math.PI;
                    const lon = Math.atan2(wz, wx) * 180 / Math.PI;

                    const [r, g, b] = sampleMoonTex(lon, lat);

                    // Lighting — same direction as Earth's light source
                    const lx = -0.35, ly = 0.5, lz = 0.8;
                    const diff    = Math.max(0, nx * lx + ny * ly + nz * lz);
                    const diffuse = 0.30 + 0.70 * diff;
                    const rim     = Math.pow(1 - nz, 2.5) * 0.6;
                    const spec    = Math.pow(Math.max(0, diff), 12) * 0.12; // subtle specular

                    const idx = (py * SIZE + px) * 4;
                    d[idx]   = Math.min(255, r * diffuse + rim * 140 + spec * 255);
                    d[idx+1] = Math.min(255, g * diffuse + rim * 155 + spec * 255);
                    d[idx+2] = Math.min(255, b * diffuse + rim * 175 + spec * 255);
                    d[idx+3] = 255;
                }
            }

            offCtx.putImageData(imgData, 0, 0);

            ctx.clearRect(0, 0, SIZE, SIZE);
            ctx.save();
            ctx.beginPath();
            ctx.arc(R, R, R - 1, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(offscreen, 0, 0);

            // Subtle atmospheric shimmer on limb
            const atmGrad = ctx.createRadialGradient(R * 0.55, R * 0.40, 0, R * 0.55, R * 0.40, R * 0.70);
            atmGrad.addColorStop(0, 'rgba(240,245,255,0.04)');
            atmGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = atmGrad;
            ctx.fillRect(0, 0, SIZE, SIZE);
            ctx.restore();

            moonRot += MOON_SPEED;
            requestAnimationFrame(drawMoon);
        }

        drawMoon();
    })();

    // ── 3D RED PLANET (About section) ─────────────────────────────────────────
    (function() {
        const canvas = document.getElementById('redPlanetCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const SIZE = 360;
        const R = SIZE / 2;
        canvas.width = SIZE; canvas.height = SIZE;

        // Build Mars-like texture
        const TW = 512, TH = 256;
        const tex = document.createElement('canvas');
        tex.width = TW; tex.height = TH;
        const tc = tex.getContext('2d');

        // Base rusty red gradient
        const baseG = tc.createLinearGradient(0, 0, 0, TH);
        baseG.addColorStop(0,   '#c05830');
        baseG.addColorStop(0.25,'#b04428');
        baseG.addColorStop(0.5, '#8c2a14');
        baseG.addColorStop(0.75,'#7a2010');
        baseG.addColorStop(1,   '#4a1008');
        tc.fillStyle = baseG;
        tc.fillRect(0, 0, TW, TH);

        // Surface banding — Mars has distinct latitudinal bands
        const bands = [
            { cy: 0.22, ry: 0.08, color: 'rgba(210,140,90,0.18)' },
            { cy: 0.40, ry: 0.06, color: 'rgba(80,15,8,0.22)' },
            { cy: 0.58, ry: 0.07, color: 'rgba(195,120,70,0.16)' },
            { cy: 0.72, ry: 0.05, color: 'rgba(60,10,5,0.20)' },
        ];
        bands.forEach(b => {
            const g = tc.createLinearGradient(0, (b.cy - b.ry)*TH, 0, (b.cy + b.ry)*TH);
            g.addColorStop(0, 'transparent');
            g.addColorStop(0.5, b.color);
            g.addColorStop(1, 'transparent');
            tc.fillStyle = g;
            tc.fillRect(0, (b.cy - b.ry)*TH, TW, b.ry*2*TH);
        });

        // Color patches (regional variation)
        const patches = [
            { x:0.15, y:0.35, rx:0.20, ry:0.14, color:'rgba(185,90,50,0.22)' },
            { x:0.45, y:0.55, rx:0.18, ry:0.12, color:'rgba(120,35,18,0.20)' },
            { x:0.70, y:0.30, rx:0.16, ry:0.11, color:'rgba(210,150,80,0.18)' },
            { x:0.30, y:0.70, rx:0.14, ry:0.09, color:'rgba(100,25,12,0.18)' },
            { x:0.80, y:0.60, rx:0.12, ry:0.10, color:'rgba(195,110,60,0.15)' },
            { x:0.55, y:0.20, rx:0.13, ry:0.08, color:'rgba(220,160,100,0.14)' },
        ];
        patches.forEach(p => {
            const gx = p.x*TW, gy = p.y*TH;
            const maxR = Math.max(p.rx, p.ry)*TW;
            const g = tc.createRadialGradient(gx, gy, 0, gx, gy, maxR);
            g.addColorStop(0, p.color);
            g.addColorStop(1, 'transparent');
            tc.save();
            tc.translate(gx, gy);
            tc.scale(p.rx*TW/maxR, p.ry*TH/maxR);
            tc.translate(-gx, -gy);
            tc.fillStyle = g;
            tc.beginPath(); tc.ellipse(gx, gy, maxR, maxR, 0, 0, Math.PI*2); tc.fill();
            tc.restore();
        });

        // Polar ice cap (north)
        const polarG = tc.createRadialGradient(TW*0.5, 0, 0, TW*0.5, 0, TH*0.18);
        polarG.addColorStop(0, 'rgba(240,220,200,0.55)');
        polarG.addColorStop(0.6,'rgba(220,200,185,0.28)');
        polarG.addColorStop(1, 'transparent');
        tc.fillStyle = polarG;
        tc.fillRect(0, 0, TW, TH*0.25);

        // Fine grain noise
        for (let i = 0; i < 2000; i++) {
            const nx = Math.random()*TW, ny = Math.random()*TH;
            const nr = Math.random()*2.5+0.3;
            const bright = Math.random() > 0.5;
            tc.fillStyle = bright
                ? `rgba(210,140,80,${Math.random()*0.07})`
                : `rgba(50,10,5,${Math.random()*0.06})`;
            tc.beginPath(); tc.arc(nx, ny, nr, 0, Math.PI*2); tc.fill();
        }

        const texData = tc.getImageData(0, 0, TW, TH).data;
        function sampleTex(lon, lat) {
            lon = ((lon % 360)+360)%360 - 180;
            const tx = Math.floor((lon+180)/360*TW) % TW;
            const ty = Math.max(0, Math.min(TH-1, Math.floor((90-lat)/180*TH)));
            const i = (ty*TW+tx)*4;
            return [texData[i], texData[i+1], texData[i+2]];
        }

        const off = document.createElement('canvas');
        off.width = SIZE; off.height = SIZE;
        const offCtx = off.getContext('2d');
        let rot = 0;
        const SPEED = 0.003;

        function drawRedPlanet() {
            const imgData = offCtx.createImageData(SIZE, SIZE);
            const d = imgData.data;
            const cosR = Math.cos(-rot), sinR = Math.sin(-rot);

            for (let py = 0; py < SIZE; py++) {
                for (let px = 0; px < SIZE; px++) {
                    const nx = (px-R)/(R-1);
                    const ny = (R-py)/(R-1);
                    const r2 = nx*nx+ny*ny;
                    if (r2 > 1) continue;
                    const nz = Math.sqrt(1-r2);
                    const wx = nx*cosR - nz*sinR;
                    const wz = nx*sinR + nz*cosR;
                    const lat = Math.asin(Math.max(-1, Math.min(1, ny)))*180/Math.PI;
                    const lon = Math.atan2(wz, wx)*180/Math.PI;
                    const [r, g, b] = sampleTex(lon, lat);
                    // Warm light source
                    const lx = -0.35, ly = 0.5, lz = 0.8;
                    const diff = Math.max(0, nx*lx+ny*ly+nz*lz);
                    const diffuse = 0.35+0.65*diff;
                    const rim = Math.pow(1-nz, 2.5)*0.7;
                    const spec = Math.pow(Math.max(0, diff), 16)*0.08;
                    const idx = (py*SIZE+px)*4;
                    d[idx]   = Math.min(255, r*diffuse + rim*200 + spec*255);
                    d[idx+1] = Math.min(255, g*diffuse + rim*90  + spec*220);
                    d[idx+2] = Math.min(255, b*diffuse + rim*60  + spec*180);
                    d[idx+3] = 255;
                }
            }
            offCtx.putImageData(imgData, 0, 0);
            ctx.clearRect(0, 0, SIZE, SIZE);
            ctx.save();
            ctx.beginPath();
            ctx.arc(R, R, R-1, 0, Math.PI*2);
            ctx.clip();
            ctx.drawImage(off, 0, 0);
            // Atmospheric haze
            const atmG = ctx.createRadialGradient(R*0.6, R*0.42, 0, R*0.6, R*0.42, R*0.75);
            atmG.addColorStop(0, 'rgba(255,140,80,0.04)');
            atmG.addColorStop(1, 'transparent');
            ctx.fillStyle = atmG;
            ctx.fillRect(0, 0, SIZE, SIZE);
            ctx.restore();
            // Red atmospheric glow at limb
            const glowG = ctx.createRadialGradient(R, R, R*0.87, R, R, R*1.06);
            glowG.addColorStop(0, 'rgba(220,80,40,0.20)');
            glowG.addColorStop(1, 'transparent');
            ctx.fillStyle = glowG;
            ctx.beginPath(); ctx.arc(R, R, R*1.06, 0, Math.PI*2); ctx.fill();
            rot += SPEED;
            requestAnimationFrame(drawRedPlanet);
        }
        drawRedPlanet();
    })();

    // ── 3D CONTACT MOON ───────────────────────────────────────────────────────
    (function() {
        const canvas = document.getElementById('contactMoonCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const SIZE = 320;
        const R = SIZE / 2;
        canvas.width = SIZE; canvas.height = SIZE;

        // Reuse same moon texture approach as orbiting moon
        const TW = 256, TH = 128;
        const moonTex = document.createElement('canvas');
        moonTex.width = TW; moonTex.height = TH;
        const mt = moonTex.getContext('2d');

        const moonGrad = mt.createLinearGradient(0, 0, 0, TH);
        moonGrad.addColorStop(0,   '#c8d4e0');
        moonGrad.addColorStop(0.3, '#a8b8c8');
        moonGrad.addColorStop(0.7, '#8898aa');
        moonGrad.addColorStop(1,   '#607080');
        mt.fillStyle = moonGrad; mt.fillRect(0, 0, TW, TH);

        // Same color-only blotches (no craters)
        const blotches = [
            { x:0.28, y:0.38, rx:0.18, ry:0.13, alpha:0.28 },
            { x:0.50, y:0.50, rx:0.14, ry:0.10, alpha:0.22 },
            { x:0.70, y:0.40, rx:0.12, ry:0.09, alpha:0.20 },
            { x:0.35, y:0.62, rx:0.11, ry:0.08, alpha:0.18 },
            { x:0.15, y:0.48, rx:0.10, ry:0.07, alpha:0.16 },
            { x:0.80, y:0.55, rx:0.09, ry:0.07, alpha:0.15 },
        ];
        blotches.forEach(b => {
            const gx=b.x*TW, gy=b.y*TH, maxR=Math.max(b.rx,b.ry)*TW;
            const g = mt.createRadialGradient(gx,gy,0,gx,gy,maxR);
            g.addColorStop(0, `rgba(55,70,88,${b.alpha})`);
            g.addColorStop(0.6, `rgba(60,75,90,${b.alpha*0.5})`);
            g.addColorStop(1, 'transparent');
            mt.save(); mt.translate(gx,gy); mt.scale(b.rx*TW/maxR, b.ry*TH/maxR); mt.translate(-gx,-gy);
            mt.fillStyle=g; mt.beginPath(); mt.ellipse(gx,gy,maxR,maxR,0,0,Math.PI*2); mt.fill(); mt.restore();
        });
        const highlands=[{x:0.60,y:0.68,rx:0.13,ry:0.09,alpha:0.18},{x:0.20,y:0.25,rx:0.10,ry:0.07,alpha:0.14}];
        highlands.forEach(h=>{
            const gx=h.x*TW,gy=h.y*TH,maxR=Math.max(h.rx,h.ry)*TW;
            const g=mt.createRadialGradient(gx,gy,0,gx,gy,maxR);
            g.addColorStop(0,`rgba(200,215,228,${h.alpha})`); g.addColorStop(1,'transparent');
            mt.save(); mt.translate(gx,gy); mt.scale(h.rx*TW/maxR,h.ry*TH/maxR); mt.translate(-gx,-gy);
            mt.fillStyle=g; mt.beginPath(); mt.ellipse(gx,gy,maxR,maxR,0,0,Math.PI*2); mt.fill(); mt.restore();
        });
        for(let i=0;i<1200;i++){
            const hx=Math.random()*TW,hy=Math.random()*TH,hr=Math.random()*2.5+0.3;
            mt.fillStyle=Math.random()>0.45?`rgba(195,208,220,${Math.random()*0.07})`:`rgba(45,58,72,${Math.random()*0.055})`;
            mt.beginPath(); mt.arc(hx,hy,hr,0,Math.PI*2); mt.fill();
        }

        const moonTexData = mt.getImageData(0,0,TW,TH).data;
        function sampleMoon(lon,lat){
            lon=((lon%360)+360)%360-180;
            const tx=Math.floor((lon+180)/360*TW)%TW;
            const ty=Math.max(0,Math.min(TH-1,Math.floor((90-lat)/180*TH)));
            const i=(ty*TW+tx)*4;
            return [moonTexData[i],moonTexData[i+1],moonTexData[i+2]];
        }

        const off=document.createElement('canvas');
        off.width=SIZE; off.height=SIZE;
        const offCtx=off.getContext('2d');
        let moonRot=0;
        const MOON_SPEED=0.003;

        function drawContactMoon(){
            const imgData=offCtx.createImageData(SIZE,SIZE);
            const d=imgData.data;
            const cosR=Math.cos(-moonRot), sinR=Math.sin(-moonRot);
            for(let py=0;py<SIZE;py++){
                for(let px=0;px<SIZE;px++){
                    const nx=(px-R)/(R-1), ny=(R-py)/(R-1);
                    const r2=nx*nx+ny*ny;
                    if(r2>1) continue;
                    const nz=Math.sqrt(1-r2);
                    const wx=nx*cosR-nz*sinR, wz=nx*sinR+nz*cosR;
                    const lat=Math.asin(Math.max(-1,Math.min(1,ny)))*180/Math.PI;
                    const lon=Math.atan2(wz,wx)*180/Math.PI;
                    const [r,g,b]=sampleMoon(lon,lat);
                    const lx=-0.35,ly=0.5,lz=0.8;
                    const diff=Math.max(0,nx*lx+ny*ly+nz*lz);
                    const diffuse=0.30+0.70*diff;
                    const rim=Math.pow(1-nz,2.5)*0.6;
                    const spec=Math.pow(Math.max(0,diff),12)*0.12;
                    const idx=(py*SIZE+px)*4;
                    d[idx]  =Math.min(255,r*diffuse+rim*140+spec*255);
                    d[idx+1]=Math.min(255,g*diffuse+rim*155+spec*255);
                    d[idx+2]=Math.min(255,b*diffuse+rim*175+spec*255);
                    d[idx+3]=255;
                }
            }
            offCtx.putImageData(imgData,0,0);
            ctx.clearRect(0,0,SIZE,SIZE);
            ctx.save();
            ctx.beginPath(); ctx.arc(R,R,R-1,0,Math.PI*2); ctx.clip();
            ctx.drawImage(off,0,0);
            const atmG=ctx.createRadialGradient(R*0.55,R*0.40,0,R*0.55,R*0.40,R*0.70);
            atmG.addColorStop(0,'rgba(240,245,255,0.04)'); atmG.addColorStop(1,'transparent');
            ctx.fillStyle=atmG; ctx.fillRect(0,0,SIZE,SIZE);
            ctx.restore();
            moonRot+=MOON_SPEED;
            requestAnimationFrame(drawContactMoon);
        }
        drawContactMoon();
    })();