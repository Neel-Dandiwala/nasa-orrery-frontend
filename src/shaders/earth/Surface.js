export const vertexShader = `uniform float time;
uniform vec2 pixels;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUvLayer0;
varying vec2 vUvLayer1;
varying vec2 vUvLayer2;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

float PI = 3.141592653589793238;

mat2 rotate(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main() {

    vec3 pos = position;

    float t = time;
    vec2 v = uv;
    v = rotate(t) * (v - 0.5) + 0.5;
    vUv = v;

    // vUv = uv;
    vPosition = normalize(position) * 0.5 + 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
}`;

export const fragmentShader = `uniform sampler2D cloudTexture;
uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform vec3 sunPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vUvLayer0;
varying vec2 vUvLayer1;
varying vec2 vUvLayer2;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

void main() {

    vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
    vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
    vec3 sunDirection = sunPosition;
    float cosAngleSunToNormal = dot(vNormal, sunDirection);
    float mixAmount = 2.0 / (1.0 + exp(-20.0 * cosAngleSunToNormal));
    vec3 finalColor = mix(nightColor, dayColor, mixAmount);
    gl_FragColor = vec4(finalColor, 1.0);

}`;