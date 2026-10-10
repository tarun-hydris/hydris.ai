import { useEffect, useRef } from 'react';
import { reduced } from '../../lib/hooks.js';

/* ---------------------------------------------------------------------------------------------
   Fluted glass. Coloured liquid, poured by the pointer (or by a slow wandering stir when the
   pointer is away), drifts and fades behind a sheet of fluted glass. Each flute bends the light
   behind it, splits the colours a little at its seams and carries a soft specular line.
   Written for Hydris in raw WebGL2: two small passes, a low-resolution liquid buffer and the glass.
   --------------------------------------------------------------------------------------------- */

const VERT = `#version 300 es
in vec2 p; out vec2 uv;
void main() { uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

/* Liquid: fade, drift along a slow curl field, add the new pour */
const LIQUID = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D prev; uniform vec2 res; uniform float t, fade, swirl;
uniform vec2 pa, pb; uniform vec3 col; uniform float rad, amt;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
vec2 curl(vec2 p) { float e = 0.01; float a = n(p + vec2(0, e)), b = n(p - vec2(0, e)), c = n(p + vec2(e, 0)), d = n(p - vec2(e, 0));
  return vec2(a - b, d - c) / (2.0 * e); }
float seg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float k = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0); return length(pa - ba * k); }
void main() {
  vec2 asp = vec2(res.x / res.y, 1.0);
  vec2 flow = curl(uv * 2.2 + t * 0.03) * (0.0009 + swirl * 0.004);
  vec4 c = texture(prev, uv - flow) * fade;
  float d = seg(uv * asp, pa * asp, pb * asp);
  float s = exp(-d * d / (rad * rad)) * amt;
  c.rgb = mix(c.rgb, col, clamp(s, 0.0, 1.0));
  c.a = max(c.a * fade, s);
  o = c;
}`;

/* Glass: refract the liquid through the flutes, fringe the seams, add highlight and grain */
const GLASS = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D liq; uniform vec2 res; uniform float t;
uniform vec3 bg, c1, c2; uniform float ang, flutes, refr, aber, soft, wave, wfreq, drift, hil, hsoft, lang, tex, grain;
float h(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * n(p); p *= 2.03; a *= 0.5; } return s; }
vec3 surface(vec2 q) {
  float f = fbm(q * 1.6 + vec2(t * 0.04, -t * 0.03));
  float g = fbm(q * 2.3 - vec2(t * 0.03, t * 0.05) + f);
  return mix(c1, c2, smoothstep(0.25, 0.85, g)) * smoothstep(0.35, 0.95, f) * tex * 0.55;
}
vec3 look(vec2 q) {
  vec4 l = texture(liq, q);
  return surface(q) + l.rgb * l.a;
}
void main() {
  vec2 asp = vec2(res.x / res.y, 1.0);
  float a = radians(ang);
  mat2 R = mat2(cos(a), -sin(a), sin(a), cos(a));
  vec2 p = R * ((uv - 0.5) * asp);
  p.x += sin(p.y * wfreq * 6.2831 + t * 0.6) * wave * 0.08 + t * drift * 0.02;
  float x = p.x * flutes;
  float cell = fract(x) - 0.5;
  float k = mix(sign(cell) * pow(abs(cell * 2.0), 3.0) * 0.5, cell, soft);
  vec2 dir = inverse(R) * vec2(1.0, 0.0) / asp;
  float bend = -k * refr / flutes;
  float seam = pow(abs(cell * 2.0), 6.0);
  vec2 base = uv + dir * bend;
  vec3 col;
  col.r = look(base + dir * aber * 0.012 * seam).r;
  col.g = look(base).g;
  col.b = look(base - dir * aber * 0.012 * seam).b;
  float lp = sin(radians(lang)) * 0.5;
  float hl = exp(-pow((cell - lp) / (0.02 + hsoft * 0.2), 2.0)) * hil;
  float shade = 1.0 - pow(abs(cell * 2.0), 2.0) * 0.18;
  vec3 c = bg + col * shade + vec3(hl);
  c += (h(uv * res + fract(t) * 91.0) - 0.5) * grain * (1.2 - dot(c, vec3(0.333)));
  o = vec4(c, 1.0);
}`;

const HYDRIS = ['#1746E4', '#DD79FD']; // the blue and the violet glow of hydris.ai
const hex = (c) => { const v = parseInt(c.replace('#', ''), 16); return [(v >> 16 & 255) / 255, (v >> 8 & 255) / 255, (v & 255) / 255]; };

export default function FlutedGlass({
  colors = HYDRIS, backgroundColor = '#050608', angle = 28, flutes = 8, refraction = 4, aberration = 0.61,
  softness = 0.5, wave = 0.06, waveFrequency = 1.5, drift = 0, highlight = 0.12, highlightSoftness = 0.3, lightAngle = -90,
  radius = 6.5, momentum = 13, swirl = 0, intensity = 1, trail = 1, texture = 0.6, grain = 0.05, speed = 1, autoplay = true,
  dpr = 1.5, className = '',
}) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false });
    if (!gl) return undefined;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = (fs) => {
      const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
      gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p);
      const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name); }
      return { p, u };
    };
    const liquid = prog(LIQUID); const glass = prog(GLASS);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    let sw = 0; let sh2 = 0; let targets = [];
    const makeTarget = (w, h) => {
      const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tx, 0);
      return { tx, fb };
    };
    const resize = () => {
      const r = Math.min(window.devicePixelRatio || 1, dpr);
      canvas.width = Math.max(2, Math.round(canvas.clientWidth * r)); canvas.height = Math.max(2, Math.round(canvas.clientHeight * r));
      const w = Math.max(64, Math.round(canvas.width / 4)); const h = Math.max(64, Math.round(canvas.height / 4));
      if (w !== sw || h !== sh2) {
        targets.forEach((t) => { gl.deleteTexture(t.tx); gl.deleteFramebuffer(t.fb); });
        sw = w; sh2 = h; targets = [makeTarget(w, h), makeTarget(w, h)];
      }
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);

    /* The pour: the pointer, or a slow wandering stir when it is away */
    const C1 = hex(colors[0]); const C2 = hex(colors[1]);
    let px = 0.5; let py = 0.5; let lx = 0.5; let ly = 0.5; let vx = 0; let vy = 0; let lastMove = -1e9;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width; const y = 1 - (e.clientY - r.top) / r.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      vx = x - px; vy = y - py; px = x; py = y; lastMove = performance.now();
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0; let visible = true; let t0 = performance.now(); let read = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); });
    io.observe(canvas);
    const bg = hex(backgroundColor);
    function frame(now) {
      raf = 0;
      if (!visible) return;
      const t = ((now - t0) / 1000) * speed;
      const idle = now - lastMove > 1400;
      if (autoplay && idle) {
        const ax = 0.5 + 0.34 * Math.sin(t * 0.37) + 0.08 * Math.sin(t * 1.3);
        const ay = 0.5 + 0.3 * Math.sin(t * 0.53 + 1.1) + 0.06 * Math.cos(t * 1.7);
        vx = ax - px; vy = ay - py; px = ax; py = ay;
      } else if (!idle) {
        // momentum: keep pouring along the last direction for a moment after the pointer rests
      } else { px += vx; py += vy; vx *= 1 - 1 / Math.max(2, momentum); vy *= 1 - 1 / Math.max(2, momentum); }
      const sp = Math.hypot(vx, vy);
      const mix = Math.min(1, Math.max(0, 0.5 + (vx + vy) * 18)) * 0.55; // mostly Hydris blue, violet as the accent
      const col = [C1[0] + (C2[0] - C1[0]) * mix, C1[1] + (C2[1] - C1[1]) * mix, C1[2] + (C2[2] - C1[2]) * mix];

      const src = targets[read]; const dst = targets[1 - read];
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb); gl.viewport(0, 0, sw, sh2);
      gl.useProgram(liquid.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, src.tx); gl.uniform1i(liquid.u.prev, 0);
      gl.uniform2f(liquid.u.res, sw, sh2); gl.uniform1f(liquid.u.t, t);
      gl.uniform1f(liquid.u.fade, 0.975 + 0.02 * Math.min(1, trail)); gl.uniform1f(liquid.u.swirl, swirl);
      gl.uniform2f(liquid.u.pa, lx, ly); gl.uniform2f(liquid.u.pb, px, py);
      gl.uniform3fv(liquid.u.col, col); gl.uniform1f(liquid.u.rad, radius / 100);
      gl.uniform1f(liquid.u.amt, Math.min(1, sp * 40) * intensity * 0.9);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      lx = px; ly = py; read = 1 - read;

      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(glass.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, dst.tx); gl.uniform1i(glass.u.liq, 0);
      const U = glass.u;
      gl.uniform2f(U.res, canvas.width, canvas.height); gl.uniform1f(U.t, t);
      gl.uniform3fv(U.bg, bg); gl.uniform3fv(U.c1, C1); gl.uniform3fv(U.c2, C2);
      gl.uniform1f(U.ang, angle); gl.uniform1f(U.flutes, flutes); gl.uniform1f(U.refr, refraction); gl.uniform1f(U.aber, aberration);
      gl.uniform1f(U.soft, softness); gl.uniform1f(U.wave, wave); gl.uniform1f(U.wfreq, waveFrequency); gl.uniform1f(U.drift, drift);
      gl.uniform1f(U.hil, highlight); gl.uniform1f(U.hsoft, highlightSoftness); gl.uniform1f(U.lang, lightAngle);
      gl.uniform1f(U.tex, texture); gl.uniform1f(U.grain, grain);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduced) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.removeEventListener('pointermove', onMove);
      const lc = gl.getExtension('WEBGL_lose_context'); if (lc) lc.loseContext();
    };
  }, [colors, backgroundColor, angle, flutes, refraction, aberration, softness, wave, waveFrequency, drift, highlight, highlightSoftness,
    lightAngle, radius, momentum, swirl, intensity, trail, texture, grain, speed, autoplay, dpr]);
  return <canvas ref={ref} className={`fluted ${className}`} aria-hidden="true" />;
}
