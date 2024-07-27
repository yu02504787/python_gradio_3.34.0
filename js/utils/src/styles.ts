export interface Styles {
	container?: boolean;
	grid_cols?: number | Array<number>;
	grid_rows?: number | Array<number>;
	height?: "auto" | string | number;
	width?: "auto" | string | number;
	full_width?: boolean;
	equal_height?: boolean;
	visible?: boolean;
	item_container?: boolean;
	color_map?: Record<string, string>;
	label_container?: boolean;
	gap?: boolean;
	size?: "sm" | "lg";
	preview?: boolean;
	object_fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
	show_copy_button?: boolean;
}

type PartialRecord<K extends keyof any, T> = {
	[P in K]?: T;
};

type ProcessedStyles = PartialRecord<keyof Styles, string> & {
	styles: string;
};

const get_style = <T extends keyof Styles>(styles: Styles, key: T) => {
	//@ts-ignore
	return style_handlers[key](styles[key]);
};

export function get_styles(
	styles: Styles,
	allowed_styles: Array<keyof Styles>
): ProcessedStyles {
	const processed_styles = allowed_styles.reduce((acc, next) => {
		if (styles[next] === undefined || !style_handlers[next]) acc[next] = " ";
		else {
			acc[next] = ` ${get_style(styles, next)} `;
		}
		return acc;
	}, {} as ProcessedStyles);

	processed_styles.styles = ` ${Object.values(processed_styles)
		.join(" ")
		.replace(/\s+/g, " ")
		.trim()} `;

	return processed_styles;
}

type StyleHandlers = {
	[K in keyof Styles]: (style: Exclude<Styles[K], null | undefined>) => string;
};

const style_handlers: StyleHandlers = {
	container(container_visible) {
		return container_visible
			? ""
			: `padding: 0; margin: 0; border-width: 0; box-shadow: none; overflow: visible; background: transparent;`;
	},
	label_container(visible) {
		return visible
			? ""
			: `border-width: 0; box-shadow: none; overflow: visible; background: transparent;`;
	},
	grid_cols(grid_cols) {
		let grid_cols_map = ["", "sm-", "md-", "lg-", "xl-", "2xl-"];
		let _grid_cols = Array.isArray(grid_cols) ? grid_cols : [grid_cols];

		return [0, 0, 0, 0, 0, 0]
			.map(
				(_, i) =>
					`--${grid_cols_map[i]}grid-cols: var(--grid-${
						_grid_cols?.[i] || _grid_cols?.[_grid_cols?.length - 1]
					});`
			)
			.join(" ");
	},
	grid_rows(grid_rows) {
		let grid_rows_map = ["", "sm-", "md-", "lg-", "xl-", "2xl-"];
		let _grid_rows = Array.isArray(grid_rows) ? grid_rows : [grid_rows];

		return [0, 0, 0, 0, 0, 0]
			.map(
				(_, i) =>
					`--${grid_rows_map[i]}grid-rows: var(--grid-${
						_grid_rows?.[i] || _grid_rows?.[_grid_rows?.length - 1]
					});`
			)
			.join(" ");
	},
	height(height) {
		return height === "auto" ? "height: auto;" : "";
	},
	full_width(full_width) {
		return full_width
			? "width: var(--size-full); flex-grow: 1;"
			: "flex-grow: 0; width: fit-content;";
	},
	equal_height(equal_height) {
		return equal_height ? "align-items: stretch;" : "align-items: flex-start;";
	},
	visible(visible) {
		return visible ? "" : "display:hidden;";
	},
	item_container(visible) {
		return visible ? "" : "border-width:0;";
	},
	object_fit(object_fit) {
		return `--object-fit: ${object_fit};`;
	}
} as const;

export const create_classes = (
	styles: Record<string, any>,
	prefix: string = ""
): string => {
	let classes: Array<string> = [];
	let target_styles: Record<string, any> = {};
	if (prefix === "") {
		target_styles = styles;
	} else {
		for (const prop in styles) {
			if (prop.startsWith(prefix + "_")) {
				const propname = prop.substring(prop.indexOf("_") + 1);
				target_styles[propname] = styles[prop];
			}
		}
	}

	if (target_styles.hasOwnProperty("margin")) {
		if (!Array.isArray(target_styles.margin)) {
			target_styles.margin = !!target_styles.margin
				? [true, true, true, true]
				: [false, false, false, false];
		}

		let margin_map = ["t", "r", "b", "l"];

		(target_styles.margin as boolean[]).forEach((margin, i) => {
			if (!margin) {
				classes.push(`!m${margin_map[i]}-0`);
			}
		});
	}

	if (target_styles.hasOwnProperty("border")) {
		if (!Array.isArray(target_styles.border)) {
			target_styles.border = !!target_styles.border
				? [true, true, true, true]
				: [false, false, false, false];
		}

		let border_map = ["t", "r", "b", "l"];

		(target_styles.border as boolean[]).forEach((border, i) => {
			if (!border) {
				classes.push(`!border-${border_map[i]}-0`);
			}
		});
	}

	switch (target_styles.rounded) {
		case true:
			classes.push("!rounded-lg");
			break;
		case false:
			classes.push("!rounded-none");
			break;
	}

	switch (target_styles.full_width) {
		case true:
			classes.push("w-full");
			break;
		case false:
			classes.push("!grow-0");
			break;
	}

	switch (target_styles.text_color) {
		case "red":
			classes.push("!text-red-500", "dark:text-red-100");
			break;
		case "yellow":
			classes.push("!text-yellow-500", "dark:text-yellow-100");
			break;
		case "green":
			classes.push("!text-green-500", "dark:text-green-100");
			break;
		case "blue":
			classes.push("!text-blue-500", "dark:text-blue-100");
			break;
		case "purple":
			classes.push("!text-purple-500", "dark:text-purple-100");
			break;
		case "black":
			classes.push("!text-gray-700", "dark:text-gray-50");
			break;
	}
	switch (target_styles.bg_color) {
		case "red":
			classes.push(
				"!bg-red-100 !from-red-100 !to-red-200 !border-red-300",
				"dark:!bg-red-700 dark:!from-red-700 dark:!to-red-800 dark:!border-red-900"
			);
			break;
		case "yellow":
			classes.push(
				"!bg-yellow-100 !from-yellow-100 !to-yellow-200 !border-yellow-300",
				"dark:!bg-yellow-700 dark:!from-yellow-700 dark:!to-yellow-800 dark:!border-yellow-900"
			);
			break;
		case "green":
			classes.push(
				"!bg-green-100 !from-green-100 !to-green-200 !border-green-300",
				"dark:!bg-green-700 dark:!from-green-700 dark:!to-green-800 dark:!border-green-900  !text-gray-800"
			);
			break;
		case "blue":
			classes.push(
				"!bg-blue-100 !from-blue-100 !to-blue-200 !border-blue-300",
				"dark:!bg-blue-700 dark:!from-blue-700 dark:!to-blue-800 dark:!border-blue-900"
			);
			break;
		case "purple":
			classes.push(
				"!bg-purple-100 !from-purple-100 !to-purple-200 !border-purple-300",
				"dark:!bg-purple-700 dark:!from-purple-700 dark:!to-purple-800 dark:!border-purple-900"
			);
			break;
		case "black":
			classes.push(
				"!bg-gray-100 !from-gray-100 !to-gray-200 !border-gray-300",
				"dark:!bg-gray-700 dark:!from-gray-700 dark:!to-gray-800 dark:!border-gray-900"
			);
		case "pink":
			classes.push(
				"!bg-pink-100 !from-pink-100 !to-pink-200 !border-pink-300",
				"dark:!bg-pink-700 dark:!from-pink-700 dark:!to-pink-800 dark:!border-pink-900 !text-gray-800"
			);
			break;
	}
	return " " + classes.join(" ");
};
