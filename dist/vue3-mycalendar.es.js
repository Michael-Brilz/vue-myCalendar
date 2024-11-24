import { defineComponent as B, computed as f, openBlock as a, createElementBlock as u, createElementVNode as e, Fragment as b, renderList as y, toDisplayString as r, createTextVNode as j, renderSlot as H, createCommentVNode as K, ref as h, watchEffect as G, onMounted as J, normalizeClass as Q, normalizeStyle as x, withModifiers as R, withDirectives as C, vModelSelect as X, vModelDynamic as Z, vModelText as M, unref as ee, createVNode as te } from "vue";
const se = {
  key: 0,
  class: "popup"
}, le = { class: "popup-content" }, ne = { key: 0 }, oe = { class: "button-container" }, ae = /* @__PURE__ */ B({
  __name: "Popup",
  props: {
    visible: { type: Boolean },
    closeButtonText: {},
    eventData: {},
    popupFields: {}
  },
  emits: ["close", "deleteEvent"],
  setup(k, { emit: T }) {
    const i = k, _ = T, L = f(() => i.popupFields || []), p = f(() => i.eventData || {}), w = (c) => c.replace(/_/g, " ").replace(/\b\w/g, (v) => v.toUpperCase()), g = f(() => L.value.length === 0 ? p.value : Object.keys(p.value).filter((c) => L.value.includes(c)).reduce((c, v) => (c[v] = p.value[v], c), {})), S = () => {
      _("close");
    }, E = () => {
      _("deleteEvent", p.value.id);
    };
    return (c, v) => c.visible ? (a(), u("div", se, [
      e("div", le, [
        p.value && Object.keys(p.value).length ? (a(), u("div", ne, [
          (a(!0), u(b, null, y(g.value, (o, m) => (a(), u("div", {
            key: m,
            class: "popup-field"
          }, [
            e("p", null, [
              e("strong", null, r(w(String(m))) + ":", 1),
              j(" " + r(o), 1)
            ])
          ]))), 128))
        ])) : H(c.$slots, "default", { key: 1 }, void 0, !0),
        e("div", oe, [
          e("button", {
            class: "close-button",
            onClick: S
          }, r(c.closeButtonText), 1),
          e("button", {
            class: "delete-button",
            onClick: E
          }, " Delete ")
        ])
      ])
    ])) : K("", !0);
  }
}), ue = (k, T) => {
  const i = k.__vccOpts || k;
  for (const [_, L] of T)
    i[_] = L;
  return i;
}, ie = /* @__PURE__ */ ue(ae, [["__scopeId", "data-v-2a039701"]]), de = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2050%2050'%20width='50px'%20height='50px'%3e%3cpath%20d='M%2025%202%20C%2012.309295%202%202%2012.309295%202%2025%20C%202%2037.690705%2012.309295%2048%2025%2048%20C%2037.690705%2048%2048%2037.690705%2048%2025%20C%2048%2012.309295%2037.690705%202%2025%202%20z%20M%2025%204%20C%2036.609824%204%2046%2013.390176%2046%2025%20C%2046%2036.609824%2036.609824%2046%2025%2046%20C%2013.390176%2046%204%2036.609824%204%2025%20C%204%2013.390176%2013.390176%204%2025%204%20z%20M%2025%2011%20A%203%203%200%200%200%2022%2014%20A%203%203%200%200%200%2025%2017%20A%203%203%200%200%200%2028%2014%20A%203%203%200%200%200%2025%2011%20z%20M%2021%2021%20L%2021%2023%20L%2022%2023%20L%2023%2023%20L%2023%2036%20L%2022%2036%20L%2021%2036%20L%2021%2038%20L%2022%2038%20L%2023%2038%20L%2027%2038%20L%2028%2038%20L%2029%2038%20L%2029%2036%20L%2028%2036%20L%2027%2036%20L%2027%2021%20L%2026%2021%20L%2022%2021%20L%2021%2021%20z'/%3e%3c/svg%3e", re = ["for"], ce = { key: 0 }, ve = ["id", "onUpdate:modelValue"], pe = ["value"], me = { key: 1 }, be = ["id", "onUpdate:modelValue", "type"], ye = { class: "form-group" }, _e = {
  for: "start",
  class: "form-label"
}, ge = { class: "form-group" }, he = {
  for: "end",
  class: "form-label"
}, fe = { class: "form-group" }, ke = {
  for: "date",
  class: "form-label"
}, Le = ["disabled"], Te = { class: "calendar" }, Ce = { class: "navigation" }, Se = { class: "current-week" }, Ee = { class: "hours-and-days" }, De = { class: "hours" }, we = { class: "weekdays-container" }, Fe = { class: "weekdays" }, xe = { class: "days" }, Me = ["onClick"], Ae = ["src"], Be = /* @__PURE__ */ B({
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
  emits: ["submitEvent", "deleteEvent"],
  setup(k, { emit: T }) {
    const i = k, _ = T, L = f(() => i.weekdays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]), p = f(() => i.eventTitleColor || "#000"), w = f(() => i.eventTitleSize || "16px"), g = f(() => {
      var l, s, t, n, d;
      return {
        startTimeLabel: ((l = i.labelsAndSettings) == null ? void 0 : l.startTimeLabel) || "Start Time",
        endTimeLabel: ((s = i.labelsAndSettings) == null ? void 0 : s.endTimeLabel) || "End Time",
        dateLabel: ((t = i.labelsAndSettings) == null ? void 0 : t.dateLabel) || "Date",
        submitButtonText: ((n = i.labelsAndSettings) == null ? void 0 : n.submitButtonText) || "Add Entry",
        calendarWeekLabel: ((d = i.labelsAndSettings) == null ? void 0 : d.calendarWeekLabel) || "CW"
      };
    }), S = h(i.schedules), E = h(i.additionalFields), c = h([
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
    ]), v = h({}), o = h({ start: "", end: "", date: "", color: "" }), m = h({ visible: !1, event: {} }), D = h(0), V = async () => {
      const l = {
        start: o.value.start,
        end: o.value.end,
        date: o.value.date,
        info: o.value.info,
        color: o.value.color
      };
      i.additionalFields.forEach((s) => {
        l[s.model] = o.value[s.model];
      }), _("submitEvent", l), Object.keys(o.value).forEach((s) => {
        o.value[s] = "";
      });
    };
    G(() => {
      !E.value.length || !S.value.length || (v.value = {}, S.value.forEach((l) => {
        const s = l.date;
        v.value[s] || (v.value[s] = []), v.value[s].push(l);
      }));
    });
    const A = (l) => {
      const s = /* @__PURE__ */ new Date(), t = s.getDay(), n = l + 1 - t + D.value * 7, d = new Date(s);
      return d.setDate(s.getDate() + n), d.toISOString().substring(0, 10);
    }, $ = () => {
      const l = /* @__PURE__ */ new Date(), s = new Date(l.getFullYear(), 0, 1), t = (l.getTime() - s.getTime()) / 864e5 + D.value * 7;
      return Math.ceil((t + s.getDay() + 1) / 7);
    }, I = () => D.value -= 1, O = () => D.value += 1, U = (l) => {
      const s = parseInt(l.start.substring(0, 2)), t = parseInt(l.start.substring(3, 5)), n = parseInt(l.end.substring(0, 2)), d = parseInt(l.end.substring(3, 5)), F = s * 60 + t, W = n * 60 + d, Y = F * 40 / 60;
      let z = (W - F) * 40 / 60;
      return d === 0 && (z += 40), {
        backgroundColor: l.color || "#a4d8ff",
        top: `${Y}px`,
        height: `${z}px`,
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 1
      };
    }, P = (l) => {
      m.value.event = l, m.value.visible = !0;
    }, q = () => m.value.visible = !1, N = (l) => {
      _("deleteEvent", l);
    };
    return J(() => {
      i.additionalFields.forEach((l) => {
        o.value[l.model] = "";
      });
    }), (l, s) => (a(), u("div", {
      class: Q(l.customClass),
      style: x(l.customStyles)
    }, [
      e("form", {
        class: "form-container",
        onSubmit: R(V, ["prevent"])
      }, [
        (a(!0), u(b, null, y(E.value, (t) => (a(), u("div", {
          key: t.id,
          class: "form-group"
        }, [
          e("label", {
            for: t.id,
            class: "form-label"
          }, r(t.label) + ":", 9, re),
          t.type === "select" ? (a(), u("div", ce, [
            C(e("select", {
              id: t.id,
              "onUpdate:modelValue": (n) => o.value[t.model] = n,
              required: "",
              class: "form-select"
            }, [
              (a(!0), u(b, null, y(t.options, (n) => (a(), u("option", {
                key: n.id,
                value: n
              }, r(n.name || `${n.first_name} ${n.last_name}`), 9, pe))), 128))
            ], 8, ve), [
              [X, o.value[t.model]]
            ])
          ])) : (a(), u("div", me, [
            C(e("input", {
              id: t.id,
              "onUpdate:modelValue": (n) => o.value[t.model] = n,
              type: t.type,
              required: "",
              class: "form-input"
            }, null, 8, be), [
              [Z, o.value[t.model]]
            ])
          ]))
        ]))), 128)),
        e("div", ye, [
          e("label", _e, r(g.value.startTimeLabel || "Start Time") + ":", 1),
          C(e("input", {
            id: "start",
            "onUpdate:modelValue": s[0] || (s[0] = (t) => o.value.start = t),
            type: "time",
            required: "",
            class: "form-input"
          }, null, 512), [
            [M, o.value.start]
          ])
        ]),
        e("div", ge, [
          e("label", he, r(g.value.endTimeLabel || "End Time") + ":", 1),
          C(e("input", {
            id: "end",
            "onUpdate:modelValue": s[1] || (s[1] = (t) => o.value.end = t),
            type: "time",
            required: "",
            class: "form-input"
          }, null, 512), [
            [M, o.value.end]
          ])
        ]),
        e("div", fe, [
          e("label", ke, r(g.value.dateLabel || "Date") + ":", 1),
          C(e("input", {
            id: "date",
            "onUpdate:modelValue": s[2] || (s[2] = (t) => o.value.date = t),
            type: "date",
            required: "",
            class: "form-input"
          }, null, 512), [
            [M, o.value.date]
          ])
        ]),
        e("button", {
          type: "submit",
          disabled: !!v.value.processing,
          class: "submit-button"
        }, r(g.value.submitButtonText || "Add Entry"), 9, Le)
      ], 32),
      e("div", Te, [
        e("div", Ce, [
          e("button", {
            class: "arrow-button",
            onClick: I
          }, "<"),
          e("span", Se, r(g.value.calendarWeekLabel || "CW") + " " + r($()), 1),
          e("button", {
            class: "arrow-button",
            onClick: O
          }, ">")
        ]),
        e("div", Ee, [
          e("div", De, [
            s[3] || (s[3] = e("div", { class: "empty-slot" }, null, -1)),
            (a(!0), u(b, null, y(c.value, (t) => (a(), u("div", {
              key: t,
              class: "hour"
            }, r(t), 1))), 128))
          ]),
          e("div", we, [
            e("ul", Fe, [
              (a(!0), u(b, null, y(L.value, (t, n) => (a(), u("li", {
                key: n,
                class: "weekday"
              }, [
                e("span", null, r(t), 1),
                e("span", null, r(A(n)), 1)
              ]))), 128))
            ]),
            e("div", xe, [
              (a(), u(b, null, y(7, (t, n) => e("div", {
                key: n,
                class: "day"
              }, [
                (a(!0), u(b, null, y(c.value, (d) => (a(), u("div", {
                  key: d,
                  class: "hour"
                }))), 128)),
                (a(!0), u(b, null, y(v.value[A(n)] || [], (d, F) => (a(), u("div", {
                  key: d.id,
                  class: "event",
                  style: x(U(d))
                }, [
                  e("span", {
                    style: x({ color: p.value, fontSize: w.value })
                  }, r(d.title), 5),
                  s[4] || (s[4] = e("br", null, null, -1)),
                  e("button", {
                    class: "info-button",
                    onClick: (W) => P(d)
                  }, [
                    e("img", {
                      src: ee(de),
                      alt: "my-logo",
                      class: "small-logo"
                    }, null, 8, Ae)
                  ], 8, Me)
                ], 4))), 128))
              ])), 64))
            ])
          ])
        ])
      ]),
      te(ie, {
        visible: m.value.visible,
        eventData: m.value.event,
        popupFields: l.popupFields,
        closeButtonText: "Close",
        onClose: q,
        onDeleteEvent: N
      }, null, 8, ["visible", "eventData", "popupFields"])
    ], 6));
  }
});
export {
  Be as ScheduleForm,
  Be as default
};
