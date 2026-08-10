// Single source of truth for the class schedule.
//
// EDIT THE SCHEDULE HERE AND NOWHERE ELSE.
//   index.html    renders the schedule table from `schedule`.
//   Join.html     renders its sign-up checkboxes from `schedule`.
//
// To add, remove, or reschedule a class, change the `schedule` array below.
// Both pages update automatically — no other file needs touching.
//
// `value` is what gets recorded in the Google Form response. Keep it stable
// across interface languages so the responses sheet stays filterable, and keep
// it free of "/" — that character joins multiple selections together.
(function (global) {
  "use strict";

  var JOIN_SEPARATOR = " / ";

  var schedule = [
    {
      id: "everyday",
      name:  { en: "Everyday English Class", "zh-hans": "日常英语班", "zh-hant": "日常英語班" },
      time:  { en: "Mondays, 7:30pm", "zh-hans": "周一晚上 7:30", "zh-hant": "星期一晚上 7:30" },
      slot:  { en: "Mondays 7:30–9:00 PM", "zh-hans": "周一晚上 7:30–9:00", "zh-hant": "星期一晚上 7:30–9:00" },
      mode:  { en: "In person", "zh-hans": "线下", "zh-hant": "實體" },
      loc:   { en: "1145 Washington St", "zh-hans": "1145 Washington St", "zh-hant": "1145 Washington St" },
      level: { en: "Beginner", "zh-hans": "初级", "zh-hant": "初級" },
      value: "日常英语班 Everyday English Class (Mon 7:30–9:00 PM, in person)"
    },
    {
      id: "intermediate",
      name:  { en: "Intermediate English Class", "zh-hans": "中级英语班", "zh-hant": "中級英語班" },
      time:  { en: "Wednesdays, 7:30pm", "zh-hans": "周三晚上 7:30", "zh-hant": "星期三晚上 7:30" },
      slot:  { en: "Wednesdays 7:30–9:00 PM", "zh-hans": "周三晚上 7:30–9:00", "zh-hant": "星期三晚上 7:30–9:00" },
      mode:  { en: "Online", "zh-hans": "线上", "zh-hant": "線上" },
      loc:   { en: "", "zh-hans": "", "zh-hant": "" },
      level: { en: "Intermediate", "zh-hans": "中级", "zh-hant": "中級" },
      value: "中级英语班 Intermediate English Class (Wed 7:30–9:00 PM, online)"
    },
    {
      id: "work",
      name:  { en: "Work English Class", "zh-hans": "职场英语班", "zh-hant": "職場英語班" },
      time:  { en: "Tuesdays & Fridays, 7:30pm", "zh-hans": "周二、周五晚上 7:30", "zh-hant": "星期二、星期五晚上 7:30" },
      slot:  { en: "Tuesdays & Fridays 7:30–9:00 PM", "zh-hans": "周二、周五晚上 7:30–9:00", "zh-hant": "星期二、星期五晚上 7:30–9:00" },
      mode:  { en: "In person", "zh-hans": "线下", "zh-hant": "實體" },
      loc:   { en: "1145 Washington St", "zh-hans": "1145 Washington St", "zh-hant": "1145 Washington St" },
      level: { en: "Intensive", "zh-hans": "强化", "zh-hant": "強化" },
      value: "职场英语班 Work English Class (Tue & Fri 7:30–9:00 PM, in person)"
    }
  ];

  // Localised field lookup, falling back to English for any missing translation.
  function pick(field, lang) {
    if (!field) return "";
    return field[lang] !== undefined && field[lang] !== null ? field[lang] : field.en;
  }

  // One-line description used by the Join form's checkboxes.
  function label(entry, lang) {
    return [pick(entry.name, lang), pick(entry.slot, lang), pick(entry.mode, lang)]
      .filter(Boolean)
      .join(" · ");
  }

  // Serialise the visitor's picks into the single free-text answer the Google
  // Form now stores. Uses `value` (not the translated label) so the responses
  // sheet reads the same whatever language the visitor used.
  function serialize(values) {
    return values.filter(function (v) { return v && String(v).trim(); })
      .map(function (v) { return String(v).trim(); })
      .join(JOIN_SEPARATOR);
  }

  global.WAClasses = Object.freeze({
    schedule: schedule,
    pick: pick,
    label: label,
    serialize: serialize,
    JOIN_SEPARATOR: JOIN_SEPARATOR
  });
}(window));
