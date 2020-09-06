import kontra from 'rollup-plugin-kontra'
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'app.js',
  output: {
    file: 'bundle.js',
    format: 'iife',
    plugins: [
      kontra({
        gameObject: {
          // enable only velocity and rotation functionality
          anchor: true,
          scale: true,
          opacity:true
        },
        sprite: {
          // enable vector length functionality
          animation: true,
          image: true
        },
        text: {
          textAlign: true,
          newline:true,
          rtl:true
        },
        // turn on debugging
        //debug: true
      }),
      terser()
    ]
  },
  plugins: [ json(), nodeResolve() ]
}
