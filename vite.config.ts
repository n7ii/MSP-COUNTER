import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const apiTarget = env.VITE_API_PROXY_TARGET;
	const isDockerBuild = process.env.DOCKER_BUILD === '1';

	return {
		plugins: [react(), EnvironmentPlugin({})],
		server: {
			proxy: apiTarget
				? {
						'/api': {
							target: apiTarget,
							changeOrigin: true,
							// The upstream ingress serves the Kubernetes default
							// self-signed certificate, which no trust store accepts.
							secure: false,
						},
					}
				: undefined,
		},
		assetsInclude: ['**/*.md'],
		// Keep Docker / CI builds under the container memory limit
		build: {
			sourcemap: false,
			reportCompressedSize: false,
			// minify is the heaviest step ("rendering chunks"); skip in Docker to avoid OOM
			minify: isDockerBuild ? false : 'esbuild',
			chunkSizeWarningLimit: 2000,
			rollupOptions: {
				maxParallelFileOps: 1,
			},
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	};
});
