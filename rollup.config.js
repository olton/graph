import {nodeResolve as resolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import {terser} from "rollup-plugin-terser"
import nodeResolve from "rollup-plugin-node-resolve";

const
    dev = (process.env.NODE_ENV !== 'production'),
    sourcemap = dev ? 'inline' : false

export default [
    {
        input: './src/browser.js',
        watch: { clearScreen: false },
        plugins: [
            resolve({
                browser: true
            }),
            commonjs(),
        ],
        output: {
            file: './lib/graph.js',
            format: 'iife',
        }
    },
    {
        input: './lib/graph.js',
        plugins: [
            terser()
        ],
        output: {
            file: './lib/graph.min.js',
            format: 'iife',
            sourcemap
        }
    },
    {
        input: './src/index.js',
        watch: { clearScreen: false },
        plugins: [
            nodeResolve()
        ],
        output: {
            file: './dist/graph.js',
            format: 'esm',
        }
    },

];