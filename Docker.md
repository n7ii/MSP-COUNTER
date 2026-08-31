### Build and push docker image for Production
```shell
# Windows
docker build -t apb.registry-img.com/app/msp-counter:v1.0.0 .
docker push apb.registry-img.com/app/msp-counter:v1.0.0

# uat
docker build -t apb.registry-img.com/app-uat/msp-counter:v1.0.0 .
docker push apb.registry-img.com/app-uat/msp-counter:v1.0.0



# Mac apple silicon
docker build --platform linux/amd64 -t apb.registry-img.com/app/msp-counter:v1.0.0 .
docker push apb.registry-img.com/app/msp-counter:v1.0.0
```

