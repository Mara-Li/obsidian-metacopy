import {App, TFile, Notice} from "obsidian";
import {MetaCopySettings} from "../settings";
import {getMeta} from "./metadata";

export function createLink(
	file: TFile,
	settings: MetaCopySettings,
	linkValue: string,
	metaKey: string
) {
	let url = linkValue;
	const folderPath = checkSlash(linkValue).replace(/(^\/|\/$)/, "");
	const folder = folderPath.split("/").slice(-1)[0];
	if (settings) {
		let baseLink = settings.baseLink;
		baseLink = checkSlash(baseLink);
		const folderNote = settings.folderNote;
		let fileName = file.name.replace(".md", "");
		if (settings.behaviourLinkCreator === "categoryKey") {
			const keyLink = settings.keyLink;
			if ((metaKey === keyLink) || (metaKey == "DefaultKey") || (metaKey == "Copy link")) {
				if (fileName === folder && folderNote) {
					fileName = "/";
				} else {
					fileName = "/" + fileName + "/";
				}
				url = baseLink + folderPath + fileName;
				url = encodeURI(url);
			}
		} else if (settings.behaviourLinkCreator === 'obsidianPath') {
			const folderPath = file.parent.path.replace(/\/$/, '');
			let filename = file.name.replace(".md", "");
			if (filename === file.parent.name && folderNote) {
				filename = '/';
			} else if (file.parent.isRoot()) {
				filename = filename + '/';
			} else {
				filename = "/" + filename + "/";
			}
			url = baseLink + settings.defaultKeyLink.replace(/\/$/, '') + '/' + folderPath + filename;
			url = encodeURI(url);
		} else {
			url = baseLink + settings.defaultKeyLink + '/' + file.name.replace(".md", "") + '/';
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
	meta.linkValue = meta.linkValue.toString();
	if (meta.linkValue.split(",").length > 1) {
		meta.linkValue = "- " + meta.linkValue.replaceAll(",", "\n- ");
	}
	const linkValue = createLink(file, settings, meta.linkValue, meta.metaKey);
	await copy(linkValue, meta.metaKey);
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

export async function copy(content: string, item: string) {
	await navigator.clipboard.writeText(content);
	let message = "Metadata " + item + " copied to clipboard";
	if (item == "DefaultKey" || item == this.settings.keyLink) {
		message = "Metacopy URL send to clipboard";
	}
	new Notice(message);
}
