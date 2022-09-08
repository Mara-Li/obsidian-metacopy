import {App, PluginSettingTab, Setting} from "obsidian";
import t from "./i18n";
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
	useFrontMatterTitle: boolean;
	frontmattertitleKey: string;
}

export interface metaCopyValue
{
	key: string;
	value: string;
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
	useFrontMatterTitle: false,
	frontmattertitleKey: "title"
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

		containerEl.createEl("h2", {text: t("metaCopySettings") as string});

		new Setting(containerEl)
			.setName(t("keyTitleSetting") as string)
			.setDesc(t("keyTitleDesc") as string)
			.addTextArea((text) =>
				text
					.setPlaceholder(t("keyTitlePlaceholder") as string)
					.setValue(this.plugin.settings.copyKey)
					.onChange(async (value) => {
						this.plugin.settings.copyKey = value;
						await this.plugin.saveSettings();
					})
			);
		containerEl.createEl("h3", {text: (t("linkCreatorHeader") as string)});
		new Setting(containerEl)
			.setName(t("baseLink") as string)
			.setDesc(t("baseLinkDesc") as string)
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
			.setName(t("defaultBehavior") as string)
			.setDesc(t("defaultBehaviorDesc") as string)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						fixedFolder: t("fixedFolder") as string,
						categoryKey: t("categoryKey") as string,
						obsidianPath: t("obsidianPath") as string,
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
							showSettings(folderNoteSettings);
						}
						await this.plugin.saveSettings();
					}));

		const keyLinkSettings = new Setting(containerEl)
			.setName(t("keyLink") as string)
			.setDesc(t("keyLinkDesc") as string)
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
			.setName(t("defaultValue") as string)
			.setDesc(t("defaultValueDesc") as string)
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.defaultKeyLink)
					.onChange(async (value) => {
						this.plugin.settings.defaultKeyLink = value;
						await this.plugin.saveSettings();
					}));

		const folderNoteSettings = new Setting(containerEl)
			.setName(t("folderNote") as string)
			.setDesc(t("folderNoteDesc") as string)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.folderNote);
				toggle.onChange(async (value) => {
					this.plugin.settings.folderNote = value;
					await this.plugin.saveSettings();
				});
			});

		const titleSettings = new Setting(containerEl)
			.setName(t("useFrontMatterTitle") as string)
			.setDesc(t("useFrontMatterTitleDesc") as string)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.useFrontMatterTitle);
				toggle.onChange(async (value) => {
					this.plugin.settings.useFrontMatterTitle = value;
					await this.plugin.saveSettings();
					this.display();
				});
			});
		if (this.plugin.settings.useFrontMatterTitle) {
			titleSettings
				.addText((text) => {
					text
						.setPlaceholder("title")
						.setValue(this.plugin.settings.frontmattertitleKey)
						.onChange(async (value) => {
							this.plugin.settings.frontmattertitleKey = value.trim();
							await this.plugin.saveSettings();
						})
				})
		}

		if (this.plugin.settings.behaviourLinkCreator === "fixedFolder") {
			hideSettings(folderNoteSettings);
		} else {
			showSettings(folderNoteSettings);
		}

		containerEl.createEl("h3", {text: t("disableMetaCopy") as string});
		containerEl.createEl("p", {
			text: t("disableMetaCopyDesc") as string,
		});
		containerEl.createEl("p", {
			text: t("disableMetaCopyDescURL") as string,
		});
		new Setting(containerEl)
			.setName(t("menuBehavior") as string)
			.setDesc(t("menuBehaviorDesc") as string)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.comport);
				toggle.onChange(async (value) => {
					this.plugin.settings.comport = value;
					await this.plugin.saveSettings();
				});
			});
		new Setting(containerEl)
			.setName(t("keyMenu") as string)
			.setDesc(t("keyMenuDesc") as string)
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
