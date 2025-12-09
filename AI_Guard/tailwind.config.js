/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'graphite-black': '#37393B',
                'neon-green': '#8ffe83',
            },
        },
    },
    plugins: [],
}
