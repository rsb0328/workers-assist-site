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
      time:  { en: "Mondays & Thursdays, 7:30pm", "zh-hans": "周一、周四晚上 7:30", "zh-hant": "星期一、星期四晚上 7:30" },
      slot:  { en: "Mondays & Thursdays 7:30–9:00 PM", "zh-hans": "周一、周四晚上 7:30–9:00", "zh-hant": "星期一、星期四晚上 7:30–9:00" },
      mode:  { en: "In person", "zh-hans": "线下", "zh-hant": "實體" },
      level: { en: "Beginner", "zh-hans": "初级", "zh-hant": "初級" },
      blurb: {
        en: "Practical English for daily life — public transit, asking prices, getting a driver's license. No experience needed.",
        "zh-hans": "日常生活用得上的英语：坐公交、问价钱、考驾照。零基础也能来。",
        "zh-hant": "日常生活用得上的英語：搭巴士、問價錢、考車牌。零基礎也能來。"
      },
      value: "日常英语班 Everyday English Class (Mon & Thu 7:30–9:00 PM, in person)"
    },
    {
      id: "beginner-online",
      name:  { en: "Beginner English Class", "zh-hans": "初级英语班", "zh-hant": "初級英語班" },
      time:  { en: "Tuesdays, 7:30pm", "zh-hans": "周二晚上 7:30", "zh-hant": "星期二晚上 7:30" },
      slot:  { en: "Tuesdays 7:30–9:00 PM", "zh-hans": "周二晚上 7:30–9:00", "zh-hant": "星期二晚上 7:30–9:00" },
      mode:  { en: "Online", "zh-hans": "线上", "zh-hant": "線上" },
      level: { en: "Beginner", "zh-hans": "初级", "zh-hant": "初級" },
      blurb: {
        en: "Learn basic English online, with practice in everyday words and simple conversations. No experience needed.",
        "zh-hans": "在线学习基础英语，练习日常用语和简单对话。零基础也能来。",
        "zh-hant": "在線學習基礎英語，練習日常用語和簡單對話。零基礎也能來。"
      },
      value: "初级英语班 Beginner English Class (Tue 7:30–9:00 PM, online)"
    },
    {
      id: "advanced",
      name:  { en: "Advanced English Class", "zh-hans": "高级英语班", "zh-hant": "高級英語班" },
      time:  { en: "Wednesdays, 7:30pm", "zh-hans": "周三晚上 7:30", "zh-hant": "星期三晚上 7:30" },
      slot:  { en: "Wednesdays 7:30–9:00 PM", "zh-hans": "周三晚上 7:30–9:00", "zh-hant": "星期三晚上 7:30–9:00" },
      mode:  { en: "Online", "zh-hans": "线上", "zh-hant": "線上" },
      level: { en: "Advanced", "zh-hans": "高级", "zh-hant": "高級" },
      blurb: {
        en: "Build fluency and express more complex ideas, for learners with a strong English foundation.",
        "zh-hans": "提升英语表达的流利度，练习表达更复杂的想法。适合已有扎实英语基础的学员。",
        "zh-hant": "提升英語表達的流利度，練習表達更複雜的想法。適合已有紮實英語基礎的學員。"
      },
      value: "高级英语班 Advanced English Class (Wed 7:30–9:00 PM, online)"
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
