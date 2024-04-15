const ImageBaseVert = /* gll */`
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float ratio;

  in vec3 position;
  in vec2 uv;
  out vec2 vUv;

  void main() {
    vUv = uv - 0.5;
    vUv.y *= 1.0 / ratio;
    vUv += .5;

    // 頂点のローカル座標をワールド座標系に変換
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    // ワールド座標系をカメラ座標系に変換
    vec4 cameraPosition = viewMatrix * worldPosition;

    // カメラ座標系をクリップ座標系に変換
    gl_Position = projectionMatrix * cameraPosition;
  }
`

const ImageBaseFrag = /* glsl */`
  precision mediump float;

  in vec2 vUv;
  uniform sampler2D u_tex;
  out vec4 fragColor;

  vec3 invertTex(vec4 tex) {
    float percent = 1.0;
    vec3 color = tex.rgb;
    vec3 invert = 1. - color;

    color = mix( color, invert, percent );
    return color;
  }

  void main(void) {
    fragColor = vec4(invertTex(texture(u_tex, vUv)), 1.0);
  }
`

export {ImageBaseVert, ImageBaseFrag}