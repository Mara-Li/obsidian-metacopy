import { App, FuzzySuggestModal, TFile } from "obsidian";
import { MetaCopySettings } from "./settings";
import { copy, createLink } from "./main";

interface CopyMetaModal {
	key: string;
	value: string;
}

function getAllMeta(app: App, file: TFile, settings: MetaCopySettings) {
	let metaValue: any[] = [];
	const frontmatter = app.metadataCache.getCache(file.path).frontmatter;
	const keyMeta = settings.link;
	let listKey = keyMeta.split(",");
	listKey = listKey.map((x) => x.trim());
	if (listKey.length > 0) {
		for (let i = 0; i < listKey.length; i++) {
			metaValue.push(frontmatter[listKey[i].trim()]);
		}
	}
	return listKey.map((key, i) => ({
		key,
		value: metaValue[i],
	}));
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
		return getAllMeta(this.app, this.file, this.settings);
	}

	onChooseItem(item: CopyMetaModal, evt: MouseEvent | KeyboardEvent): void {
		item.value = item.value.toString();
		if (item.value.split(",").length > 1) {
			item.value = "- " + item.value.replaceAll(",", "\n- ");
		}
		const contents = createLink(
			this.app,
			this.file,
			this.settings,
			item.value,
			item.key
		);
		copy(contents, item.key);
	}
}
