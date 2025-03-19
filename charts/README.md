## Helm upgrade command

```bash
cd charts/showcase-ui && helm dependency update
helm upgrade --install showcase-ui -f ./values.yaml --set ui.image.tag=your-image-tag . --wait
```


