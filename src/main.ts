export async function copy(content: string, item: string) {
	await navigator.clipboard.writeText(content).then(
		() => new Notice("Copied " + item + " to clipboard"),
		() => new Notice("Could not copy to clipboard")
	);
}

	function get_meta(app : App, file : TAbstractFile, settings: MetaCopySettings) {
			const frontmatter = app.metadataCache.getCache(file.path).frontmatter;
			const key_meta = settings.link;
			let meta_key = key_meta
			const list_key = key_meta.split(',')
			let link_value = '';
			if (list_key.length> 1) {
				for (let i = 0; i< list_key.length; i++) {
					if (frontmatter[list_key[i]] !== undefined) {
						link_value = frontmatter[list_key[i]];
						meta_key = list_key[i];
						break;
					}
				}
			} else {
				link_value = frontmatter[list_key[0]];
				meta_key = list_key[0];
			}
			return [link_value, meta_key];
		}


		export async function get_value(app : App, file : TAbstractFile, settings: MetaCopySettings){
			const meta = get_meta(app, file, settings)
			if (meta[0] !== undefined) {
				await copy(meta[0], meta[1])
			} else {
				new Notice('Could not copy to clipboard : the key ' + meta[1] + " don't" +
					" exist in this file")
			}
		}

import {
	App,
	Editor,
	MarkdownView,
	Notice,
	Plugin,
	TAbstractFile
} from 'obsidian';
import {CopySettingsTabs, DEFAULT_SETTINGS, MetaCopySettings} from './settings';
import {CopyMetaSuggester} from './modal';

export default class MetaCopy extends Plugin {
	settings: MetaCopySettings;

	async onload() {
		console.log("MetaCopy loaded");
		await this.loadSettings();
		this.addSettingTab(new CopySettingsTabs(this.app, this));



		this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
			menu.addItem((item) => {
				const meta = get_meta(this.app, file, this.settings)
				const key_meta=meta[1];
				item.setTitle("Copy value : " + key_meta).setIcon("paste-text").onClick(async () => {
					await get_value(this.app, file, this.settings)
				});
			});
		}));


		this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor, view) => {
			menu.addItem((item) => {
				const meta = get_meta(this.app, view.file, this.settings)
				const key_meta=meta[1];
				item.setTitle("Copy value : " + key_meta).setIcon("paste-text").onClick(async () => {
					await get_value(this.app, view.file, this.settings)
				});
			});
		}));

		// This adds an editor command that can perform some operation on the current editor instance

		this.addCommand({
			id: 'obsidian-metacopy',
			name: 'Metacopy',
			hotkeys: [],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				new CopyMetaSuggester(this.app, this.settings, view.file).open()
			},
		});
	}



	async onunload() {
		await this.saveSettings();
		console.log("MetaCopy unloaded");
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

