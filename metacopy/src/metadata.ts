import {App, TFile} from "obsidian";
import { BehaviourLinkCreator, MetaCopySettings, MetaCopyValue } from "../settings";
import {disableMetaCopy} from "./pluginBehavior";
import { t } from "../i18n";


export function getMeta(app: App, file: TFile, settings: MetaCopySettings): MetaCopyValue {
	if (!file) {
		return null;
	}
	const meta = app.metadataCache.getFileCache(file)?.frontmatter;
	const defaultKey: MetaCopyValue = {
		frontmatterKey : "DefaultKey",
		correspondingValue : settings.defaultKeyLink,
	};
	if (meta === undefined) {
		if (settings.behaviourLinkCreator !== BehaviourLinkCreator.OBSIDIAN_PATH) {
			return null;
		} else {
			return defaultKey;
		}
	}
	
	let linkValue = "";
	let metaKey = "";
	if (settings?.copyKey.length > 1) {
		for (let i = 0; i < settings.copyKey.length; i++) {
			if (meta[settings.copyKey[i]] !== undefined) {
				linkValue = meta[settings.copyKey[i]].trim();
				metaKey = settings.copyKey[i].trim();
				break;
			}
		}
	} else {
		linkValue = meta[settings.copyKey[0]];
		metaKey = settings.copyKey[0];
	}

	const metaKeys: MetaCopyValue = {
		frontmatterKey: metaKey,
		correspondingValue: linkValue
	};
	if (!linkValue && settings.defaultKeyLink) {
		return defaultKey;
	}
	return metaKeys;
}

export function checkMeta(app: App, settings: MetaCopySettings) {
	const file = app.workspace.getActiveFile();
	const meta = getMeta(app, file, settings);
	const checkKey = meta?.frontmatterKey === "DefaultKey" || meta?.frontmatterKey;
	return !!file && checkKey;
}


export function getAllMeta(app: App, file: TFile, settings: MetaCopySettings) {
	const metaValue: string[]=[];
	const frontmatter = app.metadataCache.getCache(file.path).frontmatter;
	let listKey = settings.copyKey;
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
	Object.entries(mappedListKey).forEach(([, v]) => {
		if (v.value === undefined) {
			mappedListKey.remove(v);
		}
	});

	if (settings.enableCopyLink) {
		mappedListKey[mappedListKey.length] = {
			key: t("command.suggesterCopyURL") as string,
			value: settings.defaultKeyLink
		};
	}
	return mappedListKey;
}
