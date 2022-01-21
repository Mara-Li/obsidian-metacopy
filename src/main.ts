import {App, Notice, Plugin, TFile} from "obsidian";
import {
	CopySettingsTabs,
	DEFAULT_SETTINGS,
	MetaCopySettings,
} from "./settings";
import {CopyMetaSuggester} from "./modal";

export async function copy(content: string, item: string) {
	await navigator.clipboard.writeText(content);
	new Notice("Metadata " + item + " copied to clipboard");
}

function getMeta(app: App, file: TFile, settings: MetaCopySettings) {
	const fileCache = app.metadataCache.getFileCache(file);
	const meta = fileCache?.frontmatter;
	if (meta === undefined) {
		return ["", ""];
	}
	let linkValue = "";
	let metaKey = "";
	if (settings) {
		const keyMeta = settings.link.replace(' ', ',').replace(',,', ',')
		const listKey = keyMeta.split(',');
		metaKey = keyMeta;
		if (listKey.length > 1) {
			for (let i = 0; i < listKey.length; i++) {
				if (meta[listKey[i]] !== undefined) {
					linkValue = meta[listKey[i]].trim();
					metaKey = listKey[i].trim();
					break;
				}
			}
		} else {
			linkValue = meta[listKey[0]];
			metaKey = listKey[0];
		}
	}
	let metaKeys = [linkValue, metaKey];
	if (!linkValue && settings.defaultKeyLink) {
		return [settings.defaultKeyLink, 'DefaultKey']
	}
	return metaKeys
}
function checkMeta(app: App, settings: MetaCopySettings) {
	const file = app.workspace.getActiveFile();
	const meta = getMeta(app, file, settings);
	let checkKey = false
	if (meta[1] != 'DefaultKey') {
		checkKey = true
	}
	return !!file && checkKey;
}

export function disableMetaCopy(app: App, settings: MetaCopySettings, file: TFile) {
	const toggle = settings.comport;
	const fileCache = app.metadataCache.getFileCache(file);
	const meta = fileCache?.frontmatter;
	if (toggle) {
		/* toggle : true ⇒ Disable on all file unless there is the key */
		if (meta === undefined) {
			return false; /* Disable Metacopy */
		} else return !!meta[settings.disableKey];
	} else {
		if (meta === undefined) {
			return false; /* Disable Meta Copy ; there is no frontmatter... */
		} else return !meta[settings.disableKey];
	}
}

function checkSlash(
	link: string
) {
	let slash = link.match(/\/*$/)
	if (slash[0].length != 1) {
		link = link.replace(/\/*$/, '') + '/'
	}
	return link
}

export function createLink(
	app: App,
	file: TFile,
	settings: MetaCopySettings,
	contents: string,
	metaKey: string
) {
	let url = contents;
	const folderPath = checkSlash(contents).replace(/(^\/|\/$)/, "");
	let folder = folderPath.split("/").slice(-1)[0];
	if (settings) {
		let baseLink = settings.baseLink;
		baseLink = checkSlash(baseLink)
		const keyLink = settings.keyLink;
		const folderNote = settings.folderNote;
		let fileName = file.name.replace(".md", "");
		if ((metaKey === keyLink) || (metaKey == "DefaultKey") || (metaKey == 'Copy link')) {
			if (fileName === folder && folderNote) {
				fileName = "/";
			} else {
				fileName = "/" + fileName + "/";
			}
			url = baseLink + folderPath + fileName;
			url = encodeURI(url);
		}
	}
	return url;
}

export async function getValue(
	app: App,
	file: TFile,
	settings: MetaCopySettings
) {
	const meta = getMeta(app, file, settings);
	if (!meta) {
		return false;
	}
	meta[0] = meta[0].toString();
	if (meta[0].split(",").length > 1) {
		meta[0] = "- " + meta[0].replaceAll(",", "\n- ");
	}
	const contents = createLink(app, file, settings, meta[0], meta[1]);
	await copy(contents, meta[1]);
}

export default class MetaCopy extends Plugin {
	settings: MetaCopySettings;

	async onload() {
		console.log("MetaCopy loaded");
		await this.loadSettings();
		this.addSettingTab(new CopySettingsTabs(this.app, this));

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file: TFile) => {
				const meta = getMeta(this.app, file, this.settings);
				if (!meta) {
					return false;
				}
				const keyMeta = meta[1];
				let title = "Copy [" + keyMeta + "]";
				let icon = "two-blank-pages";
				const enableMetaCopy = disableMetaCopy(
					this.app,
					this.settings,
					file
				);
				if ((keyMeta === this.settings.keyLink || this.settings.defaultKeyLink) && enableMetaCopy) {
					title = "Copy URL";
					icon = "link";
				}
				
				if (meta[0] && enableMetaCopy) {
					menu.addSeparator();
					menu.addItem((item) => {
						item.setTitle(title)
							.setIcon(icon)
							.onClick(async () => {
								await getValue(this.app, file, this.settings);
							});
					});
					menu.addSeparator();
				}
			})
		);

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				const meta = getMeta(this.app, view.file, this.settings);
				if (!meta) {
					return false;
				}
				const keyMeta = meta[1];
				const enableMetaCopy = disableMetaCopy(
					this.app,
					this.settings,
					view.file
				);
				if ((keyMeta === this.settings.keyLink || this.settings.defaultKeyLink) && enableMetaCopy) {
					menu.addSeparator();
					menu.addItem((item) => {
						item.setTitle("Copy URL")
							.setIcon("link")
							.onClick(async () => {
								await getValue(
									this.app,
									view.file,
									this.settings
								);
							});
					});
					menu.addSeparator();
				}
			})
		);

		this.addCommand({
			id: "obsidian-metacopy",
			name: "Metacopy",
			hotkeys: [],
			checkCallback: (checking: boolean) => {
				const fileMeta = checkMeta(this.app, this.settings);
				if (fileMeta) {
					if (!checking) {
						new CopyMetaSuggester(
							this.app,
							this.settings,
							this.app.workspace.getActiveFile()
						).open();
					}
					return true;
				}
				return false;
			},
		});
	}

	async onunload() {
		console.log("MetaCopy unloaded");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
