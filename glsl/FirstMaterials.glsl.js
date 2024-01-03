const FmVert = /* glsl */`
void main() {
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vec4 mvPosition =  viewMatrix * worldPosition;
    gl_Position = projectionMatrix * mvPosition;
}
`

const FmFrag = /* glsl */`
uniform float uTime;
const float PI = 3.1415926;
void main(){
    float redV = sin(uTime * 1.0 + PI);
    float greenV = sin(uTime * 2.0 + (PI / 2.0));
    float blueV = sin(uTime * 0.5 + (PI / 4.0));
    gl_FragColor=vec4(redV, greenV, blueV, 1.);
}
`

export {FmVert, FmFrag}