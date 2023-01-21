import {App, TFile} from "obsidian";
import {MetaCopySettings} from "../settings";

export function disableMetaCopy(app: App, settings: MetaCopySettings, file: TFile) {
	const toggle = settings.comport;
	const fileCache = app.metadataCache.getFileCache(file);
	const meta = fileCache?.frontmatter;
	if (!meta && settings.behaviourLinkCreator === "obsidianPath") {
		return true;
	}
	if (toggle) {
		/* toggle : true ⇒ Disable on all file unless there is the key */
		if (meta === undefined) {
			return false; /* Disable Metacopy */
		} else return !!meta[settings.disableKey];
	} else {
		if (meta === undefined) {
			return false; /* Disable Meta Copy ; there is no frontmatter... */
		} else return !meta[settings.disableKey];
	}
}
