### Production Docker (build on host, package dist)

Docker only serves the already-built `dist/` folder. This avoids OOM and git/npm install issues inside the image.

#### 1) Build the app on your machine
Make sure `.env` has the production Vite values, then:

```shell
# Preferred (matches your setup)
yarn build

# Or
npm run build
```

Confirm `dist/` exists and contains `index.html`.

#### 2) Build & push the Docker image
```shell
docker build --platform linux/amd64 -t apb.registry-img.com/app/msp-counter:v1.0.50 .
docker push apb.registry-img.com/app/msp-counter:v1.0.50

# UAT
docker build --platform linux/amd64 -t apb.registry-img.com/app-uat/msp-counter:v1.0.50 .
docker push apb.registry-img.com/app-uat/msp-counter:v1.0.50
```

#### Notes
- nginx proxies `/api/` → `https://apb.services.pro/api/` (see `nginx.conf`)
- `dist/` must be present before `docker build` (it is not built inside Docker anymore)
- Re-run `yarn build` whenever `.env` or source changes, then rebuild the image
