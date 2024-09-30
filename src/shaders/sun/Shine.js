export const fragmentShader = `uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
uniform samplerCube uPerlin;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 eyeVector;
float PI = 3.141592653589793238;

vec4 brightnessToColor(float brightness){
    brightness *= 0.25;
    float clampedBrightness = clamp(brightness, 0.0, 1.0);
    vec3 color = (vec3(brightness, brightness*brightness, brightness*brightness*brightness*brightness) / 0.25) * 0.8;

     float alpha = 0.0;
    if (clampedBrightness >= 0.395) {
        alpha = 1.0; 
    } else if (clampedBrightness >= 0.29) {
        // Minimal cumulative decrease between 0.35 and 0.29 using pow
        alpha = pow(1.0 - (0.35 - clampedBrightness), 37.5);
    } 
    return vec4(color, alpha);
}


float Fresnel(vec3 eyeVector, vec3 worldNormal){
    return pow(1.0 - dot(eyeVector, worldNormal), 1.5);
}

float supersun(){
    float sun = 0.0;
    vec3 normalizedLayer0 = normalize(vLayer0);
    vec3 normalizedLayer1 = normalize(vLayer1);
    vec3 normalizedLayer2 = normalize(vLayer2);

    sun += textureCube(uPerlin, normalizedLayer0).r;
    sun += textureCube(uPerlin, normalizedLayer1).r;
    sun += textureCube(uPerlin, normalizedLayer2).r;
    sun *= 0.33;
    return sun;
}

void main() {
    float brightness = supersun() * 4.0 + 0.75;
    float fres = 1.0 - Fresnel(eyeVector, vNormal);

    float radialDistance = length(vPosition);

    float updatedBrightness = (brightness + fres);

    vec4 col = brightnessToColor(updatedBrightness);
    gl_FragColor = vec4(col);
}`;

export const vertexShader = `uniform float time;
uniform vec2 pixels;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 eyeVector;
float PI = 3.141592653589793238;

mat2 rotate(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}


void main() {

    vNormal = normal;

    vec4 worldPosition = modelMatrix * vec4( normalize(position), 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);

    float t = time * 0.05;
    vec3 p0 = position;
    p0.yz = rotate(t) * p0.yz;
    vLayer0 = p0;

    mat2 rot1 = rotate(t + 10.0);
    vec3 p1 = position;
    p1.xz = rot1 * p1.xz;
    vLayer1 = p1;

    mat2 rot2 = rotate(t + 20.0);
    vec3 p2 = position;
    p2.xy = rot2 * p2.xy;
    vLayer2 = p2;

    vUv = uv;
    vPosition = normalize(position) * 0.5 + 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
}`;
