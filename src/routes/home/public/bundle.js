var app = (function (moment) {
	'use strict';

	moment = moment && Object.prototype.hasOwnProperty.call(moment, 'default') ? moment['default'] : moment;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	const directives = new WeakMap();
	/**
	 * Brands a function as a directive factory function so that lit-html will call
	 * the function during template rendering, rather than passing as a value.
	 *
	 * A _directive_ is a function that takes a Part as an argument. It has the
	 * signature: `(part: Part) => void`.
	 *
	 * A directive _factory_ is a function that takes arguments for data and
	 * configuration and returns a directive. Users of directive usually refer to
	 * the directive factory as the directive. For example, "The repeat directive".
	 *
	 * Usually a template author will invoke a directive factory in their template
	 * with relevant arguments, which will then return a directive function.
	 *
	 * Here's an example of using the `repeat()` directive factory that takes an
	 * array and a function to render an item:
	 *
	 * ```js
	 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
	 * ```
	 *
	 * When `repeat` is invoked, it returns a directive function that closes over
	 * `items` and the template function. When the outer template is rendered, the
	 * return directive function is called with the Part for the expression.
	 * `repeat` then performs it's custom logic to render multiple items.
	 *
	 * @param f The directive factory function. Must be a function that returns a
	 * function of the signature `(part: Part) => void`. The returned function will
	 * be called with the part object.
	 *
	 * @example
	 *
	 * import {directive, html} from 'lit-html';
	 *
	 * const immutable = directive((v) => (part) => {
	 *   if (part.value !== v) {
	 *     part.setValue(v)
	 *   }
	 * });
	 */
	const directive = (f) => ((...args) => {
	    const d = f(...args);
	    directives.set(d, true);
	    return d;
	});
	const isDirective = (o) => {
	    return typeof o === 'function' && directives.has(o);
	};
	//# sourceMappingURL=directive.js.map

	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * True if the custom elements polyfill is in use.
	 */
	const isCEPolyfill = window.customElements !== undefined &&
	    window.customElements.polyfillWrapFlushCallback !==
	        undefined;
	/**
	 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
	 * into another container (could be the same container), before `before`. If
	 * `before` is null, it appends the nodes to the container.
	 */
	const reparentNodes = (container, start, end = null, before = null) => {
	    while (start !== end) {
	        const n = start.nextSibling;
	        container.insertBefore(start, before);
	        start = n;
	    }
	};
	/**
	 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
	 * `container`.
	 */
	const removeNodes = (container, start, end = null) => {
	    while (start !== end) {
	        const n = start.nextSibling;
	        container.removeChild(start);
	        start = n;
	    }
	};
	//# sourceMappingURL=dom.js.map

	/**
	 * @license
	 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * A sentinel value that signals that a value was handled by a directive and
	 * should not be written to the DOM.
	 */
	const noChange = {};
	/**
	 * A sentinel value that signals a NodePart to fully clear its content.
	 */
	const nothing = {};
	//# sourceMappingURL=part.js.map

	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * An expression marker with embedded unique key to avoid collision with
	 * possible text in templates.
	 */
	const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
	/**
	 * An expression marker used text-positions, multi-binding attributes, and
	 * attributes with markup-like text values.
	 */
	const nodeMarker = `<!--${marker}-->`;
	const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
	/**
	 * Suffix appended to all bound attribute names.
	 */
	const boundAttributeSuffix = '$lit$';
	/**
	 * An updateable Template that tracks the location of dynamic parts.
	 */
	class Template {
	    constructor(result, element) {
	        this.parts = [];
	        this.element = element;
	        const nodesToRemove = [];
	        const stack = [];
	        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
	        const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
	        // Keeps track of the last index associated with a part. We try to delete
	        // unnecessary nodes, but we never want to associate two different parts
	        // to the same index. They must have a constant node between.
	        let lastPartIndex = 0;
	        let index = -1;
	        let partIndex = 0;
	        const { strings, values: { length } } = result;
	        while (partIndex < length) {
	            const node = walker.nextNode();
	            if (node === null) {
	                // We've exhausted the content inside a nested template element.
	                // Because we still have parts (the outer for-loop), we know:
	                // - There is a template in the stack
	                // - The walker will find a nextNode outside the template
	                walker.currentNode = stack.pop();
	                continue;
	            }
	            index++;
	            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
	                if (node.hasAttributes()) {
	                    const attributes = node.attributes;
	                    const { length } = attributes;
	                    // Per
	                    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
	                    // attributes are not guaranteed to be returned in document order.
	                    // In particular, Edge/IE can return them out of order, so we cannot
	                    // assume a correspondence between part index and attribute index.
	                    let count = 0;
	                    for (let i = 0; i < length; i++) {
	                        if (endsWith(attributes[i].name, boundAttributeSuffix)) {
	                            count++;
	                        }
	                    }
	                    while (count-- > 0) {
	                        // Get the template literal section leading up to the first
	                        // expression in this attribute
	                        const stringForPart = strings[partIndex];
	                        // Find the attribute name
	                        const name = lastAttributeNameRegex.exec(stringForPart)[2];
	                        // Find the corresponding attribute
	                        // All bound attributes have had a suffix added in
	                        // TemplateResult#getHTML to opt out of special attribute
	                        // handling. To look up the attribute value we also need to add
	                        // the suffix.
	                        const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
	                        const attributeValue = node.getAttribute(attributeLookupName);
	                        node.removeAttribute(attributeLookupName);
	                        const statics = attributeValue.split(markerRegex);
	                        this.parts.push({ type: 'attribute', index, name, strings: statics });
	                        partIndex += statics.length - 1;
	                    }
	                }
	                if (node.tagName === 'TEMPLATE') {
	                    stack.push(node);
	                    walker.currentNode = node.content;
	                }
	            }
	            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
	                const data = node.data;
	                if (data.indexOf(marker) >= 0) {
	                    const parent = node.parentNode;
	                    const strings = data.split(markerRegex);
	                    const lastIndex = strings.length - 1;
	                    // Generate a new text node for each literal section
	                    // These nodes are also used as the markers for node parts
	                    for (let i = 0; i < lastIndex; i++) {
	                        let insert;
	                        let s = strings[i];
	                        if (s === '') {
	                            insert = createMarker();
	                        }
	                        else {
	                            const match = lastAttributeNameRegex.exec(s);
	                            if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
	                                s = s.slice(0, match.index) + match[1] +
	                                    match[2].slice(0, -boundAttributeSuffix.length) + match[3];
	                            }
	                            insert = document.createTextNode(s);
	                        }
	                        parent.insertBefore(insert, node);
	                        this.parts.push({ type: 'node', index: ++index });
	                    }
	                    // If there's no text, we must insert a comment to mark our place.
	                    // Else, we can trust it will stick around after cloning.
	                    if (strings[lastIndex] === '') {
	                        parent.insertBefore(createMarker(), node);
	                        nodesToRemove.push(node);
	                    }
	                    else {
	                        node.data = strings[lastIndex];
	                    }
	                    // We have a part for each match found
	                    partIndex += lastIndex;
	                }
	            }
	            else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
	                if (node.data === marker) {
	                    const parent = node.parentNode;
	                    // Add a new marker node to be the startNode of the Part if any of
	                    // the following are true:
	                    //  * We don't have a previousSibling
	                    //  * The previousSibling is already the start of a previous part
	                    if (node.previousSibling === null || index === lastPartIndex) {
	                        index++;
	                        parent.insertBefore(createMarker(), node);
	                    }
	                    lastPartIndex = index;
	                    this.parts.push({ type: 'node', index });
	                    // If we don't have a nextSibling, keep this node so we have an end.
	                    // Else, we can remove it to save future costs.
	                    if (node.nextSibling === null) {
	                        node.data = '';
	                    }
	                    else {
	                        nodesToRemove.push(node);
	                        index--;
	                    }
	                    partIndex++;
	                }
	                else {
	                    let i = -1;
	                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
	                        // Comment node has a binding marker inside, make an inactive part
	                        // The binding won't work, but subsequent bindings will
	                        // TODO (justinfagnani): consider whether it's even worth it to
	                        // make bindings in comments work
	                        this.parts.push({ type: 'node', index: -1 });
	                        partIndex++;
	                    }
	                }
	            }
	        }
	        // Remove text binding nodes after the walk to not disturb the TreeWalker
	        for (const n of nodesToRemove) {
	            n.parentNode.removeChild(n);
	        }
	    }
	}
	const endsWith = (str, suffix) => {
	    const index = str.length - suffix.length;
	    return index >= 0 && str.slice(index) === suffix;
	};
	const isTemplatePartActive = (part) => part.index !== -1;
	// Allows `document.createComment('')` to be renamed for a
	// small manual size-savings.
	const createMarker = () => document.createComment('');
	/**
	 * This regex extracts the attribute name preceding an attribute-position
	 * expression. It does this by matching the syntax allowed for attributes
	 * against the string literal directly preceding the expression, assuming that
	 * the expression is in an attribute-value position.
	 *
	 * See attributes in the HTML spec:
	 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
	 *
	 * " \x09\x0a\x0c\x0d" are HTML space characters:
	 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
	 *
	 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
	 * space character except " ".
	 *
	 * So an attribute is:
	 *  * The name: any character except a control character, space character, ('),
	 *    ("), ">", "=", or "/"
	 *  * Followed by zero or more space characters
	 *  * Followed by "="
	 *  * Followed by zero or more space characters
	 *  * Followed by:
	 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
	 *    * (") then any non-("), or
	 *    * (') then any non-(')
	 */
	const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
	//# sourceMappingURL=template.js.map

	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * An instance of a `Template` that can be attached to the DOM and updated
	 * with new values.
	 */
	class TemplateInstance {
	    constructor(template, processor, options) {
	        this.__parts = [];
	        this.template = template;
	        this.processor = processor;
	        this.options = options;
	    }
	    update(values) {
	        let i = 0;
	        for (const part of this.__parts) {
	            if (part !== undefined) {
	                part.setValue(values[i]);
	            }
	            i++;
	        }
	        for (const part of this.__parts) {
	            if (part !== undefined) {
	                part.commit();
	            }
	        }
	    }
	    _clone() {
	        // There are a number of steps in the lifecycle of a template instance's
	        // DOM fragment:
	        //  1. Clone - create the instance fragment
	        //  2. Adopt - adopt into the main document
	        //  3. Process - find part markers and create parts
	        //  4. Upgrade - upgrade custom elements
	        //  5. Update - set node, attribute, property, etc., values
	        //  6. Connect - connect to the document. Optional and outside of this
	        //     method.
	        //
	        // We have a few constraints on the ordering of these steps:
	        //  * We need to upgrade before updating, so that property values will pass
	        //    through any property setters.
	        //  * We would like to process before upgrading so that we're sure that the
	        //    cloned fragment is inert and not disturbed by self-modifying DOM.
	        //  * We want custom elements to upgrade even in disconnected fragments.
	        //
	        // Given these constraints, with full custom elements support we would
	        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
	        //
	        // But Safari dooes not implement CustomElementRegistry#upgrade, so we
	        // can not implement that order and still have upgrade-before-update and
	        // upgrade disconnected fragments. So we instead sacrifice the
	        // process-before-upgrade constraint, since in Custom Elements v1 elements
	        // must not modify their light DOM in the constructor. We still have issues
	        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
	        // that don't strictly adhere to the no-modification rule because shadow
	        // DOM, which may be created in the constructor, is emulated by being placed
	        // in the light DOM.
	        //
	        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
	        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
	        // in one step.
	        //
	        // The Custom Elements v1 polyfill supports upgrade(), so the order when
	        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
	        // Connect.
	        const fragment = isCEPolyfill ?
	            this.template.element.content.cloneNode(true) :
	            document.importNode(this.template.element.content, true);
	        const stack = [];
	        const parts = this.template.parts;
	        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
	        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
	        let partIndex = 0;
	        let nodeIndex = 0;
	        let part;
	        let node = walker.nextNode();
	        // Loop through all the nodes and parts of a template
	        while (partIndex < parts.length) {
	            part = parts[partIndex];
	            if (!isTemplatePartActive(part)) {
	                this.__parts.push(undefined);
	                partIndex++;
	                continue;
	            }
	            // Progress the tree walker until we find our next part's node.
	            // Note that multiple parts may share the same node (attribute parts
	            // on a single element), so this loop may not run at all.
	            while (nodeIndex < part.index) {
	                nodeIndex++;
	                if (node.nodeName === 'TEMPLATE') {
	                    stack.push(node);
	                    walker.currentNode = node.content;
	                }
	                if ((node = walker.nextNode()) === null) {
	                    // We've exhausted the content inside a nested template element.
	                    // Because we still have parts (the outer for-loop), we know:
	                    // - There is a template in the stack
	                    // - The walker will find a nextNode outside the template
	                    walker.currentNode = stack.pop();
	                    node = walker.nextNode();
	                }
	            }
	            // We've arrived at our part's node.
	            if (part.type === 'node') {
	                const part = this.processor.handleTextExpression(this.options);
	                part.insertAfterNode(node.previousSibling);
	                this.__parts.push(part);
	            }
	            else {
	                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
	            }
	            partIndex++;
	        }
	        if (isCEPolyfill) {
	            document.adoptNode(fragment);
	            customElements.upgrade(fragment);
	        }
	        return fragment;
	    }
	}
	//# sourceMappingURL=template-instance.js.map

	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	const commentMarker = ` ${marker} `;
	/**
	 * The return type of `html`, which holds a Template and the values from
	 * interpolated expressions.
	 */
	class TemplateResult {
	    constructor(strings, values, type, processor) {
	        this.strings = strings;
	        this.values = values;
	        this.type = type;
	        this.processor = processor;
	    }
	    /**
	     * Returns a string of HTML used to create a `<template>` element.
	     */
	    getHTML() {
	        const l = this.strings.length - 1;
	        let html = '';
	        let isCommentBinding = false;
	        for (let i = 0; i < l; i++) {
	            const s = this.strings[i];
	            // For each binding we want to determine the kind of marker to insert
	            // into the template source before it's parsed by the browser's HTML
	            // parser. The marker type is based on whether the expression is in an
	            // attribute, text, or comment poisition.
	            //   * For node-position bindings we insert a comment with the marker
	            //     sentinel as its text content, like <!--{{lit-guid}}-->.
	            //   * For attribute bindings we insert just the marker sentinel for the
	            //     first binding, so that we support unquoted attribute bindings.
	            //     Subsequent bindings can use a comment marker because multi-binding
	            //     attributes must be quoted.
	            //   * For comment bindings we insert just the marker sentinel so we don't
	            //     close the comment.
	            //
	            // The following code scans the template source, but is *not* an HTML
	            // parser. We don't need to track the tree structure of the HTML, only
	            // whether a binding is inside a comment, and if not, if it appears to be
	            // the first binding in an attribute.
	            const commentOpen = s.lastIndexOf('<!--');
	            // We're in comment position if we have a comment open with no following
	            // comment close. Because <-- can appear in an attribute value there can
	            // be false positives.
	            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
	                s.indexOf('-->', commentOpen + 1) === -1;
	            // Check to see if we have an attribute-like sequence preceeding the
	            // expression. This can match "name=value" like structures in text,
	            // comments, and attribute values, so there can be false-positives.
	            const attributeMatch = lastAttributeNameRegex.exec(s);
	            if (attributeMatch === null) {
	                // We're only in this branch if we don't have a attribute-like
	                // preceeding sequence. For comments, this guards against unusual
	                // attribute values like <div foo="<!--${'bar'}">. Cases like
	                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
	                // below.
	                html += s + (isCommentBinding ? commentMarker : nodeMarker);
	            }
	            else {
	                // For attributes we use just a marker sentinel, and also append a
	                // $lit$ suffix to the name to opt-out of attribute-specific parsing
	                // that IE and Edge do for style and certain SVG attributes.
	                html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
	                    attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
	                    marker;
	            }
	        }
	        html += this.strings[l];
	        return html;
	    }
	    getTemplateElement() {
	        const template = document.createElement('template');
	        template.innerHTML = this.getHTML();
	        return template;
	    }
	}
	/**
	 * A TemplateResult for SVG fragments.
	 *
	 * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
	 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
	 * clones only container the original fragment.
	 */
	class SVGTemplateResult extends TemplateResult {
	    getHTML() {
	        return `<svg>${super.getHTML()}</svg>`;
	    }
	    getTemplateElement() {
	        const template = super.getTemplateElement();
	        const content = template.content;
	        const svgElement = content.firstChild;
	        content.removeChild(svgElement);
	        reparentNodes(content, svgElement.firstChild);
	        return template;
	    }
	}
	//# sourceMappingURL=template-result.js.map

	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	const isPrimitive = (value) => {
	    return (value === null ||
	        !(typeof value === 'object' || typeof value === 'function'));
	};
	const isIterable = (value) => {
	    return Array.isArray(value) ||
	        // tslint:disable-next-line:no-any
	        !!(value && value[Symbol.iterator]);
	};
	/**
	 * Writes attribute values to the DOM for a group of AttributeParts bound to a
	 * single attibute. The value is only set once even if there are multiple parts
	 * for an attribute.
	 */
	class AttributeCommitter {
	    constructor(element, name, strings) {
	        this.dirty = true;
	        this.element = element;
	        this.name = name;
	        this.strings = strings;
	        this.parts = [];
	        for (let i = 0; i < strings.length - 1; i++) {
	            this.parts[i] = this._createPart();
	        }
	    }
	    /**
	     * Creates a single part. Override this to create a differnt type of part.
	     */
	    _createPart() {
	        return new AttributePart(this);
	    }
	    _getValue() {
	        const strings = this.strings;
	        const l = strings.length - 1;
	        let text = '';
	        for (let i = 0; i < l; i++) {
	            text += strings[i];
	            const part = this.parts[i];
	            if (part !== undefined) {
	                const v = part.value;
	                if (isPrimitive(v) || !isIterable(v)) {
	                    text += typeof v === 'string' ? v : String(v);
	                }
	                else {
	                    for (const t of v) {
	                        text += typeof t === 'string' ? t : String(t);
	                    }
	                }
	            }
	        }
	        text += strings[l];
	        return text;
	    }
	    commit() {
	        if (this.dirty) {
	            this.dirty = false;
	            this.element.setAttribute(this.name, this._getValue());
	        }
	    }
	}
	/**
	 * A Part that controls all or part of an attribute value.
	 */
	class AttributePart {
	    constructor(committer) {
	        this.value = undefined;
	        this.committer = committer;
	    }
	    setValue(value) {
	        if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
	            this.value = value;
	            // If the value is a not a directive, dirty the committer so that it'll
	            // call setAttribute. If the value is a directive, it'll dirty the
	            // committer if it calls setValue().
	            if (!isDirective(value)) {
	                this.committer.dirty = true;
	            }
	        }
	    }
	    commit() {
	        while (isDirective(this.value)) {
	            const directive = this.value;
	            this.value = noChange;
	            directive(this);
	        }
	        if (this.value === noChange) {
	            return;
	        }
	        this.committer.commit();
	    }
	}
	/**
	 * A Part that controls a location within a Node tree. Like a Range, NodePart
	 * has start and end locations and can set and update the Nodes between those
	 * locations.
	 *
	 * NodeParts support several value types: primitives, Nodes, TemplateResults,
	 * as well as arrays and iterables of those types.
	 */
	class NodePart {
	    constructor(options) {
	        this.value = undefined;
	        this.__pendingValue = undefined;
	        this.options = options;
	    }
	    /**
	     * Appends this part into a container.
	     *
	     * This part must be empty, as its contents are not automatically moved.
	     */
	    appendInto(container) {
	        this.startNode = container.appendChild(createMarker());
	        this.endNode = container.appendChild(createMarker());
	    }
	    /**
	     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
	     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
	     * such as those that appear in a literal section of a template.
	     *
	     * This part must be empty, as its contents are not automatically moved.
	     */
	    insertAfterNode(ref) {
	        this.startNode = ref;
	        this.endNode = ref.nextSibling;
	    }
	    /**
	     * Appends this part into a parent part.
	     *
	     * This part must be empty, as its contents are not automatically moved.
	     */
	    appendIntoPart(part) {
	        part.__insert(this.startNode = createMarker());
	        part.__insert(this.endNode = createMarker());
	    }
	    /**
	     * Inserts this part after the `ref` part.
	     *
	     * This part must be empty, as its contents are not automatically moved.
	     */
	    insertAfterPart(ref) {
	        ref.__insert(this.startNode = createMarker());
	        this.endNode = ref.endNode;
	        ref.endNode = this.startNode;
	    }
	    setValue(value) {
	        this.__pendingValue = value;
	    }
	    commit() {
	        while (isDirective(this.__pendingValue)) {
	            const directive = this.__pendingValue;
	            this.__pendingValue = noChange;
	            directive(this);
	        }
	        const value = this.__pendingValue;
	        if (value === noChange) {
	            return;
	        }
	        if (isPrimitive(value)) {
	            if (value !== this.value) {
	                this.__commitText(value);
	            }
	        }
	        else if (value instanceof TemplateResult) {
	            this.__commitTemplateResult(value);
	        }
	        else if (value instanceof Node) {
	            this.__commitNode(value);
	        }
	        else if (isIterable(value)) {
	            this.__commitIterable(value);
	        }
	        else if (value === nothing) {
	            this.value = nothing;
	            this.clear();
	        }
	        else {
	            // Fallback, will render the string representation
	            this.__commitText(value);
	        }
	    }
	    __insert(node) {
	        this.endNode.parentNode.insertBefore(node, this.endNode);
	    }
	    __commitNode(value) {
	        if (this.value === value) {
	            return;
	        }
	        this.clear();
	        this.__insert(value);
	        this.value = value;
	    }
	    __commitText(value) {
	        const node = this.startNode.nextSibling;
	        value = value == null ? '' : value;
	        // If `value` isn't already a string, we explicitly convert it here in case
	        // it can't be implicitly converted - i.e. it's a symbol.
	        const valueAsString = typeof value === 'string' ? value : String(value);
	        if (node === this.endNode.previousSibling &&
	            node.nodeType === 3 /* Node.TEXT_NODE */) {
	            // If we only have a single text node between the markers, we can just
	            // set its value, rather than replacing it.
	            // TODO(justinfagnani): Can we just check if this.value is primitive?
	            node.data = valueAsString;
	        }
	        else {
	            this.__commitNode(document.createTextNode(valueAsString));
	        }
	        this.value = value;
	    }
	    __commitTemplateResult(value) {
	        const template = this.options.templateFactory(value);
	        if (this.value instanceof TemplateInstance &&
	            this.value.template === template) {
	            this.value.update(value.values);
	        }
	        else {
	            // Make sure we propagate the template processor from the TemplateResult
	            // so that we use its syntax extension, etc. The template factory comes
	            // from the render function options so that it can control template
	            // caching and preprocessing.
	            const instance = new TemplateInstance(template, value.processor, this.options);
	            const fragment = instance._clone();
	            instance.update(value.values);
	            this.__commitNode(fragment);
	            this.value = instance;
	        }
	    }
	    __commitIterable(value) {
	        // For an Iterable, we create a new InstancePart per item, then set its
	        // value to the item. This is a little bit of overhead for every item in
	        // an Iterable, but it lets us recurse easily and efficiently update Arrays
	        // of TemplateResults that will be commonly returned from expressions like:
	        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
	        // If _value is an array, then the previous render was of an
	        // iterable and _value will contain the NodeParts from the previous
	        // render. If _value is not an array, clear this part and make a new
	        // array for NodeParts.
	        if (!Array.isArray(this.value)) {
	            this.value = [];
	            this.clear();
	        }
	        // Lets us keep track of how many items we stamped so we can clear leftover
	        // items from a previous render
	        const itemParts = this.value;
	        let partIndex = 0;
	        let itemPart;
	        for (const item of value) {
	            // Try to reuse an existing part
	            itemPart = itemParts[partIndex];
	            // If no existing part, create a new one
	            if (itemPart === undefined) {
	                itemPart = new NodePart(this.options);
	                itemParts.push(itemPart);
	                if (partIndex === 0) {
	                    itemPart.appendIntoPart(this);
	                }
	                else {
	                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
	                }
	            }
	            itemPart.setValue(item);
	            itemPart.commit();
	            partIndex++;
	        }
	        if (partIndex < itemParts.length) {
	            // Truncate the parts array so _value reflects the current state
	            itemParts.length = partIndex;
	            this.clear(itemPart && itemPart.endNode);
	        }
	    }
	    clear(startNode = this.startNode) {
	        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
	    }
	}
	/**
	 * Implements a boolean attribute, roughly as defined in the HTML
	 * specification.
	 *
	 * If the value is truthy, then the attribute is present with a value of
	 * ''. If the value is falsey, the attribute is removed.
	 */
	class BooleanAttributePart {
	    constructor(element, name, strings) {
	        this.value = undefined;
	        this.__pendingValue = undefined;
	        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
	            throw new Error('Boolean attributes can only contain a single expression');
	        }
	        this.element = element;
	        this.name = name;
	        this.strings = strings;
	    }
	    setValue(value) {
	        this.__pendingValue = value;
	    }
	    commit() {
	        while (isDirective(this.__pendingValue)) {
	            const directive = this.__pendingValue;
	            this.__pendingValue = noChange;
	            directive(this);
	        }
	        if (this.__pendingValue === noChange) {
	            return;
	        }
	        const value = !!this.__pendingValue;
	        if (this.value !== value) {
	            if (value) {
	                this.element.setAttribute(this.name, '');
	            }
	            else {
	                this.element.removeAttribute(this.name);
	            }
	            this.value = value;
	        }
	        this.__pendingValue = noChange;
	    }
	}
	/**
	 * Sets attribute values for PropertyParts, so that the value is only set once
	 * even if there are multiple parts for a property.
	 *
	 * If an expression controls the whole property value, then the value is simply
	 * assigned to the property under control. If there are string literals or
	 * multiple expressions, then the strings are expressions are interpolated into
	 * a string first.
	 */
	class PropertyCommitter extends AttributeCommitter {
	    constructor(element, name, strings) {
	        super(element, name, strings);
	        this.single =
	            (strings.length === 2 && strings[0] === '' && strings[1] === '');
	    }
	    _createPart() {
	        return new PropertyPart(this);
	    }
	    _getValue() {
	        if (this.single) {
	            return this.parts[0].value;
	        }
	        return super._getValue();
	    }
	    commit() {
	        if (this.dirty) {
	            this.dirty = false;
	            // tslint:disable-next-line:no-any
	            this.element[this.name] = this._getValue();
	        }
	    }
	}
	class PropertyPart extends AttributePart {
	}
	// Detect event listener options support. If the `capture` property is read
	// from the options object, then options are supported. If not, then the thrid
	// argument to add/removeEventListener is interpreted as the boolean capture
	// value so we should only pass the `capture` property.
	let eventOptionsSupported = false;
	try {
	    const options = {
	        get capture() {
	            eventOptionsSupported = true;
	            return false;
	        }
	    };
	    // tslint:disable-next-line:no-any
	    window.addEventListener('test', options, options);
	    // tslint:disable-next-line:no-any
	    window.removeEventListener('test', options, options);
	}
	catch (_e) {
	}
	class EventPart {
	    constructor(element, eventName, eventContext) {
	        this.value = undefined;
	        this.__pendingValue = undefined;
	        this.element = element;
	        this.eventName = eventName;
	        this.eventContext = eventContext;
	        this.__boundHandleEvent = (e) => this.handleEvent(e);
	    }
	    setValue(value) {
	        this.__pendingValue = value;
	    }
	    commit() {
	        while (isDirective(this.__pendingValue)) {
	            const directive = this.__pendingValue;
	            this.__pendingValue = noChange;
	            directive(this);
	        }
	        if (this.__pendingValue === noChange) {
	            return;
	        }
	        const newListener = this.__pendingValue;
	        const oldListener = this.value;
	        const shouldRemoveListener = newListener == null ||
	            oldListener != null &&
	                (newListener.capture !== oldListener.capture ||
	                    newListener.once !== oldListener.once ||
	                    newListener.passive !== oldListener.passive);
	        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
	        if (shouldRemoveListener) {
	            this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
	        }
	        if (shouldAddListener) {
	            this.__options = getOptions(newListener);
	            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
	        }
	        this.value = newListener;
	        this.__pendingValue = noChange;
	    }
	    handleEvent(event) {
	        if (typeof this.value === 'function') {
	            this.value.call(this.eventContext || this.element, event);
	        }
	        else {
	            this.value.handleEvent(event);
	        }
	    }
	}
	// We copy options because of the inconsistent behavior of browsers when reading
	// the third argument of add/removeEventListener. IE11 doesn't support options
	// at all. Chrome 41 only reads `capture` if the argument is an object.
	const getOptions = (o) => o &&
	    (eventOptionsSupported ?
	        { capture: o.capture, passive: o.passive, once: o.once } :
	        o.capture);
	//# sourceMappingURL=parts.js.map

	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * Creates Parts when a template is instantiated.
	 */
	class DefaultTemplateProcessor {
	    /**
	     * Create parts for an attribute-position binding, given the event, attribute
	     * name, and string literals.
	     *
	     * @param element The element containing the binding
	     * @param name  The attribute name
	     * @param strings The string literals. There are always at least two strings,
	     *   event for fully-controlled bindings with a single expression.
	     */
	    handleAttributeExpressions(element, name, strings, options) {
	        const prefix = name[0];
	        if (prefix === '.') {
	            const committer = new PropertyCommitter(element, name.slice(1), strings);
	            return committer.parts;
	        }
	        if (prefix === '@') {
	            return [new EventPart(element, name.slice(1), options.eventContext)];
	        }
	        if (prefix === '?') {
	            return [new BooleanAttributePart(element, name.slice(1), strings)];
	        }
	        const committer = new AttributeCommitter(element, name, strings);
	        return committer.parts;
	    }
	    /**
	     * Create parts for a text-position binding.
	     * @param templateFactory
	     */
	    handleTextExpression(options) {
	        return new NodePart(options);
	    }
	}
	const defaultTemplateProcessor = new DefaultTemplateProcessor();
	//# sourceMappingURL=default-template-processor.js.map

	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	/**
	 * The default TemplateFactory which caches Templates keyed on
	 * result.type and result.strings.
	 */
	function templateFactory(result) {
	    let templateCache = templateCaches.get(result.type);
	    if (templateCache === undefined) {
	        templateCache = {
	            stringsArray: new WeakMap(),
	            keyString: new Map()
	        };
	        templateCaches.set(result.type, templateCache);
	    }
	    let template = templateCache.stringsArray.get(result.strings);
	    if (template !== undefined) {
	        return template;
	    }
	    // If the TemplateStringsArray is new, generate a key from the strings
	    // This key is shared between all templates with identical content
	    const key = result.strings.join(marker);
	    // Check if we already have a Template for this key
	    template = templateCache.keyString.get(key);
	    if (template === undefined) {
	        // If we have not seen this key before, create a new Template
	        template = new Template(result, result.getTemplateElement());
	        // Cache the Template for this key
	        templateCache.keyString.set(key, template);
	    }
	    // Cache all future queries for this TemplateStringsArray
	    templateCache.stringsArray.set(result.strings, template);
	    return template;
	}
	const templateCaches = new Map();
	//# sourceMappingURL=template-factory.js.map

	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	const parts = new WeakMap();
	/**
	 * Renders a template result or other value to a container.
	 *
	 * To update a container with new values, reevaluate the template literal and
	 * call `render` with the new result.
	 *
	 * @param result Any value renderable by NodePart - typically a TemplateResult
	 *     created by evaluating a template tag like `html` or `svg`.
	 * @param container A DOM parent to render to. The entire contents are either
	 *     replaced, or efficiently updated if the same result type was previous
	 *     rendered there.
	 * @param options RenderOptions for the entire render tree rendered to this
	 *     container. Render options must *not* change between renders to the same
	 *     container, as those changes will not effect previously rendered DOM.
	 */
	const render = (result, container, options) => {
	    let part = parts.get(container);
	    if (part === undefined) {
	        removeNodes(container, container.firstChild);
	        parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
	        part.appendInto(container);
	    }
	    part.setValue(result);
	    part.commit();
	};
	//# sourceMappingURL=render.js.map

	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	// IMPORTANT: do not change the property name or the assignment expression.
	// This line will be used in regexes to search for lit-html usage.
	// TODO(justinfagnani): inject version number at build time
	(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');
	/**
	 * Interprets a template literal as an HTML template that can efficiently
	 * render to and update a container.
	 */
	const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);
	/**
	 * Interprets a template literal as an SVG template that can efficiently
	 * render to and update a container.
	 */
	const svg = (strings, ...values) => new SVGTemplateResult(strings, values, 'svg', defaultTemplateProcessor);
	//# sourceMappingURL=lit-html.js.map

	var litHtml = /*#__PURE__*/Object.freeze({
		__proto__: null,
		html: html,
		svg: svg,
		DefaultTemplateProcessor: DefaultTemplateProcessor,
		defaultTemplateProcessor: defaultTemplateProcessor,
		directive: directive,
		isDirective: isDirective,
		removeNodes: removeNodes,
		reparentNodes: reparentNodes,
		noChange: noChange,
		nothing: nothing,
		AttributeCommitter: AttributeCommitter,
		AttributePart: AttributePart,
		BooleanAttributePart: BooleanAttributePart,
		EventPart: EventPart,
		isIterable: isIterable,
		isPrimitive: isPrimitive,
		NodePart: NodePart,
		PropertyCommitter: PropertyCommitter,
		PropertyPart: PropertyPart,
		parts: parts,
		render: render,
		templateCaches: templateCaches,
		templateFactory: templateFactory,
		TemplateInstance: TemplateInstance,
		SVGTemplateResult: SVGTemplateResult,
		TemplateResult: TemplateResult,
		createMarker: createMarker,
		isTemplatePartActive: isTemplatePartActive,
		Template: Template
	});

	var utils = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	const s4 = () => {
	    return Math.floor((1 + Math.random()) * 0x10000)
	        .toString(16)
	        .substring(1);
	};
	exports.guidShort = () => {
	    // Prepend with letter to ensure parsed as a string and preserve
	    // insertion order when calling Object.keys -JDK 12/1/2016
	    // http://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order
	    return "a" + s4() + s4();
	};
	exports.forEach = (obj, func) => {
	    if (!obj) {
	        return;
	    }
	    Object.entries(obj).map((i) => {
	        func(i[1], i[0]);
	    });
	};
	exports.toArray = (obj, sortField, reverse = false) => {
	    let arr = [];
	    if (Array.isArray(obj)) {
	        arr = obj;
	    }
	    else {
	        arr = Object.entries(obj || {}).map((i) => i[1]);
	    }
	    if (sortField) {
	        arr.sort((a, b) => {
	            const a1 = exports.getProperty(a, sortField);
	            const b1 = exports.getProperty(b, sortField);
	            if (a1 < b1) {
	                return reverse ? 1 : -1;
	            }
	            else if (a1 > b1) {
	                return reverse ? -1 : 1;
	            }
	            return 0;
	        });
	    }
	    return arr;
	};
	exports.group = (items, prop, groupVals) => {
	    const groups = {};
	    if (Array.isArray(groupVals)) {
	        groupVals.forEach((groupVal) => {
	            groups[groupVal] = { key: groupVal, items: [] };
	        });
	    }
	    exports.toArray(items).forEach((item) => {
	        let val;
	        if (typeof prop === "function") {
	            val = prop(item);
	        }
	        else {
	            val = exports.getProperty(item, prop);
	        }
	        if (!groups[val]) {
	            groups[val] = { key: val, items: [] };
	        }
	        groups[val].items.push(item);
	    });
	    return groups;
	};
	const getPropertyHelper = (obj, split) => {
	    if (obj == null) {
	        return null;
	    }
	    if (split.length === 1) {
	        return obj[split[0]];
	    }
	    return getPropertyHelper(obj[split[0]], split.slice(1, split.length));
	};
	exports.getProperty = (obj, path) => {
	    if (!path) {
	        return obj;
	    }
	    return getPropertyHelper(obj, path.split("."));
	};
	const setPropertyHelper = (obj, split, value) => {
	    if (obj == null) {
	        return;
	    }
	    if (split.length === 1) {
	        obj[split[0]] = value;
	    }
	    else {
	        setPropertyHelper(obj[split[0]], split.slice(1, split.length), value);
	    }
	};
	exports.setProperty = (obj, path, value) => {
	    return setPropertyHelper(obj, path.split("."), value);
	};
	exports.round = (value, decimals = 0) => {
	    // console.log("round", value, value.toFixed(precision), parseFloat(value.toFixed(precision)));
	    // return parseFloat(value.toFixed(precision));
	    return Number(Math.round((value + "e" + decimals)) + "e-" + decimals);
	};
	exports.randomInt = (min, max) => {
	    // inclusive of min and max
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	exports.formatCurrency = (value, precision = 2, emptyString = "") => {
	    if (value === "") {
	        // console.log("val is empty string", value, emptyString);
	        if (emptyString != null) {
	            return emptyString;
	        }
	        else {
	            value = 0;
	        }
	    }
	    const valueAsNumber = (typeof value === "string") ? parseInt(value, 10) : value;
	    if (typeof valueAsNumber !== "number" || isNaN(valueAsNumber)) {
	        return emptyString;
	    }
	    return exports.numberWithCommas(valueAsNumber.toFixed(precision));
	};
	exports.numberWithCommas = (x) => {
	    if (typeof x === "number") {
	        x = x.toString();
	    }
	    if (typeof x !== "string") {
	        return "";
	    }
	    const split = x.split(".");
	    split[0] = split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return split.join(".");
	};
	exports.deepCopy = (obj) => {
	    return JSON.parse(JSON.stringify(obj));
	};
	exports.getTotalFields = (item, fields) => {
	    const total = fields.reduce((acc, curr) => item[curr] + acc, 0);
	    return exports.round(total, 2);
	};
	exports.getTotal = (items, fields) => {
	    const total = exports.toArray(items).reduce((acc, curr) => (exports.getTotalFields(curr, fields)) + acc, 0);
	    return exports.round(total, 2);
	};
	exports.BuildTypescriptModel = (obj) => {
	    let str = "";
	    Object.entries(obj).sort((a, b) => a[0] > b[0] ? 1 : 0).forEach((entry) => {
	        str += `${entry[0]}: ${typeof entry[1] === "number" ? "number" : "string"};\n`;
	    });
	    return str;
	};
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQU0sRUFBRSxHQUFHLEdBQVcsRUFBRTtJQUNwQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDO1NBQzNDLFFBQVEsQ0FBQyxFQUFFLENBQUM7U0FDWixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsQ0FBQyxDQUFDO0FBRVcsUUFBQSxTQUFTLEdBQUcsR0FBVyxFQUFFO0lBQ2xDLGdFQUFnRTtJQUNoRSwwREFBMEQ7SUFDMUQsNkZBQTZGO0lBQzdGLE9BQU8sR0FBRyxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0FBQzdCLENBQUMsQ0FBQztBQUVXLFFBQUEsT0FBTyxHQUFHLENBQUMsR0FBUSxFQUFFLElBQXNDLEVBQVEsRUFBRTtJQUM5RSxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ04sT0FBTztLQUNWO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUMxQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQVcsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBRVcsUUFBQSxPQUFPLEdBQUcsQ0FBSSxHQUFtQixFQUFFLFNBQWtCLEVBQUUsVUFBbUIsS0FBSyxFQUFPLEVBQUU7SUFDakcsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3BCLEdBQUcsR0FBRyxHQUFHLENBQUM7S0FDYjtTQUFNO1FBQ0gsR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENB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
	});

	unwrapExports(utils);
	var utils_1 = utils.guidShort;
	var utils_2 = utils.forEach;
	var utils_3 = utils.toArray;
	var utils_4 = utils.group;
	var utils_5 = utils.getProperty;
	var utils_6 = utils.setProperty;
	var utils_7 = utils.round;
	var utils_8 = utils.randomInt;
	var utils_9 = utils.formatCurrency;
	var utils_10 = utils.numberWithCommas;
	var utils_11 = utils.deepCopy;
	var utils_12 = utils.getTotalFields;
	var utils_13 = utils.getTotal;
	var utils_14 = utils.BuildTypescriptModel;

	/**
	 * @license
	 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
	 * This code may only be used under the BSD style license found at
	 * http://polymer.github.io/LICENSE.txt
	 * The complete set of authors may be found at
	 * http://polymer.github.io/AUTHORS.txt
	 * The complete set of contributors may be found at
	 * http://polymer.github.io/CONTRIBUTORS.txt
	 * Code distributed by Google as part of the polymer project is also
	 * subject to an additional IP rights grant found at
	 * http://polymer.github.io/PATENTS.txt
	 */
	// Helper functions for manipulating parts
	// TODO(kschaaf): Refactor into Part API?
	const createAndInsertPart = (containerPart, beforePart) => {
	    const container = containerPart.startNode.parentNode;
	    const beforeNode = beforePart === undefined ? containerPart.endNode :
	        beforePart.startNode;
	    const startNode = container.insertBefore(createMarker(), beforeNode);
	    container.insertBefore(createMarker(), beforeNode);
	    const newPart = new NodePart(containerPart.options);
	    newPart.insertAfterNode(startNode);
	    return newPart;
	};
	const updatePart = (part, value) => {
	    part.setValue(value);
	    part.commit();
	    return part;
	};
	const insertPartBefore = (containerPart, part, ref) => {
	    const container = containerPart.startNode.parentNode;
	    const beforeNode = ref ? ref.startNode : containerPart.endNode;
	    const endNode = part.endNode.nextSibling;
	    if (endNode !== beforeNode) {
	        reparentNodes(container, part.startNode, endNode, beforeNode);
	    }
	};
	const removePart = (part) => {
	    removeNodes(part.startNode.parentNode, part.startNode, part.endNode.nextSibling);
	};
	// Helper for generating a map of array item to its index over a subset
	// of an array (used to lazily generate `newKeyToIndexMap` and
	// `oldKeyToIndexMap`)
	const generateMap = (list, start, end) => {
	    const map = new Map();
	    for (let i = start; i <= end; i++) {
	        map.set(list[i], i);
	    }
	    return map;
	};
	// Stores previous ordered list of parts and map of key to index
	const partListCache = new WeakMap();
	const keyListCache = new WeakMap();
	/**
	 * A directive that repeats a series of values (usually `TemplateResults`)
	 * generated from an iterable, and updates those items efficiently when the
	 * iterable changes based on user-provided `keys` associated with each item.
	 *
	 * Note that if a `keyFn` is provided, strict key-to-DOM mapping is maintained,
	 * meaning previous DOM for a given key is moved into the new position if
	 * needed, and DOM will never be reused with values for different keys (new DOM
	 * will always be created for new keys). This is generally the most efficient
	 * way to use `repeat` since it performs minimum unnecessary work for insertions
	 * amd removals.
	 *
	 * IMPORTANT: If providing a `keyFn`, keys *must* be unique for all items in a
	 * given call to `repeat`. The behavior when two or more items have the same key
	 * is undefined.
	 *
	 * If no `keyFn` is provided, this directive will perform similar to mapping
	 * items to values, and DOM will be reused against potentially different items.
	 */
	const repeat = directive((items, keyFnOrTemplate, template) => {
	    let keyFn;
	    if (template === undefined) {
	        template = keyFnOrTemplate;
	    }
	    else if (keyFnOrTemplate !== undefined) {
	        keyFn = keyFnOrTemplate;
	    }
	    return (containerPart) => {
	        if (!(containerPart instanceof NodePart)) {
	            throw new Error('repeat can only be used in text bindings');
	        }
	        // Old part & key lists are retrieved from the last update
	        // (associated with the part for this instance of the directive)
	        const oldParts = partListCache.get(containerPart) || [];
	        const oldKeys = keyListCache.get(containerPart) || [];
	        // New part list will be built up as we go (either reused from
	        // old parts or created for new keys in this update). This is
	        // saved in the above cache at the end of the update.
	        const newParts = [];
	        // New value list is eagerly generated from items along with a
	        // parallel array indicating its key.
	        const newValues = [];
	        const newKeys = [];
	        let index = 0;
	        for (const item of items) {
	            newKeys[index] = keyFn ? keyFn(item, index) : index;
	            newValues[index] = template(item, index);
	            index++;
	        }
	        // Maps from key to index for current and previous update; these
	        // are generated lazily only when needed as a performance
	        // optimization, since they are only required for multiple
	        // non-contiguous changes in the list, which are less common.
	        let newKeyToIndexMap;
	        let oldKeyToIndexMap;
	        // Head and tail pointers to old parts and new values
	        let oldHead = 0;
	        let oldTail = oldParts.length - 1;
	        let newHead = 0;
	        let newTail = newValues.length - 1;
	        // Overview of O(n) reconciliation algorithm (general approach
	        // based on ideas found in ivi, vue, snabbdom, etc.):
	        //
	        // * We start with the list of old parts and new values (and
	        //   arrays of their respective keys), head/tail pointers into
	        //   each, and we build up the new list of parts by updating
	        //   (and when needed, moving) old parts or creating new ones.
	        //   The initial scenario might look like this (for brevity of
	        //   the diagrams, the numbers in the array reflect keys
	        //   associated with the old parts or new values, although keys
	        //   and parts/values are actually stored in parallel arrays
	        //   indexed using the same head/tail pointers):
	        //
	        //      oldHead v                 v oldTail
	        //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
	        //   newParts: [ ,  ,  ,  ,  ,  ,  ]
	        //   newKeys:  [0, 2, 1, 4, 3, 7, 6] <- reflects the user's new
	        //                                      item order
	        //      newHead ^                 ^ newTail
	        //
	        // * Iterate old & new lists from both sides, updating,
	        //   swapping, or removing parts at the head/tail locations
	        //   until neither head nor tail can move.
	        //
	        // * Example below: keys at head pointers match, so update old
	        //   part 0 in-place (no need to move it) and record part 0 in
	        //   the `newParts` list. The last thing we do is advance the
	        //   `oldHead` and `newHead` pointers (will be reflected in the
	        //   next diagram).
	        //
	        //      oldHead v                 v oldTail
	        //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
	        //   newParts: [0,  ,  ,  ,  ,  ,  ] <- heads matched: update 0
	        //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldHead
	        //                                      & newHead
	        //      newHead ^                 ^ newTail
	        //
	        // * Example below: head pointers don't match, but tail
	        //   pointers do, so update part 6 in place (no need to move
	        //   it), and record part 6 in the `newParts` list. Last,
	        //   advance the `oldTail` and `oldHead` pointers.
	        //
	        //         oldHead v              v oldTail
	        //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
	        //   newParts: [0,  ,  ,  ,  ,  , 6] <- tails matched: update 6
	        //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldTail
	        //                                      & newTail
	        //         newHead ^              ^ newTail
	        //
	        // * If neither head nor tail match; next check if one of the
	        //   old head/tail items was removed. We first need to generate
	        //   the reverse map of new keys to index (`newKeyToIndexMap`),
	        //   which is done once lazily as a performance optimization,
	        //   since we only hit this case if multiple non-contiguous
	        //   changes were made. Note that for contiguous removal
	        //   anywhere in the list, the head and tails would advance
	        //   from either end and pass each other before we get to this
	        //   case and removals would be handled in the final while loop
	        //   without needing to generate the map.
	        //
	        // * Example below: The key at `oldTail` was removed (no longer
	        //   in the `newKeyToIndexMap`), so remove that part from the
	        //   DOM and advance just the `oldTail` pointer.
	        //
	        //         oldHead v           v oldTail
	        //   oldKeys:  [0, 1, 2, 3, 4, 5, 6]
	        //   newParts: [0,  ,  ,  ,  ,  , 6] <- 5 not in new map: remove
	        //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    5 and advance oldTail
	        //         newHead ^           ^ newTail
	        //
	        // * Once head and tail cannot move, any mismatches are due to
	        //   either new or moved items; if a new key is in the previous
	        //   "old key to old index" map, move the old part to the new
	        //   location, otherwise create and insert a new part. Note
	        //   that when moving an old part we null its position in the
	        //   oldParts array if it lies between the head and tail so we
	        //   know to skip it when the pointers get there.
	        //
	        // * Example below: neither head nor tail match, and neither
	        //   were removed; so find the `newHead` key in the
	        //   `oldKeyToIndexMap`, and move that old part's DOM into the
	        //   next head position (before `oldParts[oldHead]`). Last,
	        //   null the part in the `oldPart` array since it was
	        //   somewhere in the remaining oldParts still to be scanned
	        //   (between the head and tail pointers) so that we know to
	        //   skip that old part on future iterations.
	        //
	        //         oldHead v        v oldTail
	        //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
	        //   newParts: [0, 2,  ,  ,  ,  , 6] <- stuck: update & move 2
	        //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    into place and advance
	        //                                      newHead
	        //         newHead ^           ^ newTail
	        //
	        // * Note that for moves/insertions like the one above, a part
	        //   inserted at the head pointer is inserted before the
	        //   current `oldParts[oldHead]`, and a part inserted at the
	        //   tail pointer is inserted before `newParts[newTail+1]`. The
	        //   seeming asymmetry lies in the fact that new parts are
	        //   moved into place outside in, so to the right of the head
	        //   pointer are old parts, and to the right of the tail
	        //   pointer are new parts.
	        //
	        // * We always restart back from the top of the algorithm,
	        //   allowing matching and simple updates in place to
	        //   continue...
	        //
	        // * Example below: the head pointers once again match, so
	        //   simply update part 1 and record it in the `newParts`
	        //   array.  Last, advance both head pointers.
	        //
	        //         oldHead v        v oldTail
	        //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
	        //   newParts: [0, 2, 1,  ,  ,  , 6] <- heads matched: update 1
	        //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance both oldHead
	        //                                      & newHead
	        //            newHead ^        ^ newTail
	        //
	        // * As mentioned above, items that were moved as a result of
	        //   being stuck (the final else clause in the code below) are
	        //   marked with null, so we always advance old pointers over
	        //   these so we're comparing the next actual old value on
	        //   either end.
	        //
	        // * Example below: `oldHead` is null (already placed in
	        //   newParts), so advance `oldHead`.
	        //
	        //            oldHead v     v oldTail
	        //   oldKeys:  [0, 1, -, 3, 4, 5, 6] <- old head already used:
	        //   newParts: [0, 2, 1,  ,  ,  , 6]    advance oldHead
	        //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
	        //               newHead ^     ^ newTail
	        //
	        // * Note it's not critical to mark old parts as null when they
	        //   are moved from head to tail or tail to head, since they
	        //   will be outside the pointer range and never visited again.
	        //
	        // * Example below: Here the old tail key matches the new head
	        //   key, so the part at the `oldTail` position and move its
	        //   DOM to the new head position (before `oldParts[oldHead]`).
	        //   Last, advance `oldTail` and `newHead` pointers.
	        //
	        //               oldHead v  v oldTail
	        //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
	        //   newParts: [0, 2, 1, 4,  ,  , 6] <- old tail matches new
	        //   newKeys:  [0, 2, 1, 4, 3, 7, 6]   head: update & move 4,
	        //                                     advance oldTail & newHead
	        //               newHead ^     ^ newTail
	        //
	        // * Example below: Old and new head keys match, so update the
	        //   old head part in place, and advance the `oldHead` and
	        //   `newHead` pointers.
	        //
	        //               oldHead v oldTail
	        //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
	        //   newParts: [0, 2, 1, 4, 3,   ,6] <- heads match: update 3
	        //   newKeys:  [0, 2, 1, 4, 3, 7, 6]    and advance oldHead &
	        //                                      newHead
	        //                  newHead ^  ^ newTail
	        //
	        // * Once the new or old pointers move past each other then all
	        //   we have left is additions (if old list exhausted) or
	        //   removals (if new list exhausted). Those are handled in the
	        //   final while loops at the end.
	        //
	        // * Example below: `oldHead` exceeded `oldTail`, so we're done
	        //   with the main loop.  Create the remaining part and insert
	        //   it at the new head position, and the update is complete.
	        //
	        //                   (oldHead > oldTail)
	        //   oldKeys:  [0, 1, -, 3, 4, 5, 6]
	        //   newParts: [0, 2, 1, 4, 3, 7 ,6] <- create and insert 7
	        //   newKeys:  [0, 2, 1, 4, 3, 7, 6]
	        //                     newHead ^ newTail
	        //
	        // * Note that the order of the if/else clauses is not
	        //   important to the algorithm, as long as the null checks
	        //   come first (to ensure we're always working on valid old
	        //   parts) and that the final else clause comes last (since
	        //   that's where the expensive moves occur). The order of
	        //   remaining clauses is is just a simple guess at which cases
	        //   will be most common.
	        //
	        // * TODO(kschaaf) Note, we could calculate the longest
	        //   increasing subsequence (LIS) of old items in new position,
	        //   and only move those not in the LIS set. However that costs
	        //   O(nlogn) time and adds a bit more code, and only helps
	        //   make rare types of mutations require fewer moves. The
	        //   above handles removes, adds, reversal, swaps, and single
	        //   moves of contiguous items in linear time, in the minimum
	        //   number of moves. As the number of multiple moves where LIS
	        //   might help approaches a random shuffle, the LIS
	        //   optimization becomes less helpful, so it seems not worth
	        //   the code at this point. Could reconsider if a compelling
	        //   case arises.
	        while (oldHead <= oldTail && newHead <= newTail) {
	            if (oldParts[oldHead] === null) {
	                // `null` means old part at head has already been used
	                // below; skip
	                oldHead++;
	            }
	            else if (oldParts[oldTail] === null) {
	                // `null` means old part at tail has already been used
	                // below; skip
	                oldTail--;
	            }
	            else if (oldKeys[oldHead] === newKeys[newHead]) {
	                // Old head matches new head; update in place
	                newParts[newHead] =
	                    updatePart(oldParts[oldHead], newValues[newHead]);
	                oldHead++;
	                newHead++;
	            }
	            else if (oldKeys[oldTail] === newKeys[newTail]) {
	                // Old tail matches new tail; update in place
	                newParts[newTail] =
	                    updatePart(oldParts[oldTail], newValues[newTail]);
	                oldTail--;
	                newTail--;
	            }
	            else if (oldKeys[oldHead] === newKeys[newTail]) {
	                // Old head matches new tail; update and move to new tail
	                newParts[newTail] =
	                    updatePart(oldParts[oldHead], newValues[newTail]);
	                insertPartBefore(containerPart, oldParts[oldHead], newParts[newTail + 1]);
	                oldHead++;
	                newTail--;
	            }
	            else if (oldKeys[oldTail] === newKeys[newHead]) {
	                // Old tail matches new head; update and move to new head
	                newParts[newHead] =
	                    updatePart(oldParts[oldTail], newValues[newHead]);
	                insertPartBefore(containerPart, oldParts[oldTail], oldParts[oldHead]);
	                oldTail--;
	                newHead++;
	            }
	            else {
	                if (newKeyToIndexMap === undefined) {
	                    // Lazily generate key-to-index maps, used for removals &
	                    // moves below
	                    newKeyToIndexMap = generateMap(newKeys, newHead, newTail);
	                    oldKeyToIndexMap = generateMap(oldKeys, oldHead, oldTail);
	                }
	                if (!newKeyToIndexMap.has(oldKeys[oldHead])) {
	                    // Old head is no longer in new list; remove
	                    removePart(oldParts[oldHead]);
	                    oldHead++;
	                }
	                else if (!newKeyToIndexMap.has(oldKeys[oldTail])) {
	                    // Old tail is no longer in new list; remove
	                    removePart(oldParts[oldTail]);
	                    oldTail--;
	                }
	                else {
	                    // Any mismatches at this point are due to additions or
	                    // moves; see if we have an old part we can reuse and move
	                    // into place
	                    const oldIndex = oldKeyToIndexMap.get(newKeys[newHead]);
	                    const oldPart = oldIndex !== undefined ? oldParts[oldIndex] : null;
	                    if (oldPart === null) {
	                        // No old part for this value; create a new one and
	                        // insert it
	                        const newPart = createAndInsertPart(containerPart, oldParts[oldHead]);
	                        updatePart(newPart, newValues[newHead]);
	                        newParts[newHead] = newPart;
	                    }
	                    else {
	                        // Reuse old part
	                        newParts[newHead] =
	                            updatePart(oldPart, newValues[newHead]);
	                        insertPartBefore(containerPart, oldPart, oldParts[oldHead]);
	                        // This marks the old part as having been used, so that
	                        // it will be skipped in the first two checks above
	                        oldParts[oldIndex] = null;
	                    }
	                    newHead++;
	                }
	            }
	        }
	        // Add parts for any remaining new values
	        while (newHead <= newTail) {
	            // For all remaining additions, we insert before last new
	            // tail, since old pointers are no longer valid
	            const newPart = createAndInsertPart(containerPart, newParts[newTail + 1]);
	            updatePart(newPart, newValues[newHead]);
	            newParts[newHead++] = newPart;
	        }
	        // Remove any remaining unused old parts
	        while (oldHead <= oldTail) {
	            const oldPart = oldParts[oldHead++];
	            if (oldPart !== null) {
	                removePart(oldPart);
	            }
	        }
	        // Save order of new parts for next round
	        partListCache.set(containerPart, newParts);
	        keyListCache.set(containerPart, newKeys);
	    };
	});
	//# sourceMappingURL=repeat.js.map

	var repeat$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		repeat: repeat
	});

	var utilsBrowser = createCommonjsModule(function (module, exports) {
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });

	const moment_1 = __importDefault(moment);
	exports.moment = moment_1.default;

	var lit_html_2 = litHtml;
	exports.html = lit_html_2.html;
	exports.render = lit_html_2.render;
	exports.TemplateResult = lit_html_2.TemplateResult;

	exports.repeat = repeat$1.repeat;
	// bind and call so the caller's source and line number shows up in devtools -JDK 2020-01-04
	// tslint:disable-next-line: no-console
	exports.log = Function.prototype.bind.call(console.log, console, "%c App:", "color: green");
	// tslint:disable-next-line: no-console
	exports.debug = Function.prototype.bind.call(console.log, console, "%c DEBUG:", "color: blue");
	exports.autoReload = (socket = io()) => {
	    socket.on("reload", () => {
	        window.location.reload();
	    });
	    exports.log("autoReload connected.");
	};
	exports.Loading = () => litHtml.html `
    <h3>Loading...</h3>
`;
	exports.Error = (err) => {
	    return litHtml.html `
        <h3>Error:</h3>
        <p>${err.message}</p>
        <pre>${JSON.stringify(err.stack, null, 2)}</pre>
    `;
	};
	exports.StringFormatter = {
	    inputType: "text",
	    parse: (str) => str,
	    preferredInputStyle: "width: 100%",
	    toString: (value) => value,
	};
	exports.CurrencyFormatter = {
	    inputType: "text",
	    parse: (str) => utils.round(parseFloat(str.replace("$", "").replace(",", "")), 2),
	    preferredInputStyle: "width: 8em; text-align: right;",
	    toString: (value) => utils.formatCurrency(value),
	};
	exports.IntegerFormatter = {
	    inputType: "text",
	    parse: (str) => utils.round(parseFloat(str.replace(",", "")), 0),
	    preferredInputStyle: "width: 8em; text-align: right;",
	    toString: (value) => value.toString(),
	};
	exports.DateFormatter = {
	    inputType: "date",
	    parse: (str) => { exports.log("str", str); return moment_1.default(str).format("YYYY-MM-DD"); },
	    preferredInputStyle: "width: 8em;",
	    toString: (value) => moment_1.default(value).format("YYYY-MM-DD"),
	};
	exports.TwoWayInput = (model, prop, formatter = exports.StringFormatter, onChanged, isTextArea = false) => {
	    let timeout;
	    const commit = (e) => {
	        if (timeout) {
	            clearTimeout(timeout);
	        }
	        exports.log("e.target", e.target);
	        const newValue = e.target.value;
	        /*
	        const newValue = isTextArea ? (e.target as HTMLTextAreaElement).innerHTML as any
	                                    : (e.target as HTMLInputElement).value as any;
	        */
	        model[prop] = formatter.parse(newValue);
	        if (onChanged) {
	            onChanged(newValue);
	        }
	    };
	    const onChange = (e) => {
	        // Commit immediately
	        commit(e);
	    };
	    const onInput = (e) => {
	        if (timeout) {
	            clearTimeout(timeout);
	        }
	        timeout = setTimeout(() => {
	            commit(e);
	        }, 1000);
	    };
	    let value = utils.getProperty(model, prop);
	    value = formatter.toString(value);
	    const style = formatter.preferredInputStyle || "";
	    if (isTextArea) {
	        return litHtml.html `
            <textarea style=${style} @input=${onInput} @change=${onChange}>${value}</textarea>
        `;
	    }
	    else {
	        return litHtml.html `
            <input type=${formatter.inputType} style=${style} value=${value} @input=${onInput} @change=${onChange} />
        `;
	    }
	};
	exports.Label = (label, content) => {
	    return litHtml.html `
        <div class="row">
            <label class="row-nofill w5">
                ${label}
            </label>
            <div class="row-nofill w10">
                ${content}
            </div>
        </div>
    `;
	};
	exports.normalizedDate = (date) => moment_1.default(date).format("YYYY-MM-DD");
	exports.normalizedDateTime = (date) => moment_1.default(date).toISOString();
	exports.formattedDate = (date) => moment_1.default(date).format("MM-DD-YYYY");
	exports.formattedDateTime = (date) => moment_1.default(date).format("MM-DD-YYYY h:mma");
	exports.elementRef = () => {
	    const id = utils.guidShort();
	    return {
	        get: () => document.getElementById(id),
	        id,
	    };
	};
	class DateRange {
	    constructor() {
	        this.endDate = moment_1.default();
	        this.startDate = moment_1.default(this.endDate).add(-12, "months");
	    }
	    render() {
	        const startChanged = (e) => this.startDate = moment_1.default(e.target.value);
	        const endChanged = (e) => {
	            this.endDate = moment_1.default(e.target.value);
	        };
	        return litHtml.html `
            <div class="row">
                <span class="w3">Start:</span>
                <input class="w4" value=${this.startDate.format("YYYY-MM-DD")} @change=${startChanged} type="date" />
            </div>
            <div class="row">
                <span class="w3">End:</span>
                <input class="w4" value=${this.endDate.format("YYYY-MM-DD")} @change=${endChanged} type="date" />
            </div>
        `;
	    }
	}
	exports.DateRange = DateRange;
	/*
	export interface IInputOptions {
	    label?: string;
	    type?: "number" | "text" | "date";
	    step?: number;
	    onChange?: (newValue: any) => void;
	    isCurrency?: boolean;
	}

	export const TwoWayInput = <T>(model: T, prop: keyof T, options: IInputOptions = {}) => {
	    let type = options.type || "text";

	    let timeout: NodeJS.Timeout;

	    const commit = (e: InputEvent) => {
	        if (timeout) { clearTimeout(timeout); }

	        let newValue = (e.target as HTMLInputElement).value as any;
	        if (options.type === "number") { newValue = parseFloat(newValue); }
	        if (options.isCurrency) { newValue = round(newValue); }
	        model[prop] = newValue;

	        if (options.onChange) { options.onChange(newValue); }
	    };

	    const onChange = (e: InputEvent) => {
	        // Commit immediately
	        commit(e);
	    };

	    const onInput = (e: InputEvent) => {
	        if (timeout) { clearTimeout(timeout); }
	        timeout = setTimeout(() => {
	            commit(e);
	        }, 1000);
	    };

	    let value = getProperty(model, prop as string);
	    if (options.type === "date") {
	        value = moment(value).format("YYYY-MM-DD");
	    }
	    if (options.isCurrency) {
	        type = "number";
	        options.step = 0.01;
	        value = formatCurrency(value);
	    }

	    return html`
	        <input value=${value} @input=${onInput} @change=${onChange}
	        type=${type} step=${options.step || 0.01} />
	    `;
	};

	*/
	/*
	export class InputGeneric<T> {
	    private model: T;
	    private prop: keyof T;
	    private options: IInputOptions;

	    constructor(model: T, prop: keyof T, options: IInputOptions = {}) {
	        this.model = model;
	        this.prop = prop;
	        this.options = options;
	    }

	    public getModelValue(): string {
	        return getProperty(this.model, this.prop as string).toString();
	    }

	    public parseValue(value: any): { success: boolean; value: any} {
	        return { success: true, value };
	    }

	    public setModelValue(newValue: any) {
	        const result = this.parseValue(newValue);
	        if (result.success) {
	            this.model[this.prop] = result.value;
	            log("onInput", newValue);
	            if (this.options.onChange) { this.options.onChange(newValue); }
	        }
	    }

	    public render() {
	        return html`
	            <input value=${this.getModelValue()} @input=${this.onInput.bind(this)} />
	        `;
	    }

	    private onInput(e: InputEvent) {
	        const newValue = (e.target as HTMLInputElement).value as any;
	        this.setModelValue(newValue);
	    }
	}

	// tslint:disable-next-line: max-classes-per-file
	export class InputCurrency<T> extends InputGeneric<T> {
	    public getModelValue(): string {
	        return "Currency";
	    }
	}

	export const InputCurrency2 = <T>(model: T, prop: keyof T, options: IInputOptions = {}) => {
	    let timeout: NodeJS.Timeout;
	    const commit = (e: InputEvent) => {
	        if (timeout) { clearTimeout(timeout); }

	        let newValue = (e.target as HTMLInputElement).value as any;
	        newValue = parseFloat(newValue);
	        newValue = round(newValue);
	        model[prop] = newValue;

	        if (options.onChange) { options.onChange(newValue); }
	    };

	    const onChange = (e: InputEvent) => commit(e);
	    const onInput = (e: InputEvent) => {
	        if (timeout) { clearTimeout(timeout); }
	        timeout = setTimeout(() => {
	            commit(e);
	        }, 1000);
	    };

	    const value = formatCurrency(getProperty(model, prop as string));
	    const type = "text";

	    return html`
	        <input value=${value} @input=${onInput} @change=${onChange}
	        type=${type} />
	    `;
	};
	*/
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMtYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWxzLWJyb3dzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1Q0FBZ0Q7QUFDaEQsb0RBQTRCO0FBS25CLGlCQUxGLGdCQUFNLENBS0U7QUFKZixvQ0FBeUU7QUFFekUscUNBQXdEO0FBQS9DLDBCQUFBLElBQUksQ0FBQTtBQUFFLDRCQUFBLE1BQU0sQ0FBQTtBQUFFLG9DQUFBLGNBQWMsQ0FBQTtBQUNyQyxxREFBb0Q7QUFBM0MsMEJBQUEsTUFBTSxDQUFBO0FBR2YsNEZBQTRGO0FBQzVGLHVDQUF1QztBQUMxQixRQUFBLEdBQUcsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ2pHLHVDQUF1QztBQUMxQixRQUFBLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBRXZGLFFBQUEsVUFBVSxHQUFHLENBQUMsU0FBZ0MsRUFBRSxFQUFFLEVBQVEsRUFBRTtJQUNyRSxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDckIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztJQUNILFdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2pDLENBQUMsQ0FBQztBQUVXLFFBQUEsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLGVBQUksQ0FBQTs7Q0FFaEMsQ0FBQztBQUVXLFFBQUEsS0FBSyxHQUFHLENBQUMsR0FBVSxFQUFFLEVBQUU7SUFDaEMsT0FBTyxlQUFJLENBQUE7O2FBRUYsR0FBRyxDQUFDLE9B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
	});

	unwrapExports(utilsBrowser);
	var utilsBrowser_1 = utilsBrowser.moment;
	var utilsBrowser_2 = utilsBrowser.html;
	var utilsBrowser_3 = utilsBrowser.render;
	var utilsBrowser_4 = utilsBrowser.TemplateResult;
	var utilsBrowser_5 = utilsBrowser.repeat;
	var utilsBrowser_6 = utilsBrowser.log;
	var utilsBrowser_7 = utilsBrowser.debug;
	var utilsBrowser_8 = utilsBrowser.autoReload;
	var utilsBrowser_9 = utilsBrowser.Loading;
	var utilsBrowser_10 = utilsBrowser.Error;
	var utilsBrowser_11 = utilsBrowser.StringFormatter;
	var utilsBrowser_12 = utilsBrowser.CurrencyFormatter;
	var utilsBrowser_13 = utilsBrowser.IntegerFormatter;
	var utilsBrowser_14 = utilsBrowser.DateFormatter;
	var utilsBrowser_15 = utilsBrowser.TwoWayInput;
	var utilsBrowser_16 = utilsBrowser.Label;
	var utilsBrowser_17 = utilsBrowser.normalizedDate;
	var utilsBrowser_18 = utilsBrowser.normalizedDateTime;
	var utilsBrowser_19 = utilsBrowser.formattedDate;
	var utilsBrowser_20 = utilsBrowser.formattedDateTime;
	var utilsBrowser_21 = utilsBrowser.elementRef;
	var utilsBrowser_22 = utilsBrowser.DateRange;

	var nav = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	exports.Nav = litHtml.html `
    <header>
        <nav>
            <a href="/">Home</a>
            <a href="/todo">Todo</a>
        </nav>
    </header>
`;
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmF2LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQWdDO0FBRW5CLFFBQUEsR0FBRyxHQUFHLGVBQUksQ0FBQTs7Ozs7OztDQU90QixDQUFDIn0=
	});

	unwrapExports(nav);
	var nav_1 = nav.Nav;

	var app = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	const nsp = io("/");
	utilsBrowser.autoReload(nsp);
	const Main = () => {
	    return utilsBrowser.html `
        ${nav.Nav}
        <h1>Home</h1>
    `;
	};
	const mainDiv = document.getElementById("mainDiv");
	utilsBrowser.render(Main(), mainDiv);
	/*
	page("*", (ctx) => {
	    log("ERROR: Page Not Found", ctx);
	    render(html`<h3>Error [client]: Page Not Found</h3>`, mainDiv);
	});
	page.start();
	*/

	});

	var app$1 = unwrapExports(app);

	return app$1;

}(moment));
//# sourceMappingURL=bundle.js.map
