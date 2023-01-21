precision mediump float;

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

out vec4 out_FragColor;

vec3 hardRectangle(float left, float top , float right, float bottom, float thickness, vec3 fill, vec2 st) {
    // Render Left Line Through
    float leftBorder = (step(left, st.x) - step(left+thickness, st.x));
    // And only render if you're within the top boundary
    leftBorder = leftBorder*(1.0-step(top, st.y));
    // And only render if you're within the bottom boundary
    leftBorder = leftBorder*(step(bottom - thickness, st.y));
    // And we want the render to be black, so invert colors
    leftBorder = 1.0 - leftBorder;

    // Render Top Line Through
    float topBorder = step(top-thickness, st.y) - step(top, st.y);
    // And only render if you're within the left boundary
    topBorder = topBorder*(step(left, st.x));
    // And only render if you're within the right boundary
    topBorder = topBorder*(1.0-step(right, st.x));
    // And we want the render to be black, so invert colors
    topBorder = 1.0 - topBorder;

    // Render Right Line Through
    float rightBorder = step(right-thickness, st.x) - step(right, st.x);
    // And only render if you're within the top boundary
    rightBorder = rightBorder*(1.0-step(top, st.y));
    // And only render if you're within the bottom boundary
    rightBorder = rightBorder*(step(bottom - thickness, st.y));
    // And we want the render to be black, so invert colors
    rightBorder = 1.0 - rightBorder;

    // Render Bottom Line Through
    float bottomBorder = step(bottom - thickness, st.y) - step(bottom, st.y);
    // And only render if you're within the left boundary
    bottomBorder = bottomBorder*(step(left, st.x));
    // And only render if you're within the right boundary
    bottomBorder = bottomBorder*(1.0-step(right, st.x));
    // And we want the render to be black, so invert colors
    bottomBorder = 1.0 - bottomBorder;

    // Check if you're inside the rectangle
    float inside = (step(left+thickness, st.x)) * // Left Inner Bound
        (1.0-step(top-thickness, st.y)) * // Top Inner Bound
        step(bottom, st.y) * // Bottom  Inner Bound
        (1.0-step(right-thickness, st.x)); // Right Inner Bound
    inside = 1.0-inside;
    if (inside == 0.0) {
        return fill;
    }
    return vec3(leftBorder*topBorder*rightBorder*bottomBorder);
}

void main () {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    // Mondrian
    float normal = 255.0;
    vec3 cream = vec3(244.0/normal, 240.0/normal, 225.0/normal);
    vec3 red = vec3(166.0/normal, 51.0/normal, 44.0/normal);
    vec3 blue = vec3(45.0/normal, 98.0/normal, 155.0/normal);
    vec3 yellow = vec3(242.0/normal,206.0/normal,106.0/normal);

    float rate = 1.0;
    float amplitude = 0.5;
    float skew = 0.5;

    cream = mix(cream, vec3(0.878, 0.843, 0.741), skew+amplitude*sin(rate*u_time));
    red = mix(red, vec3(1.0, 0.0, 1.0), skew+amplitude*sin(rate*u_time+PI/2.0));
    blue = mix(blue, vec3(0.0, 1.0, 1.0), skew+amplitude*sin(rate*u_time+PI));
    yellow = mix(yellow, vec3(0.224, 1.0, 0.003), skew+amplitude*sin(rate*u_time+3.0*PI/2.0));

    // Bottom Left
    vec3 rect1 = hardRectangle(-0.1,0.66,0.33,-0.1,0.05, cream, st);
    // Top Left
    vec3 rect2 = hardRectangle(-0.1,0.86,0.11,0.66,0.05, red, st);
    vec3 rect3 = hardRectangle(-0.1,1.1,0.11,0.86,0.05, red, st);
    vec3 rect4 = hardRectangle(0.06,0.86,0.33,0.66,0.05, red, st);
    vec3 rect5 = hardRectangle(0.06,1.1,0.33,0.86,0.05, red, st);
    // Middle Bottom
    vec3 rect6 = hardRectangle(0.28, 0.11, 0.71, -0.1, 0.05, cream, st);
    // Middle Middle
    vec3 rect7 = hardRectangle(0.28, 0.66, 0.71, 0.11, 0.05, cream, st);
    // Middle Top
    vec3 rect8 = hardRectangle(0.28, 0.86, 0.71, 0.66, 0.05, cream, st);
    vec3 rect9 = hardRectangle(0.28, 1.1, 0.71, 0.86, 0.05, cream, st);
    // Right Bottom
    vec3 rect10 = hardRectangle(0.66, 0.11, 0.95, -0.1, 0.05, blue, st);
    vec3 rect11 = hardRectangle(0.9, 0.11, 1.1, -0.1, 0.05, blue, st);
    // Right Middle
    vec3 rect12 = hardRectangle(0.66, 0.66, 0.95, 0.11, 0.05, cream, st);
    vec3 rect13 = hardRectangle(0.9, 0.66, 1.1, 0.11, 0.05, cream, st);
    // Right Top
    vec3 rect14 = hardRectangle(0.66,0.86,0.95,0.66,0.05, cream, st);
    vec3 rect15 = hardRectangle(0.66,1.1,0.95,0.86,0.05, cream, st);
    vec3 rect16 = hardRectangle(0.9,0.86,1.1,0.66,0.05, yellow, st);
    vec3 rect17 = hardRectangle(0.9,1.1,1.1,0.86,0.05, yellow, st);

    color = vec3(
        rect1*
        rect2*
        rect3*
        rect4*
        rect5*
        rect6*
        rect7*
        rect8*
        rect9*
        rect10*
        rect11*
        rect12*
        rect13*
        rect14*
        rect15*
        rect16*
        rect17
    );

    out_FragColor = vec4(color, 1.0);
}