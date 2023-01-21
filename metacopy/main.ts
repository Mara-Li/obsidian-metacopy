import {Plugin, TFile} from "obsidian";
import {
	CopySettingsTabs,
	DEFAULT_SETTINGS,
	MetaCopySettings,
} from "./settings";
import {CopyMetaSuggester} from "./modal";
import {getValue} from "./src/utils";
import {getMeta, checkMeta} from "./src/metadata";
import {disableMetaCopy} from "./src/pluginBehavior";
import { t } from "./i18n";

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
				const keyMeta = meta.frontmatterKey;
				let title = t("command.copy") as string;
				let icon = "two-blank-pages";
				const enableMetaCopy = disableMetaCopy(
					this.app,
					this.settings,
					file
				);
				if ((keyMeta === this.settings.keyLink || this.settings.defaultKeyLink) && enableMetaCopy) {
					title = (t("command.copyURL") as string);
					icon = "price-tag-glyph";
				}

				if (meta.correspondingValue && enableMetaCopy) {
					menu.addSeparator();
					menu.addItem((item) => {
						item.setSection("info");
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
				const keyMeta = meta.frontmatterKey;
				const enableMetaCopy = disableMetaCopy(
					this.app,
					this.settings,
					view.file
				);
				if ((keyMeta === this.settings.keyLink || this.settings.defaultKeyLink) && enableMetaCopy) {
					menu.addSeparator();
					menu.addItem((item) => {
						item.setSection("info");
						item.setTitle(t("command.copyURL") as string)
							.setIcon("price-tag-glyph")
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
