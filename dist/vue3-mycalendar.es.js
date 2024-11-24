import { defineComponent as $, computed as L, openBlock as a, createElementBlock as d, createElementVNode as e, Fragment as g, renderList as k, toDisplayString as r, createTextVNode as K, renderSlot as G, createCommentVNode as Q, ref as b, watchEffect as X, onMounted as Z, normalizeClass as ee, normalizeStyle as A, withModifiers as te, withDirectives as S, vModelSelect as se, vModelDynamic as le, vModelText as x, unref as oe, createVNode as z, createApp as ne } from "vue";
const ae = {
  key: 0,
  class: "popup"
}, de = { class: "popup-content" }, ie = { key: 0 }, ue = { class: "button-container" }, re = /* @__PURE__ */ $({
  __name: "Popup",
  props: {
    visible: { type: Boolean },
    closeButtonText: {},
    eventData: {},
    popupFields: {}
  },
  emits: ["close", "handleDelete"],
  setup(T, { emit: h }) {
    const i = T, _ = h, y = L(() => i.popupFields || []), v = L(() => i.eventData || {}), D = (c) => c.replace(/_/g, " ").replace(/\b\w/g, (p) => p.toUpperCase()), m = L(() => y.value.length === 0 ? v.value : Object.keys(v.value).filter((c) => y.value.includes(c)).reduce((c, p) => (c[p] = v.value[p], c), {})), C = () => {
      _("close");
    }, E = () => {
      _("handleDelete", v.value.id);
    };
    return (c, p) => c.visible ? (a(), d("div", ae, [
      e("div", de, [
        v.value && Object.keys(v.value).length ? (a(), d("div", ie, [
          (a(!0), d(g, null, k(m.value, (n, f) => (a(), d("div", {
            key: f,
            class: "popup-field"
          }, [
            e("p", null, [
              e("strong", null, r(D(String(f))) + ":", 1),
              K(" " + r(n), 1)
            ])
          ]))), 128))
        ])) : G(c.$slots, "default", { key: 1 }, void 0, !0),
        e("div", ue, [
          e("button", {
            class: "close-button",
            onClick: C
          }, r(c.closeButtonText), 1),
          e("button", {
            class: "delete-button",
            onClick: E
          }, " Delete ")
        ])
      ])
    ])) : Q("", !0);
  }
}), I = (T, h) => {
  const i = T.__vccOpts || T;
  for (const [_, y] of h)
    i[_] = y;
  return i;
}, ce = /* @__PURE__ */ I(re, [["__scopeId", "data-v-f2be054c"]]), pe = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2050%2050'%20width='50px'%20height='50px'%3e%3cpath%20d='M%2025%202%20C%2012.309295%202%202%2012.309295%202%2025%20C%202%2037.690705%2012.309295%2048%2025%2048%20C%2037.690705%2048%2048%2037.690705%2048%2025%20C%2048%2012.309295%2037.690705%202%2025%202%20z%20M%2025%204%20C%2036.609824%204%2046%2013.390176%2046%2025%20C%2046%2036.609824%2036.609824%2046%2025%2046%20C%2013.390176%2046%204%2036.609824%204%2025%20C%204%2013.390176%2013.390176%204%2025%204%20z%20M%2025%2011%20A%203%203%200%200%200%2022%2014%20A%203%203%200%200%200%2025%2017%20A%203%203%200%200%200%2028%2014%20A%203%203%200%200%200%2025%2011%20z%20M%2021%2021%20L%2021%2023%20L%2022%2023%20L%2023%2023%20L%2023%2036%20L%2022%2036%20L%2021%2036%20L%2021%2038%20L%2022%2038%20L%2023%2038%20L%2027%2038%20L%2028%2038%20L%2029%2038%20L%2029%2036%20L%2028%2036%20L%2027%2036%20L%2027%2021%20L%2026%2021%20L%2022%2021%20L%2021%2021%20z'/%3e%3c/svg%3e", ve = ["for"], me = { key: 0 }, be = ["id", "onUpdate:modelValue"], he = ["value"], _e = { key: 1 }, ye = ["id", "onUpdate:modelValue", "type"], fe = { class: "form-group" }, ge = {
  for: "start",
  class: "form-label"
}, ke = { class: "form-group" }, Le = {
  for: "end",
  class: "form-label"
}, Te = { class: "form-group" }, De = {
  for: "date",
  class: "form-label"
}, Se = ["disabled"], Ce = { class: "calendar" }, Ee = { class: "navigation" }, we = { class: "current-week" }, Fe = { class: "hours-and-days" }, Ae = { class: "hours" }, xe = { class: "weekdays-container" }, Me = { class: "weekdays" }, We = { class: "days" }, Be = ["onClick"], $e = ["src"], V = /* @__PURE__ */ $({
  __name: "ScheduleForm",
  props: {
    customClass: {},
    customStyles: {},
    schedules: {},
    additionalFields: {},
    weekdays: {},
    eventTitleColor: {},
    eventTitleSize: {},
    popupFields: {},
    labelsAndSettings: {}
  },
  emits: ["submitEvent", "handleDelete"],
  setup(T, { emit: h }) {
    const i = T, _ = h, y = L(() => i.weekdays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]), v = L(() => i.eventTitleColor || "#000"), D = L(() => i.eventTitleSize || "16px"), m = L(() => {
      var l, s, t, o, u;
      return {
        startTimeLabel: ((l = i.labelsAndSettings) == null ? void 0 : l.startTimeLabel) || "Start Time",
        endTimeLabel: ((s = i.labelsAndSettings) == null ? void 0 : s.endTimeLabel) || "End Time",
        dateLabel: ((t = i.labelsAndSettings) == null ? void 0 : t.dateLabel) || "Date",
        submitButtonText: ((o = i.labelsAndSettings) == null ? void 0 : o.submitButtonText) || "Add Entry",
        calendarWeekLabel: ((u = i.labelsAndSettings) == null ? void 0 : u.calendarWeekLabel) || "CW"
      };
    }), C = b(i.schedules), E = b(i.additionalFields), c = b([
      "00:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00"
    ]), p = b({}), n = b({ start: "", end: "", date: "", color: "" }), f = b({ visible: !1, event: {} }), w = b(0), U = async () => {
      const l = {
        start: n.value.start,
        end: n.value.end,
        date: n.value.date,
        info: n.value.info,
        color: n.value.color
      };
      i.additionalFields.forEach((s) => {
        l[s.model] = n.value[s.model];
      }), _("submitEvent", l), Object.keys(n.value).forEach((s) => {
        n.value[s] = "";
      });
    };
    X(() => {
      !E.value.length || !C.value.length || (p.value = {}, C.value.forEach((l) => {
        const s = l.date;
        p.value[s] || (p.value[s] = []), p.value[s].push(l);
      }));
    });
    const M = (l) => {
      const s = /* @__PURE__ */ new Date(), t = s.getDay(), o = l + 1 - t + w.value * 7, u = new Date(s);
      return u.setDate(s.getDate() + o), u.toISOString().substring(0, 10);
    }, P = () => {
      const l = /* @__PURE__ */ new Date(), s = new Date(l.getFullYear(), 0, 1), t = (l.getTime() - s.getTime()) / 864e5 + w.value * 7;
      return Math.ceil((t + s.getDay() + 1) / 7);
    }, q = () => w.value -= 1, N = () => w.value += 1, R = (l) => {
      const s = parseInt(l.start.substring(0, 2)), t = parseInt(l.start.substring(3, 5)), o = parseInt(l.end.substring(0, 2)), u = parseInt(l.end.substring(3, 5)), F = s * 60 + t, W = o * 60 + u, J = F * 40 / 60;
      let B = (W - F) * 40 / 60;
      return u === 0 && (B += 40), {
        backgroundColor: l.color || "#a4d8ff",
        top: `${J}px`,
        height: `${B}px`,
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 1
      };
    }, H = (l) => {
      f.value.event = l, f.value.visible = !0;
    }, Y = () => f.value.visible = !1, j = (l) => {
      _("handleDelete", l);
    };
    return Z(() => {
      i.additionalFields.forEach((l) => {
        n.value[l.model] = "";
      });
    }), (l, s) => (a(), d("div", {
      class: ee(l.customClass),
      style: A(l.customStyles)
    }, [
      e("form", {
        class: "form-container",
        onSubmit: te(U, ["prevent"])
      }, [
        (a(!0), d(g, null, k(E.value, (t) => (a(), d("div", {
          key: t.id,
          class: "form-group"
        }, [
          e("label", {
            for: t.id,
            class: "form-label"
          }, r(t.label) + ":", 9, ve),
          t.type === "select" ? (a(), d("div", me, [
            S(e("select", {
              id: t.id,
              "onUpdate:modelValue": (o) => n.value[t.model] = o,
              required: "",
              class: "form-select"
            }, [
              (a(!0), d(g, null, k(t.options, (o) => (a(), d("option", {
                key: o.id,
                value: o
              }, r(o.name || `${o.first_name} ${o.last_name}`), 9, he))), 128))
            ], 8, be), [
              [se, n.value[t.model]]
            ])
          ])) : (a(), d("div", _e, [
            S(e("input", {
              id: t.id,
              "onUpdate:modelValue": (o) => n.value[t.model] = o,
              type: t.type,
              required: "",
              class: "form-input"
            }, null, 8, ye), [
              [le, n.value[t.model]]
            ])
          ]))
        ]))), 128)),
        e("div", fe, [
          e("label", ge, r(m.value.startTimeLabel || "Start Time") + ":", 1),
          S(e("input", {
            id: "start",
            "onUpdate:modelValue": s[0] || (s[0] = (t) => n.value.start = t),
            type: "time",
            required: "",
            class: "form-input"
          }, null, 512), [
            [x, n.value.start]
          ])
        ]),
        e("div", ke, [
          e("label", Le, r(m.value.endTimeLabel || "End Time") + ":", 1),
          S(e("input", {
            id: "end",
            "onUpdate:modelValue": s[1] || (s[1] = (t) => n.value.end = t),
            type: "time",
            required: "",
            class: "form-input"
          }, null, 512), [
            [x, n.value.end]
          ])
        ]),
        e("div", Te, [
          e("label", De, r(m.value.dateLabel || "Date") + ":", 1),
          S(e("input", {
            id: "date",
            "onUpdate:modelValue": s[2] || (s[2] = (t) => n.value.date = t),
            type: "date",
            required: "",
            class: "form-input"
          }, null, 512), [
            [x, n.value.date]
          ])
        ]),
        e("button", {
          type: "submit",
          disabled: !!p.value.processing,
          class: "submit-button"
        }, r(m.value.submitButtonText || "Add Entry"), 9, Se)
      ], 32),
      e("div", Ce, [
        e("div", Ee, [
          e("button", {
            class: "arrow-button",
            onClick: q
          }, "<"),
          e("span", we, r(m.value.calendarWeekLabel || "CW") + " " + r(P()), 1),
          e("button", {
            class: "arrow-button",
            onClick: N
          }, ">")
        ]),
        e("div", Fe, [
          e("div", Ae, [
            s[3] || (s[3] = e("div", { class: "empty-slot" }, null, -1)),
            (a(!0), d(g, null, k(c.value, (t) => (a(), d("div", {
              key: t,
              class: "hour"
            }, r(t), 1))), 128))
          ]),
          e("div", xe, [
            e("ul", Me, [
              (a(!0), d(g, null, k(y.value, (t, o) => (a(), d("li", {
                key: o,
                class: "weekday"
              }, [
                e("span", null, r(t), 1),
                e("span", null, r(M(o)), 1)
              ]))), 128))
            ]),
            e("div", We, [
              (a(), d(g, null, k(7, (t, o) => e("div", {
                key: o,
                class: "day"
              }, [
                (a(!0), d(g, null, k(c.value, (u) => (a(), d("div", {
                  key: u,
                  class: "hour"
                }))), 128)),
                (a(!0), d(g, null, k(p.value[M(o)] || [], (u, F) => (a(), d("div", {
                  key: u.id,
                  class: "event",
                  style: A(R(u))
                }, [
                  e("span", {
                    style: A({ color: v.value, fontSize: D.value })
                  }, r(u.title), 5),
                  s[4] || (s[4] = e("br", null, null, -1)),
                  e("button", {
                    class: "info-button",
                    onClick: (W) => H(u)
                  }, [
                    e("img", {
                      src: oe(pe),
                      alt: "my-logo",
                      class: "small-logo"
                    }, null, 8, $e)
                  ], 8, Be)
                ], 4))), 128))
              ])), 64))
            ])
          ])
        ])
      ]),
      z(ce, {
        visible: f.value.visible,
        eventData: f.value.event,
        popupFields: l.popupFields,
        closeButtonText: "Close",
        onClose: Y,
        onHandleDelete: j
      }, null, 8, ["visible", "eventData", "popupFields"])
    ], 6));
  }
}), ze = { class: "wrapper" }, Ie = {
  __name: "App",
  setup(T) {
    const h = b([
      { id: 1, title: "Meeting", date: "2024-11-04", start: "09:00", end: "10:00", teacher: "Malika Heaney", room: "Room 1", color: "#e2Be33" },
      { id: 2, title: "Workshop", date: "2024-11-07", start: "13:00", end: "15:00", teacher: "John Doe", room: "Room 2", color: "#33C3FF" }
    ]), i = b(["title", "date", "start", "end"]), _ = b([
      { id: "teacher", label: "Teacher", type: "text", model: "teacher" },
      { id: "room", label: "Room", type: "select", model: "room", options: [{ id: 1, name: "Room 1" }, { id: 2, name: "Room 2" }] }
    ]), y = L(() => ({
      startTimeLabel: "Start Time",
      endTimeLabel: "End Time",
      dateLabel: "Date",
      submitButtonText: "Add Event",
      calendarWeekLabel: "Week"
    })), v = (D) => {
      h.value = h.value.filter((m) => m.id !== D);
    };
    return (D, m) => (a(), d("div", ze, [
      z(V, {
        schedules: h.value,
        "additional-fields": _.value,
        "custom-class": "customize-schedule-form",
        "labels-and-settings": y.value,
        "popup-fields": i.value,
        onDeleteEvent: v
      }, null, 8, ["schedules", "additional-fields", "labels-and-settings", "popup-fields"])
    ]));
  }
}, Ve = /* @__PURE__ */ I(Ie, [["__scopeId", "data-v-8f30bfe4"]]), O = ne(Ve);
O.component("ScheduleForm", V);
O.mount("#app");
