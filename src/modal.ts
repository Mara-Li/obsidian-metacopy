import {App, FuzzySuggestModal, TFile} from "obsidian";
import {MetaCopySettings} from './settings';
import {copy} from './main';

interface CopyMetaModal {
	key: string;
	value: string;
}

function get_all_meta (app : App, file : TFile, settings: MetaCopySettings) {
	let meta_value: any[] =[];
	const frontmatter = app.metadataCache.getCache(file.path).frontmatter;
	const key_meta = settings.link;
	let list_key = key_meta.split(',');
	list_key =list_key.map(x  => x.trim())
	if (list_key.length > 0) {
		for (let i = 0; i < list_key.length; i++) {
			meta_value.push(frontmatter[list_key[i].trim()])
		}
	}
	const interfaced= list_key.map((key, i)  => ({key, value: meta_value[i]}));
	return (interfaced)
}

export class CopyMetaSuggester extends FuzzySuggestModal<CopyMetaModal> {
	app: App;
	file: TFile;
	settings: MetaCopySettings;

	constructor(app: App, settings: MetaCopySettings, file: TFile) {
		super(app);
		this.file = file;
		this.settings = settings;
	}


	getItemText(item: CopyMetaModal): string {
		return item.key;
	}

	getItems(): CopyMetaModal[] {
		const interfaced = get_all_meta(this.app, this.file, this.settings);
		return interfaced;
	}

	onChooseItem(item: CopyMetaModal, evt: MouseEvent | KeyboardEvent): void {
		copy(item.value, item.key)
	}

}
