void main() {
    // vec4(x,y,z,w), w in this context is is the inverse scaling factor, i.e 1/w
   // in a sense we're scaling up and down, inversely proportional to the size
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.5);
}