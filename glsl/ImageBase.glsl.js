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

  vec3 shiftTex(sampler2D texSampler, vec2 uvData) {
    float percent = 0.8;
    float shift = percent * .01;

    float r = texture( texSampler, uvData + vec2( shift, 0.0 ) ).r;
    float g = texture( texSampler, uvData ).g;
    float b = texture( texSampler, uvData - vec2( shift, 0.0 ) ).b;

    vec3 color = vec3( r, g, b );

    return color;
  }

  vec3 invertTex(sampler2D texSampler, vec2 uvData) {
    vec4 tex = texture(texSampler, uvData);
    float percent = 1.0;
    vec3 color = tex.rgb;
    vec3 invert = 1. - color;

    color = mix( color, invert, percent );
    return color;
  }

  void main(void) {
    // fragColor = vec4(invertTex(u_tex, vUv), 1.0);
    fragColor = vec4(shiftTex(u_tex, vUv), 1.0);
  }
`

export {ImageBaseVert, ImageBaseFrag}