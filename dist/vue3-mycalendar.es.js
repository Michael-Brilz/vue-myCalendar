import { computed as $, ref as w, watch as be, defineComponent as se, resolveComponent as he, createElementBlock as i, createCommentVNode as G, openBlock as l, createElementVNode as e, createVNode as N, toDisplayString as m, unref as _, Fragment as M, renderList as F, withDirectives as B, vModelText as O, createTextVNode as oe, isRef as ae, watchEffect as ge, onMounted as fe, normalizeStyle as J, normalizeClass as _e, renderSlot as ye, createBlock as Le, withModifiers as ne, vModelSelect as we, vModelDynamic as De } from "vue";
function ke(A, U) {
  var z, V;
  const n = $(() => A.popupFields || []), u = w({ ...A.eventData }), T = w([...((z = A.eventData) == null ? void 0 : z.todos) || []]), v = w([...((V = A.eventData) == null ? void 0 : V.participants) || []]);
  be(() => A.eventData, (s) => {
    s && (u.value = { ...s }, T.value = [...s.todos || []], v.value = [...s.participants || []]);
  }, { immediate: !0 });
  const P = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (b) => b.toUpperCase()), R = $(() => n.value.length === 0 ? u.value : Object.fromEntries(
    Object.entries(u.value).filter(([s]) => n.value.includes(s))
  )), k = (s, b) => {
    u.value[s] = b, U("updateEvent", u.value);
  }, S = w(""), x = () => {
    const s = S.value.trim();
    s && (T.value.push(s), S.value = "", U("update:todos", { todos: [...T.value], eventId: u.value.id }));
  }, I = (s) => {
    T.value.splice(s, 1), U("update:todos", { todos: [...T.value], eventId: u.value.id });
  }, C = w("");
  return {
    editableEventData: u,
    popupFields: n,
    filteredEventData: R,
    formatKey: P,
    updateField: k,
    // Todos
    localTodos: T,
    newTodo: S,
    addTodo: x,
    removeTodo: I,
    // Participants
    localParticipants: v,
    newParticipant: C,
    addParticipant: () => {
      const s = C.value.trim();
      s && (v.value.push(s), C.value = "", U("update:participants", { participants: [...v.value], eventId: u.value.id }));
    },
    removeParticipant: (s) => {
      v.value.splice(s, 1), U("update:participants", { participants: [...v.value], eventId: u.value.id });
    }
  };
}
const Se = {
  key: 0,
  class: "popup"
}, Ce = { class: "top-right-icons" }, Te = { class: "popup-title" }, Ee = { key: 0 }, $e = {
  key: 0,
  class: "popup-field"
}, Me = { class: "popup-label" }, Pe = ["onUpdate:modelValue", "placeholder"], Fe = { class: "section" }, Ae = { class: "popup-label" }, Ue = { class: "list" }, xe = ["onClick"], Ve = { class: "input-row" }, Be = { class: "section" }, Ie = { class: "popup-label" }, ze = { class: "list" }, We = ["onClick"], Ne = { class: "input-row" }, Oe = /* @__PURE__ */ se({
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
  setup(A, { emit: U }) {
    const n = A, u = $(() => n.todosLabel || "To-do"), T = $(() => n.participantsLabel || "Participant"), v = U, {
      editableEventData: P,
      filteredEventData: R,
      formatKey: k,
      localTodos: S,
      newTodo: x,
      addTodo: I,
      localParticipants: C,
      newParticipant: y,
      addParticipant: d
    } = ke(n, v), z = () => v("close-popup"), V = () => v("handle-delete", n.eventData.id), s = () => {
      const L = {
        ...P.value,
        todos: S.value,
        participants: C.value
      };
      v("update-event", L), v("update:todos", { todos: S.value, eventId: n.eventData.id }), v("update:participants", { participants: C.value, eventId: n.eventData.id }), v("close-popup");
    }, b = w(null), W = { x: 0, y: 0 }, K = (L) => {
      if (!b.value) return;
      const h = b.value;
      W.x = L.clientX - h.getBoundingClientRect().left, W.y = L.clientY - h.getBoundingClientRect().top;
      const E = (r) => {
        h.style.left = `${r.clientX - W.x}px`, h.style.top = `${r.clientY - W.y}px`, h.style.position = "absolute", h.style.transform = "none";
      }, g = () => {
        window.removeEventListener("mousemove", E), window.removeEventListener("mouseup", g);
      };
      window.addEventListener("mousemove", E), window.addEventListener("mouseup", g);
    }, Q = (L) => {
      S.value.splice(L, 1), v("update:todos", {
        todos: [...S.value],
        eventId: P.value.id
      });
    }, Y = (L) => {
      C.value.splice(L, 1), v("update:participants", {
        participants: [...C.value],
        eventId: P.value.id
      });
    };
    return (L, h) => {
      const E = he("font-awesome-icon");
      return L.visible ? (l(), i("div", Se, [
        e("div", {
          class: "popup-content",
          ref_key: "popupRef",
          ref: b,
          onMousedown: K
        }, [
          e("div", Ce, [
            e("button", {
              class: "icon-button",
              onClick: V,
              title: "Delete"
            }, [
              N(E, { icon: ["fas", "trash"] })
            ]),
            e("button", {
              class: "icon-button",
              onClick: z,
              title: "Close"
            }, [
              N(E, { icon: ["fas", "times"] })
            ])
          ]),
          e("h2", Te, m(_(P).title), 1),
          L.eventData && Object.keys(L.eventData).length ? (l(), i("div", Ee, [
            (l(!0), i(M, null, F(_(R), (g, r) => (l(), i(M, { key: r }, [
              r !== "title" ? (l(), i("div", $e, [
                e("label", Me, m(_(k)(String(r))), 1),
                B(e("input", {
                  "onUpdate:modelValue": (j) => _(P)[r] = j,
                  class: "popup-input",
                  placeholder: _(k)(String(r))
                }, null, 8, Pe), [
                  [O, _(P)[r]]
                ])
              ])) : G("", !0)
            ], 64))), 128))
          ])) : G("", !0),
          e("div", Fe, [
            e("label", Ae, m(u.value), 1),
            e("ul", Ue, [
              (l(!0), i(M, null, F(_(S), (g, r) => (l(), i("li", { key: r }, [
                oe(m(g) + " ", 1),
                e("button", {
                  onClick: (j) => Q(r)
                }, [
                  N(E, { icon: ["fas", "trash"] })
                ], 8, xe)
              ]))), 128))
            ]),
            e("div", Ve, [
              B(e("input", {
                "onUpdate:modelValue": h[0] || (h[0] = (g) => ae(x) ? x.value = g : null),
                placeholder: "New To-do...",
                class: "popup-input"
              }, null, 512), [
                [O, _(x)]
              ]),
              e("button", {
                class: "add-inline-button",
                onClick: h[1] || (h[1] = //@ts-ignore
                (...g) => _(I) && _(I)(...g))
              }, [
                N(E, { icon: ["fas", "plus"] })
              ])
            ])
          ]),
          e("div", Be, [
            e("label", Ie, m(T.value), 1),
            e("ul", ze, [
              (l(!0), i(M, null, F(_(C), (g, r) => (l(), i("li", { key: r }, [
                oe(m(g) + " ", 1),
                e("button", {
                  onClick: (j) => Y(r)
                }, [
                  N(E, { icon: ["fas", "trash"] })
                ], 8, We)
              ]))), 128))
            ]),
            e("div", Ne, [
              B(e("input", {
                "onUpdate:modelValue": h[2] || (h[2] = (g) => ae(y) ? y.value = g : null),
                placeholder: "Add Participant ...",
                class: "popup-input"
              }, null, 512), [
                [O, _(y)]
              ]),
              e("button", {
                class: "add-inline-button",
                onClick: h[3] || (h[3] = //@ts-ignore
                (...g) => _(d) && _(d)(...g))
              }, [
                N(E, { icon: ["fas", "user-plus"] })
              ])
            ])
          ]),
          e("div", { class: "popup-footer" }, [
            e("button", {
              class: "save-button",
              onClick: s
            }, "Speichern")
          ])
        ], 544)
      ])) : G("", !0);
    };
  }
}), Re = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2050%2050'%20width='50px'%20height='50px'%3e%3cpath%20d='M%2025%202%20C%2012.309295%202%202%2012.309295%202%2025%20C%202%2037.690705%2012.309295%2048%2025%2048%20C%2037.690705%2048%2048%2037.690705%2048%2025%20C%2048%2012.309295%2037.690705%202%2025%202%20z%20M%2025%204%20C%2036.609824%204%2046%2013.390176%2046%2025%20C%2046%2036.609824%2036.609824%2046%2025%2046%20C%2013.390176%2046%204%2036.609824%204%2025%20C%204%2013.390176%2013.390176%204%2025%204%20z%20M%2025%2011%20A%203%203%200%200%200%2022%2014%20A%203%203%200%200%200%2025%2017%20A%203%203%200%200%200%2028%2014%20A%203%203%200%200%200%2025%2011%20z%20M%2021%2021%20L%2021%2023%20L%2022%2023%20L%2023%2023%20L%2023%2036%20L%2022%2036%20L%2021%2036%20L%2021%2038%20L%2022%2038%20L%2023%2038%20L%2027%2038%20L%2028%2038%20L%2029%2038%20L%2029%2036%20L%2028%2036%20L%2027%2036%20L%2027%2021%20L%2026%2021%20L%2022%2021%20L%2021%2021%20z'/%3e%3c/svg%3e", Ye = ["for"], je = { key: 0 }, qe = ["id", "onUpdate:modelValue"], Ke = ["value"], Xe = { key: 1 }, He = ["id", "onUpdate:modelValue", "type"], Ge = { class: "form-group" }, Je = {
  for: "start",
  class: "form-label"
}, Qe = { class: "form-group" }, Ze = {
  for: "end",
  class: "form-label"
}, et = { class: "form-group" }, tt = {
  for: "date",
  class: "form-label"
}, ot = {
  type: "submit",
  class: "submit-button"
}, at = { class: "calendar" }, nt = { class: "navigation" }, st = { class: "current-week" }, lt = { class: "hours-and-days" }, it = { class: "hours" }, dt = { class: "weekdays-container" }, ut = { class: "weekdays" }, rt = { class: "days" }, ct = ["onDrop"], pt = ["onDragstart"], vt = ["onClick"], mt = ["src"], ht = /* @__PURE__ */ se({
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
    labelsAndSettings: {},
    placeholderSettings: {},
    popupVisible: { type: Boolean },
    popupEvent: {}
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
  setup(A, { emit: U }) {
    const n = A, u = U, T = w(!1), v = $(
      () => n.weekdays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    ), P = $(() => n.eventTitleColor || "#000"), R = $(() => n.eventTitleSize || "16px"), k = $(() => {
      var o, t, p, D, a, c, f;
      return {
        startTimeLabel: ((o = n.labelsAndSettings) == null ? void 0 : o.startTimeLabel) || "Start Time",
        endTimeLabel: ((t = n.labelsAndSettings) == null ? void 0 : t.endTimeLabel) || "End Time",
        dateLabel: ((p = n.labelsAndSettings) == null ? void 0 : p.dateLabel) || "Date",
        submitButtonText: ((D = n.labelsAndSettings) == null ? void 0 : D.submitButtonText) || "Add Entry",
        calendarWeekLabel: ((a = n.labelsAndSettings) == null ? void 0 : a.calendarWeekLabel) || "CW",
        todosLabel: (c = n.labelsAndSettings) == null ? void 0 : c.todosLabel,
        participantsLabel: (f = n.labelsAndSettings) == null ? void 0 : f.participantsLabel
      };
    }), S = $(() => n.placeholderSettings || {}), x = w(n.schedules), I = w(n.additionalFields), C = w(Array.from({ length: 24 }, (o, t) => t.toString().padStart(2, "0") + ":00")), y = w({}), d = w({ start: "", end: "", date: "", color: "" }), z = $(() => n.popupVisible), V = $(() => n.popupEvent), s = w(0), b = w(null), W = () => {
      const o = {
        start: d.value.start,
        end: d.value.end,
        date: d.value.date,
        info: d.value.info,
        color: d.value.color
      };
      n.additionalFields.forEach((t) => {
        o[t.model] = d.value[t.model];
      }), u("submit-event", o), Object.keys(d.value).forEach((t) => {
        d.value[t] = "";
      });
    }, K = (o) => {
      u("update-event", o);
    };
    ge(() => {
      !I.value.length || !x.value.length || (y.value = {}, x.value.forEach((o) => {
        const t = o.date;
        y.value[t] || (y.value[t] = []), y.value[t].push(o);
      }));
    });
    const Y = (o) => {
      const t = /* @__PURE__ */ new Date(), p = t.getDay(), D = o + 1 - p + s.value * 7, a = new Date(t);
      return a.setDate(t.getDate() + D), a.toISOString().substring(0, 10);
    }, L = () => {
      const o = /* @__PURE__ */ new Date(), t = new Date(o.getFullYear(), 0, 1), p = (o.getTime() - t.getTime()) / 864e5 + s.value * 7;
      return Math.ceil((p + t.getDay() + 1) / 7);
    }, h = () => s.value -= 1, E = () => s.value += 1, g = (o) => {
      const t = r(o.start), p = r(o.end), D = t.totalMinutes * 40 / 60, a = (p.totalMinutes - t.totalMinutes) * 40 / 60;
      return {
        backgroundColor: o.color || "var(--calendar-primary-color)",
        top: `${D}px`,
        height: `${a}px`,
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 1,
        borderRadius: "var(--event-border-radius)"
      };
    }, r = (o) => {
      const [t, p] = o.split(":").map(Number);
      return { h: t, m: p, totalMinutes: t * 60 + p };
    }, j = (o, t) => r(t).totalMinutes - r(o).totalMinutes, le = (o, t) => {
      const p = r(o).totalMinutes + t, D = Math.floor(p / 60).toString().padStart(2, "0"), a = (p % 60).toString().padStart(2, "0");
      return `${D}:${a}`;
    }, ie = (o, t) => {
      b.value = t;
    }, de = () => {
      b.value = null;
    }, ue = (o, t) => {
      var te;
      if (!b.value) return;
      const D = o.currentTarget.getBoundingClientRect(), a = o.clientY - D.top, c = 60 / 40, f = Math.round(a * c / 15) * 15, X = `${String(Math.floor(f / 60)).padStart(2, "0")}:${String(f % 60).padStart(2, "0")}`, q = j(b.value.start, b.value.end), ve = le(X, q), H = Y(t), Z = {
        ...b.value,
        start: X,
        end: ve,
        date: H
      };
      u("update-event", Z);
      const ee = b.value.date;
      y.value[ee] = ((te = y.value[ee]) == null ? void 0 : te.filter((me) => me.id !== b.value.id)) || [], y.value[H] = [...y.value[H] || [], Z], b.value = null;
    }, re = (o) => {
      u("show-info", o);
    }, ce = () => {
      u("close-popup");
    }, pe = (o) => u("handle-delete", o);
    return fe(() => {
      var t;
      n.additionalFields.forEach((p) => {
        d.value[p.model] = "";
      });
      const o = (t = window.matchMedia) == null ? void 0 : t.call(window, "(prefers-color-scheme: dark)");
      o != null && o.matches && (T.value = !0);
    }), (o, t) => {
      var p, D;
      return l(), i("div", {
        class: _e(["calendar-theme", o.customClass, { dark: T.value }]),
        style: J(o.customStyles)
      }, [
        e("form", {
          class: "form-container",
          onSubmit: ne(W, ["prevent"])
        }, [
          (l(!0), i(M, null, F(I.value, (a) => (l(), i("div", {
            key: a.id,
            class: "form-group"
          }, [
            e("label", {
              for: a.id,
              class: "form-label"
            }, m(a.label) + ":", 9, Ye),
            a.type === "select" ? (l(), i("div", je, [
              B(e("select", {
                id: a.id,
                "onUpdate:modelValue": (c) => d.value[a.model] = c,
                required: "",
                class: "form-select"
              }, [
                (l(!0), i(M, null, F(a.options, (c) => (l(), i("option", {
                  key: c.id,
                  value: c
                }, m(c.name || `${c.first_name} ${c.last_name}`), 9, Ke))), 128))
              ], 8, qe), [
                [we, d.value[a.model]]
              ])
            ])) : (l(), i("div", Xe, [
              B(e("input", {
                id: a.id,
                "onUpdate:modelValue": (c) => d.value[a.model] = c,
                type: a.type,
                required: "",
                class: "form-input"
              }, null, 8, He), [
                [De, d.value[a.model]]
              ])
            ]))
          ]))), 128)),
          e("div", Ge, [
            e("label", Je, m(k.value.startTimeLabel) + ":", 1),
            B(e("input", {
              id: "start",
              "onUpdate:modelValue": t[0] || (t[0] = (a) => d.value.start = a),
              type: "time",
              required: "",
              class: "form-input"
            }, null, 512), [
              [O, d.value.start]
            ])
          ]),
          e("div", Qe, [
            e("label", Ze, m(k.value.endTimeLabel) + ":", 1),
            B(e("input", {
              id: "end",
              "onUpdate:modelValue": t[1] || (t[1] = (a) => d.value.end = a),
              type: "time",
              required: "",
              class: "form-input"
            }, null, 512), [
              [O, d.value.end]
            ])
          ]),
          e("div", et, [
            e("label", tt, m(k.value.dateLabel) + ":", 1),
            B(e("input", {
              id: "date",
              "onUpdate:modelValue": t[2] || (t[2] = (a) => d.value.date = a),
              type: "date",
              required: "",
              class: "form-input"
            }, null, 512), [
              [O, d.value.date]
            ])
          ]),
          e("button", ot, m(k.value.submitButtonText), 1)
        ], 32),
        e("div", at, [
          e("div", nt, [
            e("button", {
              class: "arrow-button",
              onClick: h
            }, "<"),
            e("span", st, m(k.value.calendarWeekLabel) + " " + m(L()), 1),
            e("button", {
              class: "arrow-button",
              onClick: E
            }, ">")
          ]),
          e("div", lt, [
            e("div", it, [
              t[6] || (t[6] = e("div", { class: "empty-slot" }, null, -1)),
              (l(!0), i(M, null, F(C.value, (a) => (l(), i("div", {
                key: a,
                class: "hour"
              }, m(a), 1))), 128))
            ]),
            e("div", dt, [
              e("ul", ut, [
                (l(!0), i(M, null, F(v.value, (a, c) => (l(), i("li", {
                  key: c,
                  class: "weekday"
                }, [
                  e("span", null, m(a), 1),
                  e("span", null, m(Y(c)), 1)
                ]))), 128))
              ]),
              e("div", rt, [
                (l(), i(M, null, F(7, (a, c) => e("div", {
                  key: c,
                  class: "day",
                  onDragover: t[3] || (t[3] = ne(() => {
                  }, ["prevent"])),
                  onDrop: (f) => ue(f, c)
                }, [
                  (l(!0), i(M, null, F(C.value, (f) => (l(), i("div", {
                    key: f,
                    class: "hour"
                  }))), 128)),
                  (l(!0), i(M, null, F(y.value[Y(c)] || [], (f, X) => (l(), i("div", {
                    key: f.id,
                    class: "event",
                    style: J(g(f)),
                    draggable: "true",
                    onDragstart: (q) => ie(q, f),
                    onDragend: de
                  }, [
                    e("span", {
                      style: J({ color: P.value, fontSize: R.value })
                    }, m(f.title), 5),
                    t[7] || (t[7] = e("br", null, null, -1)),
                    e("button", {
                      class: "info-button",
                      onClick: (q) => re(f)
                    }, [
                      e("img", {
                        src: _(Re),
                        alt: "info",
                        class: "small-logo"
                      }, null, 8, mt)
                    ], 8, vt)
                  ], 44, pt))), 128))
                ], 40, ct)), 64))
              ])
            ])
          ])
        ]),
        o.$slots["popup-calendar"] ? ye(o.$slots, "popup-calendar", { key: 0 }) : (l(), Le(Oe, {
          key: 1,
          visible: z.value,
          eventData: V.value,
          popupFields: o.popupFields || [],
          closeButtonText: "Close",
          todosLabel: k.value.todosLabel || "To-Do",
          participantsLabel: k.value.participantsLabel || "Teammates",
          todos: ((p = V.value) == null ? void 0 : p.todos) || [],
          participants: ((D = V.value) == null ? void 0 : D.participants) || [],
          todoPlaceholder: S.value.todo || "New To-do...",
          participantPlaceholder: S.value.participant || "Add Participant...",
          "onUpdate:todos": t[4] || (t[4] = (a) => u("update:todos", a)),
          "onUpdate:participants": t[5] || (t[5] = (a) => u("update:participants", a)),
          onClosePopup: ce,
          onHandleDelete: pe,
          onUpdateEvent: K
        }, null, 8, ["visible", "eventData", "popupFields", "todosLabel", "participantsLabel", "todos", "participants", "todoPlaceholder", "participantPlaceholder"]))
      ], 6);
    };
  }
});
export {
  ht as ScheduleForm,
  ht as default
};
