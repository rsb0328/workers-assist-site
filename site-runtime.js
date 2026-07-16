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

  global.WASite = Object.freeze({
    applyCopy: applyCopy,
    buildMailto: buildMailto,
    readLanguage: readLanguage,
    updateLanguageButtons: updateLanguageButtons,
    updateMetadata: updateMetadata,
    writeLanguage: writeLanguage
  });
}(window));
