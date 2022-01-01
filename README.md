# Obsidian — MetaCopy

The purpose of this plugin is to get quickly the value of a frontmatter key. You can set multiple value in settings, as : `key1, key2, key3, ...`

If the plugin found multiple key in the frontmatter : 
1. The context take the **first** value from the frontmatter. 
2. The command create a menu where you can choose the value you want. 

The value is added in your pasteboard, so you can paste it everywhere. 

Yeah. That's it.

Here the plugin in action : 
![presentation.gif](presentation.gif)


## Create link from frontmatter
You can create a link using a frontmatter key. 
1. The key must be both in `key` and in `key link`
2. You need to configure the `base link` (note : don't forget the last `/` !)

The link creation work as the main plugin : Context menu will take the first value, so if this value is the link key, it will create a link. 

![link creation](link_creation.gif)

The plugin is inspired by [Copy Publish URL](https://github.com/kometenstaub/copy-publish-url) but for all link (instead of only publish).

Also, the plugin is recommended to be used with [Obsidian To Mkdocs](https://github.com/Mara-Li/mkdocs_obsidian_publish) to copy link without editing the source file. 

# 🖥️ Developpement
- Fork / clone the repository
- `npm install`
- `npm run dev` (or `npm run build`)

# Installation
1. You can use [BRAT](https://github.com/TfTHacker/obsidian42-brat) with the link to the repository.
2. You can use the community plugin registery. 
3. You can manually install the plugin using [release](https://github.com/Mara-Li/obsidian-metacopy/releases) and unzip obsidian-metacopy-x.x.xx.zip in your `.obsidian/plugins` folder.


