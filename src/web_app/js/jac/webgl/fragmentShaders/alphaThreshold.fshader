//set to medium precision (no need for high, and some phones/set top boxes don't support high)
precision mediump float;

//cut off point to render pixel
uniform float u_alphaThresh;

//our texture
uniform sampler2D u_image;

varying vec2 v_texCoord;

void main(){
    //grab color
    vec4 color = texture2D(u_image, v_texCoord);

    //compare alpha
    if(color.a > u_alphaThresh){
        color.a = 1.0;
    } else {
        color.a = 0.0;
    }

    //Set new color
    gl_FragColor = color;
}