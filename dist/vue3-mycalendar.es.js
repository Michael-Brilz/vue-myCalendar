import { computed as T, ref as _, watch as fe, defineComponent as se, resolveComponent as ge, openBlock as i, createElementBlock as d, createElementVNode as e, createVNode as W, toDisplayString as v, unref as g, Fragment as C, renderList as $, withDirectives as F, vModelText as I, createCommentVNode as X, createTextVNode as te, isRef as ae, watchEffect as ye, onMounted as _e, normalizeStyle as H, normalizeClass as Le, renderSlot as oe, withModifiers as ne, vModelSelect as we, vModelDynamic as De, createBlock as ke } from "vue";
function Se(f, M) {
  const k = T(() => f.popupFields || []), s = _({ ...f.eventData }), m = _([...f.eventData?.todos || []]), u = _([...f.eventData?.participants || []]);
  fe(() => f.eventData, (o) => {
    o && (s.value = { ...o }, m.value = [...o.todos || []], u.value = [...o.participants || []]);
  }, { immediate: !0 });
  const E = (o) => o.replace(/_/g, " ").replace(/\b\w/g, (B) => B.toUpperCase()), z = T(() => k.value.length === 0 ? s.value : Object.fromEntries(
    Object.entries(s.value).filter(([o]) => k.value.includes(o))
  )), V = (o, B) => {
    s.value[o] = B, M("updateEvent", s.value);
  }, c = _(""), P = () => {
    const o = c.value.trim();
    o && (m.value.push(o), c.value = "", M("update:todos", { todos: [...m.value], eventId: s.value.id }));
  }, A = (o) => {
    m.value.splice(o, 1), M("update:todos", { todos: [...m.value], eventId: s.value.id });
  }, L = _("");
  return {
    editableEventData: s,
    popupFields: k,
    filteredEventData: z,
    formatKey: E,
    updateField: V,
    // Todos
    localTodos: m,
    newTodo: c,
    addTodo: P,
    removeTodo: A,
    // Participants
    localParticipants: u,
    newParticipant: L,
    addParticipant: () => {
      const o = L.value.trim();
      o && (u.value.push(o), L.value = "", M("update:participants", { participants: [...u.value], eventId: s.value.id }));
    },
    removeParticipant: (o) => {
      u.value.splice(o, 1), M("update:participants", { participants: [...u.value], eventId: s.value.id });
    }
  };
}
const Te = {
  key: 0,
  class: "popup"
}, Ce = { class: "top-right-icons" }, Ee = { class: "popup-title" }, $e = { key: 0 }, Me = {
  key: 0,
  class: "popup-field"
}, Pe = { class: "popup-label" }, xe = ["onUpdate:modelValue", "placeholder"], Fe = { class: "section" }, Ae = { class: "popup-label" }, Ue = { class: "list" }, Be = ["onClick"], Ve = { class: "input-row" }, We = { class: "section" }, Ie = { class: "popup-label" }, ze = { class: "list" }, Ne = ["onClick"], Oe = { class: "input-row" }, qe = /* @__PURE__ */ se({
  __name: "Popup",
  props: {
    visible: { type: Boolean },
    closeButtonText: {},
    eventData: {},
    popupFields: {},
    todosLabel: {},
    participantsLabel: {},
    todos: {},
    participants: {},
    todoPlaceholder: {},
    participantPlaceholder: {}
  },
  emits: ["submit-event", "handle-delete", "update-event", "show-info", "close-popup", "update:todos", "update:participants"],
  setup(f, { emit: M }) {
    const k = f, s = T(() => k.todosLabel || "To-do"), m = T(() => k.participantsLabel || "Participant"), u = M, {
      editableEventData: E,
      filteredEventData: z,
      formatKey: V,
      localTodos: c,
      newTodo: P,
      addTodo: A,
      localParticipants: L,
      newParticipant: U,
      addParticipant: w
    } = Se(k, u), o = () => u("close-popup"), B = () => u("handle-delete", k.eventData.id), N = () => {
      const D = {
        ...E.value,
        todos: c.value,
        participants: L.value
      };
      u("update-event", D), u("update:todos", { todos: c.value, eventId: k.eventData.id }), u("update:participants", { participants: L.value, eventId: k.eventData.id }), u("close-popup");
    }, x = _(null), y = { x: 0, y: 0 }, O = (D) => {
      if (!x.value) return;
      const r = x.value;
      y.x = D.clientX - r.getBoundingClientRect().left, y.y = D.clientY - r.getBoundingClientRect().top;
      const S = (h) => {
        r.style.left = `${h.clientX - y.x}px`, r.style.top = `${h.clientY - y.y}px`, r.style.position = "absolute", r.style.transform = "none";
      }, b = () => {
        window.removeEventListener("mousemove", S), window.removeEventListener("mouseup", b);
      };
      window.addEventListener("mousemove", S), window.addEventListener("mouseup", b);
    }, j = (D) => {
      c.value.splice(D, 1), u("update:todos", {
        todos: [...c.value],
        eventId: E.value.id
      });
    }, G = (D) => {
      L.value.splice(D, 1), u("update:participants", {
        participants: [...L.value],
        eventId: E.value.id
      });
    };
    return (D, r) => {
      const S = ge("font-awesome-icon");
      return f.visible ? (i(), d("div", Te, [
        e("div", {
          class: "popup-content",
          ref_key: "popupRef",
          ref: x,
          onMousedown: O
        }, [
          e("div", Ce, [
            e("button", {
              class: "icon-button",
              onClick: B,
              title: "Delete"
            }, [
              W(S, { icon: ["fas", "trash"] })
            ]),
            e("button", {
              class: "icon-button",
              onClick: o,
              title: "Close"
            }, [
              W(S, { icon: ["fas", "times"] })
            ])
          ]),
          e("h2", Ee, v(g(E).title), 1),
          f.eventData && Object.keys(f.eventData).length ? (i(), d("div", $e, [
            (i(!0), d(C, null, $(g(z), (b, h) => (i(), d(C, { key: h }, [
              h !== "title" ? (i(), d("div", Me, [
                e("label", Pe, v(g(V)(String(h))), 1),
                F(e("input", {
                  "onUpdate:modelValue": (q) => g(E)[h] = q,
                  class: "popup-input",
                  placeholder: g(V)(String(h))
                }, null, 8, xe), [
                  [I, g(E)[h]]
                ])
              ])) : X("", !0)
            ], 64))), 128))
          ])) : X("", !0),
          e("div", Fe, [
            e("label", Ae, v(s.value), 1),
            e("ul", Ue, [
              (i(!0), d(C, null, $(g(c), (b, h) => (i(), d("li", { key: h }, [
                te(v(b) + " ", 1),
                e("button", {
                  onClick: (q) => j(h)
                }, [
                  W(S, { icon: ["fas", "trash"] })
                ], 8, Be)
              ]))), 128))
            ]),
            e("div", Ve, [
              F(e("input", {
                "onUpdate:modelValue": r[0] || (r[0] = (b) => ae(P) ? P.value = b : null),
                placeholder: "New To-do...",
                class: "popup-input"
              }, null, 512), [
                [I, g(P)]
              ]),
              e("button", {
                class: "add-inline-button",
                onClick: r[1] || (r[1] = //@ts-ignore
                (...b) => g(A) && g(A)(...b))
              }, [
                W(S, { icon: ["fas", "plus"] })
              ])
            ])
          ]),
          e("div", We, [
            e("label", Ie, v(m.value), 1),
            e("ul", ze, [
              (i(!0), d(C, null, $(g(L), (b, h) => (i(), d("li", { key: h }, [
                te(v(b) + " ", 1),
                e("button", {
                  onClick: (q) => G(h)
                }, [
                  W(S, { icon: ["fas", "trash"] })
                ], 8, Ne)
              ]))), 128))
            ]),
            e("div", Oe, [
              F(e("input", {
                "onUpdate:modelValue": r[2] || (r[2] = (b) => ae(U) ? U.value = b : null),
                placeholder: "Add Participant ...",
                class: "popup-input"
              }, null, 512), [
                [I, g(U)]
              ]),
              e("button", {
                class: "add-inline-button",
                onClick: r[3] || (r[3] = //@ts-ignore
                (...b) => g(w) && g(w)(...b))
              }, [
                W(S, { icon: ["fas", "user-plus"] })
              ])
            ])
          ]),
          e("div", { class: "popup-footer" }, [
            e("button", {
              class: "save-button",
              onClick: N
            }, "Speichern")
          ])
        ], 544)
      ])) : X("", !0);
    };
  }
}), Re = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2050%2050'%20width='50px'%20height='50px'%3e%3cpath%20d='M%2025%202%20C%2012.309295%202%202%2012.309295%202%2025%20C%202%2037.690705%2012.309295%2048%2025%2048%20C%2037.690705%2048%2048%2037.690705%2048%2025%20C%2048%2012.309295%2037.690705%202%2025%202%20z%20M%2025%204%20C%2036.609824%204%2046%2013.390176%2046%2025%20C%2046%2036.609824%2036.609824%2046%2025%2046%20C%2013.390176%2046%204%2036.609824%204%2025%20C%204%2013.390176%2013.390176%204%2025%204%20z%20M%2025%2011%20A%203%203%200%200%200%2022%2014%20A%203%203%200%200%200%2025%2017%20A%203%203%200%200%200%2028%2014%20A%203%203%200%200%200%2025%2011%20z%20M%2021%2021%20L%2021%2023%20L%2022%2023%20L%2023%2023%20L%2023%2036%20L%2022%2036%20L%2021%2036%20L%2021%2038%20L%2022%2038%20L%2023%2038%20L%2027%2038%20L%2028%2038%20L%2029%2038%20L%2029%2036%20L%2028%2036%20L%2027%2036%20L%2027%2021%20L%2026%2021%20L%2022%2021%20L%2021%2021%20z'/%3e%3c/svg%3e", Ye = ["for"], je = { key: 0 }, Ke = ["id", "onUpdate:modelValue"], Xe = ["value"], He = { key: 1 }, Ge = ["id", "onUpdate:modelValue", "type"], Je = { class: "form-group" }, Qe = {
  for: "start",
  class: "form-label"
}, Ze = { class: "form-group" }, et = {
  for: "end",
  class: "form-label"
}, tt = { class: "form-group" }, at = {
  for: "date",
  class: "form-label"
}, ot = {
  type: "submit",
  class: "submit-button"
}, nt = { class: "calendar" }, st = { class: "navigation" }, lt = { class: "current-week" }, it = { class: "hours-and-days" }, dt = { class: "hours" }, ut = { class: "weekdays-container" }, rt = { class: "weekdays" }, ct = { class: "days" }, pt = ["onDrop"], vt = ["onDragstart"], mt = ["onClick"], bt = ["src"], ft = /* @__PURE__ */ se({
  __name: "ScheduleForm",
  props: {
    schedules: {},
    additionalFields: {},
    customClass: { default: "" },
    customStyles: { default: () => ({}) },
    weekdays: { default: () => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
    eventTitleColor: { default: "#000" },
    eventTitleSize: { default: "16px" },
    popupFields: { default: () => [] },
    labelsAndSettings: { default: () => ({
      startTimeLabel: "Start Time",
      endTimeLabel: "End Time",
      dateLabel: "Date",
      submitButtonText: "Add Entry",
      calendarWeekLabel: "CW"
    }) },
    placeholderSettings: { default: () => ({}) },
    popupVisible: { type: Boolean, default: !1 },
    popupEvent: { default: null }
  },
  emits: [
    "submit-event",
    "handle-delete",
    "update-event",
    "show-info",
    "close-popup",
    "update:todos",
    "update:participants"
  ],
  setup(f, { expose: M, emit: k }) {
    const s = f, m = k, u = _(!1), E = T(
      () => s.weekdays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    ), z = T(() => s.eventTitleColor || "#000"), V = T(() => s.eventTitleSize || "16px"), c = T(() => ({
      startTimeLabel: s.labelsAndSettings?.startTimeLabel || "Start Time",
      endTimeLabel: s.labelsAndSettings?.endTimeLabel || "End Time",
      dateLabel: s.labelsAndSettings?.dateLabel || "Date",
      submitButtonText: s.labelsAndSettings?.submitButtonText || "Add Entry",
      calendarWeekLabel: s.labelsAndSettings?.calendarWeekLabel || "CW",
      todosLabel: s.labelsAndSettings?.todosLabel,
      participantsLabel: s.labelsAndSettings?.participantsLabel
    })), P = T(() => s.placeholderSettings || {}), A = _(s.schedules), L = _(s.additionalFields), U = _(Array.from({ length: 24 }, (n, t) => t.toString().padStart(2, "0") + ":00")), w = _({}), o = _({ start: "", end: "", date: "", color: "" }), B = T(() => s.popupVisible), N = T(() => s.popupEvent), x = _(0), y = _(null), O = (n) => {
      const t = n || o.value, a = {
        start: t.start,
        end: t.end,
        date: t.date,
        info: t.info,
        color: t.color
      };
      s.additionalFields.forEach((l) => {
        a[l.model] = t[l.model];
      }), m("submit-event", a), D(), Object.keys(o.value).forEach((l) => {
        o.value[l] = "";
      });
    }, j = (n) => {
      m("update-event", n);
    };
    ye(() => {
      !L.value.length || !A.value.length || (w.value = {}, A.value.forEach((n) => {
        const t = n.date;
        w.value[t] || (w.value[t] = []), w.value[t].push(n);
      }));
    });
    const D = () => {
      Object.keys(o.value).forEach((n) => {
        o.value[n] = "";
      });
    }, r = (n) => {
      const t = /* @__PURE__ */ new Date(), a = t.getDay(), l = n + 1 - a + x.value * 7, p = new Date(t);
      return p.setDate(t.getDate() + l), p.toISOString().substring(0, 10);
    }, S = () => {
      const n = /* @__PURE__ */ new Date(), t = new Date(n.getFullYear(), 0, 1), a = (n.getTime() - t.getTime()) / 864e5 + x.value * 7;
      return Math.ceil((a + t.getDay() + 1) / 7);
    }, b = () => x.value -= 1, h = () => x.value += 1, q = (n) => {
      const t = R(n.start), a = R(n.end), l = t.totalMinutes * 40 / 60, p = (a.totalMinutes - t.totalMinutes) * 40 / 60;
      return {
        backgroundColor: n.color || "var(--calendar-primary-color)",
        top: `${l}px`,
        height: `${p}px`,
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 1,
        borderRadius: "var(--event-border-radius)"
      };
    }, R = (n) => {
      const [t, a] = n.split(":").map(Number);
      return { h: t, m: a, totalMinutes: t * 60 + a };
    }, le = (n, t) => R(t).totalMinutes - R(n).totalMinutes, ie = (n, t) => {
      const a = R(n).totalMinutes + t, l = Math.floor(a / 60).toString().padStart(2, "0"), p = (a % 60).toString().padStart(2, "0");
      return `${l}:${p}`;
    }, de = (n, t) => {
      y.value = t;
    }, ue = () => {
      y.value = null;
    }, re = (n, t) => {
      if (!y.value) return;
      const l = n.currentTarget.getBoundingClientRect(), p = n.clientY - l.top, J = 60 / 40, Y = Math.round(p * J / 15) * 15, Q = `${String(Math.floor(Y / 60)).padStart(2, "0")}:${String(Y % 60).padStart(2, "0")}`, me = le(y.value.start, y.value.end), be = ie(Q, me), K = r(t), Z = {
        ...y.value,
        start: Q,
        end: be,
        date: K
      };
      m("update-event", Z);
      const ee = y.value.date;
      w.value[ee] = w.value[ee]?.filter((he) => he.id !== y.value.id) || [], w.value[K] = [...w.value[K] || [], Z], y.value = null;
    }, ce = (n) => {
      m("show-info", n);
    }, pe = () => {
      m("close-popup");
    }, ve = (n) => m("handle-delete", n);
    return _e(() => {
      s.additionalFields.forEach((t) => {
        o.value[t.model] = "";
      }), window.matchMedia?.("(prefers-color-scheme: dark)")?.matches && (u.value = !0);
    }), M({
      newEvent: o,
      addEvent: O,
      resetForm: D
    }), (n, t) => (i(), d("div", {
      class: Le(["calendar-theme", f.customClass, { dark: u.value }]),
      style: H(f.customStyles)
    }, [
      oe(n.$slots, "form", {
        newEvent: o.value,
        addEvent: O,
        additionalFields: L.value,
        labels: c.value,
        resetForm: D
      }, () => [
        e("form", {
          class: "form-container",
          onSubmit: ne(O, ["prevent"])
        }, [
          (i(!0), d(C, null, $(L.value, (a) => (i(), d("div", {
            key: a.id,
            class: "form-group"
          }, [
            e("label", {
              for: a.id,
              class: "form-label"
            }, v(a.label) + ":", 9, Ye),
            a.type === "select" ? (i(), d("div", je, [
              F(e("select", {
                id: a.id,
                "onUpdate:modelValue": (l) => o.value[a.model] = l,
                required: "",
                class: "form-select"
              }, [
                (i(!0), d(C, null, $(a.options, (l) => (i(), d("option", {
                  key: l.id,
                  value: l
                }, v(l.name || `${l.first_name} ${l.last_name}`), 9, Xe))), 128))
              ], 8, Ke), [
                [we, o.value[a.model]]
              ])
            ])) : (i(), d("div", He, [
              F(e("input", {
                id: a.id,
                "onUpdate:modelValue": (l) => o.value[a.model] = l,
                type: a.type,
                required: "",
                class: "form-input"
              }, null, 8, Ge), [
                [De, o.value[a.model]]
              ])
            ]))
          ]))), 128)),
          e("div", Je, [
            e("label", Qe, v(c.value.startTimeLabel) + ":", 1),
            F(e("input", {
              id: "start",
              "onUpdate:modelValue": t[0] || (t[0] = (a) => o.value.start = a),
              type: "time",
              required: "",
              class: "form-input"
            }, null, 512), [
              [I, o.value.start]
            ])
          ]),
          e("div", Ze, [
            e("label", et, v(c.value.endTimeLabel) + ":", 1),
            F(e("input", {
              id: "end",
              "onUpdate:modelValue": t[1] || (t[1] = (a) => o.value.end = a),
              type: "time",
              required: "",
              class: "form-input"
            }, null, 512), [
              [I, o.value.end]
            ])
          ]),
          e("div", tt, [
            e("label", at, v(c.value.dateLabel) + ":", 1),
            F(e("input", {
              id: "date",
              "onUpdate:modelValue": t[2] || (t[2] = (a) => o.value.date = a),
              type: "date",
              required: "",
              class: "form-input"
            }, null, 512), [
              [I, o.value.date]
            ])
          ]),
          e("button", ot, v(c.value.submitButtonText), 1)
        ], 32)
      ]),
      e("div", nt, [
        e("div", st, [
          e("button", {
            class: "arrow-button",
            onClick: b
          }, "<"),
          e("span", lt, v(c.value.calendarWeekLabel) + " " + v(S()), 1),
          e("button", {
            class: "arrow-button",
            onClick: h
          }, ">")
        ]),
        e("div", it, [
          e("div", dt, [
            t[6] || (t[6] = e("div", { class: "empty-slot" }, null, -1)),
            (i(!0), d(C, null, $(U.value, (a) => (i(), d("div", {
              key: a,
              class: "hour"
            }, v(a), 1))), 128))
          ]),
          e("div", ut, [
            e("ul", rt, [
              (i(!0), d(C, null, $(E.value, (a, l) => (i(), d("li", {
                key: l,
                class: "weekday"
              }, [
                e("span", null, v(a), 1),
                e("span", null, v(r(l)), 1)
              ]))), 128))
            ]),
            e("div", ct, [
              (i(), d(C, null, $(7, (a, l) => e("div", {
                key: l,
                class: "day",
                onDragover: t[3] || (t[3] = ne(() => {
                }, ["prevent"])),
                onDrop: (p) => re(p, l)
              }, [
                (i(!0), d(C, null, $(U.value, (p) => (i(), d("div", {
                  key: p,
                  class: "hour"
                }))), 128)),
                (i(!0), d(C, null, $(w.value[r(l)] || [], (p, J) => (i(), d("div", {
                  key: p.id,
                  class: "event",
                  style: H(q(p)),
                  draggable: "true",
                  onDragstart: (Y) => de(Y, p),
                  onDragend: ue
                }, [
                  e("span", {
                    style: H({ color: z.value, fontSize: V.value })
                  }, v(p.title), 5),
                  t[7] || (t[7] = e("br", null, null, -1)),
                  e("button", {
                    class: "info-button",
                    onClick: (Y) => ce(p)
                  }, [
                    e("img", {
                      src: g(Re),
                      alt: "info",
                      class: "small-logo"
                    }, null, 8, bt)
                  ], 8, mt)
                ], 44, vt))), 128))
              ], 40, pt)), 64))
            ])
          ])
        ])
      ]),
      n.$slots["popup-calendar"] ? oe(n.$slots, "popup-calendar", { key: 0 }) : (i(), ke(qe, {
        key: 1,
        visible: B.value,
        eventData: N.value,
        popupFields: f.popupFields || [],
        closeButtonText: "Close",
        todosLabel: c.value.todosLabel || "To-Do",
        participantsLabel: c.value.participantsLabel || "Teammates",
        todos: N.value?.todos || [],
        participants: N.value?.participants || [],
        todoPlaceholder: P.value.todo || "New To-do...",
        participantPlaceholder: P.value.participant || "Add Participant...",
        "onUpdate:todos": t[4] || (t[4] = (a) => m("update:todos", a)),
        "onUpdate:participants": t[5] || (t[5] = (a) => m("update:participants", a)),
        onClosePopup: pe,
        onHandleDelete: ve,
        onUpdateEvent: j
      }, null, 8, ["visible", "eventData", "popupFields", "todosLabel", "participantsLabel", "todos", "participants", "todoPlaceholder", "participantPlaceholder"]))
    ], 6));
  }
});
export {
  ft as ScheduleForm,
  ft as default
};
