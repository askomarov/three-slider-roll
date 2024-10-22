varying float progress;
varying float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D uTexture;

void main() {

  gl_FragColor = vec4(vUv, 1.0, 1.0);
  vec3 color = texture2D(uTexture, vUv).rgb;

  float alpha = smoothstep(-0.8, 0., vPosition.z);
  gl_FragColor = vec4(color, alpha);
}
