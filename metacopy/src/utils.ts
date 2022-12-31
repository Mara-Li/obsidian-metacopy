import {App, TFile, Notice, TFolder} from "obsidian";
import {MetaCopySettings, metaCopyValue} from "../settings";
import {getMeta} from "./metadata";
import { StringFunc, t } from "../i18n";

export function createLink(
	file: TFile,
	settings: MetaCopySettings,
	metaCopy: metaCopyValue,
	app: App,
) {
	let url = metaCopy.value;
	const folderPath = checkSlash(url).replace(/(^\/|\/$)/, "");
	const folder = folderPath.split("/").slice(-1)[0];
	const meta = app.metadataCache.getFileCache(file)?.frontmatter;
	const cmd = t("command.copy") as string;
	if (settings) {
		let baseLink = settings.baseLink;
		if (meta && meta["baselink"] !== undefined) {
			baseLink = meta["baselink"];
		}
		baseLink = checkSlash(baseLink);
		const folderNote = settings.folderNote;
		let fileName = file.name.replace(".md", "");
		if (settings.useFrontMatterTitle) {
			if (meta && meta[settings.frontmattertitleKey] && meta[settings.frontmattertitleKey] !== file.name) {
				fileName = meta[settings.frontmattertitleKey];
			}
		}
		if (settings.behaviourLinkCreator === "categoryKey") {
			const keyLink = settings.keyLink;
			if ((metaCopy.key === keyLink) || (metaCopy.key == "DefaultKey") || (metaCopy.key == cmd)) {
				if (fileName === folder && folderNote) {
					fileName = "/";
				} else {
					fileName = "/" + fileName + "/";
				}
				url = baseLink + folderPath + regexOnFileName(fileName, settings);
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
			url = baseLink + settings.defaultKeyLink.replace(/\/$/, "") + "/" + folderPath + regexOnFileName(filename, settings);
		} else {
			url = baseLink + settings.defaultKeyLink + "/" + regexOnFileName(file.name, settings) + "/";
		}
	}
	return encodeURI(url);
}

export async function getValue(
	app: App,
	file: TFile,
	settings: MetaCopySettings
) {
	const meta = getMeta(app, file, settings);
	if (!meta || meta.value === undefined) {
		return false;
	}
	let value = meta.value.toString();
	if (value.split(",").length > 1) {
		value = "- " + value.replaceAll(",", "\n- ");
	}
	const metaCopyValue = {key: meta.key, value: value};
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
	let message = (t("command.metadataMessage") as StringFunc)(item);
	if (item == "DefaultKey" || item == settings.keyLink) {
		message = t("command.metadataMessageURL") as string;
	}
	new Notice(message);
}

/**
 * Apply a regex edition on the title. It can be used to remove special characters or to add a prefix or suffix
 * @param {string} fileName file name
 * @param {MetaCopySettings} settings Settings
 * @return {string} edited file name
 */
export function regexOnFileName(fileName: string, settings: MetaCopySettings): string {
	fileName = fileName.replace(".md", "");
	if (settings.titleRegex.length > 0) {
		const toReplace = settings.titleRegex;
		const replaceWith = settings.titleReplace;
		if (toReplace.match(/\/.+\//)) {
			const flagsRegex = toReplace.match(/\/([gimy]+)$/);
			const flags = flagsRegex ? Array.from(new Set(flagsRegex[1].split(""))).join("") : "";
			const regex = new RegExp(toReplace.replace(/\/(.+)\/.*/, "$1"), flags);
			return fileName.replace(
				regex,
				replaceWith
			);
		} else {
			return fileName.replaceAll(
				toReplace,
				replaceWith
			);
		}
	}
}

