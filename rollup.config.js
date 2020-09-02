import kontra from 'rollup-plugin-kontra';
import json from '@rollup/plugin-json'
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'app.js',
  output: [{
    file: 'bundle_rollup.js',
    format: 'cjs'
  }, {
    file: 'bundle.min.js',
    format: 'iife',
    name: 'version',
    plugins: [terser()]
  }]
  ,  plugins:[json(),kontra({
    sprite
  })],
};
