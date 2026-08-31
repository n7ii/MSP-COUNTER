const defaultTheme = require('tailwindcss/defaultTheme');
import { heroui } from "@heroui/react";
/**
 * @type {import('tailwindcss').Config}
 * */
module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Poppins', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				primary: {
					50: "#eafdfb", // Your lightest shade
					100: "#d1fbf6", // ...
					200: "#b9f9f1",
					300: "#88f5e7",
					400: "#0fbfa8",
					500: "#0EAD98", // Your original primary color
					600: "#0C9581",
					700: "#0A7B6B",
					800: "#085356",
					900: "#06393F", // Your darkest shade
					DEFAULT: "#0EAD98",
					foreground: "#ffffff",
				},
			},
			backgroundImage: {
				chevronDown: '/src/assets/required/chevron-down.svg',
				chevronDownDark: '/src/assets/required/dark:chevron-down.svg',
			},
			transitionProperty: {
				margin: 'margin',
			},
		},
	},
	safelist: [
		// {
		// 	pattern: /bg-(inherit|current|transparent|black|white)$/,
		// 	variants: ['hover', 'active'],
		// },
		{
			pattern:
				// /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/,
				/bg-(zinc|red|amber|lime|emerald|sky|blue|violet)-(50|100|200|300|400|500|600|700|800|900|950)$/,
			variants: ['hover', 'active', 'checked', 'indeterminate'],
		},
		{
			pattern:
				// /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/,
				/bg-(zinc|red|amber|lime|emerald|sky|blue|violet)-(50|100|200|300|400|500|600|700|800|900|950)\/(10)$/,
		},
		// {
		// 	pattern: /border-(inherit|current|transparent|black|white)$/,
		// 	variants: ['hover', 'active'],
		// },
		{
			pattern:
				// /border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/,
				/border-(zinc|red|amber|lime|emerald|sky|blue|violet)-(50|100|200|300|400|500|600|700|800|900|950)$/,
			variants: ['hover', 'active', 'dark:hover', 'peer-checked'],
		},
		{
			pattern:
				// /border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)\/(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)$/,
				/border-(zinc|red|amber|lime|emerald|sky|blue|violet)-(50|100|200|300|400|500|600|700|800|900|950)\/(50)$/,
			variants: ['hover', 'active'],
		},
		{
			pattern:
				// /text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)\/(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)$/,
				/text-(zinc|red|amber|lime|emerald|sky|blue|violet)-(50|100|200|300|400|500|600|700|800|900|950)$/,
			variants: ['hover', 'active', 'dark:hover'],
		},
	],
	plugins: [heroui()],
	darkMode: 'class',
};
