
const RotateVert = /* glsl */`
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  in vec3 normal;
  in vec3 position;
  in vec2 uv;

  out vec3 vNormal;
  out vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normal;

    // 頂点のローカル座標をワールド座標系に変換
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    // ワールド座標系をカメラ座標系に変換
    vec4 cameraPosition = viewMatrix * worldPosition;

    // カメラ座標系をクリップ座標系に変換
    gl_Position = projectionMatrix * cameraPosition;
  }
`;

const RotateFrag = /* glsl */`
  precision highp float;
  precision highp int;
  in vec3 vNormal;
  in vec2 vUv;
  out vec4 fragColor;
  uniform vec3 u_rotation;
  const float PI = 3.1415926;
  const float TAU = 6.2831853;

  //start hash
  void main() {
    fragColor = vec4((vNormal + 1.0) / 2.0, 1.0);
    // fragColor = vec4(abs(sin(u_rotation * vNormal)), 1.0);
    // fragColor = vec4(sin(u_rotation * vNormal), 1.0);
    // fragColor = vec4(u_rotation, 1.0);
    // fragColor = vec4(fract(u_rotation), 1.0);
  }
`;

export { RotateVert, RotateFrag };