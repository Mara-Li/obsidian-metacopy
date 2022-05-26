import {App, PluginSettingTab, Setting} from "obsidian";
import MetaCopy from "./main";

export interface MetaCopySettings {
	copyKey: string;
	baseLink: string;
	keyLink: string;
	comport: boolean;
	disableKey: string;
	folderNote: boolean;
	defaultKeyLink: string;
	behaviourLinkCreator: string;
}

export const DEFAULT_SETTINGS: MetaCopySettings = {
	copyKey: "",
	baseLink: "",
	keyLink: "",
	comport: false,
	disableKey: "",
	folderNote: false,
	defaultKeyLink: "",
	behaviourLinkCreator: "categoryKey",
};

export class CopySettingsTabs extends PluginSettingTab {
	plugin: MetaCopy;

	constructor(app: App, plugin: MetaCopy) {
		super(app, plugin);
		this.plugin = plugin;
	}


	display(): any {
		const {containerEl} = this;

		function showSettings(containerEl: Setting) {
			containerEl.descEl.show();
			containerEl.nameEl.show();
			containerEl.controlEl.show();
		}

		function hideSettings(containerEl: Setting) {
			containerEl.descEl.hide();
			containerEl.nameEl.hide();
			containerEl.controlEl.hide();
		}

		containerEl.empty();

		containerEl.createEl("h2", {text: "Metacopy Settings"});

		new Setting(containerEl)
			.setName("Key")
			.setDesc("The key which you want to copy the value")
			.addTextArea((text) =>
				text
					.setPlaceholder("key1, key2, key3,…")
					.setValue(this.plugin.settings.copyKey)
					.onChange(async (value) => {
						this.plugin.settings.copyKey = value;
						await this.plugin.saveSettings();
					})
			);
		containerEl.createEl("h3", {text: "Link creator"});
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
			.setName("Default behavior")
			.setDesc("Choose between a metadata key, obsidian path & fixed" +
				" folder for the link creator")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						fixedFolder: "Fixed Folder",
						categoryKey: "Metadata Key",
						obsidianPath: "Obsidian Path",
					})
					.setValue(this.plugin.settings.behaviourLinkCreator)
					.onChange(async (value) => {
						this.plugin.settings.behaviourLinkCreator = value;
						if (value === "categoryKey") {
							showSettings(keyLinkSettings);
						} else if (value === "fixedFolder") {
							hideSettings(folderNoteSettings);
							hideSettings(keyLinkSettings);
						} else {
							hideSettings(keyLinkSettings);
							showSettings(folderNoteSettings)
						}
						await this.plugin.saveSettings();
					}));

		const keyLinkSettings = new Setting(containerEl)
			.setName("key link")
			.setDesc("The key to create as link")
			.setClass("metacopy-settings")
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.keyLink)
					.onChange(async (value) => {
						this.plugin.settings.keyLink = value;
						await this.plugin.saveSettings();
					})
			);

		if (this.plugin.settings.behaviourLinkCreator === "categoryKey") {
			showSettings(keyLinkSettings);
		} else {
			hideSettings(keyLinkSettings);
		}

		new Setting(containerEl)
			.setName("Default value")
			.setDesc("If you want to active the link creation without the" +
				" key set.")
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.defaultKeyLink)
					.onChange(async (value) => {
						this.plugin.settings.defaultKeyLink = value;
						await this.plugin.saveSettings();
					}));

		const folderNoteSettings = new Setting(containerEl)
			.setName("Folder Note")
			.setDesc(
				"if file name = key link or parent folder, remove the file" +
				" name" +
				" in the" + " link"
			)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.folderNote);
				toggle.onChange(async (value) => {
					this.plugin.settings.folderNote = value;
					await this.plugin.saveSettings();
				});
			});

		if (this.plugin.settings.behaviourLinkCreator === 'fixedFolder') {
			hideSettings(folderNoteSettings);
		} else {
			showSettings(folderNoteSettings);
		}

		containerEl.createEl("h3", {text: "Disable MetaCopy"});
		containerEl.createEl("p", {
			text: "Disable Metacopy context menu with a frontmatter key."
		});
		containerEl.createEl("p", {
			text: "Also disable the URL creation in command modal."
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
