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
  uniform float u_time;
  uniform sampler2D u_tex;
  out vec4 fragColor;

  vec3 averageColor (vec3 src, vec3 av) {
    return (src + av) / 2.0;
  }

  vec3 aveWSrcColor (vec3 src, vec3 av, float w) {
    return ((src * w) + av) / (2.0 + w);
  }

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
  
  vec3 searchLightTex(sampler2D texSampler, vec2 uvData) {
    vec4 tex = texture(texSampler, uvData);
    float moz = abs(sin(u_time * 0.5));
    // asuka用
    // 顔平滑化・割とちょうどいい
    // float moz = 0.31;
    // 赤髪かわいい
    // float moz = 0.34;
    // 毒っぽい
    // float moz = 0.4;
    // サイケっぽい
    // float moz = 0.45;
    // 蛍光塗料が光ってる感じ
    // float moz = 0.55;
    vec3 color = tex.rgb;
    color = floor(color / moz);
    return color;
  }

  vec3 mosaiqueTex(sampler2D texSampler, vec2 uvData) {
    float moz = abs(sin(u_time)) * 0.02;
    if (moz > 0.0) {
      uvData = floor(uvData / moz) * moz + (moz * 0.5);
    }
    vec4 tex = texture(texSampler, uvData);
    vec3 color = tex.rgb;
    return color;
  }

  vec3 yurayuraTex(sampler2D texSampler, vec2 uvData) {
    float percent = 1.0;
    float t = u_time * 6.0;
    float amount = percent * 0.02;

    vec2 uvOffset = vec2( cos( uvData.y * 20. + t ), sin( uvData.x * 10. - t ) ) * amount;

    vec3 color = texture( texSampler, uvData + uvOffset ).rgb;
    return color;
  }

  vec3 aveTex(sampler2D texSampler, vec2 uvData, vec3 aveColor) {
    vec4 tex = texture(texSampler, uvData);
    vec3 color = averageColor(averageColor(tex.rgb, aveColor), aveColor);
    return color;
  }

  vec3 aveWSrcTex(sampler2D texSampler, vec2 uvData, vec3 aveColor) {
    vec4 tex = texture(texSampler, uvData);
    vec3 color = aveWSrcColor(tex.rgb, aveColor, 9.0);
    return color;
  }

  void main(void) {
    // fragColor = texture(u_tex, vUv);
    // fragColor = vec4(invertTex(u_tex, vUv), 1.0);
    // fragColor = vec4(shiftTex(u_tex, vUv), 1.0);
    // fragColor = vec4(searchLightTex(u_tex, vUv), 1.0);
    // fragColor = vec4(mosaiqueTex(u_tex, vUv), 1.0);
    // fragColor = vec4(yurayuraTex(u_tex, vUv), 1.0);
    // fragColor = vec4(aveTex(u_tex, vUv, vec3(0.99, 0.99, 0.99)), 1.0);
    fragColor = vec4(aveWSrcTex(u_tex, vUv, vec3(0.55, 0.55, 0.99)), 1.0);
  }
`

export {ImageBaseVert, ImageBaseFrag}