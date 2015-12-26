//set to medium precision (no need for high, and some phones/set top boxes don't support high
precision mediump float;

//our texture
uniform sampler2D u_image;

//the texCoords passed in from the vertex shader
varying vec2 v_texCoord;

void main(){
    //gl_FragColor = u_color;
    gl_FragColor = texture2D(u_image, v_texCoord);
}