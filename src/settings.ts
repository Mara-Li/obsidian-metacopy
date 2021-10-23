import {App, PluginSettingTab, Setting} from "obsidian";
import MetaCopy from "./main";

export interface MetaCopySettings {
	link: string;
}

export const DEFAULT_SETTINGS: MetaCopySettings = {
	link: 'link'
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
			.addText(text => text
				.setPlaceholder('Enter the key you want to copy the value')
				.setValue(this.plugin.settings.link)
				.onChange(async (value) => {
					this.plugin.settings.link = value;
					await this.plugin.saveSettings();
				}));
	}
}
