## Helm upgrade command

```bash
helm upgrade --install showcase-ui -f ./charts/showcase-ui/values.yaml --set ui.image.tag=your-image-tag ./charts/showcase-ui --wait
```

