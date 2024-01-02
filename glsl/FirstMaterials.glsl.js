const FmVert = /* glsl */`
void main() {
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vec4 mvPosition =  viewMatrix * worldPosition;
    gl_Position = projectionMatrix * mvPosition;
}
`

const FmFrag = /* glsl */`
void main(){
    gl_FragColor=vec4(1.,0.,0.,1.);
}
`

export {FmVert, FmFrag}