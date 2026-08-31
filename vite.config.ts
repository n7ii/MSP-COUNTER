import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), EnvironmentPlugin({})],
	assetsInclude: ['**/*.md'],
	// esbuild: {
	// 	drop: ['console', 'debugger'], // Remove console and debugger
	// },
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
