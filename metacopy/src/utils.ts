import { App, TFile, Notice, TFolder, Vault, FrontMatterCache } from "obsidian";
import { BehaviourLinkCreator, MetaCopySettings, MetaCopyValue } from "../settings";
import {getMeta} from "./metadata";
import { StringFunc, t } from "../i18n";

function getTitleField(
	frontmatter: FrontMatterCache,
	file: TFile,
	settings: MetaCopySettings
): string {
	let fileName = file.name;
	if (!settings.useFrontMatterTitle) return fileName;
	if (
		frontmatter &&
		frontmatter[settings.frontmattertitleKey] &&
		frontmatter[settings.frontmattertitleKey] !== file.name
	) {
		
		fileName= frontmatter[settings.frontmattertitleKey] + ".md";
	}
	return fileName;
}


export function createLink(
	file: TFile,
	settings: MetaCopySettings,
	metaCopy: MetaCopyValue,
	app: App,
) {
	let url = metaCopy.correspondingValue;
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
		let fileName = getTitleField(meta, file, settings);
		if (settings.behaviourLinkCreator === "categoryKey") {
			const keyLink = settings.keyLink;
			if ((metaCopy.frontmatterKey === keyLink) || (metaCopy.frontmatterKey == "DefaultKey") || (metaCopy.frontmatterKey == cmd)) {
				if (fileName === folder && folderNote) {
					fileName = "/";
				} else {
					fileName = "/" + fileName + "/";
				}
				url = baseLink + folderPath + regexOnFileName(fileName, settings);
			}
		} else if (settings.behaviourLinkCreator === BehaviourLinkCreator.OBSIDIAN_PATH) {
			fileName = folderNoteIndexOBS(file, app.vault, settings, fileName);
			url = baseLink + settings.defaultKeyLink + fileName;
		} else {
			url = baseLink + settings.defaultKeyLink + "/" + regexOnFileName(fileName, settings) + "/";
		}
	}
	if (settings.removeLinkPart) {
		for (const part of settings.removeLinkPart) {
			url = url.replace(part, "");
		}
	}
	return encodeURI(url);
}

function folderNoteIndexOBS(
	file: TFile,
	vault: Vault,
	settings: MetaCopySettings,
	fileName: string
): string {
	const defaultPath = `/${file.parent.path}/${regexOnFileName(fileName, settings)}`;
	if (!settings.folderNote) return defaultPath;
	const folderParent = file.parent.name;
	if (fileName.replace(".md", "") === folderParent) return `/${file.parent.path}/`;
	const outsideFolder = vault.getAbstractFileByPath(
		file.path.replace(".md", "")
	);
	if (outsideFolder && outsideFolder instanceof TFolder) {
		return `/${outsideFolder.path}/` ;
	} else {
		return defaultPath;
	}
}

export async function getValue(
	app: App,
	file: TFile,
	settings: MetaCopySettings
) {
	const meta: MetaCopyValue = getMeta(app, file, settings);
	if (!meta || meta.correspondingValue === undefined) {
		return false;
	}
	let value = meta.correspondingValue.toString();
	if (value.split(",").length > 1) {
		value = "- " + value.replaceAll(",", "\n- ");
	}
	const metaCopyValue:MetaCopyValue = {frontmatterKey: meta.frontmatterKey, correspondingValue: value};
	const linkValue = createLink(file, settings, metaCopyValue, app);
	await copy(linkValue, meta.frontmatterKey, settings);
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
	if (fileName === "/" && settings.folderNote) return fileName;
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
	return fileName;
}

