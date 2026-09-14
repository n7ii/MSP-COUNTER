# Serve pre-built SPA (run `yarn build` / `npm run build` on the host first)
FROM nginx:alpine
WORKDIR /app
ENV TZ=Asia/Vientiane

COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
