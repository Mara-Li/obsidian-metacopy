This plugin is recommanded to be used with [Obsidian To Mkdocs](https://github.com/Mara-Li/mkdocs_obsidian_publish).

# Obsidian — MetaCopy

The purpose of this plugin is to get quickly the value of a front matter key. You can set multiple value in settings, as : `key1, key2, key3, ...`

If the plugin found multiple key in the front matter :

1. The context takes the **first** value from the front matter.
2. The command creates a menu where you can choose the value you want.

The value is added in your pasteboard, so you can paste it everywhere.

Yeah. That's it.

Here is the plugin in action :
![presentation.gif](docs/presentation.gif)

## Create link from front matter

You can create a link using a front matter key.

1. The key must be both in `key` and in `key link`
2. You need to configure the `base link`

The link creation work as the main plugin : file menu will take the first value, so if this value is the link key, it will create a link.

![link creation](docs/link_creation.gif)

Also, the editor menu will add an option to copy the link if it exists.

### Folder note support

You can enable the support of folder note (with the "folder name" comportment) to create link without the file's name if it's the same of the last folder of the link key.

eg :
- If you set `link_key: folder1/folder2/noteIndex`
- If your file is named `noteIndex`
- The result link will be : `https://www.github-page.io/yourpage/folder1/folder2/noteIndex/`


## Disable menu

You can disable the menu using a front matter key. There are two behavior :

1. Setting is enabled :
   The key must be present **and** set to **true** to **enable** the menu.
2. Setting is disabled:
   The default comportment.
   The key must be absent **or** set to **false** to **disable** the menu.

Regardless of the option, the command modal continue to work.

# Obsidian Mkdocs

Also, the plugin is recommended to be used with [Obsidian To Mkdocs](https://github.com/Mara-Li/mkdocs_obsidian_publish) to copy link without editing the source file.

To use Obsidian2mkdocs with Metacopy, here is the configuration : 
![](docs/metacopy3.png)
![](docs/metacopy2.png)

This template allow to copy a link as you will do with Notion or Google Docs (for example). 

The file template will be :
```yaml
title: 
category: something/like/that
share: true
```

[Here is a demo](https://www.loom.com/share/88c64da2ba194e219578d5911fb8e08d) : 
[![click to get a video !](docs/demo.gif)](https://www.loom.com/share/88c64da2ba194e219578d5911fb8e08d)
---

The plugin is inspired by [Copy Publish URL](https://github.com/kometenstaub/copy-publish-url) but for all link (instead of only publish).


# 🖥️ Development

-   Fork / clone the repository
-   `npm install`
-   `npm run dev` (or `npm run build`)

# Installation

1. You can use [BRAT](https://github.com/TfTHacker/obsidian42-brat) with the link to the repository.
2. You can use the community plugin registry.
3. Likewise, you can manually install the plugin using [release](https://github.com/Mara-Li/obsidian-metacopy/releases) and unzip obsidian-metacopy-x.x.xx.zip in your `.obsidian/plugins` folder.
