export const vertexShader = `uniform float time;
uniform vec2 pixels;
uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uNormalMapTexture;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying mat3 vTbn;
attribute vec4 tangent;
float PI = 3.141592653589793238;

mat2 rotate(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main() {

    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vec3 t = normalize(tangent.xyz);
    vec3 n = normalize(normal.xyz);
    vec3 b = normalize(cross(t, n));

    t = mat3(modelMatrix) * t;
    b = mat3(modelMatrix) * b;
    n = mat3(modelMatrix) * n;
    vTbn = mat3(t, b, n);
    vPosition = normalize(position) * 0.5 + 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
}`;

export const fragmentShader = `uniform sampler2D uNormalMapTexture;
uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularMapTexture;
uniform vec3 sunPosition;
uniform float uNormalPower;
uniform vec3 uPosition;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying mat3 vTbn;

void main() {

    vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
    vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
    vec3 sunDirection = normalize(sunPosition);
    float cosAngleSunToNormal = dot(vNormal, sunDirection);

    vec3 t_normal = texture2D(uNormalMapTexture, vUv).xyz * 2.0 - 1.0;  
    vec3 normal = normalize(vTbn * t_normal);
    float cosAngleSunToSurface = dot(normal, sunDirection);

    float mixAmountTexture = 1.0 / (1.0 + exp(-20.0 * cosAngleSunToNormal));
    mixAmountTexture *= 1.0 + uNormalPower * (cosAngleSunToSurface - cosAngleSunToNormal);
    
    mixAmountTexture = clamp(mixAmountTexture, 0.0, 1.0);


    vec3 finalColor = mix(nightColor, dayColor, mixAmountTexture);

    float specularRatio = texture2D(uSpecularMapTexture, vUv).r;
    specularRatio = 3.0 * specularRatio + 0.1;
    vec3 specularVector = -reflect(sunDirection, normal);
    vec3 surfacePosition = uPosition + vPosition;
    float specularPower = clamp(dot(specularVector, normalize(cameraPosition - surfacePosition)), 0.0, 1.0);
    finalColor += mixAmountTexture * pow(specularPower, 2.0) * specularRatio;

    
    // float mixAmount = 1.0 / (1.0 + exp(-20.0 * cosAngleSunToNormal));
    
    gl_FragColor = vec4(finalColor, 1.0);
    //gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0); 

}`;