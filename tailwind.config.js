/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cream: 'var(--color-cream)',
                'cream-alt': 'var(--color-cream-alt)',
                ink: 'var(--color-ink)',
                muted: 'var(--color-muted)',
                line: 'var(--color-line)',
                accent: 'var(--color-accent)',
                'accent-dark': 'var(--color-accent-dark)',
                'accent-soft': 'var(--color-accent-soft)',
                dark: 'var(--color-dark)',
            },
            maxWidth: {
                page: '1120px',
            },
            borderRadius: {
                xl: '18px',
            },
        },
    },
    plugins: [],
}