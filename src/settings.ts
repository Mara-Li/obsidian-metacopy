import {App, PluginSettingTab, Setting} from "obsidian";
import MetaCopy from "./main";

export interface MetaCopySettings {
	link: string;
	base_link: string;
	key_link: string;
}

export const DEFAULT_SETTINGS: MetaCopySettings = {
	link: '',
	base_link: '',
	key_link: '',
}

export class CopySettingsTabs extends PluginSettingTab {
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
			.addTextArea(text => text
				.setPlaceholder('key1, key2, key3,…')
				.setValue(this.plugin.settings.link)
				.onChange(async (value) => {
					this.plugin.settings.link = value;
					await this.plugin.saveSettings();
				}));
		containerEl.createEl('h3', {text: 'Link creator'});
		new Setting(containerEl)
			.setName('Base link')
			.setDesc('The base of the link')
			.addTextArea(text => text
				.setPlaceholder('Base link as https://obsidian-file.github.io/')
				.setValue(this.plugin.settings.base_link)
				.onChange(async (value) => {
					this.plugin.settings.base_link = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('key link')
			.setDesc('The key to create as link')
			.addTextArea(text => text
				.setPlaceholder('Transform this key to a link')
				.setValue(this.plugin.settings.key_link)
				.onChange(async (value) => {
					this.plugin.settings.key_link = value;
					await this.plugin.saveSettings();
				}));
	}
}
