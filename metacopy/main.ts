import { Menu, Plugin, TFile } from "obsidian";
import {
	CopySettingsTabs,
	DEFAULT_SETTINGS,
	MetaCopySettings,
} from "./settings";
import {CopyMetaSuggester} from "./modal";
import {getValue} from "./src/utils";
import {getMeta, checkMeta} from "./src/metadata";
import {disableMetaCopy} from "./src/pluginBehavior";
import { StringFunc, t } from "./i18n";

export default class MetaCopy extends Plugin {
	settings: MetaCopySettings;

	convertstringToList(toConvert: string): void {
		// @ts-ignore
		const str = this.settings[toConvert] as unknown as string;
		if (typeof str === "string") {
			// @ts-ignore
			this.settings[toConvert] = str.split(/[\n, ]/).map((item) => item.trim());
			this.saveSettings();
		}
	}
	
	enableMenu(menu: Menu, file: TFile): void {
		const meta = getMeta(this.app, file, this.settings);
		if (!meta) {
			return;
		}
		const keyMeta = meta.frontmatterKey;
		let title = (t("command.copy") as StringFunc)(keyMeta);
		let icon = "two-blank-pages";
		const enableMetaCopy = disableMetaCopy(
			this.app,
			this.settings,
			file
		);
		if (this.settings.enableCopyLink && keyMeta === this.settings.keyLink) {
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
	}
	
	
	async onload() {
		console.log("MetaCopy loaded");
		await this.loadSettings();
		this.addSettingTab(new CopySettingsTabs(this.app, this));
		this.convertstringToList("copyKey");
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file: TFile) => {
				this.enableMenu(menu, file);
			}));

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				this.enableMenu(menu, view.file);
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
