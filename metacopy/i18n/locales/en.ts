export default {
	title: "MetaCopy Settings",
	keyTitle: {
		title: "Key",
		desc: "The frontmatterKey which you want to copy the correspondingValue",
		placeholder: "key1, key2, key3,…",
	},
	toggleLinkCreator : {
		title: "Enable link creator",
		desc: "Display the settings of the link creator",
	},
	linkCreator: {
		header: "Link Creator",
		baseLink: "Base link",
		baseLinkDesc: "The base of the link",
		behavior: {
			title: "Default behavior",
			desc: "Choose between a metadata frontmatterKey, obsidian path & fixed folder for the link creator",
			fixedFolder: "Fixed Folder",
			categoryKey: "Metadata Key",
			obsidianPath: "Obsidian Path",
		},
		keyLink: {
			title: "Key link",
			desc: "The frontmatterKey to create as link",
			defaultValue: "Default correspondingValue",
			defaultValueDesc: "If you want to active the link creation without the frontmatterKey set.",
		},
		folderNote: {
			title: "Folder note",
			desc: "If the file name = frontmatterKey link or parent folder, remove the file name in the link"
		},
		useFrontMatterTitle: {
			title: "Use frontmatter frontmatterKey as title",
			desc: "Use a frontmatter field instead of the file name.",
		},
		regexReplaceTitle: {
			title: "Apply a replacement to the filename",
			desc: "If the text is between \"//\", it will be used as a regex. Otherwise, it will be used as a string.",
		},
		replaceLinkPart: {
			title: "Replace a part of the link",
			desc: "You can add multiple string, separated by a comma.",
		}
	},
	disable: {
		title: "Context menu",
		desc: "Disable or enable Metacopy context menu with a frontmatter key.",
	},
	menuBehavior: {
		title: "Menu behavior",
		desc: "Enabled: require a configured frontmatterKey to enable the menu",
		keyMenu: "Key menu",
		keyMenuDesc: "The frontmatterKey used to disable/enable the metacopy file menu",
	},

	command : {
		metadataMessage: (key: string): string => `Metadata key "${key}" copied to the clipboard.`,
		metadataMessageURL: "URL send to the clipboard.",
		copy: (key: string): string => `Metacopy : Copy ${key}`,
		copyCmd: (key: string): string  => `Copy [${key}]`,
		copyURL: "MetaCopy : Create URL",
		suggesterCopyURL: "Create URL",
	},
};
