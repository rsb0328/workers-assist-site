// Shared front-end helpers for the whole site: language persistence, copy
// swapping, and the mailto builder.
//
// NOTE ON NAMING: despite the name, this file is Worker's Assist' own code.
// The file called support.js is the generated dc-runtime bundle (vendor code —
// do not edit it). The two names read backwards; renaming would mean updating
// the <script> tags in all three pages.
//
// Loaded by Home.dc.html, Join.html and Volunteer.html. Exposes `window.WASite`.
(function (global) {
  "use strict";

  var LANGUAGE_STORAGE_KEY = "wa.lang";
  var COPY_BINDINGS = [
    { selector: "[data-i18n]", dataKey: "i18n", property: "textContent" },
    { selector: "[data-i18n-html]", dataKey: "i18nHtml", property: "innerHTML" },
    { selector: "[data-i18n-placeholder]", dataKey: "i18nPlaceholder", attribute: "placeholder" },
    { selector: "[data-i18n-title]", dataKey: "i18nTitle", attribute: "title" },
    { selector: "[data-i18n-alt]", dataKey: "i18nAlt", attribute: "alt" },
    { selector: "[data-i18n-aria]", dataKey: "i18nAria", attribute: "aria-label" }
  ];

  // Returns the stored preference only if this page can actually render it,
  // so a page supporting fewer languages falls back instead of breaking.
  function readLanguage(allowedLanguages, fallback) {
    var saved = null;
    try { saved = global.localStorage.getItem(LANGUAGE_STORAGE_KEY); } catch (error) {}
    return allowedLanguages.indexOf(saved) !== -1 ? saved : fallback;
  }

  function writeLanguage(language) {
    try { global.localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch (error) {}
  }

  function updateMetadata(copy) {
    if (copy.docTitle || copy.title) document.title = copy.docTitle || copy.title;
    var description = document.querySelector('meta[name="description"]');
    if (description && copy.description) description.setAttribute("content", copy.description);
  }

  function applyCopy(root, copy) {
    COPY_BINDINGS.forEach(function (binding) {
      root.querySelectorAll(binding.selector).forEach(function (element) {
        var key = element.dataset[binding.dataKey];
        if (key === undefined || copy[key] === undefined) return;
        if (binding.attribute) element.setAttribute(binding.attribute, copy[key]);
        else element[binding.property] = copy[key];
      });
    });
  }

  function updateLanguageButtons(selector, dataAttribute, language) {
    document.querySelectorAll(selector).forEach(function (button) {
      var active = button.getAttribute(dataAttribute) === language;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function buildMailto(address, subject, body) {
    return "mailto:" + address + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  // Wires up a page's language switcher and applies the starting language.
  //
  // Options:
  //   strings   {lang: {key: text}}  copy for every supported language
  //   selector  CSS selector for the switcher buttons
  //   attribute attribute on each button naming its language
  //   fallback  language to use when nothing valid is stored (default "en")
  //   onApply   optional (lang, copy) hook for page-specific rendering
  //
  // The stored preference is written ONLY when the visitor clicks a button.
  // Writing on load would let a page overwrite a preference it cannot honour —
  // e.g. landing on a Chinese-only page used to silently reset the whole site
  // to Chinese for an English visitor.
  function initLanguage(options) {
    var strings = options.strings;
    var supported = Object.keys(strings);
    var fallback = options.fallback || "en";

    function apply(language, persist) {
      if (!strings[language]) language = fallback;
      var copy = strings[language];

      document.documentElement.lang =
        language === "en" ? "en" : (language === "zh-hant" ? "zh-Hant" : "zh-Hans");
      document.documentElement.setAttribute("data-lang", language);

      updateMetadata(copy);
      applyCopy(document, copy);
      updateLanguageButtons(options.selector, options.attribute, language);
      if (options.onApply) options.onApply(language, copy);
      if (persist) writeLanguage(language);
      return language;
    }

    document.querySelectorAll(options.selector).forEach(function (button) {
      button.addEventListener("click", function () {
        apply(button.getAttribute(options.attribute), true);
      });
    });

    return { apply: apply, current: apply(readLanguage(supported, fallback), false) };
  }

  global.WASite = Object.freeze({
    applyCopy: applyCopy,
    buildMailto: buildMailto,
    initLanguage: initLanguage,
    readLanguage: readLanguage,
    updateLanguageButtons: updateLanguageButtons,
    updateMetadata: updateMetadata,
    writeLanguage: writeLanguage
  });
}(window));
