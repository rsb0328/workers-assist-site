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
//
// There is no per-class address: every in-person class meets at the same place,
// shown once on the map in the home page schedule section. If a class ever
// moves elsewhere, add a `loc` field here and render it in the schedule ticket.
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
      level: { en: "Beginner", "zh-hans": "初级", "zh-hant": "初級" },
      blurb: {
        en: "Practical English for daily life — public transit, asking prices, getting a driver's license. No experience needed.",
        "zh-hans": "日常生活用得上的英语：坐公交、问价钱、考驾照。零基础也能来。",
        "zh-hant": "日常生活用得上的英語：搭巴士、問價錢、考車牌。零基礎也能來。"
      },
      value: "日常英语班 Everyday English Class (Mon 7:30–9:00 PM, in person)"
    },
    {
      id: "intermediate",
      name:  { en: "Intermediate English Class", "zh-hans": "中级英语班", "zh-hant": "中級英語班" },
      time:  { en: "Wednesdays, 7:30pm", "zh-hans": "周三晚上 7:30", "zh-hant": "星期三晚上 7:30" },
      slot:  { en: "Wednesdays 7:30–9:00 PM", "zh-hans": "周三晚上 7:30–9:00", "zh-hant": "星期三晚上 7:30–9:00" },
      mode:  { en: "Online", "zh-hans": "线上", "zh-hant": "線上" },
      level: { en: "Intermediate", "zh-hans": "中级", "zh-hant": "中級" },
      blurb: {
        en: "Grammar and sentence building, for learners who already speak some English.",
        "zh-hans": "学语法、练造句。适合已经有一点英语基础的学员。",
        "zh-hant": "學文法、練造句。適合已經有一點英語基礎的學員。"
      },
      value: "中级英语班 Intermediate English Class (Wed 7:30–9:00 PM, online)"
    },
    {
      id: "work",
      name:  { en: "Workplace English", "zh-hans": "职场英语班", "zh-hant": "職場英語班" },
      time:  { en: "Tuesdays & Fridays, 7:30pm", "zh-hans": "周二、周五晚上 7:30", "zh-hant": "星期二、星期五晚上 7:30" },
      slot:  { en: "Tuesdays & Fridays 7:30–9:00 PM", "zh-hans": "周二、周五晚上 7:30–9:00", "zh-hant": "星期二、星期五晚上 7:30–9:00" },
      mode:  { en: "In person", "zh-hans": "线下", "zh-hant": "實體" },
      level: { en: "Intensive", "zh-hans": "强化", "zh-hant": "強化" },
      blurb: {
        en: "English for service jobs — taking phone reservations, checking customer preferences. No experience needed.",
        "zh-hans": "在服务行业用得上的英语：接电话订位、问清楚客人的要求。零基础也能来。",
        "zh-hant": "在服務行業用得上的英語：接電話訂位、問清楚客人的要求。零基礎也能來。"
      },
      value: "职场英语班 Workplace English (Tue & Fri 7:30–9:00 PM, in person)"
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
