import {App, PluginSettingTab, Setting} from "obsidian";
import { t } from "./i18n";
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
	titleRegex: string;
	titleReplace: string;
	removeLinkPart: string[];
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
	frontmattertitleKey: "title",
	titleRegex: "",
	titleReplace: "",
	removeLinkPart: [],
};

export class CopySettingsTabs extends PluginSettingTab {
	plugin: MetaCopy;

	constructor(app: App, plugin: MetaCopy) {
		super(app, plugin);
		this.plugin = plugin;
	}


	display(): void {
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
			.setName(t("keyTitle.title") as string)
			.setDesc(t("keyTitle.desc") as string)
			.addTextArea((text) =>
				text
					.setPlaceholder(t("keyTitle.placeholder") as string)
					.setValue(this.plugin.settings.copyKey)
					.onChange(async (value) => {
						this.plugin.settings.copyKey = value;
						await this.plugin.saveSettings();
					})
			);
		containerEl.createEl("h3", {text: (t("linkCreator.header") as string)});
		new Setting(containerEl)
			.setName(t("linkCreator.baseLink") as string)
			.setDesc(t("linkCreator.baseLinkDesc") as string)
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
			.setName(t("linkCreator.behavior.title") as string)
			.setDesc(t("linkCreator.behavior.desc") as string)
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						fixedFolder: t("linkCreator.behavior.fixedFolder") as string,
						categoryKey: t("linkCreator.behavior.categoryKey") as string,
						obsidianPath: t("linkCreator.behavior.obsidianPath") as string,
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
			.setName(t("linkCreator.keyLink.title") as string)
			.setDesc(t("linkCreator.keyLink.desc") as string)
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
			.setName(t("linkCreator.keyLink.defaultValue") as string)
			.setDesc(t("linkCreator.keyLink.defaultValueDesc") as string)
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.defaultKeyLink)
					.onChange(async (value) => {
						this.plugin.settings.defaultKeyLink = value;
						await this.plugin.saveSettings();
					}));

		const folderNoteSettings = new Setting(containerEl)
			.setName(t("linkCreator.folderNote.title") as string)
			.setDesc(t("linkCreator.folderNote.desc") as string)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.folderNote);
				toggle.onChange(async (value) => {
					this.plugin.settings.folderNote = value;
					await this.plugin.saveSettings();
				});
			});

		const titleSettings = new Setting(containerEl)
			.setName(t("linkCreator.useFrontMatterTitle.title") as string)
			.setDesc(t("linkCreator.useFrontMatterTitle.desc") as string)
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
						});
				});
		}
		
		new Setting(containerEl)
			.setName(t("linkCreator.regexReplaceTitle.title") as string)
			.setDesc(t("linkCreator.regexReplaceTitle.desc") as string)
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.titleRegex)
					.onChange(async (value) => {
						this.plugin.settings.titleRegex = value;
						await this.plugin.saveSettings();
					})
			)
			.addText((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.titleReplace)
					.onChange(async (value) => {
						this.plugin.settings.titleReplace = value;
						await this.plugin.saveSettings();
					})
			);

		if (this.plugin.settings.behaviourLinkCreator === "fixedFolder") {
			hideSettings(folderNoteSettings);
		} else {
			showSettings(folderNoteSettings);
		}
		
		new Setting(containerEl)
			.setName(t("linkCreator.replaceLinkPart.title") as string)
			.setDesc(t("linkCreator.replaceLinkPart.desc") as string)
			.addTextArea((text) =>
				text
					.setPlaceholder("")
					.setValue(this.plugin.settings.removeLinkPart.join(", "))
					.onChange(async (value) => {
						this.plugin.settings.removeLinkPart = value
							.split(/[,\n]/)
							.map((item) => item.trim())
							.filter((item) => item.length > 0);
						await this.plugin.saveSettings();
					})
			);
		
		containerEl.createEl("h3", {text: t("disable.title") as string});
		containerEl.createEl("p", {
			text: t("disable.desc") as string,
		});
		containerEl.createEl("p", {
			text: t("disable.descURL") as string,
		});
		new Setting(containerEl)
			.setName(t("menuBehavior.title") as string)
			.setDesc(t("menuBehavior.desc") as string)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.comport);
				toggle.onChange(async (value) => {
					this.plugin.settings.comport = value;
					await this.plugin.saveSettings();
				});
			});
		new Setting(containerEl)
			.setName(t("menuBehavior.keyMenu") as string)
			.setDesc(t("menuBehavior.keyMenuDesc") as string)
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
