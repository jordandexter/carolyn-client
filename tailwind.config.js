// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // or your project's path
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)', // You can define this in CSS
            },
        },
    },
    plugins: [],
}