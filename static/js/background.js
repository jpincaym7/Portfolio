
const canvas = document.querySelector("#canvas");
const gl = canvas.getContext("webgl2", {
powerPreference: "high-performance",
antialias: false,
depth: false,
stencil: false
});

const vertexShader = `#version 300 es
    layout(location = 0) in vec2 aPosition;
    out vec2 vUV;
    void main() {
        vUV = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }`;

const fragmentShader = `#version 300 es
    precision mediump float;
    in vec2 vUV;
    uniform float uTime;
    uniform vec2 uResolution;
    out vec4 fragColor;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < 4; ++i) {
            v += a * snoise(p);
            p = rot * p * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    void main() {
        vec2 aspect = vec2(1.0, uResolution.y/uResolution.x);
        vec2 p = vUV * 3.0 * aspect;
        float n = fbm(p + uTime * 0.1);
        float d = fbm(p + n + uTime * 0.05);
        n = fbm(p + d);
        n = smoothstep(0.3, 0.8, n);
        fragColor = vec4(mix(vec3(0.0), vec3(1.0, 0.84, 0.0), n), 1.0);
    }`;

const program = gl.createProgram();
gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexShader));
gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentShader));
gl.linkProgram(program);
gl.useProgram(program);

function createShader(type, source) {
const shader = gl.createShader(type);
gl.shaderSource(shader, source);
gl.compileShader(shader);
return shader;
}

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(
gl.ARRAY_BUFFER,
new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
gl.STATIC_DRAW
);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

const timeLocation = gl.getUniformLocation(program, "uTime");
const resolutionLocation = gl.getUniformLocation(program, "uResolution");

let width = 0;
let height = 0;
const resize = () => {
width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;
gl.viewport(0, 0, width, height);
gl.uniform2f(resolutionLocation, width, height);
};

window.addEventListener("resize", () => {
cancelAnimationFrame(rafId);
resize();
lastTime = performance.now();
rafId = requestAnimationFrame(render);
});

let lastTime = performance.now();
const targetFPS = 30;
const frameTime = 1000 / targetFPS;
let rafId;

function render(now) {
const deltaTime = now - lastTime;
if (deltaTime >= frameTime) {
    lastTime = now - (deltaTime % frameTime);
    gl.uniform1f(timeLocation, now * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
rafId = requestAnimationFrame(render);
}

resize();
rafId = requestAnimationFrame(render);
