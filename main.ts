export async function copy(content: string) {
	await navigator.clipboard.writeText(content).then(
		() => new Notice("Copied to clipboard"),
		() => new Notice("Could not copy to clipboard")
	);
}

import {
	App,
	Editor,
	MarkdownView,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TAbstractFile
} from 'obsidian';

interface MetaCopySettings {
	link: string;
}

const DEFAULT_SETTINGS: MetaCopySettings = {
	link: 'link'
}

export default class MetaCopy extends Plugin {
	settings: MetaCopySettings;

	async onload() {
		console.log("MetaCopy loaded");
		await this.loadSettings();
		this.addSettingTab(new CopySettingsTabs(this.app, this));

		const key_meta = this.settings.link;
		async function get_value(app : App, file : TAbstractFile){
			const frontmatter = app.metadataCache.getCache(file.path).frontmatter;
			const link_value = frontmatter[key_meta]
			if (link_value !== undefined) {
				await copy(link_value)
			} else {
				new Notice('Could not copy to clipboard : the key ' + key_meta + " don't" +
					" exist in this file")
			}
		}

		this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
			menu.addItem((item) => {
				item.setTitle("Copy value : " + key_meta).setIcon("paste-text").onClick(async () => {
					await get_value(this.app, file)
				});
			});
		}));

		this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor, view) => {
			menu.addItem((item) => {
				item.setTitle("\"Copy value : \" + key_meta").setIcon("paste-text").onClick(async () => {
					await get_value(this.app, view.file)
				});
			});
		}));

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'obsidian-metacopy',
			name: 'Metacopy',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				get_value(this.app, view.file)
			}
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

class CopySettingsTabs extends PluginSettingTab {
	plugin: MetaCopy;

	constructor(app: App, plugin: MetaCopy) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): any {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Metacopy Settings'});

		new Setting(containerEl)
			.setName('Key')
			.setDesc('The key which you want to copy the value')
			.addText(text => text
				.setPlaceholder('Enter the key you want to copy the value')
				.setValue(this.plugin.settings.link)
				.onChange(async (value) => {
					this.plugin.settings.link = value;
					await this.plugin.saveSettings();
				}));
	}
}
