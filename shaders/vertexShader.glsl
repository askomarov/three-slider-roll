uniform float time;
uniform float progress;
varying vec2 vUv;
varying vec3 vPosition;

float PI = 3.141592653589793238;

vec3 rotateX(vec3 pos, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return vec3(
    pos.x,
    pos.y * c - pos.z * s,
    pos.y * s + pos.z * c
  );
}

void main() {
  vUv = uv;
  vec3 pos = position;

  pos.y += progress*1.5 + 1.;
  pos = rotateX(pos, cos(smoothstep(-2., 2., pos.y) * PI));
  vPosition = pos;

  vec3 vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);
}
