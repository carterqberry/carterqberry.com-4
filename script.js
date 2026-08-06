// ── HERO PLANET: reveal only once every image has loaded ──────────────────────
(function() {
    const wrap = document.querySelector('.hero-planet-wrap');
    if (!wrap) return;
    const imgs = wrap.querySelectorAll('img');
    let remaining = imgs.length;
    if (remaining === 0) { wrap.classList.add('loaded'); return; }
    function done() {
        remaining--;
        if (remaining <= 0) wrap.classList.add('loaded');
    }
    imgs.forEach(img => {
        if (img.complete) done();
        else { img.addEventListener('load', done); img.addEventListener('error', done); }
    });
})();

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