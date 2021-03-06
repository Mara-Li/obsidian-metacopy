import {App, TFile} from "obsidian";
import {MetaCopySettings} from "../settings";
import {disableMetaCopy} from "./pluginBehavior";


export function getMeta(app: App, file: TFile, settings: MetaCopySettings) {
	const fileCache = app.metadataCache.getFileCache(file);
	const meta = fileCache?.frontmatter;
	if (meta === undefined) {
		return null;
	}
	let linkValue = "";
	let metaKey = "";
	if (settings) {
		const keyMeta = settings.copyKey.replace(" ", ",").replace(",,", ",");
		const listKey = keyMeta.split(",");
		metaKey = keyMeta;
		if (listKey.length > 1) {
			for (let i = 0; i < listKey.length; i++) {
				if (meta[listKey[i]] !== undefined) {
					linkValue = meta[listKey[i]].trim();
					metaKey = listKey[i].trim();
					break;
				}
			}
		} else {
			linkValue = meta[listKey[0]];
			metaKey = listKey[0];
		}
	}
	const metaKeys = {
		'linkValue' : linkValue,
		'metaKey' : metaKey
	};
	if (!linkValue && settings.defaultKeyLink) {
		return {
			'linkValue' : settings.defaultKeyLink,
			'metaKey' : "DefaultKey"
		};
	};
	return metaKeys;
}

export function checkMeta(app: App, settings: MetaCopySettings) {
	const file = app.workspace.getActiveFile();
	const meta = getMeta(app, file, settings);
	let checkKey = false;
	checkKey = meta?.metaKey === "DefaultKey" || meta?.metaKey === "Copy link";
	return !!file && checkKey;
}


export function getAllMeta(app: App, file: TFile, settings: MetaCopySettings) {
	const metaValue: any[] = [];
	const frontmatter = app.metadataCache.getCache(file.path).frontmatter;
	const keyMeta = settings.copyKey.replace(" ", ",").replace(",,", ",");
	let listKey = keyMeta.split(",");
	listKey = listKey.map((x) => x.trim());
	if (listKey.length > 0) {
		for (let i = 0; i < listKey.length; i++) {
			if (frontmatter[listKey[i]]) {
				metaValue.push(frontmatter[listKey[i].trim()]);
			}
		}
	}
	let mappedListKey = listKey.map((key, i) => ({
		key,
		value: metaValue[i],
	}));
	mappedListKey = JSON.parse(JSON.stringify(mappedListKey));
	Object.entries(mappedListKey).forEach(([k, v]) => {
		if (v.value === undefined) {
			mappedListKey.remove(v);
		}
	});
	const enableMetaCopy = disableMetaCopy(
		app,
		settings,
		file
	);
	if (enableMetaCopy && settings.defaultKeyLink) {
		mappedListKey[mappedListKey.length] = {
			key: "Copy link",
			value: settings.defaultKeyLink
		};
	}
	return mappedListKey;
}
