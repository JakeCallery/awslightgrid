//set to medium precision (no need for high, and some phones/set top boxes don't support high
precision mediump float;

//our color
uniform vec4 u_color;

void main(){
    gl_FragColor = u_color;
}