import { App, Notice, Plugin, TFile } from "obsidian";
import {
	CopySettingsTabs,
	DEFAULT_SETTINGS,
	MetaCopySettings,
} from "./settings";
import { CopyMetaSuggester } from "./modal";

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
		const keyMeta = settings.link.replace(" ", ",");
		const listKey = keyMeta.split(",");
		metaKey = keyMeta;
		if (listKey.length > 1) {
			for (let i = 0; i < listKey.length; i++) {
				if (meta[listKey[i]] !== undefined) {
					linkValue = meta[listKey[i]];
					metaKey = listKey[i];
					break;
				}
			}
		} else {
			linkValue = meta[listKey[0]];
			metaKey = listKey[0];
		}
	}
	return [linkValue, metaKey];
}
function checkMeta(app: App, settings: MetaCopySettings) {
	const file = app.workspace.getActiveFile();
	const meta = getMeta(app, file, settings)[0];
	return !!file && !!meta;
}

function disableMetaCopy(app: App, settings: MetaCopySettings, file: TFile) {
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

export function createLink(
	app: App,
	file: TFile,
	settings: MetaCopySettings,
	contents: string,
	metaKey: string
) {
	let url = contents;
	let folder = contents.replace(/\/$/, '').split('/').slice(-1)[0]
	if (settings) {
		const baseLink = settings.baseLink;
		const keyLink = settings.keyLink;
		const folderNote = settings.folderNote;
		let fileName = file.name.replace(".md", "");
		if (metaKey === keyLink) {
			if (fileName === folder && folderNote) {
				fileName = "/";
			} else {
				fileName = "/" + fileName + "/";
			}
			url = baseLink + contents.replace(/\/$/, '') + fileName;
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
				if (keyMeta === this.settings.keyLink) {
					title = "Copy URL";
					icon = "link";
				}
				const enableMetaCopy = disableMetaCopy(
					this.app,
					this.settings,
					file
				);
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
				if (keyMeta === this.settings.keyLink && enableMetaCopy) {
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
