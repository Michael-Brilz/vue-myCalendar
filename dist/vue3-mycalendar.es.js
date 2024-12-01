import { defineComponent as V, computed as f, openBlock as a, createElementBlock as u, createElementVNode as e, Fragment as b, renderList as y, toDisplayString as r, createTextVNode as j, renderSlot as I, createCommentVNode as K, ref as g, watchEffect as G, onMounted as J, normalizeClass as Q, normalizeStyle as M, withModifiers as R, withDirectives as T, vModelSelect as X, vModelDynamic as Z, vModelText as x, unref as ee, createVNode as te } from "vue";
const se = {
  key: 0,
  class: "popup"
}, le = { class: "popup-content" }, ne = { key: 0 }, oe = { class: "button-container" }, ae = /* @__PURE__ */ V({
  __name: "Popup",
  props: {
    visible: { type: Boolean },
    closeButtonText: {},
    eventData: {},
    popupFields: {}
  },
  emits: ["close", "handleDelete"],
  setup(k, { emit: D }) {
    const i = k, _ = D, L = f(() => i.popupFields || []), m = f(() => i.eventData || {}), E = (c) => c.replace(/_/g, " ").replace(/\b\w/g, (v) => v.toUpperCase()), h = f(() => L.value.length === 0 ? m.value : Object.keys(m.value).filter((c) => L.value.includes(c)).reduce((c, v) => (c[v] = m.value[v], c), {})), C = () => {
      _("close");
    }, S = () => {
      _("handleDelete", m.value.id);
    };
    return (c, v) => c.visible ? (a(), u("div", se, [
      e("div", le, [
        m.value && Object.keys(m.value).length ? (a(), u("div", ne, [
          (a(!0), u(b, null, y(h.value, (o, p) => (a(), u("div", {
            key: p,
            class: "popup-field"
          }, [
            e("p", null, [
              e("strong", null, r(E(String(p))) + ":", 1),
              j(" " + r(o), 1)
            ])
          ]))), 128))
        ])) : I(c.$slots, "default", { key: 1 }, void 0, !0),
        e("div", oe, [
          e("button", {
            class: "close-button",
            onClick: C
          }, r(c.closeButtonText), 1),
          e("button", {
            class: "delete-button",
            onClick: S
          }, " Delete ")
        ])
      ])
    ])) : K("", !0);
  }
}), ue = (k, D) => {
  const i = k.__vccOpts || k;
  for (const [_, L] of D)
    i[_] = L;
  return i;
}, ie = /* @__PURE__ */ ue(ae, [["__scopeId", "data-v-f2be054c"]]), de = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2050%2050'%20width='50px'%20height='50px'%3e%3cpath%20d='M%2025%202%20C%2012.309295%202%202%2012.309295%202%2025%20C%202%2037.690705%2012.309295%2048%2025%2048%20C%2037.690705%2048%2048%2037.690705%2048%2025%20C%2048%2012.309295%2037.690705%202%2025%202%20z%20M%2025%204%20C%2036.609824%204%2046%2013.390176%2046%2025%20C%2046%2036.609824%2036.609824%2046%2025%2046%20C%2013.390176%2046%204%2036.609824%204%2025%20C%204%2013.390176%2013.390176%204%2025%204%20z%20M%2025%2011%20A%203%203%200%200%200%2022%2014%20A%203%203%200%200%200%2025%2017%20A%203%203%200%200%200%2028%2014%20A%203%203%200%200%200%2025%2011%20z%20M%2021%2021%20L%2021%2023%20L%2022%2023%20L%2023%2023%20L%2023%2036%20L%2022%2036%20L%2021%2036%20L%2021%2038%20L%2022%2038%20L%2023%2038%20L%2027%2038%20L%2028%2038%20L%2029%2038%20L%2029%2036%20L%2028%2036%20L%2027%2036%20L%2027%2021%20L%2026%2021%20L%2022%2021%20L%2021%2021%20z'/%3e%3c/svg%3e", re = ["for"], ce = { key: 0 }, ve = ["id", "onUpdate:modelValue"], pe = ["value"], me = { key: 1 }, be = ["id", "onUpdate:modelValue", "type"], ye = { class: "form-group" }, _e = {
  for: "start",
  class: "form-label"
}, he = { class: "form-group" }, ge = {
  for: "end",
  class: "form-label"
}, fe = { class: "form-group" }, ke = {
  for: "date",
  class: "form-label"
}, Le = ["disabled"], De = { class: "calendar" }, Te = { class: "navigation" }, Ce = { class: "current-week" }, Se = { class: "hours-and-days" }, we = { class: "hours" }, Ee = { class: "weekdays-container" }, Fe = { class: "weekdays" }, Me = { class: "days" }, xe = ["onClick"], Ae = ["src"], ze = /* @__PURE__ */ V({
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
  setup(k, { emit: D }) {
    const i = k, _ = D, L = f(() => i.weekdays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]), m = f(() => i.eventTitleColor || "#000"), E = f(() => i.eventTitleSize || "16px"), h = f(() => {
      var l, s, t, n, d;
      return {
        startTimeLabel: ((l = i.labelsAndSettings) == null ? void 0 : l.startTimeLabel) || "Start Time",
        endTimeLabel: ((s = i.labelsAndSettings) == null ? void 0 : s.endTimeLabel) || "End Time",
        dateLabel: ((t = i.labelsAndSettings) == null ? void 0 : t.dateLabel) || "Date",
        submitButtonText: ((n = i.labelsAndSettings) == null ? void 0 : n.submitButtonText) || "Add Entry",
        calendarWeekLabel: ((d = i.labelsAndSettings) == null ? void 0 : d.calendarWeekLabel) || "CW"
      };
    }), C = g(i.schedules), S = g(i.additionalFields), c = g([
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
    ]), v = g({}), o = g({ start: "", end: "", date: "", color: "" }), p = g({ visible: !1, event: {} }), w = g(0), O = async () => {
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
      !S.value.length || !C.value.length || (v.value = {}, C.value.forEach((l) => {
        const s = l.date;
        v.value[s] || (v.value[s] = []), v.value[s].push(l);
      }));
    });
    const A = (l) => {
      const s = /* @__PURE__ */ new Date(), t = s.getDay(), n = l + 1 - t + w.value * 7, d = new Date(s);
      return d.setDate(s.getDate() + n), d.toISOString().substring(0, 10);
    }, U = () => {
      const l = /* @__PURE__ */ new Date(), s = new Date(l.getFullYear(), 0, 1), t = (l.getTime() - s.getTime()) / 864e5 + w.value * 7;
      return Math.ceil((t + s.getDay() + 1) / 7);
    }, P = () => w.value -= 1, q = () => w.value += 1, N = (l) => {
      const s = parseInt(l.start.substring(0, 2)), t = parseInt(l.start.substring(3, 5)), n = parseInt(l.end.substring(0, 2)), d = parseInt(l.end.substring(3, 5)), F = s * 60 + t, z = n * 60 + d, Y = F * 40 / 60;
      let B = (z - F) * 40 / 60;
      return d === 0 && (B += 40), {
        backgroundColor: l.color || "#a4d8ff",
        top: `${Y}px`,
        height: `${B}px`,
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 1
      };
    }, H = (l) => {
      p.value.event = l, p.value.visible = !0;
    }, W = () => p.value.visible = !1, $ = (l) => {
      _("handleDelete", l);
    };
    return J(() => {
      i.additionalFields.forEach((l) => {
        o.value[l.model] = "";
      });
    }), (l, s) => (a(), u("div", {
      class: Q(l.customClass),
      style: M(l.customStyles)
    }, [
      e("form", {
        class: "form-container",
        onSubmit: R(O, ["prevent"])
      }, [
        (a(!0), u(b, null, y(S.value, (t) => (a(), u("div", {
          key: t.id,
          class: "form-group"
        }, [
          e("label", {
            for: t.id,
            class: "form-label"
          }, r(t.label) + ":", 9, re),
          t.type === "select" ? (a(), u("div", ce, [
            T(e("select", {
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
            T(e("input", {
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
          e("label", _e, r(h.value.startTimeLabel || "Start Time") + ":", 1),
          T(e("input", {
            id: "start",
            "onUpdate:modelValue": s[0] || (s[0] = (t) => o.value.start = t),
            type: "time",
            required: "",
            class: "form-input"
          }, null, 512), [
            [x, o.value.start]
          ])
        ]),
        e("div", he, [
          e("label", ge, r(h.value.endTimeLabel || "End Time") + ":", 1),
          T(e("input", {
            id: "end",
            "onUpdate:modelValue": s[1] || (s[1] = (t) => o.value.end = t),
            type: "time",
            required: "",
            class: "form-input"
          }, null, 512), [
            [x, o.value.end]
          ])
        ]),
        e("div", fe, [
          e("label", ke, r(h.value.dateLabel || "Date") + ":", 1),
          T(e("input", {
            id: "date",
            "onUpdate:modelValue": s[2] || (s[2] = (t) => o.value.date = t),
            type: "date",
            required: "",
            class: "form-input"
          }, null, 512), [
            [x, o.value.date]
          ])
        ]),
        e("button", {
          type: "submit",
          disabled: !!v.value.processing,
          class: "submit-button"
        }, r(h.value.submitButtonText || "Add Entry"), 9, Le)
      ], 32),
      e("div", De, [
        e("div", Te, [
          e("button", {
            class: "arrow-button",
            onClick: P
          }, "<"),
          e("span", Ce, r(h.value.calendarWeekLabel || "CW") + " " + r(U()), 1),
          e("button", {
            class: "arrow-button",
            onClick: q
          }, ">")
        ]),
        e("div", Se, [
          e("div", we, [
            s[3] || (s[3] = e("div", { class: "empty-slot" }, null, -1)),
            (a(!0), u(b, null, y(c.value, (t) => (a(), u("div", {
              key: t,
              class: "hour"
            }, r(t), 1))), 128))
          ]),
          e("div", Ee, [
            e("ul", Fe, [
              (a(!0), u(b, null, y(L.value, (t, n) => (a(), u("li", {
                key: n,
                class: "weekday"
              }, [
                e("span", null, r(t), 1),
                e("span", null, r(A(n)), 1)
              ]))), 128))
            ]),
            e("div", Me, [
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
                  style: M(N(d))
                }, [
                  e("span", {
                    style: M({ color: m.value, fontSize: E.value })
                  }, r(d.title), 5),
                  s[4] || (s[4] = e("br", null, null, -1)),
                  e("button", {
                    class: "info-button",
                    onClick: (z) => H(d)
                  }, [
                    e("img", {
                      src: ee(de),
                      alt: "my-logo",
                      class: "small-logo"
                    }, null, 8, Ae)
                  ], 8, xe)
                ], 4))), 128))
              ])), 64))
            ])
          ])
        ])
      ]),
      e("div", null, [
        I(l.$slots, "popup-calendar", {
          visible: p.value.visible,
          eventData: p.value.event,
          close: W,
          delete: $
        }, () => [
          te(ie, {
            visible: p.value.visible,
            eventData: p.value.event,
            popupFields: l.popupFields,
            closeButtonText: "Close",
            onClose: W,
            onHandleDelete: $
          }, null, 8, ["visible", "eventData", "popupFields"])
        ])
      ])
    ], 6));
  }
});
export {
  ze as ScheduleForm,
  ze as default
};
