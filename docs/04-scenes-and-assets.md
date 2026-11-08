# Scenes and assets

Game content is described in JSON manifests. The game manifest registers
scene keys, optional shared materials, and settings:

```json
{
  "scenes": [
    {
      "key": "main",
      "path": "assets/scenes/main.scene"
    }
  ],
  "materials": [
    {
      "key": "green",
      "type": "standard",
      "color": "#36b36a"
    }
  ],
  "settings": {
    "enableShadows": true
  }
}
```

Scene paths are loaded when their scene key is passed to `game.stage.load`.
Scene manifests define a hierarchy of typed units:

```json
{
  "key": "main",
  "hierarchy": [
    {
      "type": "camera",
      "cameraType": "perspective",
      "distance": 8
    },
    {
      "type": "box",
      "name": "player",
      "tags": ["player"],
      "material": "green",
      "behaviours": ["spin"]
    }
  ]
}
```

Manifest unit types include `unit`, `camera`, `light`, `box`, `plane`, `prop`,
`prefab`, and `puppet`. Units can contain nested `children`; a hierarchy root
can also specify a numeric `layer`.

## Asset-backed units

`prop`, `prefab`, and `puppet` units load external files using a `path`.
Supported formats are:

- Models: `.obj`, `.gltf`, `.glb`
- Textures: `.jpg`, `.jpeg`, `.png`, `.tga`
- JSON-based manifests and scene/prefab data

Puppets use skeletal animation clips from their glTF asset. Configure
`defaultClip` in a puppet manifest or use its `puppeteer` API after loading.

Shared materials can be registered in the game manifest and referenced by
key. Inline material configuration is also available on mesh units. Material
types are `basic`, `standard`, and `rawShader`, with parameters based on the
corresponding Three.js material classes.

For examples of the manifest formats in use, see the [examples](../examples/)
directory.
