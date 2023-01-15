export default {
	title: "Paramètre MetaCopy",
	keyTitle: {
		title: "Clé",
		desc: "La clé dont vous voulez copier la valeur",
		placeholder: "clé1, clé2, clé3,…",
	},
	linkCreator: {
		header: "Créateur de lien",
		baseLink: "Base du lien",
		baseLinkDesc: "La base du lien",
		behavior: {
			title: "Comportement par défaut",
			desc: "Choisissez entre une clé de métadonnées, le chemin dans Obsidian et un dossier fixe pour le créateur de liens.",
			fixedFolder: "Dossier fixe",
			categoryKey: "Clé de métadonnée",
			obsidianPath: "Chemin Obsidian",
		},
		keyLink:{
			title: "Clé de lien",
			desc: "La clé pour créer le lien",
			defaultValue: "Valeur par défaut",
			defaultValueDesc: "Si vous voulez activer la création de liens sans clé de métadonnée.",
		},
		folderNote: {
			title: "Folder Note",
			desc: "Si le nom du fichier = lien clé ou dossier parent, supprimer le nom du fichier dans le lien",
		},
		useFrontMatterTitle: {
			title: "Utiliser une clé frontmatter pour le titre",
			desc: "Utiliser une clé de métadonnée en tant que titre (au lieu du nom du fichier) pour créer le lien.",
		},
		regexReplaceTitle: {
			title: "Appliquer un remplacement au titre",
			desc: "Si le texte est entre \"//\", il sera interprété comme une expression régulière. Sinon, il sera interprété comme une chaîne de caractères.",
		},
		replaceLinkPart: {
			title: "Supprimer une partie du lien",
			desc: "Vous pouvez ajouter plusieurs chaînes de caractères, séparées par une virgule.",
		}
	},
	disable: {
		title: "Désactiver MetaCopy",
		desc: "Désactiver le menu contextuel de Metacopy avec une clé de métadonnée.",
		descURL: "Désactive également la création d'URL dans la commande.",
	},
	menuBehavior: {
		title: "Comportement du menu",
		desc: "Activer : nécessite une clé configurée pour activer le menu",
		keyMenu: "Clé du menu",
		keyMenuDesc: "La clé utilisée pour désactiver/activer le menu du fichier Metacopy.",
	},
	command : {
		metadataMessage: (key: string): string => `Clé de métadonnée "${key}" copiée dans le presse-papier`,
		metadataMessageURL: "URL envoyé dans le presse-papier",
		copy: "Copier le lien",
		copyCmd: (key: string): string  => `Copie de [${key}]`,
		copyURL: "MetaCopy : Créer URL",


	},
};
