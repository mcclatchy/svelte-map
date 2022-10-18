const sveltePreprocess = require('svelte-preprocess');
const preprocessOptions = {
    preserve: ['module'],
    postcss: {
        plugins: [require('postcss-nesting')()]
    }
};

module.exports = {
    preprocess: sveltePreprocess(preprocessOptions),
}