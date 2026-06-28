/* =========================================================================
   i18n.js — trilingual dictionary + language switcher + schedule renderer.

   - Strings live here under en / zh-hans / zh-hant.
   - Elements carry data-i18n (text) or data-i18n-alt (image alt text).
   - On load: read localStorage (default "en"), set <html lang>, swap text in.
   - English stays in the HTML as the visible fallback if this script fails.
   - The Home schedule renders from classes.json so the list can be updated
     without touching HTML; falls back to the static markup on any error.
   ========================================================================= */

(function () {
  "use strict";

  var STORAGE_KEY = "wa.lang";
  var DEFAULT = "en";

  // Maps our locale keys to the value for the <html lang> attribute.
  var HTML_LANG = { "en": "en", "zh-hans": "zh-Hans", "zh-hant": "zh-Hant" };

  var STRINGS = {
    "en": {
      "nav.home":       "Home",
      "nav.volunteer":  "Volunteer",
      "nav.students":   "Students",

      "cta.join":       "Join a Class",
      "cta.joinArrow":  "Join a Class →",
      "cta.volunteer":  "Volunteer with us",

      "hero.eyebrow":   "Greater Boston",
      "hero.headline":  "Uniting immigrant workers & families",
      "hero.tagline":   "Linguistic justice Civic engagement Worker rights",

      "beat1.eyebrow":  "Who we are",
      "beat1.body":     "We're a community of English teachers and learners. Our classes are instructed in Mandarin and Cantonese. We build a one-on-one connection with every student.",
      "beat1.alt":      "A teacher and student working together one-on-one.",

      "beat2.eyebrow":  "Schedule",
      "beat2.heading":  "Classes you can join now",
      "beat2.alt":      "This week's class schedule.",

      "beat3.eyebrow":  "Our story",
      "beat3.body1":    "We started as a group of international students who wanted to help. We knew how hard a new language and a new country can be — and how much easier it gets when someone beside you speaks your language.",
      "beat3.body2":    "Today we're a cooperative of teachers and learners across Greater Boston, built on a simple idea: mutual aid. Neighbors helping neighbors — and everyone is welcome.",
      "beat3.alt":      "Neighbors gathered at a community event.",

      "footer.mission": "A 501(c)(3) nonprofit cooperative serving immigrant workers and families across Greater Boston.",
      "footer.email":   "admin@workers-assist.com"
    },

    "zh-hans": {
      "nav.home":       "首页",
      "nav.volunteer":  "志愿者",
      "nav.students":   "学员",

      "cta.join":       "报名上课",
      "cta.joinArrow":  "报名上课 →",
      "cta.volunteer":  "成为志愿者",

      "hero.eyebrow":   "大波士顿地区",
      "hero.headline":  "团结移民工人与家庭",
      "hero.tagline":   "掌握语言　接轨社会　争回我们的权利",

      "beat1.eyebrow":  "我们是谁",
      "beat1.body":     "我们是一个由英语老师和学员组成的社群。课程以普通话和粤语讲授，我们与每一位学员建立一对一的联系。",
      "beat1.alt":      "老师与学员一对一上课。",

      "beat2.eyebrow":  "课表",
      "beat2.heading":  "现在就能报名的课程",
      "beat2.alt":      "本周课程安排。",

      "beat3.eyebrow":  "我们的故事",
      "beat3.body1":    "我们最初只是一群想出一份力的留学生。我们深知面对一门新语言、一个新国家有多难，也明白当身边有人说着你的母语时，一切会变得轻松许多。",
      "beat3.body2":    "如今，我们已是一个遍布大波士顿地区、由老师和学员组成的合作社，秉持一个朴素的信念：互助。邻里帮邻里，人人都受欢迎。",
      "beat3.alt":      "街坊邻里在社区活动中相聚。",

      "footer.mission": "一家服务于大波士顿地区移民工人及其家庭的 501(c)(3) 非营利互助合作社。",
      "footer.email":   "admin@workers-assist.com"
    },

    "zh-hant": {
      "nav.home":       "首頁",
      "nav.volunteer":  "志工",
      "nav.students":   "學員",

      "cta.join":       "報名上課",
      "cta.joinArrow":  "報名上課 →",
      "cta.volunteer":  "成為志工",

      "hero.eyebrow":   "大波士頓地區",
      "hero.headline":  "團結移民工人與家庭",
      "hero.tagline":   "掌握語言　接軌社會　爭回我們的權利",

      "beat1.eyebrow":  "我們是誰",
      "beat1.body":     "我們是一個由英語老師和學員組成的社群。課程以普通話和廣東話講授，我們與每一位學員建立一對一的聯繫。",
      "beat1.alt":      "老師與學員一對一上課。",

      "beat2.eyebrow":  "課表",
      "beat2.heading":  "現在就能報名的課程",
      "beat2.alt":      "本週課程安排。",

      "beat3.eyebrow":  "我們的故事",
      "beat3.body1":    "我們最初只是一群想出一份力的留學生。我們深知面對一門新語言、一個新國家有多難，也明白當身邊有人說著你的母語時，一切會變得輕鬆許多。",
      "beat3.body2":    "如今，我們已是一個遍布大波士頓地區、由老師和學員組成的合作社，秉持一個樸素的信念：互助。鄰里幫鄰里，人人都受歡迎。",
      "beat3.alt":      "街坊鄰里在社區活動中相聚。",

      "footer.mission": "一家服務於大波士頓地區移民工人及其家庭的 501(c)(3) 非營利互助合作社。",
      "footer.email":   "admin@workers-assist.com"
    }
  };

  function getLang() {
    var saved;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    return STRINGS[saved] ? saved : DEFAULT;
  }

  function setLang(lang) {
    if (!STRINGS[lang]) lang = DEFAULT;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    apply(lang);
  }

  function apply(lang) {
    var dict = STRINGS[lang];
    document.documentElement.lang = HTML_LANG[lang] || "en";

    // Text nodes
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      if (dict[key] != null) nodes[i].textContent = dict[key];
    }
    // Image alt text
    var imgs = document.querySelectorAll("[data-i18n-alt]");
    for (var j = 0; j < imgs.length; j++) {
      var akey = imgs[j].getAttribute("data-i18n-alt");
      if (dict[akey] != null) imgs[j].setAttribute("alt", dict[akey]);
    }
    // Placeholders (forms on other pages)
    var phs = document.querySelectorAll("[data-i18n-placeholder]");
    for (var k = 0; k < phs.length; k++) {
      var pkey = phs[k].getAttribute("data-i18n-placeholder");
      if (dict[pkey] != null) phs[k].setAttribute("placeholder", dict[pkey]);
    }

    // Reflect active state on the language bar
    var btns = document.querySelectorAll(".langbar__btn");
    for (var b = 0; b < btns.length; b++) {
      btns[b].setAttribute("aria-pressed", String(btns[b].getAttribute("data-lang") === lang));
    }

    // Re-render the schedule in the new language
    renderSchedule(lang);
  }

  // ---- Schedule (Home only) ------------------------------------------------
  function renderSchedule(lang) {
    var list = document.getElementById("schedule-list");
    if (!list) return; // not on the home page

    fetch("classes.json")
      .then(function (r) { if (!r.ok) throw new Error("classes.json " + r.status); return r.json(); })
      .then(function (classes) {
        var html = "";
        for (var i = 0; i < classes.length; i++) {
          var c = classes[i];
          var name = (c.name && (c.name[lang] || c.name.en)) || "";
          var time = (c.time && (c.time[lang] || c.time.en)) || "";
          var loc  = (c.location && (c.location[lang] || c.location.en)) || "";
          html +=
            '<li class="schedule__item">' +
              '<span class="schedule__name">' + esc(name) + "</span>" +
              '<span class="schedule__time">' + esc(time) + "</span>" +
              '<span class="schedule__loc">'  + esc(loc)  + "</span>" +
            "</li>";
        }
        if (html) list.innerHTML = html;
      })
      .catch(function (e) {
        // Keep the static HTML fallback already in the page.
        if (window.console) console.warn("[i18n] schedule render skipped:", e.message);
      });
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ---- Wire up -------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    var btns = document.querySelectorAll(".langbar__btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        setLang(this.getAttribute("data-lang"));
      });
    }
    apply(getLang());
  });

  // Expose for other pages / debugging
  window.WA_I18N = { setLang: setLang, getLang: getLang, strings: STRINGS };
})();



