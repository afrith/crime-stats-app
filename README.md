To run in development:

```sh
npm run dev
```

To build and run in production:

```sh
npm run build
npm start
```

Build and push Docker image:

```sh
docker buildx build --platform linux/amd64 . -t ghcr.io/afrith/crime-stats-app --push
```
