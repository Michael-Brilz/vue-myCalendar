import { computed as D, ref as k, watch as be, defineComponent as ne, resolveComponent as he, openBlock as i, createElementBlock as d, createElementVNode as e, createVNode as z, toDisplayString as m, unref as L, Fragment as C, renderList as E, withDirectives as A, vModelText as I, createCommentVNode as X, createTextVNode as ee, isRef as te, useSlots as fe, watchEffect as ge, onMounted as ye, normalizeStyle as H, normalizeClass as _e, renderSlot as oe, withModifiers as ae, vModelSelect as Le, vModelDynamic as we, createBlock as De } from "vue";
function ke(y, $) {
  const w = D(() => y.popupFields || []), n = k({ ...y.eventData }), b = k([...y.eventData?.todos || []]), r = k([...y.eventData?.participants || []]);
  be(() => y.eventData, (s) => {
    s && (n.value = { ...s }, b.value = [...s.todos || []], r.value = [...s.participants || []]);
  }, { immediate: !0 });
  const c = (s) => s.replace(/_/g, " ").replace(/\b\w/g, (x) => x.toUpperCase()), u = D(() => w.value.length === 0 ? n.value : Object.fromEntries(
    Object.entries(n.value).filter(([s]) => w.value.includes(s))
  )), M = (s, x) => {
    n.value[s] = x, $("updateEvent", n.value);
  }, p = k(""), P = () => {
    const s = p.value.trim();
    s && (b.value.push(s), p.value = "", $("update:todos", { todos: [...b.value], eventId: n.value.id }));
  }, B = (s) => {
    b.value.splice(s, 1), $("update:todos", { todos: [...b.value], eventId: n.value.id });
  }, S = k("");
  return {
    editableEventData: n,
    popupFields: w,
    filteredEventData: u,
    formatKey: c,
    updateField: M,
    // Todos
    localTodos: b,
    newTodo: p,
    addTodo: P,
    removeTodo: B,
    // Participants
    localParticipants: r,
    newParticipant: S,
    addParticipant: () => {
      const s = S.value.trim();
      s && (r.value.push(s), S.value = "", $("update:participants", { participants: [...r.value], eventId: n.value.id }));
    },
    removeParticipant: (s) => {
      r.value.splice(s, 1), $("update:participants", { participants: [...r.value], eventId: n.value.id });
    }
  };
}
const Se = {
  key: 0,
  class: "popup"
}, Te = { class: "top-right-icons" }, Ce = { class: "popup-title" }, Ee = { key: 0 }, $e = {
  key: 0,
  class: "popup-field"
}, Me = { class: "popup-label" }, Pe = ["onUpdate:modelValue", "placeholder"], xe = { class: "section" }, Fe = { class: "popup-label" }, Ae = { class: "list" }, Ue = ["onClick"], Be = { class: "input-row" }, Ve = { class: "section" }, We = { class: "popup-label" }, ze = { class: "list" }, Ie = ["onClick"], Ne = { class: "input-row" }, qe = /* @__PURE__ */ ne({
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
  setup(y, { emit: $ }) {
    const w = y, n = D(() => w.todosLabel || "To-do"), b = D(() => w.participantsLabel || "Participant"), r = $, {
      editableEventData: c,
      filteredEventData: u,
      formatKey: M,
      localTodos: p,
      newTodo: P,
      addTodo: B,
      localParticipants: S,
      newParticipant: V,
      addParticipant: W
    } = ke(w, r), s = () => r("close-popup"), x = () => r("handle-delete", w.eventData.id), Y = () => {
      const T = {
        ...c.value,
        todos: p.value,
        participants: S.value
      };
      r("update-event", T), r("update:todos", { todos: p.value, eventId: w.eventData.id }), r("update:participants", { participants: S.value, eventId: w.eventData.id }), r("close-popup");
    }, U = k(null), F = { x: 0, y: 0 }, N = (T) => {
      if (!U.value) return;
      const h = U.value;
      F.x = T.clientX - h.getBoundingClientRect().left, F.y = T.clientY - h.getBoundingClientRect().top;
      const _ = (g) => {
        h.style.left = `${g.clientX - F.x}px`, h.style.top = `${g.clientY - F.y}px`, h.style.position = "absolute", h.style.transform = "none";
      }, f = () => {
        window.removeEventListener("mousemove", _), window.removeEventListener("mouseup", f);
      };
      window.addEventListener("mousemove", _), window.addEventListener("mouseup", f);
    }, q = (T) => {
      p.value.splice(T, 1), r("update:todos", {
        todos: [...p.value],
        eventId: c.value.id
      });
    }, j = (T) => {
      S.value.splice(T, 1), r("update:participants", {
        participants: [...S.value],
        eventId: c.value.id
      });
    };
    return (T, h) => {
      const _ = he("font-awesome-icon");
      return y.visible ? (i(), d("div", Se, [
        e("div", {
          class: "popup-content",
          ref_key: "popupRef",
          ref: U,
          onMousedown: N
        }, [
          e("div", Te, [
            e("button", {
              class: "icon-button",
              onClick: x,
              title: "Delete"
            }, [
              z(_, { icon: ["fas", "trash"] })
            ]),
            e("button", {
              class: "icon-button",
              onClick: s,
              title: "Close"
            }, [
              z(_, { icon: ["fas", "times"] })
            ])
          ]),
          e("h2", Ce, m(L(c).title), 1),
          y.eventData && Object.keys(y.eventData).length ? (i(), d("div", Ee, [
            (i(!0), d(C, null, E(L(u), (f, g) => (i(), d(C, { key: g }, [
              g !== "title" ? (i(), d("div", $e, [
                e("label", Me, m(L(M)(String(g))), 1),
                A(e("input", {
                  "onUpdate:modelValue": (R) => L(c)[g] = R,
                  class: "popup-input",
                  placeholder: L(M)(String(g))
                }, null, 8, Pe), [
                  [I, L(c)[g]]
                ])
              ])) : X("", !0)
            ], 64))), 128))
          ])) : X("", !0),
          e("div", xe, [
            e("label", Fe, m(n.value), 1),
            e("ul", Ae, [
              (i(!0), d(C, null, E(L(p), (f, g) => (i(), d("li", { key: g }, [
                ee(m(f) + " ", 1),
                e("button", {
                  onClick: (R) => q(g)
                }, [
                  z(_, { icon: ["fas", "trash"] })
                ], 8, Ue)
              ]))), 128))
            ]),
            e("div", Be, [
              A(e("input", {
                "onUpdate:modelValue": h[0] || (h[0] = (f) => te(P) ? P.value = f : null),
                placeholder: "New To-do...",
                class: "popup-input"
              }, null, 512), [
                [I, L(P)]
              ]),
              e("button", {
                class: "add-inline-button",
                onClick: h[1] || (h[1] = //@ts-ignore
                (...f) => L(B) && L(B)(...f))
              }, [
                z(_, { icon: ["fas", "plus"] })
              ])
            ])
          ]),
          e("div", Ve, [
            e("label", We, m(b.value), 1),
            e("ul", ze, [
              (i(!0), d(C, null, E(L(S), (f, g) => (i(), d("li", { key: g }, [
                ee(m(f) + " ", 1),
                e("button", {
                  onClick: (R) => j(g)
                }, [
                  z(_, { icon: ["fas", "trash"] })
                ], 8, Ie)
              ]))), 128))
            ]),
            e("div", Ne, [
              A(e("input", {
                "onUpdate:modelValue": h[2] || (h[2] = (f) => te(V) ? V.value = f : null),
                placeholder: "Add Participant ...",
                class: "popup-input"
              }, null, 512), [
                [I, L(V)]
              ]),
              e("button", {
                class: "add-inline-button",
                onClick: h[3] || (h[3] = //@ts-ignore
                (...f) => L(W) && L(W)(...f))
              }, [
                z(_, { icon: ["fas", "user-plus"] })
              ])
            ])
          ]),
          e("div", { class: "popup-footer" }, [
            e("button", {
              class: "save-button",
              onClick: Y
            }, "Speichern")
          ])
        ], 544)
      ])) : X("", !0);
    };
  }
}), Re = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2050%2050'%20width='50px'%20height='50px'%3e%3cpath%20d='M%2025%202%20C%2012.309295%202%202%2012.309295%202%2025%20C%202%2037.690705%2012.309295%2048%2025%2048%20C%2037.690705%2048%2048%2037.690705%2048%2025%20C%2048%2012.309295%2037.690705%202%2025%202%20z%20M%2025%204%20C%2036.609824%204%2046%2013.390176%2046%2025%20C%2046%2036.609824%2036.609824%2046%2025%2046%20C%2013.390176%2046%204%2036.609824%204%2025%20C%204%2013.390176%2013.390176%204%2025%204%20z%20M%2025%2011%20A%203%203%200%200%200%2022%2014%20A%203%203%200%200%200%2025%2017%20A%203%203%200%200%200%2028%2014%20A%203%203%200%200%200%2025%2011%20z%20M%2021%2021%20L%2021%2023%20L%2022%2023%20L%2023%2023%20L%2023%2036%20L%2022%2036%20L%2021%2036%20L%2021%2038%20L%2022%2038%20L%2023%2038%20L%2027%2038%20L%2028%2038%20L%2029%2038%20L%2029%2036%20L%2028%2036%20L%2027%2036%20L%2027%2021%20L%2026%2021%20L%2022%2021%20L%2021%2021%20z'/%3e%3c/svg%3e", Oe = ["for"], Ye = { key: 0 }, je = ["id", "onUpdate:modelValue"], Ke = ["value"], Xe = { key: 1 }, He = ["id", "onUpdate:modelValue", "type"], Ge = { class: "form-group" }, Je = {
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
}, at = { class: "calendar" }, nt = { class: "navigation" }, st = { class: "current-week" }, lt = { class: "hours-and-days" }, it = { class: "hours" }, dt = { class: "weekdays-container" }, ut = { class: "weekdays" }, rt = { class: "days" }, ct = ["onDrop"], pt = ["onDragstart"], vt = ["onClick"], mt = ["src"], ft = /* @__PURE__ */ ne({
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
  emits: ["submit-event", "handle-delete", "update-event", "show-info", "close-popup", "update:todos", "update:participants"],
  setup(y, { expose: $, emit: w }) {
    const n = y, b = w;
    fe();
    const r = k(!1), c = k({}), u = k({
      start: "",
      end: "",
      date: "",
      color: "",
      title: "",
      description: ""
    }), M = k(0), p = k(null), P = k(
      Array.from({ length: 24 }, (a, t) => t.toString().padStart(2, "0") + ":00")
    ), B = D(() => n.weekdays), S = D(() => n.eventTitleColor), V = D(() => n.eventTitleSize), W = D(() => n.additionalFields), s = D(() => ({
      startTimeLabel: n.labelsAndSettings?.startTimeLabel || "Start Time",
      endTimeLabel: n.labelsAndSettings?.endTimeLabel || "End Time",
      dateLabel: n.labelsAndSettings?.dateLabel || "Date",
      submitButtonText: n.labelsAndSettings?.submitButtonText || "Add Entry",
      calendarWeekLabel: n.labelsAndSettings?.calendarWeekLabel || "CW",
      todosLabel: n.labelsAndSettings?.todosLabel,
      participantsLabel: n.labelsAndSettings?.participantsLabel
    })), x = D(() => n.placeholderSettings || {}), Y = D(() => n.popupVisible), U = D(() => n.popupEvent), F = () => {
      u.value = {
        start: "",
        end: "",
        date: "",
        color: "",
        title: "",
        description: ""
      }, n.additionalFields.forEach((a) => {
        u.value[a.model] = "";
      });
    }, N = (a) => {
      const t = a || u.value, o = {
        title: t.title,
        start: t.start,
        end: t.end,
        date: t.date,
        info: t.info,
        color: t.color,
        description: t.description
      };
      n.additionalFields.forEach((l) => {
        o[l.model] = t[l.model];
      }), b("submit-event", o), F();
    }, q = (a) => {
      const t = /* @__PURE__ */ new Date(), o = t.getDay(), l = a + 1 - o + M.value * 7, v = new Date(t);
      return v.setDate(t.getDate() + l), v.toISOString().substring(0, 10);
    }, j = () => {
      const a = /* @__PURE__ */ new Date(), t = new Date(a.getFullYear(), 0, 1), o = (a.getTime() - t.getTime()) / 864e5 + M.value * 7;
      return Math.ceil((o + t.getDay() + 1) / 7);
    }, T = () => {
      M.value -= 1;
    }, h = () => {
      M.value += 1;
    }, _ = (a) => {
      const [t, o] = a.split(":").map(Number);
      return { h: t, m: o, totalMinutes: t * 60 + o };
    }, f = (a) => {
      const t = _(a.start), o = _(a.end), l = t.totalMinutes * 40 / 60, v = (o.totalMinutes - t.totalMinutes) * 40 / 60;
      return {
        backgroundColor: a.color || "var(--calendar-primary-color)",
        top: `${l}px`,
        height: `${v}px`,
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 1,
        borderRadius: "var(--event-border-radius)"
      };
    }, g = (a, t) => _(t).totalMinutes - _(a).totalMinutes, R = (a, t) => {
      const o = _(a).totalMinutes + t, l = Math.floor(o / 60).toString().padStart(2, "0"), v = (o % 60).toString().padStart(2, "0");
      return `${l}:${v}`;
    }, se = (a, t) => {
      p.value = t;
    }, le = () => {
      p.value = null;
    }, ie = (a, t) => {
      if (!p.value) return;
      const l = a.currentTarget.getBoundingClientRect(), v = a.clientY - l.top, O = 60 / 40, G = Math.round(v * O / 15) * 15, J = `${String(Math.floor(G / 60)).padStart(2, "0")}:${String(G % 60).padStart(2, "0")}`, pe = g(p.value.start, p.value.end), ve = R(J, pe), K = q(t), Q = {
        ...p.value,
        start: J,
        end: ve,
        date: K
      };
      b("update-event", Q);
      const Z = p.value.date;
      c.value[Z] = c.value[Z]?.filter((me) => me.id !== p.value.id) || [], c.value[K] = [...c.value[K] || [], Q], p.value = null;
    }, de = (a) => {
      b("show-info", a);
    }, ue = () => {
      b("close-popup");
    }, re = (a) => {
      b("handle-delete", a);
    }, ce = (a) => {
      b("update-event", a);
    };
    return ge(() => {
      if (!n.schedules.length) {
        c.value = {};
        return;
      }
      c.value = {}, n.schedules.forEach((a) => {
        const t = a.date;
        c.value[t] || (c.value[t] = []), c.value[t].push(a);
      });
    }), ye(() => {
      n.additionalFields.forEach((t) => {
        u.value[t.model] = "";
      }), window.matchMedia?.("(prefers-color-scheme: dark)")?.matches && (r.value = !0);
    }), $({
      newEvent: u,
      addEvent: N,
      resetForm: F
    }), (a, t) => (i(), d("div", {
      class: _e(["calendar-theme", y.customClass, { dark: r.value }]),
      style: H(y.customStyles)
    }, [
      oe(a.$slots, "form", {
        newEvent: u.value,
        addEvent: N,
        additionalFields: W.value,
        labels: s.value,
        resetForm: F
      }, () => [
        e("form", {
          class: "form-container",
          onSubmit: ae(N, ["prevent"])
        }, [
          (i(!0), d(C, null, E(W.value, (o) => (i(), d("div", {
            key: o.id,
            class: "form-group"
          }, [
            e("label", {
              for: o.id,
              class: "form-label"
            }, m(o.label) + ":", 9, Oe),
            o.type === "select" ? (i(), d("div", Ye, [
              A(e("select", {
                id: o.id,
                "onUpdate:modelValue": (l) => u.value[o.model] = l,
                required: "",
                class: "form-select"
              }, [
                (i(!0), d(C, null, E(o.options, (l) => (i(), d("option", {
                  key: l.id,
                  value: l
                }, m(l.name || `${l.first_name} ${l.last_name}`), 9, Ke))), 128))
              ], 8, je), [
                [Le, u.value[o.model]]
              ])
            ])) : (i(), d("div", Xe, [
              A(e("input", {
                id: o.id,
                "onUpdate:modelValue": (l) => u.value[o.model] = l,
                type: o.type,
                required: "",
                class: "form-input"
              }, null, 8, He), [
                [we, u.value[o.model]]
              ])
            ]))
          ]))), 128)),
          e("div", Ge, [
            e("label", Je, m(s.value.startTimeLabel) + ":", 1),
            A(e("input", {
              id: "start",
              "onUpdate:modelValue": t[0] || (t[0] = (o) => u.value.start = o),
              type: "time",
              required: "",
              class: "form-input"
            }, null, 512), [
              [I, u.value.start]
            ])
          ]),
          e("div", Qe, [
            e("label", Ze, m(s.value.endTimeLabel) + ":", 1),
            A(e("input", {
              id: "end",
              "onUpdate:modelValue": t[1] || (t[1] = (o) => u.value.end = o),
              type: "time",
              required: "",
              class: "form-input"
            }, null, 512), [
              [I, u.value.end]
            ])
          ]),
          e("div", et, [
            e("label", tt, m(s.value.dateLabel) + ":", 1),
            A(e("input", {
              id: "date",
              "onUpdate:modelValue": t[2] || (t[2] = (o) => u.value.date = o),
              type: "date",
              required: "",
              class: "form-input"
            }, null, 512), [
              [I, u.value.date]
            ])
          ]),
          e("button", ot, m(s.value.submitButtonText), 1)
        ], 32)
      ]),
      e("div", at, [
        e("div", nt, [
          e("button", {
            type: "button",
            class: "arrow-button",
            onClick: T
          }, "<"),
          e("span", st, m(s.value.calendarWeekLabel) + " " + m(j()), 1),
          e("button", {
            type: "button",
            class: "arrow-button",
            onClick: h
          }, ">")
        ]),
        e("div", lt, [
          e("div", it, [
            t[6] || (t[6] = e("div", { class: "empty-slot" }, null, -1)),
            (i(!0), d(C, null, E(P.value, (o) => (i(), d("div", {
              key: o,
              class: "hour"
            }, m(o), 1))), 128))
          ]),
          e("div", dt, [
            e("ul", ut, [
              (i(!0), d(C, null, E(B.value, (o, l) => (i(), d("li", {
                key: l,
                class: "weekday"
              }, [
                e("span", null, m(o), 1),
                e("span", null, m(q(l)), 1)
              ]))), 128))
            ]),
            e("div", rt, [
              (i(), d(C, null, E(7, (o, l) => e("div", {
                key: l,
                class: "day",
                onDragover: t[3] || (t[3] = ae(() => {
                }, ["prevent"])),
                onDrop: (v) => ie(v, l)
              }, [
                (i(!0), d(C, null, E(P.value, (v) => (i(), d("div", {
                  key: v,
                  class: "hour"
                }))), 128)),
                (i(!0), d(C, null, E(c.value[q(l)] || [], (v) => (i(), d("div", {
                  key: v.id,
                  class: "event",
                  style: H(f(v)),
                  draggable: "true",
                  onDragstart: (O) => se(O, v),
                  onDragend: le
                }, [
                  e("span", {
                    style: H({ color: S.value, fontSize: V.value })
                  }, m(v.title), 5),
                  t[7] || (t[7] = e("br", null, null, -1)),
                  e("button", {
                    type: "button",
                    class: "info-button",
                    onClick: (O) => de(v)
                  }, [
                    e("img", {
                      src: L(Re),
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
      a.$slots["popup-calendar"] ? oe(a.$slots, "popup-calendar", { key: 0 }) : (i(), De(qe, {
        key: 1,
        visible: Y.value,
        eventData: U.value,
        popupFields: y.popupFields || [],
        closeButtonText: "Close",
        todosLabel: s.value.todosLabel || "To-Do",
        participantsLabel: s.value.participantsLabel || "Teammates",
        todos: U.value?.todos || [],
        participants: U.value?.participants || [],
        todoPlaceholder: x.value.todo || "New To-do...",
        participantPlaceholder: x.value.participant || "Add Participant...",
        "onUpdate:todos": t[4] || (t[4] = (o) => b("update:todos", o)),
        "onUpdate:participants": t[5] || (t[5] = (o) => b("update:participants", o)),
        onClosePopup: ue,
        onHandleDelete: re,
        onUpdateEvent: ce
      }, null, 8, ["visible", "eventData", "popupFields", "todosLabel", "participantsLabel", "todos", "participants", "todoPlaceholder", "participantPlaceholder"]))
    ], 6));
  }
});
export {
  ft as ScheduleForm,
  ft as default
};
