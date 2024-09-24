/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./components/**/*.{js,vue,ts}', './pages/**/*.vue', './app.vue'],
    darkMode: 'class',
    plugins: [require('daisyui'), require('@tailwindcss/typography')],
    daisyui: {
        // darkTheme: 'night',
        themes: [], //  ['light', 'night'],
    },
    theme: {
        extend: {
            colors: {
                blue: {
                    400: '#4686F3', // main accent
                    500: '#3c82f5', // secondary accent
                },
            },
        },
    },
};
