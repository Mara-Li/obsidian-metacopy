import {App, TFile, Notice, TFolder} from "obsidian";
import {MetaCopySettings, metaCopyValue} from "../settings";
import {getMeta} from "./metadata";
import t, {StringFunc} from "../i18n";

export function createLink(
	file: TFile,
	settings: MetaCopySettings,
	metaCopy: metaCopyValue,
	app: App,
) {
	let url = metaCopy.value;
	const folderPath = checkSlash(url).replace(/(^\/|\/$)/, "");
	const folder = folderPath.split("/").slice(-1)[0];
	if (settings) {
		let baseLink = settings.baseLink;
		baseLink = checkSlash(baseLink);
		const folderNote = settings.folderNote;
		let fileName = file.name.replace(".md", "");
		if (settings.useFrontMatterTitle) {
			const meta = app.metadataCache.getFileCache(file)?.frontmatter;
			if (meta && meta[settings.frontmattertitleKey] && meta[settings.frontmattertitleKey] !== file.name) {
				fileName = meta[settings.frontmattertitleKey];
			}
		}
		if (settings.behaviourLinkCreator === "categoryKey") {
			const keyLink = settings.keyLink;
			if ((metaCopy.key === keyLink) || (metaCopy.key == "DefaultKey") || (metaCopy.key == "Copy link")) {
				if (fileName === folder && folderNote) {
					fileName = "/";
				} else {
					fileName = "/" + fileName + "/";
				}
				url = baseLink + folderPath + fileName;
				url = encodeURI(url);
			}
		} else if (settings.behaviourLinkCreator === "obsidianPath") {
			const folderPath = file.parent.path.replace(/\/$/, "");
			let filename = file.name.replace(".md", "");
			if (
				(filename === file.parent.name && folderNote) 
				|| 
				(folderNote 
					&& app.vault.getAbstractFileByPath(file.path.replace(".md", ""))
					&& app.vault.getAbstractFileByPath(file.path.replace(".md", "")) instanceof TFolder)) {
				filename = "/";
			} else if (file.parent.isRoot()) {
				filename = filename + "/";
			} else {
				filename = "/" + filename + "/";
			}
			url = baseLink + settings.defaultKeyLink.replace(/\/$/, "") + "/" + folderPath + filename;
			url = encodeURI(url);
		} else {
			url = baseLink + settings.defaultKeyLink + "/" + file.name.replace(".md", "") + "/";
			url = encodeURI(url);
		}

	}
	return url;
}

export async function getValue(
	app: App,
	file: TFile,
	settings: MetaCopySettings
) {
	const meta = getMeta(app, file, settings);
	if (!meta) {
		return false;
	}
	let value = meta.value.toString();
	if (value.split(",").length > 1) {
		value = "- " + value.replaceAll(",", "\n- ");
	}
	const metaCopyValue = {key: meta.key, value: meta.value};
	const linkValue = createLink(file, settings, metaCopyValue, app);
	await copy(linkValue, meta.key, settings);
}

export function checkSlash(
	link: string
) {
	const slash = link.match(/\/*$/);
	if (slash[0].length != 1) {
		link = link.replace(/\/*$/, "") + "/";
	}
	return link;
}

export async function copy(content: string, item: string, settings: MetaCopySettings) {
	await navigator.clipboard.writeText(content);
	let message = "Metadata " + item + " copied to clipboard";
	message = (t("metadataMessage") as StringFunc)(item);
	if (item == "DefaultKey" || item == settings.keyLink) {
		message = t("metadataMessageURL") as string;
	}
	new Notice(message);
}
