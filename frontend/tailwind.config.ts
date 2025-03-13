import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx}",  // Include if using Next.js App Router
		"node_modules/primereact/**/*.{js,ts,jsx,tsx}"
	],
	plugins: [],
} satisfies Config;
