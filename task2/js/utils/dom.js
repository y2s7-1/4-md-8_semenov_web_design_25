export const $ = (sel, ctx=document) => ctx.querySelector(sel);
export const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
export const createEl = (tag, props={}) => Object.assign(document.createElement(tag), props);
