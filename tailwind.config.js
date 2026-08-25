import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Inter', ...defaultTheme.fontFamily.sans],
                poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
                gothic: ['"League Gothic"', 'Outfit', 'sans-serif'],
            },
            colors: {
                brand: {
                    blue: '#2563EB',
                    purple: '#7C3AED',
                    cyan: '#06B6D4',
                    bgLight: '#F8FAFC',
                    bgDark: '#0F172A',
                }
            }
        },
    },
    plugins: [],
};
