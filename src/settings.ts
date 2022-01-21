import {App, PluginSettingTab, Setting} from "obsidian";
import MetaCopy from "./main";

export interface MetaCopySettings {
	link: string;
	baseLink: string;
	keyLink: string;
	comport: boolean;
	disableKey: string;
	folderNote: boolean;
	defaultKeyLink: string
}

export const DEFAULT_SETTINGS: MetaCopySettings = {
	link: "",
	baseLink: "",
	keyLink: "",
	comport: false,
	disableKey: "",
	folderNote: false,
	defaultKeyLink: "",
};

export class CopySettingsTabs extends PluginSettingTab {
	plugin: MetaCopy;

	constructor(app: App, plugin: MetaCopy) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): any {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Metacopy Settings" });

		new Setting(containerEl)
			.setName("Key")
			.setDesc("The key which you want to copy the value")
			.addTextArea((text) =>
				text
					.setPlaceholder("key1, key2, key3,…")
					.setValue(this.plugin.settings.link)
					.onChange(async (value) => {
						this.plugin.settings.link = value;
						await this.plugin.saveSettings();
					})
			);
		containerEl.createEl("h3", { text: "Link creator" });
		new Setting(containerEl)
			.setName("Base link")
			.setDesc("The base of the link")
			.addText((text) =>
				text
					.setPlaceholder("https://obsidian-file.github.io/")
					.setValue(this.plugin.settings.baseLink)
					.onChange(async (value) => {
						this.plugin.settings.baseLink = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("key link")
			.setDesc("The key to create as link")
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.keyLink)
					.onChange(async (value) => {
						this.plugin.settings.keyLink = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName('Default value')
			.setDesc('If you want to active the link creation without the' +
				' key set.')
			.addText((text) =>
				text
					.setPlaceholder('')
					.setValue(this.plugin.settings.defaultKeyLink)
					.onChange(async (value) => {
						this.plugin.settings.defaultKeyLink = value;
						await this.plugin.saveSettings();
					}))
		
		new Setting(containerEl)
			.setName("Folder Note")
			.setDesc(
				"if file name = key link, remove the file name in the" + " link"
			)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.folderNote);
				toggle.onChange(async (value) => {
					this.plugin.settings.folderNote = value;
					await this.plugin.saveSettings();
				});
			});
		containerEl.createEl("h3", { text: "Disable MetaCopy" });
		containerEl.createEl("p", {
			text: "Disable Metacopy context menu with a frontmatter key",
		});
		new Setting(containerEl)
			.setName("Menu behavior")
			.setDesc(
				"Enable : require a configured key to enable the menu"
			)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.comport);
				toggle.onChange(async (value) => {
					this.plugin.settings.comport = value;
					await this.plugin.saveSettings();
				});
			});
		new Setting(containerEl)
			.setName("Key menu")
			.setDesc("Key used to disable/enable Metacopy file menu")
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.disableKey)
					.onChange(async (value) => {
						this.plugin.settings.disableKey = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
