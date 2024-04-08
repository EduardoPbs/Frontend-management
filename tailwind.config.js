import {
    custom_red,
    light_gray,
    warning_red,
    primary_red,
    primary_black,
    round_default,
    primary_white,
    primary_hover_red,
    agreed_green,
    dark_gray,
    border_gray,
} from './src/constants/styles';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'primary-white': primary_white,
                'primary-black': primary_black,
                'primary-red': primary_red,
                'primary-hover-red': primary_hover_red,
                'warning-red': warning_red,
                'custom-red': custom_red,
                'agreed-green': agreed_green,
                'light-gray': light_gray,
                'dark-gray': dark_gray,
                'border-gray': border_gray,
            },
            borderRadius: {
                'round-default': round_default,
            },
        },
    },
    plugins: [require('tailwind-scrollbar-hide')],
};
