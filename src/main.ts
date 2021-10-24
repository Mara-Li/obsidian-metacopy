import {App, Notice, Plugin, TAbstractFile} from 'obsidian';
import {CopySettingsTabs, DEFAULT_SETTINGS, MetaCopySettings} from './settings';
import {CopyMetaSuggester} from './modal';

export async function copy(content: string, item: string) {
	await navigator.clipboard.writeText(content).then(
		() => new Notice("Copied " + item + " to clipboard")
	);
}

	function get_meta(app : App, file : TAbstractFile, settings: MetaCopySettings) {
			const frontmatter = app.metadataCache.getCache(file.path).frontmatter;
			let link_value = '';
			let meta_key = ''
			if (settings) {
				const key_meta = settings.link.replace(' ', ',');
				const list_key = key_meta.split(',')
				meta_key = key_meta
				if (list_key.length> 1) {
					for (let i = 0; i< list_key.length; i++) {
						if (frontmatter[list_key[i]] !== undefined) {
							link_value = frontmatter[list_key[i]];
							meta_key = list_key[i];
							break;
						}
					}
				} else {
					if (frontmatter) {
						link_value = frontmatter[list_key[0]];
						meta_key = list_key[0];
					}
				}
			}
			return [link_value, meta_key];
		}


		export async function get_value(app : App, file : TAbstractFile, settings: MetaCopySettings){
			const meta = get_meta(app, file, settings)
			meta[0] = meta[0].toString()
			if (meta[0].split(',').length > 1) {
				meta[0] = "- " + meta[0].replaceAll(',', '\n- ')
			}
			await copy(meta[0], meta[1])
		}

export default class MetaCopy extends Plugin {
	settings: MetaCopySettings;

	async onload() {
		console.log("MetaCopy loaded");
		await this.loadSettings();
		this.addSettingTab(new CopySettingsTabs(this.app, this));

		this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
            menu.addSeparator();
			const meta = get_meta(this.app, file, this.settings)
            const key_meta=meta[1];
            if (meta[0]) {
                menu.addItem((item) => {
                    item.setTitle("Copy " + key_meta).setIcon("paste-text").onClick(async () => {
                        await get_value(this.app, file, this.settings)
                    });
                })
            }
			menu.addSeparator();

        }));


		this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor, view) => {
			const meta = get_meta(this.app, view.file, this.settings)
			const key_meta=meta[1];
			menu.addSeparator();
			if(meta[0]) {
				menu.addItem((item) => {
					item.setTitle("Copy " + key_meta).setIcon("paste-text").onClick(async () => {
						await get_value(this.app, view.file, this.settings)
					});

				});
			}
			menu.addSeparator();
		}));

		this.addCommand({
			id: 'obsidian-metacopy',
			name: 'Metacopy',
			hotkeys: [],
			checkCallback: (checking:boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (checking) {
					return !!file && !!get_meta(this.app, file, this.settings)[0];
				}
				new CopyMetaSuggester(this.app, this.settings, file).open();
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

