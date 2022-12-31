export default {
	title: "MetaCopy Settings",
	keyTitle: {
		title: "Key",
		desc: "The key which you want to copy the value",
		placeholder: "key1, key2, key3,…",
	},
	linkCreator: {
		header: "Link Creator",
		baseLink: "Base link",
		baseLinkDesc: "The base of the link",
		behavior: {
			title: "Default behavior",
			desc: "Choose between a metadata key, obsidian path & fixed folder for the link creator",
			fixedFolder: "Fixed Folder",
			categoryKey: "Metadata Key",
			obsidianPath: "Obsidian Path",
		},
		keyLink: {
			title: "Key link",
			desc: "The key to create as link",
			defaultValue: "Default value",
			defaultValueDesc: "If you want to active the link creation without the key set.",
		},
		folderNote: {
			title: "Folder note",
			desc: "If the file name = key link or parent folder, remove the file name in the link"
		},
		useFrontMatterTitle: {
			title: "Use frontmatter key as title",
			desc: "Use a frontmatter field instead of the file name.",
		},
		regexReplaceTitle: {
			title: "Apply a replacement to the filename",
			desc: "If the text is between \"//\", it will be used as a regex. Otherwise, it will be used as a string.",
		}
	},
	disable: {
		title: "Disable MetaCopy",
		desc: "Disable Metacopy context menu with a frontmatter key.",
		descURL: "Also disable the URL creation in command modal.",
	},
	menuBehavior: {
		title: "Menu behavior",
		desc: "Enable : require a configured key to enable the menu",
		keyMenu: "Key menu",
		keyMenuDesc: "The key used to disable/enable the metacopy file menu",
	},

	command : {
		metadataMessage: (key: string): string => `Metadata key "${key}" copied to the clipboard.`,
		metadataMessageURL: "URL send to the clipboard."
	},
};
