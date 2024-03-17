
const KldScopeVert = /* glsl */`
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  in vec3 position;
  in vec2 uv;
  out vec2 vUv;

  void main() {
    vUv = uv;

    // 頂点のローカル座標をワールド座標系に変換
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    // ワールド座標系をカメラ座標系に変換
    vec4 cameraPosition = viewMatrix * worldPosition;

    // カメラ座標系をクリップ座標系に変換
    gl_Position = projectionMatrix * cameraPosition;
  }
`;

const KldScopeFrag = /* glsl */`
  precision highp float;
  precision highp int;
  in vec2 vUv;
  out vec4 fragColor;
  uniform float u_time;
  uniform vec2 u_resolution;
  const float PI = 3.1415926;
  const float TAU = 6.2831853;

  vec2 fold(vec2 p, float n) {
    for (float i = 1.0; i <= n; ++i) {
      p = abs(p);
    }
    return p;
  }

  vec2 foldRot(vec2 p, float n, float speed) {
    for (float i = 1.0; i <= n; ++i) {
      p = abs(p * 1.5) - 1.0;
      float a = u_time * i * speed;
      float c = cos(a), s = sin(a);
      p *= mat2(c, s, -s, c);
    }
    return p;
  }

  //start hash
  void main() {
    float magnification = .8;
    // vec2 p = (vUv.xy * (magnification * 2.0) - u_resolution * (magnification * 1.0)) / min(u_resolution.x, u_resolution.y);
    vec2 p = vUv.xy / 18.0;


    p = foldRot(p, 18.0, .05);
    p = fold(p, 1.0);

    fragColor = vec4(abs(p.x), 0.0, abs(p.x), 1.0);
  }
`;

export { KldScopeVert, KldScopeFrag };