import { computed as y, ref as F, watch as ie, defineComponent as Wt, resolveComponent as re, openBlock as i, createElementBlock as r, withModifiers as rt, createElementVNode as o, normalizeStyle as K, unref as c, withDirectives as V, vModelText as O, toDisplayString as m, createCommentVNode as M, createVNode as R, createTextVNode as Vt, Fragment as I, renderList as N, withKeys as xt, isRef as Ot, useSlots as de, watchEffect as Bt, onMounted as ue, onBeforeUnmount as ce, normalizeClass as ct, renderSlot as Tt, vModelSelect as pe, vModelDynamic as ve, createBlock as me } from "vue";
function fe(v, _) {
  const T = y(() => v.popupFields || []), s = F({ ...v.eventData }), p = F([...v.eventData?.todos || []]), L = F([...v.eventData?.participants || []]);
  ie(() => v.eventData, (w) => {
    w && (s.value = { ...w }, p.value = [...w.todos || []], L.value = [...w.participants || []]);
  }, { immediate: !0 });
  const D = (w) => w.replace(/_/g, " ").replace(/\b\w/g, (W) => W.toUpperCase()), u = y(() => T.value.length === 0 ? s.value : Object.fromEntries(
    Object.entries(s.value).filter(([w]) => T.value.includes(w))
  )), l = (w, W) => {
    s.value[w] = W, _("updateEvent", s.value);
  }, U = F(""), B = () => {
    const w = U.value.trim();
    w && (p.value.push(w), U.value = "", _("update:todos", { todos: [...p.value], eventId: s.value.id }));
  }, g = (w) => {
    p.value.splice(w, 1), _("update:todos", { todos: [...p.value], eventId: s.value.id });
  }, z = F("");
  return {
    editableEventData: s,
    popupFields: T,
    filteredEventData: u,
    formatKey: D,
    updateField: l,
    // Todos
    localTodos: p,
    newTodo: U,
    addTodo: B,
    removeTodo: g,
    // Participants
    localParticipants: L,
    newParticipant: z,
    addParticipant: () => {
      const w = z.value.trim();
      w && (L.value.push(w), z.value = "", _("update:participants", { participants: [...L.value], eventId: s.value.id }));
    },
    removeParticipant: (w) => {
      L.value.splice(w, 1), _("update:participants", { participants: [...L.value], eventId: s.value.id });
    }
  };
}
const he = { class: "popup-header-text" }, ye = {
  key: 1,
  class: "popup-title"
}, be = {
  key: 2,
  class: "popup-header-time"
}, ge = { class: "popup-header-actions" }, we = {
  key: 0,
  class: "popup-meta"
}, ke = {
  key: 0,
  class: "meta-row meta-row--editable meta-row--datetime"
}, _e = {
  key: 1,
  class: "meta-row"
}, Te = {
  key: 0,
  class: "meta-time"
}, De = {
  key: 2,
  class: "meta-row meta-row--editable"
}, Se = {
  key: 3,
  class: "meta-row"
}, Ce = ["href"], $e = {
  key: 4,
  class: "meta-row meta-row--editable"
}, Me = {
  key: 1,
  class: "popup-description-wrap"
}, Le = { class: "popup-description" }, Ee = {
  key: 2,
  class: "popup-section"
}, Ue = { class: "popup-label" }, Pe = ["onUpdate:modelValue", "placeholder"], Ae = { class: "popup-section" }, Fe = { class: "section-header" }, Ye = { class: "section-label" }, Ie = {
  key: 0,
  class: "chips"
}, Ne = ["onClick"], Ve = {
  key: 1,
  class: "input-row"
}, xe = ["placeholder"], Oe = { class: "popup-section" }, Be = { class: "section-header" }, ze = { class: "section-label" }, We = {
  key: 0,
  class: "todo-list"
}, Re = { class: "todo-text" }, Xe = ["onClick"], je = {
  key: 1,
  class: "input-row"
}, He = ["placeholder"], qe = {
  key: 3,
  class: "popup-footer"
}, Ke = /* @__PURE__ */ Wt({
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
    participantPlaceholder: {},
    readonly: { type: Boolean },
    createMode: { type: Boolean }
  },
  emits: ["submit-event", "handle-delete", "update-event", "show-info", "close-popup", "update:todos", "update:participants"],
  setup(v, { emit: _ }) {
    const T = v, s = y(() => T.readonly ?? !1), p = y(() => T.createMode ?? !1), L = y(() => T.todosLabel || "To-Do"), D = y(() => T.participantsLabel || "Teilnehmer"), u = _, {
      editableEventData: l,
      filteredEventData: U,
      formatKey: B,
      localTodos: g,
      newTodo: z,
      addTodo: j,
      localParticipants: X,
      newParticipant: w,
      addParticipant: W
    } = fe(T, u), mt = /* @__PURE__ */ new Set([
      "id",
      "title",
      "date",
      "start",
      "end",
      "startsAt",
      "endsAt",
      "color",
      "location",
      "link",
      "organizer",
      "description",
      "info",
      "todos",
      "participants",
      "allDay",
      "source",
      "editable",
      "reminderMinutes",
      "recurrence"
    ]), dt = y(
      () => Object.fromEntries(
        Object.entries(U.value).filter(
          ([b]) => b !== "title" && !mt.has(b)
        )
      )
    ), ut = y(() => {
      const b = l.value;
      if (b.date) {
        const [f, $, h] = b.date.split("-").map(Number);
        return new Intl.DateTimeFormat(void 0, { day: "numeric", month: "long", year: "numeric" }).format(new Date(f, $ - 1, h));
      }
      return b.startsAt ? new Intl.DateTimeFormat(void 0, { day: "numeric", month: "long", year: "numeric" }).format(new Date(b.startsAt)) : "";
    }), k = y(() => {
      const b = l.value;
      if (b.start && b.end) return `${b.start} – ${b.end}`;
      if (b.startsAt && b.endsAt) {
        const f = new Intl.DateTimeFormat(void 0, { hour: "2-digit", minute: "2-digit" });
        return `${f.format(new Date(b.startsAt))} – ${f.format(new Date(b.endsAt))}`;
      }
      return "";
    }), nt = () => u("close-popup"), Y = () => u("handle-delete", T.eventData.id), ft = () => {
      const b = {
        ...l.value,
        todos: g.value,
        participants: X.value
      };
      p.value ? u("submit-event", b) : (u("update-event", b), u("update:todos", { todos: g.value, eventId: T.eventData.id }), u("update:participants", { participants: X.value, eventId: T.eventData.id })), u("close-popup");
    }, P = F(null), Q = { x: 0, y: 0 }, ht = (b) => {
      if (b.target.closest("input, textarea, button, a, select") || !P.value) return;
      const $ = P.value;
      Q.x = b.clientX - $.getBoundingClientRect().left, Q.y = b.clientY - $.getBoundingClientRect().top;
      const h = (Z) => {
        $.style.left = `${Z.clientX - Q.x}px`, $.style.top = `${Z.clientY - Q.y}px`, $.style.position = "absolute", $.style.transform = "none";
      }, A = () => {
        window.removeEventListener("mousemove", h), window.removeEventListener("mouseup", A);
      };
      window.addEventListener("mousemove", h), window.addEventListener("mouseup", A);
    }, yt = (b) => {
      g.value.splice(b, 1), u("update:todos", { todos: [...g.value], eventId: l.value.id });
    }, ot = (b) => {
      X.value.splice(b, 1), u("update:participants", { participants: [...X.value], eventId: l.value.id });
    };
    return (b, f) => {
      const $ = re("font-awesome-icon");
      return v.visible ? (i(), r("div", {
        key: 0,
        class: "popup",
        onClick: rt(nt, ["self"])
      }, [
        o("div", {
          class: "popup-content",
          ref_key: "popupRef",
          ref: P,
          onMousedown: ht
        }, [
          o("div", {
            class: "popup-header",
            style: K({ borderLeftColor: c(l).color || "var(--accent-color)" })
          }, [
            o("div", he, [
              p.value ? V((i(), r("input", {
                key: 0,
                "onUpdate:modelValue": f[0] || (f[0] = (h) => c(l).title = h),
                class: "popup-title-input",
                placeholder: "Titel…",
                autofocus: ""
              }, null, 512)), [
                [O, c(l).title]
              ]) : (i(), r("h2", ye, m(c(l).title), 1)),
              k.value && !p.value ? (i(), r("span", be, m(k.value), 1)) : M("", !0)
            ]),
            o("div", ge, [
              !s.value && !p.value ? (i(), r("button", {
                key: 0,
                class: "icon-button danger",
                onClick: Y,
                title: "Löschen"
              }, [
                R($, { icon: ["fas", "trash"] })
              ])) : M("", !0),
              o("button", {
                class: "icon-button",
                onClick: nt,
                title: "Schließen"
              }, [
                R($, { icon: ["fas", "times"] })
              ])
            ])
          ], 4),
          c(l).date || c(l).startsAt || c(l).location || c(l).link || c(l).organizer ? (i(), r("div", we, [
            c(l).date != null ? (i(), r("div", ke, [
              R($, {
                icon: ["fas", "calendar-days"],
                class: "meta-icon"
              }),
              V(o("input", {
                "onUpdate:modelValue": f[1] || (f[1] = (h) => c(l).date = h),
                type: "date",
                class: "meta-input meta-input--date"
              }, null, 512), [
                [O, c(l).date]
              ]),
              V(o("input", {
                "onUpdate:modelValue": f[2] || (f[2] = (h) => c(l).start = h),
                type: "time",
                class: "meta-input meta-input--time"
              }, null, 512), [
                [O, c(l).start]
              ]),
              f[12] || (f[12] = o("span", { class: "meta-time-sep" }, "–", -1)),
              V(o("input", {
                "onUpdate:modelValue": f[3] || (f[3] = (h) => c(l).end = h),
                type: "time",
                class: "meta-input meta-input--time"
              }, null, 512), [
                [O, c(l).end]
              ])
            ])) : c(l).startsAt ? (i(), r("div", _e, [
              R($, {
                icon: ["fas", "calendar-days"],
                class: "meta-icon"
              }),
              o("span", null, [
                Vt(m(ut.value), 1),
                k.value ? (i(), r("span", Te, ", " + m(k.value), 1)) : M("", !0)
              ])
            ])) : M("", !0),
            c(l).location ? (i(), r("div", De, [
              R($, {
                icon: ["fas", "location-dot"],
                class: "meta-icon"
              }),
              V(o("input", {
                "onUpdate:modelValue": f[4] || (f[4] = (h) => c(l).location = h),
                class: "meta-input",
                placeholder: "Location"
              }, null, 512), [
                [O, c(l).location]
              ])
            ])) : M("", !0),
            c(l).link ? (i(), r("div", Se, [
              R($, {
                icon: ["fas", "link"],
                class: "meta-icon"
              }),
              o("a", {
                href: c(l).link,
                target: "_blank",
                rel: "noopener noreferrer",
                class: "popup-link"
              }, m(c(l).link), 9, Ce)
            ])) : M("", !0),
            c(l).organizer ? (i(), r("div", $e, [
              R($, {
                icon: ["fas", "user"],
                class: "meta-icon"
              }),
              V(o("input", {
                "onUpdate:modelValue": f[5] || (f[5] = (h) => c(l).organizer = h),
                class: "meta-input",
                placeholder: "Organizer"
              }, null, 512), [
                [O, c(l).organizer]
              ])
            ])) : M("", !0)
          ])) : M("", !0),
          c(l).description || c(l).info ? (i(), r("div", Me, [
            o("p", Le, m(c(l).description || c(l).info), 1)
          ])) : M("", !0),
          Object.keys(dt.value).length ? (i(), r("div", Ee, [
            (i(!0), r(I, null, N(dt.value, (h, A) => (i(), r("div", {
              key: A,
              class: "popup-field"
            }, [
              o("label", Ue, m(c(B)(String(A))), 1),
              V(o("input", {
                "onUpdate:modelValue": (Z) => c(l)[A] = Z,
                class: "popup-input",
                placeholder: c(B)(String(A))
              }, null, 8, Pe), [
                [O, c(l)[A]]
              ])
            ]))), 128))
          ])) : M("", !0),
          o("div", Ae, [
            o("div", Fe, [
              R($, {
                icon: ["fas", "users"],
                class: "section-icon"
              }),
              o("span", Ye, m(D.value), 1)
            ]),
            c(X).length ? (i(), r("div", Ie, [
              (i(!0), r(I, null, N(c(X), (h, A) => (i(), r("span", {
                key: A,
                class: "chip"
              }, [
                Vt(m(h) + " ", 1),
                o("button", {
                  class: "chip-remove",
                  onClick: (Z) => ot(A),
                  title: "Entfernen"
                }, "×", 8, Ne)
              ]))), 128))
            ])) : M("", !0),
            s.value ? M("", !0) : (i(), r("div", Ve, [
              V(o("input", {
                "onUpdate:modelValue": f[6] || (f[6] = (h) => Ot(w) ? w.value = h : null),
                placeholder: v.participantPlaceholder || "Teilnehmer hinzufügen…",
                class: "popup-input",
                onKeyup: f[7] || (f[7] = xt(
                  //@ts-ignore
                  (...h) => c(W) && c(W)(...h),
                  ["enter"]
                ))
              }, null, 40, xe), [
                [O, c(w)]
              ]),
              o("button", {
                class: "add-inline-button",
                onClick: f[8] || (f[8] = //@ts-ignore
                (...h) => c(W) && c(W)(...h)),
                title: "Hinzufügen"
              }, [
                R($, { icon: ["fas", "user-plus"] })
              ])
            ]))
          ]),
          o("div", Oe, [
            o("div", Be, [
              R($, {
                icon: ["fas", "list-check"],
                class: "section-icon"
              }),
              o("span", ze, m(L.value), 1)
            ]),
            c(g).length ? (i(), r("ul", We, [
              (i(!0), r(I, null, N(c(g), (h, A) => (i(), r("li", {
                key: A,
                class: "todo-item"
              }, [
                f[13] || (f[13] = o("span", { class: "todo-bullet" }, null, -1)),
                o("span", Re, m(h), 1),
                o("button", {
                  class: "todo-remove",
                  onClick: (Z) => yt(A),
                  title: "Entfernen"
                }, [
                  R($, { icon: ["fas", "trash"] })
                ], 8, Xe)
              ]))), 128))
            ])) : M("", !0),
            s.value ? M("", !0) : (i(), r("div", je, [
              V(o("input", {
                "onUpdate:modelValue": f[9] || (f[9] = (h) => Ot(z) ? z.value = h : null),
                placeholder: v.todoPlaceholder || "Neue Aufgabe…",
                class: "popup-input",
                onKeyup: f[10] || (f[10] = xt(
                  //@ts-ignore
                  (...h) => c(j) && c(j)(...h),
                  ["enter"]
                ))
              }, null, 40, He), [
                [O, c(z)]
              ]),
              o("button", {
                class: "add-inline-button",
                onClick: f[11] || (f[11] = //@ts-ignore
                (...h) => c(j) && c(j)(...h)),
                title: "Hinzufügen"
              }, [
                R($, { icon: ["fas", "plus"] })
              ])
            ]))
          ]),
          !s.value || p.value ? (i(), r("div", qe, [
            o("button", {
              class: "save-button",
              onClick: ft
            }, m(p.value ? "Erstellen" : "Speichern"), 1)
          ])) : M("", !0)
        ], 544)
      ])) : M("", !0);
    };
  }
});
function et(v, _) {
  const T = new Intl.DateTimeFormat("en-US", {
    timeZone: _,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1
  }), s = {};
  for (const U of T.formatToParts(v))
    U.type !== "literal" && (s[U.type] = U.value);
  const p = Number(s.year), L = Number(s.month), D = Number(s.day), u = Number(s.hour) % 24, l = Number(s.minute);
  return {
    year: p,
    month: L,
    day: D,
    hour: u,
    minute: l,
    ymd: `${s.year}-${s.month}-${s.day}`,
    minutesOfDay: u * 60 + l
  };
}
function pt(v, _) {
  return et(v, _).ymd;
}
function q(v, _) {
  return et(v, _).minutesOfDay;
}
function lt(v, _) {
  const T = et(v, _);
  return `${String(T.hour).padStart(2, "0")}:${String(T.minute).padStart(2, "0")}`;
}
function zt(v, _) {
  const T = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1
  }), s = new Intl.DateTimeFormat("en-US", {
    timeZone: _,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1
  }), p = (L) => {
    const D = {};
    for (const u of L.formatToParts(v))
      u.type !== "literal" && (D[u.type] = Number(u.value));
    return Date.UTC(
      D.year,
      D.month - 1,
      D.day,
      D.hour % 24,
      D.minute,
      D.second
    );
  };
  return Math.round((p(s) - p(T)) / 6e4);
}
function it(v, _, T, s, p, L) {
  const D = Date.UTC(
    v,
    _ - 1,
    T,
    s,
    p,
    0
  ), u = new Date(D), l = zt(u, L), U = D - l * 6e4, B = new Date(U), g = zt(B, L);
  return g !== l ? new Date(
    D - g * 6e4
  ) : B;
}
function Ze(v, _, T = 1) {
  const s = et(
    v,
    _
  ), p = new Intl.DateTimeFormat("en-US", {
    timeZone: _,
    weekday: "short"
  }).format(v), D = ([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ].indexOf(p) - T + 7) % 7, u = Date.UTC(
    s.year,
    s.month - 1,
    s.day,
    12,
    0,
    0
  ), l = new Date(
    u - D * 864e5
  ), U = l.getUTCFullYear(), B = String(
    l.getUTCMonth() + 1
  ).padStart(2, "0"), g = String(
    l.getUTCDate()
  ).padStart(2, "0");
  return `${U}-${B}-${g}`;
}
function vt(v, _) {
  const [T, s, p] = v.split("-").map(Number), L = Date.UTC(
    T,
    s - 1,
    p,
    12,
    0,
    0
  ), D = new Date(
    L + _ * 864e5
  ), u = D.getUTCFullYear(), l = String(
    D.getUTCMonth() + 1
  ).padStart(2, "0"), U = String(
    D.getUTCDate()
  ).padStart(2, "0");
  return `${u}-${l}-${U}`;
}
function Ge(v) {
  const [_, T, s] = v.split("-").map(Number);
  return new Date(
    Date.UTC(
      _,
      T - 1,
      s,
      12
    )
  ).getUTCDay();
}
function Je(v, _) {
  return new Date(
    Date.UTC(
      v,
      _,
      0
    )
  ).getUTCDate();
}
function Qe(v, _, T) {
  const s = `${v}-${String(_).padStart(2, "0")}-01`, p = (Ge(s) - T + 7) % 7, L = vt(
    s,
    -p
  );
  return Array.from(
    { length: 42 },
    (D, u) => vt(
      L,
      u
    )
  );
}
const tn = { class: "form-group form-group--full" }, en = {
  for: "title",
  class: "form-label"
}, nn = ["placeholder"], an = ["for"], on = { key: 0 }, sn = ["id", "onUpdate:modelValue"], ln = ["value"], rn = { key: 1 }, dn = ["id", "onUpdate:modelValue", "type"], un = { class: "form-group" }, cn = {
  for: "start",
  class: "form-label"
}, pn = { class: "form-group" }, vn = {
  for: "end",
  class: "form-label"
}, mn = { class: "form-group" }, fn = {
  for: "date",
  class: "form-label"
}, hn = {
  type: "submit",
  class: "submit-button"
}, yn = { class: "calendar" }, bn = { class: "navigation" }, gn = { class: "current-week" }, wn = { class: "view-toggle" }, kn = {
  key: 0,
  class: "week-scroll-wrapper"
}, _n = { class: "hours-and-days" }, Tn = { class: "hours" }, Dn = {
  key: 0,
  class: "allday-spacer"
}, Sn = { class: "weekdays-container" }, Cn = { class: "weekdays" }, $n = {
  key: 0,
  class: "allday-row"
}, Mn = ["onClick"], Ln = { class: "days" }, En = ["data-ymd", "onClick"], Un = ["onPointerdown", "onClick"], Pn = { class: "event-inner" }, An = { class: "event-time-label" }, Fn = { class: "event-meta-row" }, Yn = {
  key: 0,
  class: "event-meta-badge"
}, In = {
  key: 1,
  class: "event-meta-badge event-meta-badge--link"
}, Nn = {
  key: 2,
  class: "event-meta-badge"
}, Vn = {
  key: 1,
  class: "month-view"
}, xn = { class: "month-weekdays" }, On = { class: "month-grid" }, Bn = ["data-ymd", "onClick"], zn = ["onClick"], Wn = { class: "month-events" }, Rn = ["onPointerdown", "onClick"], Xn = { class: "month-chip-time" }, jn = { class: "month-chip-title" }, Hn = ["onClick"], Dt = 3, qn = 4, J = 40, Gn = /* @__PURE__ */ Wt({
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
    popupEvent: { default: null },
    timeZone: { default: () => Intl.DateTimeFormat().resolvedOptions().timeZone },
    weekStartsOn: { default: 1 },
    view: { default: void 0 },
    readonly: { type: Boolean, default: !1 }
  },
  emits: ["submit-event", "handle-delete", "update-event", "show-info", "close-popup", "update:todos", "update:participants", "update:view", "slot-click", "range-change"],
  setup(v, { expose: _, emit: T }) {
    const s = v, p = T;
    de();
    const L = F(!1), D = F({}), u = F({
      start: "",
      end: "",
      date: "",
      color: "",
      title: "",
      description: ""
    }), l = F(/* @__PURE__ */ new Date()), U = F("week"), B = F(
      Array.from({ length: 24 }, (t, e) => e.toString().padStart(2, "0") + ":00")
    ), g = F(null);
    let z = !1;
    const j = F(-1);
    let X = null;
    const w = F(!1), W = F({
      id: 0,
      title: "",
      date: "",
      start: "",
      end: "",
      color: "",
      todos: [],
      participants: []
    }), mt = y(() => s.eventTitleColor), dt = y(() => s.eventTitleSize), ut = y(() => s.additionalFields), k = y(() => s.timeZone), nt = y(() => s.weekStartsOn), Y = y({
      get: () => s.view ?? U.value,
      set: (t) => {
        U.value = t, p("update:view", t);
      }
    }), ft = y(() => {
      const t = s.weekdays;
      return nt.value === 1 ? t : [t[6], ...t.slice(0, 6)];
    }), P = y(() => ({
      startTimeLabel: s.labelsAndSettings?.startTimeLabel || "Start Time",
      endTimeLabel: s.labelsAndSettings?.endTimeLabel || "End Time",
      dateLabel: s.labelsAndSettings?.dateLabel || "Date",
      submitButtonText: s.labelsAndSettings?.submitButtonText || "Add Entry",
      calendarWeekLabel: s.labelsAndSettings?.calendarWeekLabel || "CW",
      todosLabel: s.labelsAndSettings?.todosLabel,
      participantsLabel: s.labelsAndSettings?.participantsLabel,
      weekViewLabel: s.labelsAndSettings?.weekViewLabel || "Week",
      monthViewLabel: s.labelsAndSettings?.monthViewLabel || "Month",
      titleLabel: s.labelsAndSettings?.titleLabel || "Title",
      todayButtonLabel: s.labelsAndSettings?.todayButtonLabel || "Today"
    })), Q = y(() => s.placeholderSettings || {});
    y(() => s.popupVisible), y(() => s.popupEvent);
    const ht = y(() => w.value), yt = y(() => s.popupVisible || w.value), ot = y(
      () => w.value ? W.value : s.popupEvent ?? { id: 0, title: "" }
    ), b = y(
      () => Ze(l.value, k.value, nt.value)
    ), f = y(() => Y.value === "month" ? new Intl.DateTimeFormat(void 0, {
      month: "long",
      year: "numeric",
      timeZone: k.value
    }).format(l.value) : `${P.value.calendarWeekLabel} ${Ht()}`), $ = y(() => {
      const t = et(l.value, k.value), e = Qe(t.year, t.month, nt.value), n = pt(/* @__PURE__ */ new Date(), k.value);
      return e.map((a) => {
        const [, d, E] = a.split("-").map(Number);
        return {
          ymd: a,
          day: E,
          inMonth: d === t.month,
          isToday: a === n,
          events: D.value[a] ?? []
        };
      });
    }), h = y(
      () => $.value.slice(0, 7).map((t) => {
        const [e, n, a] = t.ymd.split("-").map(Number);
        return new Intl.DateTimeFormat(void 0, {
          weekday: "short",
          timeZone: "UTC"
        }).format(new Date(Date.UTC(e, n - 1, a, 12)));
      })
    ), A = y(() => !!g.value?.active), Z = y(() => {
      const t = g.value;
      if (!t || !t.active || t.mode !== "week") return {};
      const e = t.previewStartMin * J / 60, n = Math.max(t.durationMin, 15) * J / 60;
      return {
        position: "absolute",
        top: `${e}px`,
        height: `${n}px`,
        left: 0,
        right: 0,
        opacity: 0.55,
        pointerEvents: "none",
        borderRadius: "var(--event-border-radius)",
        background: t.event.color || "var(--calendar-primary-color)",
        zIndex: 5
      };
    }), St = y(() => {
      const t = g.value;
      if (!t || !t.active) return "";
      if (t.mode === "week") {
        const d = t.previewStartMin + t.durationMin;
        return `${Ct(t.previewStartMin)} – ${Ct(d)}`;
      }
      const [e, n, a] = t.previewYmd.split("-").map(Number);
      return new Intl.DateTimeFormat(void 0, {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        timeZone: "UTC"
      }).format(new Date(Date.UTC(e, n - 1, a, 12)));
    });
    function tt(t) {
      if (t.startsAt && t.endsAt) {
        const e = new Date(t.startsAt), n = new Date(t.endsAt);
        if (!isNaN(e.getTime()) && !isNaN(n.getTime()))
          return { start: e, end: n };
      }
      if (t.date && t.start && t.end) {
        const [e, n, a] = t.date.split("-").map(Number), [d, E] = t.start.split(":").map(Number), [S, C] = t.end.split(":").map(Number);
        return {
          start: it(e, n, a, d, E, k.value),
          end: it(e, n, a, S, C, k.value)
        };
      }
      return null;
    }
    function Ct(t) {
      const e = Math.max(0, Math.min(t, 1439)), n = String(Math.floor(e / 60)).padStart(2, "0"), a = String(e % 60).padStart(2, "0");
      return `${n}:${a}`;
    }
    function Rt(t) {
      const e = t.map((S) => {
        const C = tt(S);
        return C ? {
          id: S.id,
          start: q(C.start, k.value),
          end: q(C.end, k.value)
        } : null;
      }).filter((S) => S !== null).sort((S, C) => S.start - C.start || S.end - C.end), n = {};
      let a = [], d = -1 / 0;
      const E = (S) => {
        const C = [], x = {};
        for (const G of S) {
          let Nt = !1;
          for (let st = 0; st < C.length; st++)
            if (C[st] <= G.start) {
              C[st] = G.end, x[G.id] = st, Nt = !0;
              break;
            }
          Nt || (C.push(G.end), x[G.id] = C.length - 1);
        }
        const at = C.length;
        for (const G of S)
          n[G.id] = { col: x[G.id], cols: at };
      };
      for (const S of e)
        a.length && S.start >= d && (E(a), a = [], d = -1 / 0), a.push(S), d = Math.max(d, S.end);
      return a.length && E(a), n;
    }
    const Xt = y(() => pt(/* @__PURE__ */ new Date(), k.value)), bt = y(() => {
      const t = {};
      for (const [e, n] of Object.entries(D.value)) {
        const a = n.filter((d) => !d.allDay);
        a.length && (t[e] = a);
      }
      return t;
    }), $t = y(() => {
      const t = {};
      for (const [e, n] of Object.entries(D.value)) {
        const a = n.filter((d) => d.allDay);
        a.length && (t[e] = a);
      }
      return t;
    }), Mt = y(
      () => Array.from({ length: 7 }, (t, e) => H(e)).some((t) => ($t.value[t] ?? []).length > 0)
    ), jt = y(() => {
      const t = {};
      for (const e of Object.keys(bt.value))
        Object.assign(t, Rt(bt.value[e]));
      return t;
    }), gt = () => {
      u.value = {
        start: "",
        end: "",
        date: "",
        color: "",
        title: "",
        description: ""
      }, s.additionalFields.forEach((t) => {
        u.value[t.model] = "";
      });
    }, wt = (t) => {
      const e = t || u.value, n = {
        title: e.title,
        start: e.start,
        end: e.end,
        date: e.date,
        info: e.info,
        color: e.color,
        description: e.description
      };
      s.additionalFields.forEach((a) => {
        n[a.model] = e[a.model];
      }), p("submit-event", n), gt();
    }, H = (t) => vt(b.value, t), Ht = () => {
      const t = et(l.value, k.value), e = new Date(Date.UTC(t.year, 0, 1)), a = (new Date(Date.UTC(t.year, t.month - 1, t.day)).getTime() - e.getTime()) / 864e5;
      return Math.ceil((a + e.getUTCDay() + 1) / 7);
    }, Lt = (t) => {
      l.value = new Date(l.value.getTime() + t * 7 * 864e5);
    }, Et = (t) => {
      const e = et(l.value, k.value);
      let n = e.month + t, a = e.year;
      for (; n > 12; )
        n -= 12, a += 1;
      for (; n < 1; )
        n += 12, a -= 1;
      const d = Math.min(e.day, Je(a, n));
      l.value = it(a, n, d, 12, 0, k.value);
    }, qt = () => Y.value === "month" ? Et(-1) : Lt(-1), Kt = () => Y.value === "month" ? Et(1) : Lt(1), Ut = (t) => {
      const [e, n, a] = t.split("-").map(Number);
      l.value = it(e, n, a, 12, 0, k.value), Y.value = "week";
    }, Zt = (t) => {
      const e = tt(t);
      if (!e) return { display: "none" };
      const n = q(e.start, k.value), a = q(e.end, k.value), d = n * J / 60, E = Math.max(a - n, 15) * J / 60, S = jt.value[t.id] ?? { col: 0, cols: 1 }, C = 100 / S.cols, x = C * S.col, at = g.value?.active && g.value.event.id === t.id;
      return {
        backgroundColor: t.color || "var(--calendar-primary-color)",
        top: `${d}px`,
        height: `${E}px`,
        position: "absolute",
        left: `${x}%`,
        width: `calc(${C}% - 4px)`,
        right: "auto",
        zIndex: 1,
        opacity: at ? 0.35 : 1,
        borderRadius: "var(--event-border-radius)"
      };
    }, Gt = (t) => {
      const e = tt(t);
      return e ? lt(e.start, k.value) : "";
    }, Pt = (t) => {
      const e = tt(t);
      return e ? `${lt(e.start, k.value)} – ${lt(e.end, k.value)}` : "";
    }, Jt = () => {
      l.value = /* @__PURE__ */ new Date();
    }, Qt = (t, e) => {
      if (s.readonly || z || t.target.closest(".event, .allday-chip")) return;
      const a = t.currentTarget.getBoundingClientRect(), d = (t.clientY - a.top) / J * 60, E = Math.round(d / 15) * 15, S = Math.max(0, Math.min(E, 1410)), C = Math.min(S + 60, 1440), x = (at) => `${String(Math.floor(at / 60)).padStart(2, "0")}:${String(at % 60).padStart(2, "0")}`;
      u.value.date = e, u.value.start = x(S), u.value.end = x(C), W.value = {
        id: 0,
        title: "",
        date: e,
        start: x(S),
        end: x(C),
        color: "",
        todos: [],
        participants: []
      }, w.value = !0, p("slot-click", { date: e, start: x(S), end: x(C) });
    }, te = (t, e) => {
      s.readonly || t.target.closest(".month-chip, .month-daynum, .month-more") || (u.value.date = e, W.value = {
        id: 0,
        title: "",
        date: e,
        start: "",
        end: "",
        color: "",
        todos: [],
        participants: []
      }, w.value = !0, p("slot-click", { date: e }));
    }, At = (t, e, n) => {
      if (t.button !== 0 && t.pointerType === "mouse") return;
      const a = tt(e);
      if (!a) return;
      const d = q(a.start, k.value), E = q(a.end, k.value), C = t.currentTarget.getBoundingClientRect(), x = t.clientY - C.top;
      g.value = {
        event: e,
        pointerId: t.pointerId,
        startX: t.clientX,
        startY: t.clientY,
        grabOffsetMinutes: Y.value === "week" ? x * 60 / J : 0,
        durationMin: E - d,
        mode: Y.value,
        active: !1,
        previewYmd: n,
        previewStartMin: d,
        cursorX: t.clientX,
        cursorY: t.clientY
      }, window.addEventListener("pointermove", Ft), window.addEventListener("pointerup", Yt), window.addEventListener("pointercancel", It);
    }, Ft = (t) => {
      const e = g.value;
      if (!e || t.pointerId !== e.pointerId) return;
      if (!e.active) {
        const d = t.clientX - e.startX, E = t.clientY - e.startY;
        if (Math.hypot(d, E) < qn) return;
        e.active = !0;
      }
      t.preventDefault(), e.cursorX = t.clientX, e.cursorY = t.clientY;
      const a = document.elementFromPoint(t.clientX, t.clientY)?.closest("[data-ymd]");
      if (a && (e.previewYmd = a.getAttribute("data-ymd"), e.mode === "week")) {
        const d = a.getBoundingClientRect(), S = (t.clientY - d.top) * 60 / J - e.grabOffsetMinutes, C = Math.max(0, Math.min(S, 1440 - e.durationMin));
        e.previewStartMin = Math.round(C / 15) * 15;
      }
    }, Yt = (t) => {
      const e = g.value;
      !e || t.pointerId !== e.pointerId || (kt(), e.active && (ee(e), z = !0, setTimeout(() => {
        z = !1;
      }, 50)), g.value = null);
    }, It = () => {
      kt(), g.value = null;
    }, kt = () => {
      window.removeEventListener("pointermove", Ft), window.removeEventListener("pointerup", Yt), window.removeEventListener("pointercancel", It);
    }, ee = (t) => {
      const [e, n, a] = t.previewYmd.split("-").map(Number);
      let d;
      if (t.mode === "week")
        d = t.previewStartMin;
      else {
        const C = tt(t.event);
        if (!C) return;
        d = q(C.start, k.value);
      }
      const E = it(
        e,
        n,
        a,
        Math.floor(d / 60),
        d % 60,
        k.value
      ), S = new Date(E.getTime() + t.durationMin * 6e4);
      ne(t.event, E, S);
    }, ne = (t, e, n) => {
      p("update-event", {
        ...t,
        startsAt: e.toISOString(),
        endsAt: n.toISOString(),
        date: pt(e, k.value),
        start: lt(e, k.value),
        end: lt(n, k.value)
      });
    }, _t = (t) => {
      z || p("show-info", t);
    }, ae = () => {
      w.value ? w.value = !1 : p("close-popup");
    }, oe = (t) => {
      w.value = !1, p("submit-event", t);
    }, se = (t) => {
      p("handle-delete", t);
    }, le = (t) => {
      p("update-event", t);
    };
    return Bt(() => {
      const t = {};
      for (const e of s.schedules) {
        const n = tt(e);
        if (!n) continue;
        const a = pt(n.start, k.value);
        (t[a] ??= []).push(e);
      }
      D.value = t;
    }), Bt(() => {
      let t, e;
      if (Y.value === "week")
        t = b.value, e = vt(b.value, 6);
      else {
        const n = $.value;
        t = n[0]?.ymd ?? b.value, e = n[n.length - 1]?.ymd ?? b.value;
      }
      p("range-change", { start: t, end: e, view: Y.value });
    }), ue(() => {
      s.additionalFields.forEach((t) => {
        u.value[t.model] = "";
      }), typeof window < "u" && (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches && (L.value = !0), j.value = q(/* @__PURE__ */ new Date(), k.value), X = setInterval(() => {
        j.value = q(/* @__PURE__ */ new Date(), k.value);
      }, 6e4));
    }), ce(() => {
      kt(), X && clearInterval(X);
    }), _({
      newEvent: u,
      addEvent: wt,
      resetForm: gt
    }), (t, e) => (i(), r("div", {
      class: ct(["calendar-theme", v.customClass, { dark: L.value, "is-dragging": A.value }]),
      style: K(v.customStyles)
    }, [
      Tt(t.$slots, "form", {
        newEvent: u.value,
        addEvent: wt,
        additionalFields: ut.value,
        labels: P.value,
        resetForm: gt
      }, () => [
        o("form", {
          class: "form-container",
          onSubmit: rt(wt, ["prevent"])
        }, [
          o("div", tn, [
            o("label", en, m(P.value.titleLabel) + ":", 1),
            V(o("input", {
              id: "title",
              "onUpdate:modelValue": e[0] || (e[0] = (n) => u.value.title = n),
              type: "text",
              required: "",
              class: "form-input",
              placeholder: P.value.titleLabel
            }, null, 8, nn), [
              [O, u.value.title]
            ])
          ]),
          (i(!0), r(I, null, N(ut.value, (n) => (i(), r("div", {
            key: n.id,
            class: "form-group"
          }, [
            o("label", {
              for: n.id,
              class: "form-label"
            }, m(n.label) + ":", 9, an),
            n.type === "select" ? (i(), r("div", on, [
              V(o("select", {
                id: n.id,
                "onUpdate:modelValue": (a) => u.value[n.model] = a,
                required: "",
                class: "form-select"
              }, [
                (i(!0), r(I, null, N(n.options, (a) => (i(), r("option", {
                  key: a.id,
                  value: a
                }, m(a.name || `${a.first_name} ${a.last_name}`), 9, ln))), 128))
              ], 8, sn), [
                [pe, u.value[n.model]]
              ])
            ])) : (i(), r("div", rn, [
              V(o("input", {
                id: n.id,
                "onUpdate:modelValue": (a) => u.value[n.model] = a,
                type: n.type,
                required: "",
                class: "form-input"
              }, null, 8, dn), [
                [ve, u.value[n.model]]
              ])
            ]))
          ]))), 128)),
          o("div", un, [
            o("label", cn, m(P.value.startTimeLabel) + ":", 1),
            V(o("input", {
              id: "start",
              "onUpdate:modelValue": e[1] || (e[1] = (n) => u.value.start = n),
              type: "time",
              required: "",
              class: "form-input"
            }, null, 512), [
              [O, u.value.start]
            ])
          ]),
          o("div", pn, [
            o("label", vn, m(P.value.endTimeLabel) + ":", 1),
            V(o("input", {
              id: "end",
              "onUpdate:modelValue": e[2] || (e[2] = (n) => u.value.end = n),
              type: "time",
              required: "",
              class: "form-input"
            }, null, 512), [
              [O, u.value.end]
            ])
          ]),
          o("div", mn, [
            o("label", fn, m(P.value.dateLabel) + ":", 1),
            V(o("input", {
              id: "date",
              "onUpdate:modelValue": e[3] || (e[3] = (n) => u.value.date = n),
              type: "date",
              required: "",
              class: "form-input"
            }, null, 512), [
              [O, u.value.date]
            ])
          ]),
          o("button", hn, m(P.value.submitButtonText), 1)
        ], 32)
      ]),
      o("div", yn, [
        o("div", bn, [
          o("button", {
            type: "button",
            class: "today-btn",
            onClick: Jt
          }, m(P.value.todayButtonLabel), 1),
          o("button", {
            type: "button",
            class: "arrow-button",
            onClick: qt
          }, "<"),
          o("span", gn, m(f.value), 1),
          o("button", {
            type: "button",
            class: "arrow-button",
            onClick: Kt
          }, ">"),
          o("div", wn, [
            o("button", {
              type: "button",
              class: ct(["view-btn", { active: Y.value === "week" }]),
              onClick: e[4] || (e[4] = (n) => Y.value = "week")
            }, m(P.value.weekViewLabel), 3),
            o("button", {
              type: "button",
              class: ct(["view-btn", { active: Y.value === "month" }]),
              onClick: e[5] || (e[5] = (n) => Y.value = "month")
            }, m(P.value.monthViewLabel), 3)
          ])
        ]),
        Y.value === "week" ? (i(), r("div", kn, [
          o("div", _n, [
            o("div", Tn, [
              e[8] || (e[8] = o("div", { class: "empty-slot" }, null, -1)),
              Mt.value ? (i(), r("div", Dn)) : M("", !0),
              (i(!0), r(I, null, N(B.value, (n) => (i(), r("div", {
                key: n,
                class: "hour"
              }, m(n), 1))), 128))
            ]),
            o("div", Sn, [
              o("ul", Cn, [
                (i(!0), r(I, null, N(ft.value, (n, a) => (i(), r("li", {
                  key: a,
                  class: "weekday"
                }, [
                  o("span", null, m(n), 1),
                  o("span", null, m(H(a)), 1)
                ]))), 128))
              ]),
              Mt.value ? (i(), r("div", $n, [
                (i(), r(I, null, N(7, (n, a) => o("div", {
                  key: a,
                  class: "allday-day"
                }, [
                  (i(!0), r(I, null, N($t.value[H(a)] || [], (d) => (i(), r("button", {
                    key: "ad-" + d.id,
                    type: "button",
                    class: "allday-chip",
                    style: K({ backgroundColor: d.color || "var(--calendar-primary-color)" }),
                    onClick: (E) => _t(d)
                  }, m(d.title), 13, Mn))), 128))
                ])), 64))
              ])) : M("", !0),
              o("div", Ln, [
                (i(), r(I, null, N(7, (n, a) => o("div", {
                  key: a,
                  class: "day",
                  "data-ymd": H(a),
                  onClick: (d) => Qt(d, H(a))
                }, [
                  (i(!0), r(I, null, N(B.value, (d) => (i(), r("div", {
                    key: d,
                    class: "hour"
                  }))), 128)),
                  H(a) === Xt.value && j.value >= 0 ? (i(), r("div", {
                    key: 0,
                    class: "current-time-line",
                    style: K({ top: `${j.value * J / 60}px` })
                  }, [...e[9] || (e[9] = [
                    o("div", { class: "current-time-dot" }, null, -1)
                  ])], 4)) : M("", !0),
                  g.value?.active && g.value.mode === "week" && g.value.previewYmd === H(a) ? (i(), r("div", {
                    key: "preview-" + a,
                    class: "event-preview",
                    style: K(Z.value)
                  }, m(St.value), 5)) : M("", !0),
                  (i(!0), r(I, null, N(bt.value[H(a)] || [], (d) => (i(), r("div", {
                    key: "ev-" + d.id,
                    class: "event",
                    style: K(Zt(d)),
                    onPointerdown: (E) => At(E, d, H(a)),
                    onClick: rt((E) => _t(d), ["stop"])
                  }, [
                    Tt(t.$slots, "event", {
                      event: d,
                      timeRange: Pt(d)
                    }, () => [
                      o("div", Pn, [
                        o("span", {
                          class: "event-title",
                          style: K({ color: mt.value, fontSize: dt.value })
                        }, m(d.title), 5),
                        o("span", An, m(Pt(d)), 1),
                        o("div", Fn, [
                          d.location ? (i(), r("span", Yn, m(d.location), 1)) : M("", !0),
                          d.link ? (i(), r("span", In, "🔗")) : M("", !0),
                          d.participants?.length ? (i(), r("span", Nn, m(d.participants.length) + " 👥", 1)) : M("", !0)
                        ])
                      ])
                    ])
                  ], 44, Un))), 128))
                ], 8, En)), 64))
              ])
            ])
          ])
        ])) : (i(), r("div", Vn, [
          o("div", xn, [
            (i(!0), r(I, null, N(h.value, (n, a) => (i(), r("div", {
              key: a,
              class: "month-weekday"
            }, m(n), 1))), 128))
          ]),
          o("div", On, [
            (i(!0), r(I, null, N($.value, (n) => (i(), r("div", {
              key: n.ymd,
              "data-ymd": n.ymd,
              class: ct(["month-cell", {
                "is-outside": !n.inMonth,
                "is-today": n.isToday,
                "drop-target": g.value?.active && g.value.mode === "month" && g.value.previewYmd === n.ymd
              }]),
              onClick: (a) => te(a, n.ymd)
            }, [
              o("button", {
                type: "button",
                class: "month-daynum",
                onClick: rt((a) => Ut(n.ymd), ["stop"])
              }, m(n.day), 9, zn),
              o("div", Wn, [
                (i(!0), r(I, null, N(n.events.slice(0, Dt), (a) => (i(), r("button", {
                  key: "mev-" + a.id,
                  type: "button",
                  class: "month-chip",
                  style: K({ backgroundColor: a.color || "var(--calendar-primary-color)" }),
                  onPointerdown: (d) => At(d, a, n.ymd),
                  onClick: rt((d) => _t(a), ["stop"])
                }, [
                  o("span", Xn, m(Gt(a)), 1),
                  o("span", jn, m(a.title), 1)
                ], 44, Rn))), 128)),
                n.events.length > Dt ? (i(), r("button", {
                  key: 0,
                  type: "button",
                  class: "month-more",
                  onClick: (a) => Ut(n.ymd)
                }, " +" + m(n.events.length - Dt), 9, Hn)) : M("", !0)
              ])
            ], 10, Bn))), 128))
          ])
        ]))
      ]),
      g.value?.active ? (i(), r("div", {
        key: 0,
        class: "drag-time-tooltip",
        style: K({ left: g.value.cursorX + 14 + "px", top: g.value.cursorY + 14 + "px" })
      }, m(St.value), 5)) : M("", !0),
      t.$slots["popup-calendar"] ? Tt(t.$slots, "popup-calendar", { key: 1 }) : (i(), me(Ke, {
        key: 2,
        visible: yt.value,
        eventData: ot.value,
        createMode: ht.value,
        popupFields: v.popupFields || [],
        readonly: s.readonly,
        closeButtonText: "Close",
        todosLabel: P.value.todosLabel || "To-Do",
        participantsLabel: P.value.participantsLabel || "Teammates",
        todos: ot.value.todos || [],
        participants: ot.value.participants || [],
        todoPlaceholder: Q.value.todo || "New To-do...",
        participantPlaceholder: Q.value.participant || "Add Participant...",
        "onUpdate:todos": e[6] || (e[6] = (n) => p("update:todos", n)),
        "onUpdate:participants": e[7] || (e[7] = (n) => p("update:participants", n)),
        onClosePopup: ae,
        onHandleDelete: se,
        onUpdateEvent: le,
        onSubmitEvent: oe
      }, null, 8, ["visible", "eventData", "createMode", "popupFields", "readonly", "todosLabel", "participantsLabel", "todos", "participants", "todoPlaceholder", "participantPlaceholder"]))
    ], 6));
  }
});
export {
  Gn as ScheduleForm,
  Gn as default
};
