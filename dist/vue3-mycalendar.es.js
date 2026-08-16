import { computed as T, ref as F, watch as Xt, defineComponent as Et, resolveComponent as Rt, openBlock as r, createElementBlock as d, createElementVNode as a, createVNode as H, toDisplayString as w, unref as E, Fragment as U, renderList as Y, withDirectives as V, vModelText as G, createCommentVNode as K, createTextVNode as Lt, isRef as Ct, useSlots as qt, watchEffect as Ht, onMounted as Zt, onBeforeUnmount as jt, normalizeStyle as Z, normalizeClass as st, renderSlot as Mt, withModifiers as Gt, vModelSelect as Kt, vModelDynamic as Jt, createBlock as Qt } from "vue";
function te(i, p) {
  const h = T(() => i.popupFields || []), s = F({ ...i.eventData }), v = F([...i.eventData?.todos || []]), m = F([...i.eventData?.participants || []]);
  Xt(() => i.eventData, (g) => {
    g && (s.value = { ...g }, v.value = [...g.todos || []], m.value = [...g.participants || []]);
  }, { immediate: !0 });
  const u = (g) => g.replace(/_/g, " ").replace(/\b\w/g, (y) => y.toUpperCase()), c = T(() => h.value.length === 0 ? s.value : Object.fromEntries(
    Object.entries(s.value).filter(([g]) => h.value.includes(g))
  )), b = (g, y) => {
    s.value[g] = y, p("updateEvent", s.value);
  }, D = F(""), P = () => {
    const g = D.value.trim();
    g && (v.value.push(g), D.value = "", p("update:todos", { todos: [...v.value], eventId: s.value.id }));
  }, f = (g) => {
    v.value.splice(g, 1), p("update:todos", { todos: [...v.value], eventId: s.value.id });
  }, x = F("");
  return {
    editableEventData: s,
    popupFields: h,
    filteredEventData: c,
    formatKey: u,
    updateField: b,
    // Todos
    localTodos: v,
    newTodo: D,
    addTodo: P,
    removeTodo: f,
    // Participants
    localParticipants: m,
    newParticipant: x,
    addParticipant: () => {
      const g = x.value.trim();
      g && (m.value.push(g), x.value = "", p("update:participants", { participants: [...m.value], eventId: s.value.id }));
    },
    removeParticipant: (g) => {
      m.value.splice(g, 1), p("update:participants", { participants: [...m.value], eventId: s.value.id });
    }
  };
}
const ee = {
  key: 0,
  class: "popup"
}, ne = { class: "top-right-icons" }, oe = { class: "popup-title" }, ae = { key: 0 }, se = {
  key: 0,
  class: "popup-field"
}, ie = { class: "popup-label" }, le = ["onUpdate:modelValue", "placeholder"], re = { class: "section" }, de = { class: "popup-label" }, ue = { class: "list" }, ce = ["onClick"], pe = { class: "input-row" }, ve = { class: "section" }, me = { class: "popup-label" }, he = { class: "list" }, fe = ["onClick"], ye = { class: "input-row" }, be = /* @__PURE__ */ Et({
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
  setup(i, { emit: p }) {
    const h = i, s = T(() => h.todosLabel || "To-do"), v = T(() => h.participantsLabel || "Participant"), m = p, {
      editableEventData: u,
      filteredEventData: c,
      formatKey: b,
      localTodos: D,
      newTodo: P,
      addTodo: f,
      localParticipants: x,
      newParticipant: X,
      addParticipant: J
    } = te(h, m), g = () => m("close-popup"), y = () => m("handle-delete", h.eventData.id), Q = () => {
      const I = {
        ...u.value,
        todos: D.value,
        participants: x.value
      };
      m("update-event", I), m("update:todos", { todos: D.value, eventId: h.eventData.id }), m("update:participants", { participants: x.value, eventId: h.eventData.id }), m("close-popup");
    }, $ = F(null), R = { x: 0, y: 0 }, A = (I) => {
      if (!$.value) return;
      const C = $.value;
      R.x = I.clientX - C.getBoundingClientRect().left, R.y = I.clientY - C.getBoundingClientRect().top;
      const N = (M) => {
        C.style.left = `${M.clientX - R.x}px`, C.style.top = `${M.clientY - R.y}px`, C.style.position = "absolute", C.style.transform = "none";
      }, L = () => {
        window.removeEventListener("mousemove", N), window.removeEventListener("mouseup", L);
      };
      window.addEventListener("mousemove", N), window.addEventListener("mouseup", L);
    }, at = (I) => {
      D.value.splice(I, 1), m("update:todos", {
        todos: [...D.value],
        eventId: u.value.id
      });
    }, it = (I) => {
      x.value.splice(I, 1), m("update:participants", {
        participants: [...x.value],
        eventId: u.value.id
      });
    };
    return (I, C) => {
      const N = Rt("font-awesome-icon");
      return i.visible ? (r(), d("div", ee, [
        a("div", {
          class: "popup-content",
          ref_key: "popupRef",
          ref: $,
          onMousedown: A
        }, [
          a("div", ne, [
            a("button", {
              class: "icon-button",
              onClick: y,
              title: "Delete"
            }, [
              H(N, { icon: ["fas", "trash"] })
            ]),
            a("button", {
              class: "icon-button",
              onClick: g,
              title: "Close"
            }, [
              H(N, { icon: ["fas", "times"] })
            ])
          ]),
          a("h2", oe, w(E(u).title), 1),
          i.eventData && Object.keys(i.eventData).length ? (r(), d("div", ae, [
            (r(!0), d(U, null, Y(E(c), (L, M) => (r(), d(U, { key: M }, [
              M !== "title" ? (r(), d("div", se, [
                a("label", ie, w(E(b)(String(M))), 1),
                V(a("input", {
                  "onUpdate:modelValue": (tt) => E(u)[M] = tt,
                  class: "popup-input",
                  placeholder: E(b)(String(M))
                }, null, 8, le), [
                  [G, E(u)[M]]
                ])
              ])) : K("", !0)
            ], 64))), 128))
          ])) : K("", !0),
          a("div", re, [
            a("label", de, w(s.value), 1),
            a("ul", ue, [
              (r(!0), d(U, null, Y(E(D), (L, M) => (r(), d("li", { key: M }, [
                Lt(w(L) + " ", 1),
                a("button", {
                  onClick: (tt) => at(M)
                }, [
                  H(N, { icon: ["fas", "trash"] })
                ], 8, ce)
              ]))), 128))
            ]),
            a("div", pe, [
              V(a("input", {
                "onUpdate:modelValue": C[0] || (C[0] = (L) => Ct(P) ? P.value = L : null),
                placeholder: "New To-do...",
                class: "popup-input"
              }, null, 512), [
                [G, E(P)]
              ]),
              a("button", {
                class: "add-inline-button",
                onClick: C[1] || (C[1] = //@ts-ignore
                (...L) => E(f) && E(f)(...L))
              }, [
                H(N, { icon: ["fas", "plus"] })
              ])
            ])
          ]),
          a("div", ve, [
            a("label", me, w(v.value), 1),
            a("ul", he, [
              (r(!0), d(U, null, Y(E(x), (L, M) => (r(), d("li", { key: M }, [
                Lt(w(L) + " ", 1),
                a("button", {
                  onClick: (tt) => it(M)
                }, [
                  H(N, { icon: ["fas", "trash"] })
                ], 8, fe)
              ]))), 128))
            ]),
            a("div", ye, [
              V(a("input", {
                "onUpdate:modelValue": C[2] || (C[2] = (L) => Ct(X) ? X.value = L : null),
                placeholder: "Add Participant ...",
                class: "popup-input"
              }, null, 512), [
                [G, E(X)]
              ]),
              a("button", {
                class: "add-inline-button",
                onClick: C[3] || (C[3] = //@ts-ignore
                (...L) => E(J) && E(J)(...L))
              }, [
                H(N, { icon: ["fas", "user-plus"] })
              ])
            ])
          ]),
          a("div", { class: "popup-footer" }, [
            a("button", {
              class: "save-button",
              onClick: Q
            }, "Speichern")
          ])
        ], 544)
      ])) : K("", !0);
    };
  }
}), we = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2050%2050'%20width='50px'%20height='50px'%3e%3cpath%20d='M%2025%202%20C%2012.309295%202%202%2012.309295%202%2025%20C%202%2037.690705%2012.309295%2048%2025%2048%20C%2037.690705%2048%2048%2037.690705%2048%2025%20C%2048%2012.309295%2037.690705%202%2025%202%20z%20M%2025%204%20C%2036.609824%204%2046%2013.390176%2046%2025%20C%2046%2036.609824%2036.609824%2046%2025%2046%20C%2013.390176%2046%204%2036.609824%204%2025%20C%204%2013.390176%2013.390176%204%2025%204%20z%20M%2025%2011%20A%203%203%200%200%200%2022%2014%20A%203%203%200%200%200%2025%2017%20A%203%203%200%200%200%2028%2014%20A%203%203%200%200%200%2025%2011%20z%20M%2021%2021%20L%2021%2023%20L%2022%2023%20L%2023%2023%20L%2023%2036%20L%2022%2036%20L%2021%2036%20L%2021%2038%20L%2022%2038%20L%2023%2038%20L%2027%2038%20L%2028%2038%20L%2029%2038%20L%2029%2036%20L%2028%2036%20L%2027%2036%20L%2027%2021%20L%2026%2021%20L%2022%2021%20L%2021%2021%20z'/%3e%3c/svg%3e";
function W(i, p) {
  const h = new Intl.DateTimeFormat("en-US", {
    timeZone: p,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1
  }), s = {};
  for (const D of h.formatToParts(i))
    D.type !== "literal" && (s[D.type] = D.value);
  const v = Number(s.year), m = Number(s.month), u = Number(s.day), c = Number(s.hour) % 24, b = Number(s.minute);
  return {
    year: v,
    month: m,
    day: u,
    hour: c,
    minute: b,
    ymd: `${s.year}-${s.month}-${s.day}`,
    minutesOfDay: c * 60 + b
  };
}
function ct(i, p) {
  return W(i, p).ymd;
}
function z(i, p) {
  return W(i, p).minutesOfDay;
}
function pt(i, p) {
  const h = W(i, p);
  return `${String(h.hour).padStart(2, "0")}:${String(h.minute).padStart(2, "0")}`;
}
function $t(i, p) {
  const h = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1
  }), s = new Intl.DateTimeFormat("en-US", {
    timeZone: p,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1
  }), v = (m) => {
    const u = {};
    for (const c of m.formatToParts(i))
      c.type !== "literal" && (u[c.type] = Number(c.value));
    return Date.UTC(
      u.year,
      u.month - 1,
      u.day,
      u.hour % 24,
      u.minute,
      u.second
    );
  };
  return Math.round((v(s) - v(h)) / 6e4);
}
function ot(i, p, h, s, v, m) {
  const u = Date.UTC(
    i,
    p - 1,
    h,
    s,
    v,
    0
  ), c = new Date(u), b = $t(c, m), D = u - b * 6e4, P = new Date(D), f = $t(P, m);
  return f !== b ? new Date(
    u - f * 6e4
  ) : P;
}
function ge(i, p, h = 1) {
  const s = W(
    i,
    p
  ), v = new Intl.DateTimeFormat("en-US", {
    timeZone: p,
    weekday: "short"
  }).format(i), u = ([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ].indexOf(v) - h + 7) % 7, c = Date.UTC(
    s.year,
    s.month - 1,
    s.day,
    12,
    0,
    0
  ), b = new Date(
    c - u * 864e5
  ), D = b.getUTCFullYear(), P = String(
    b.getUTCMonth() + 1
  ).padStart(2, "0"), f = String(
    b.getUTCDate()
  ).padStart(2, "0");
  return `${D}-${P}-${f}`;
}
function mt(i, p) {
  const [h, s, v] = i.split("-").map(Number), m = Date.UTC(
    h,
    s - 1,
    v,
    12,
    0,
    0
  ), u = new Date(
    m + p * 864e5
  ), c = u.getUTCFullYear(), b = String(
    u.getUTCMonth() + 1
  ).padStart(2, "0"), D = String(
    u.getUTCDate()
  ).padStart(2, "0");
  return `${c}-${b}-${D}`;
}
function ke(i) {
  const [p, h, s] = i.split("-").map(Number);
  return new Date(
    Date.UTC(
      p,
      h - 1,
      s,
      12
    )
  ).getUTCDay();
}
function _e(i, p) {
  return new Date(
    Date.UTC(
      i,
      p,
      0
    )
  ).getUTCDate();
}
function Te(i, p, h) {
  const s = `${i}-${String(p).padStart(2, "0")}-01`, v = (ke(s) - h + 7) % 7, m = mt(
    s,
    -v
  );
  return Array.from(
    { length: 42 },
    (u, c) => mt(
      m,
      c
    )
  );
}
const De = ["for"], Se = { key: 0 }, Le = ["id", "onUpdate:modelValue"], Ce = ["value"], Me = { key: 1 }, $e = ["id", "onUpdate:modelValue", "type"], Ee = { class: "form-group" }, Ue = {
  for: "start",
  class: "form-label"
}, Pe = { class: "form-group" }, xe = {
  for: "end",
  class: "form-label"
}, Ie = { class: "form-group" }, Ye = {
  for: "date",
  class: "form-label"
}, Fe = {
  type: "submit",
  class: "submit-button"
}, Ae = { class: "calendar" }, Ne = { class: "navigation" }, Oe = { class: "current-week" }, Ve = { class: "view-toggle" }, Be = {
  key: 0,
  class: "hours-and-days"
}, ze = { class: "hours" }, We = { class: "weekdays-container" }, Xe = { class: "weekdays" }, Re = { class: "days" }, qe = ["data-ymd"], He = ["onPointerdown"], Ze = ["onClick"], je = ["src"], Ge = {
  key: 1,
  class: "month-view"
}, Ke = { class: "month-weekdays" }, Je = { class: "month-grid" }, Qe = ["data-ymd"], tn = ["onClick"], en = { class: "month-events" }, nn = ["onPointerdown", "onClick"], on = { class: "month-chip-time" }, an = { class: "month-chip-title" }, sn = ["onClick"], vt = 3, ln = 4, j = 40, un = /* @__PURE__ */ Et({
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
    view: { default: void 0 }
  },
  emits: ["submit-event", "handle-delete", "update-event", "show-info", "close-popup", "update:todos", "update:participants", "update:view"],
  setup(i, { expose: p, emit: h }) {
    const s = i, v = h;
    qt();
    const m = F(!1), u = F({}), c = F({
      start: "",
      end: "",
      date: "",
      color: "",
      title: "",
      description: ""
    }), b = F(/* @__PURE__ */ new Date()), D = F("week"), P = F(
      Array.from({ length: 24 }, (t, e) => e.toString().padStart(2, "0") + ":00")
    ), f = F(null);
    let x = !1;
    const X = T(() => s.eventTitleColor), J = T(() => s.eventTitleSize), g = T(() => s.additionalFields), y = T(() => s.timeZone), Q = T(() => s.weekStartsOn), $ = T({
      get: () => s.view ?? D.value,
      set: (t) => {
        D.value = t, v("update:view", t);
      }
    }), R = T(() => {
      const t = s.weekdays;
      return Q.value === 1 ? t : [t[6], ...t.slice(0, 6)];
    }), A = T(() => ({
      startTimeLabel: s.labelsAndSettings?.startTimeLabel || "Start Time",
      endTimeLabel: s.labelsAndSettings?.endTimeLabel || "End Time",
      dateLabel: s.labelsAndSettings?.dateLabel || "Date",
      submitButtonText: s.labelsAndSettings?.submitButtonText || "Add Entry",
      calendarWeekLabel: s.labelsAndSettings?.calendarWeekLabel || "CW",
      todosLabel: s.labelsAndSettings?.todosLabel,
      participantsLabel: s.labelsAndSettings?.participantsLabel,
      weekViewLabel: s.labelsAndSettings?.weekViewLabel || "Week",
      monthViewLabel: s.labelsAndSettings?.monthViewLabel || "Month"
    })), at = T(() => s.placeholderSettings || {}), it = T(() => s.popupVisible), I = T(() => s.popupEvent), C = T(
      () => ge(b.value, y.value, Q.value)
    ), N = T(() => $.value === "month" ? new Intl.DateTimeFormat(void 0, {
      month: "long",
      year: "numeric",
      timeZone: y.value
    }).format(b.value) : `${A.value.calendarWeekLabel} ${It()}`), L = T(() => {
      const t = W(b.value, y.value), e = Te(t.year, t.month, Q.value), n = ct(/* @__PURE__ */ new Date(), y.value);
      return e.map((o) => {
        const [, l, S] = o.split("-").map(Number);
        return {
          ymd: o,
          day: S,
          inMonth: l === t.month,
          isToday: o === n,
          events: u.value[o] ?? []
        };
      });
    }), M = T(
      () => L.value.slice(0, 7).map((t) => {
        const [e, n, o] = t.ymd.split("-").map(Number);
        return new Intl.DateTimeFormat(void 0, {
          weekday: "short",
          timeZone: "UTC"
        }).format(new Date(Date.UTC(e, n - 1, o, 12)));
      })
    ), tt = T(() => !!f.value?.active), Ut = T(() => {
      const t = f.value;
      if (!t || !t.active || t.mode !== "week") return {};
      const e = t.previewStartMin * j / 60, n = Math.max(t.durationMin, 15) * j / 60;
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
    }), ht = T(() => {
      const t = f.value;
      if (!t || !t.active) return "";
      if (t.mode === "week") {
        const l = t.previewStartMin + t.durationMin;
        return `${ft(t.previewStartMin)} – ${ft(l)}`;
      }
      const [e, n, o] = t.previewYmd.split("-").map(Number);
      return new Intl.DateTimeFormat(void 0, {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        timeZone: "UTC"
      }).format(new Date(Date.UTC(e, n - 1, o, 12)));
    });
    function q(t) {
      if (t.startsAt && t.endsAt) {
        const e = new Date(t.startsAt), n = new Date(t.endsAt);
        if (!isNaN(e.getTime()) && !isNaN(n.getTime()))
          return { start: e, end: n };
      }
      if (t.date && t.start && t.end) {
        const [e, n, o] = t.date.split("-").map(Number), [l, S] = t.start.split(":").map(Number), [_, k] = t.end.split(":").map(Number);
        return {
          start: ot(e, n, o, l, S, y.value),
          end: ot(e, n, o, _, k, y.value)
        };
      }
      return null;
    }
    function ft(t) {
      const e = Math.max(0, Math.min(t, 1439)), n = String(Math.floor(e / 60)).padStart(2, "0"), o = String(e % 60).padStart(2, "0");
      return `${n}:${o}`;
    }
    function Pt(t) {
      const e = t.map((_) => {
        const k = q(_);
        return k ? {
          id: _.id,
          start: z(k.start, y.value),
          end: z(k.end, y.value)
        } : null;
      }).filter((_) => _ !== null).sort((_, k) => _.start - k.start || _.end - k.end), n = {};
      let o = [], l = -1 / 0;
      const S = (_) => {
        const k = [], B = {};
        for (const O of _) {
          let St = !1;
          for (let nt = 0; nt < k.length; nt++)
            if (k[nt] <= O.start) {
              k[nt] = O.end, B[O.id] = nt, St = !0;
              break;
            }
          St || (k.push(O.end), B[O.id] = k.length - 1);
        }
        const ut = k.length;
        for (const O of _)
          n[O.id] = { col: B[O.id], cols: ut };
      };
      for (const _ of e)
        o.length && _.start >= l && (S(o), o = [], l = -1 / 0), o.push(_), l = Math.max(l, _.end);
      return o.length && S(o), n;
    }
    const xt = T(() => {
      const t = {};
      for (const e of Object.keys(u.value))
        Object.assign(t, Pt(u.value[e]));
      return t;
    }), lt = () => {
      c.value = {
        start: "",
        end: "",
        date: "",
        color: "",
        title: "",
        description: ""
      }, s.additionalFields.forEach((t) => {
        c.value[t.model] = "";
      });
    }, rt = (t) => {
      const e = t || c.value, n = {
        title: e.title,
        start: e.start,
        end: e.end,
        date: e.date,
        info: e.info,
        color: e.color,
        description: e.description
      };
      s.additionalFields.forEach((o) => {
        n[o.model] = e[o.model];
      }), v("submit-event", n), lt();
    }, et = (t) => mt(C.value, t), It = () => {
      const t = W(b.value, y.value), e = new Date(Date.UTC(t.year, 0, 1)), o = (new Date(Date.UTC(t.year, t.month - 1, t.day)).getTime() - e.getTime()) / 864e5;
      return Math.ceil((o + e.getUTCDay() + 1) / 7);
    }, yt = (t) => {
      b.value = new Date(b.value.getTime() + t * 7 * 864e5);
    }, bt = (t) => {
      const e = W(b.value, y.value);
      let n = e.month + t, o = e.year;
      for (; n > 12; )
        n -= 12, o += 1;
      for (; n < 1; )
        n += 12, o -= 1;
      const l = Math.min(e.day, _e(o, n));
      b.value = ot(o, n, l, 12, 0, y.value);
    }, Yt = () => $.value === "month" ? bt(-1) : yt(-1), Ft = () => $.value === "month" ? bt(1) : yt(1), wt = (t) => {
      const [e, n, o] = t.split("-").map(Number);
      b.value = ot(e, n, o, 12, 0, y.value), $.value = "week";
    }, At = (t) => {
      const e = q(t);
      if (!e) return { display: "none" };
      const n = z(e.start, y.value), o = z(e.end, y.value), l = n * j / 60, S = Math.max(o - n, 15) * j / 60, _ = xt.value[t.id] ?? { col: 0, cols: 1 }, k = 100 / _.cols, B = k * _.col, ut = f.value?.active && f.value.event.id === t.id;
      return {
        backgroundColor: t.color || "var(--calendar-primary-color)",
        top: `${l}px`,
        height: `${S}px`,
        position: "absolute",
        left: `${B}%`,
        width: `calc(${k}% - 4px)`,
        right: "auto",
        zIndex: 1,
        opacity: ut ? 0.35 : 1,
        borderRadius: "var(--event-border-radius)"
      };
    }, Nt = (t) => {
      const e = q(t);
      return e ? pt(e.start, y.value) : "";
    }, gt = (t, e, n) => {
      if (t.button !== 0 && t.pointerType === "mouse") return;
      const o = q(e);
      if (!o) return;
      const l = z(o.start, y.value), S = z(o.end, y.value), k = t.currentTarget.getBoundingClientRect(), B = t.clientY - k.top;
      f.value = {
        event: e,
        pointerId: t.pointerId,
        startX: t.clientX,
        startY: t.clientY,
        grabOffsetMinutes: $.value === "week" ? B * 60 / j : 0,
        durationMin: S - l,
        mode: $.value,
        active: !1,
        previewYmd: n,
        previewStartMin: l,
        cursorX: t.clientX,
        cursorY: t.clientY
      }, window.addEventListener("pointermove", kt), window.addEventListener("pointerup", _t), window.addEventListener("pointercancel", Tt);
    }, kt = (t) => {
      const e = f.value;
      if (!e || t.pointerId !== e.pointerId) return;
      if (!e.active) {
        const l = t.clientX - e.startX, S = t.clientY - e.startY;
        if (Math.hypot(l, S) < ln) return;
        e.active = !0;
      }
      t.preventDefault(), e.cursorX = t.clientX, e.cursorY = t.clientY;
      const o = document.elementFromPoint(t.clientX, t.clientY)?.closest("[data-ymd]");
      if (o && (e.previewYmd = o.getAttribute("data-ymd"), e.mode === "week")) {
        const l = o.getBoundingClientRect(), _ = (t.clientY - l.top) * 60 / j - e.grabOffsetMinutes, k = Math.max(0, Math.min(_, 1440 - e.durationMin));
        e.previewStartMin = Math.round(k / 15) * 15;
      }
    }, _t = (t) => {
      const e = f.value;
      !e || t.pointerId !== e.pointerId || (dt(), e.active && (Ot(e), x = !0, setTimeout(() => {
        x = !1;
      }, 50)), f.value = null);
    }, Tt = () => {
      dt(), f.value = null;
    }, dt = () => {
      window.removeEventListener("pointermove", kt), window.removeEventListener("pointerup", _t), window.removeEventListener("pointercancel", Tt);
    }, Ot = (t) => {
      const [e, n, o] = t.previewYmd.split("-").map(Number);
      let l;
      if (t.mode === "week")
        l = t.previewStartMin;
      else {
        const k = q(t.event);
        if (!k) return;
        l = z(k.start, y.value);
      }
      const S = ot(
        e,
        n,
        o,
        Math.floor(l / 60),
        l % 60,
        y.value
      ), _ = new Date(S.getTime() + t.durationMin * 6e4);
      Vt(t.event, S, _);
    }, Vt = (t, e, n) => {
      v("update-event", {
        ...t,
        startsAt: e.toISOString(),
        endsAt: n.toISOString(),
        date: ct(e, y.value),
        start: pt(e, y.value),
        end: pt(n, y.value)
      });
    }, Dt = (t) => {
      x || v("show-info", t);
    }, Bt = () => {
      v("close-popup");
    }, zt = (t) => {
      v("handle-delete", t);
    }, Wt = (t) => {
      v("update-event", t);
    };
    return Ht(() => {
      const t = {};
      for (const e of s.schedules) {
        const n = q(e);
        if (!n) continue;
        const o = ct(n.start, y.value);
        (t[o] ??= []).push(e);
      }
      u.value = t;
    }), Zt(() => {
      s.additionalFields.forEach((e) => {
        c.value[e.model] = "";
      }), window.matchMedia?.("(prefers-color-scheme: dark)")?.matches && (m.value = !0);
    }), jt(() => {
      dt();
    }), p({
      newEvent: c,
      addEvent: rt,
      resetForm: lt
    }), (t, e) => (r(), d("div", {
      class: st(["calendar-theme", i.customClass, { dark: m.value, "is-dragging": tt.value }]),
      style: Z(i.customStyles)
    }, [
      Mt(t.$slots, "form", {
        newEvent: c.value,
        addEvent: rt,
        additionalFields: g.value,
        labels: A.value,
        resetForm: lt
      }, () => [
        a("form", {
          class: "form-container",
          onSubmit: Gt(rt, ["prevent"])
        }, [
          (r(!0), d(U, null, Y(g.value, (n) => (r(), d("div", {
            key: n.id,
            class: "form-group"
          }, [
            a("label", {
              for: n.id,
              class: "form-label"
            }, w(n.label) + ":", 9, De),
            n.type === "select" ? (r(), d("div", Se, [
              V(a("select", {
                id: n.id,
                "onUpdate:modelValue": (o) => c.value[n.model] = o,
                required: "",
                class: "form-select"
              }, [
                (r(!0), d(U, null, Y(n.options, (o) => (r(), d("option", {
                  key: o.id,
                  value: o
                }, w(o.name || `${o.first_name} ${o.last_name}`), 9, Ce))), 128))
              ], 8, Le), [
                [Kt, c.value[n.model]]
              ])
            ])) : (r(), d("div", Me, [
              V(a("input", {
                id: n.id,
                "onUpdate:modelValue": (o) => c.value[n.model] = o,
                type: n.type,
                required: "",
                class: "form-input"
              }, null, 8, $e), [
                [Jt, c.value[n.model]]
              ])
            ]))
          ]))), 128)),
          a("div", Ee, [
            a("label", Ue, w(A.value.startTimeLabel) + ":", 1),
            V(a("input", {
              id: "start",
              "onUpdate:modelValue": e[0] || (e[0] = (n) => c.value.start = n),
              type: "time",
              required: "",
              class: "form-input"
            }, null, 512), [
              [G, c.value.start]
            ])
          ]),
          a("div", Pe, [
            a("label", xe, w(A.value.endTimeLabel) + ":", 1),
            V(a("input", {
              id: "end",
              "onUpdate:modelValue": e[1] || (e[1] = (n) => c.value.end = n),
              type: "time",
              required: "",
              class: "form-input"
            }, null, 512), [
              [G, c.value.end]
            ])
          ]),
          a("div", Ie, [
            a("label", Ye, w(A.value.dateLabel) + ":", 1),
            V(a("input", {
              id: "date",
              "onUpdate:modelValue": e[2] || (e[2] = (n) => c.value.date = n),
              type: "date",
              required: "",
              class: "form-input"
            }, null, 512), [
              [G, c.value.date]
            ])
          ]),
          a("button", Fe, w(A.value.submitButtonText), 1)
        ], 32)
      ]),
      a("div", Ae, [
        a("div", Ne, [
          a("button", {
            type: "button",
            class: "arrow-button",
            onClick: Yt
          }, "<"),
          a("span", Oe, w(N.value), 1),
          a("button", {
            type: "button",
            class: "arrow-button",
            onClick: Ft
          }, ">"),
          a("div", Ve, [
            a("button", {
              type: "button",
              class: st(["view-btn", { active: $.value === "week" }]),
              onClick: e[3] || (e[3] = (n) => $.value = "week")
            }, w(A.value.weekViewLabel), 3),
            a("button", {
              type: "button",
              class: st(["view-btn", { active: $.value === "month" }]),
              onClick: e[4] || (e[4] = (n) => $.value = "month")
            }, w(A.value.monthViewLabel), 3)
          ])
        ]),
        $.value === "week" ? (r(), d("div", Be, [
          a("div", ze, [
            e[7] || (e[7] = a("div", { class: "empty-slot" }, null, -1)),
            (r(!0), d(U, null, Y(P.value, (n) => (r(), d("div", {
              key: n,
              class: "hour"
            }, w(n), 1))), 128))
          ]),
          a("div", We, [
            a("ul", Xe, [
              (r(!0), d(U, null, Y(R.value, (n, o) => (r(), d("li", {
                key: o,
                class: "weekday"
              }, [
                a("span", null, w(n), 1),
                a("span", null, w(et(o)), 1)
              ]))), 128))
            ]),
            a("div", Re, [
              (r(), d(U, null, Y(7, (n, o) => a("div", {
                key: o,
                class: "day",
                "data-ymd": et(o)
              }, [
                (r(!0), d(U, null, Y(P.value, (l) => (r(), d("div", {
                  key: l,
                  class: "hour"
                }))), 128)),
                f.value?.active && f.value.mode === "week" && f.value.previewYmd === et(o) ? (r(), d("div", {
                  key: "preview-" + o,
                  class: "event-preview",
                  style: Z(Ut.value)
                }, w(ht.value), 5)) : K("", !0),
                (r(!0), d(U, null, Y(u.value[et(o)] || [], (l) => (r(), d("div", {
                  key: "ev-" + l.id,
                  class: "event",
                  style: Z(At(l)),
                  onPointerdown: (S) => gt(S, l, et(o))
                }, [
                  a("span", {
                    style: Z({ color: X.value, fontSize: J.value })
                  }, w(l.title), 5),
                  e[8] || (e[8] = a("br", null, null, -1)),
                  a("button", {
                    type: "button",
                    class: "info-button",
                    onClick: (S) => Dt(l)
                  }, [
                    a("img", {
                      src: E(we),
                      alt: "info",
                      class: "small-logo"
                    }, null, 8, je)
                  ], 8, Ze)
                ], 44, He))), 128))
              ], 8, qe)), 64))
            ])
          ])
        ])) : (r(), d("div", Ge, [
          a("div", Ke, [
            (r(!0), d(U, null, Y(M.value, (n, o) => (r(), d("div", {
              key: o,
              class: "month-weekday"
            }, w(n), 1))), 128))
          ]),
          a("div", Je, [
            (r(!0), d(U, null, Y(L.value, (n) => (r(), d("div", {
              key: n.ymd,
              "data-ymd": n.ymd,
              class: st(["month-cell", {
                "is-outside": !n.inMonth,
                "is-today": n.isToday,
                "drop-target": f.value?.active && f.value.mode === "month" && f.value.previewYmd === n.ymd
              }])
            }, [
              a("button", {
                type: "button",
                class: "month-daynum",
                onClick: (o) => wt(n.ymd)
              }, w(n.day), 9, tn),
              a("div", en, [
                (r(!0), d(U, null, Y(n.events.slice(0, vt), (o) => (r(), d("button", {
                  key: "mev-" + o.id,
                  type: "button",
                  class: "month-chip",
                  style: Z({ backgroundColor: o.color || "var(--calendar-primary-color)" }),
                  onPointerdown: (l) => gt(l, o, n.ymd),
                  onClick: (l) => Dt(o)
                }, [
                  a("span", on, w(Nt(o)), 1),
                  a("span", an, w(o.title), 1)
                ], 44, nn))), 128)),
                n.events.length > vt ? (r(), d("button", {
                  key: 0,
                  type: "button",
                  class: "month-more",
                  onClick: (o) => wt(n.ymd)
                }, " +" + w(n.events.length - vt), 9, sn)) : K("", !0)
              ])
            ], 10, Qe))), 128))
          ])
        ]))
      ]),
      f.value?.active ? (r(), d("div", {
        key: 0,
        class: "drag-time-tooltip",
        style: Z({ left: f.value.cursorX + 14 + "px", top: f.value.cursorY + 14 + "px" })
      }, w(ht.value), 5)) : K("", !0),
      t.$slots["popup-calendar"] ? Mt(t.$slots, "popup-calendar", { key: 1 }) : (r(), Qt(be, {
        key: 2,
        visible: it.value,
        eventData: I.value,
        popupFields: i.popupFields || [],
        closeButtonText: "Close",
        todosLabel: A.value.todosLabel || "To-Do",
        participantsLabel: A.value.participantsLabel || "Teammates",
        todos: I.value?.todos || [],
        participants: I.value?.participants || [],
        todoPlaceholder: at.value.todo || "New To-do...",
        participantPlaceholder: at.value.participant || "Add Participant...",
        "onUpdate:todos": e[5] || (e[5] = (n) => v("update:todos", n)),
        "onUpdate:participants": e[6] || (e[6] = (n) => v("update:participants", n)),
        onClosePopup: Bt,
        onHandleDelete: zt,
        onUpdateEvent: Wt
      }, null, 8, ["visible", "eventData", "popupFields", "todosLabel", "participantsLabel", "todos", "participants", "todoPlaceholder", "participantPlaceholder"]))
    ], 6));
  }
});
export {
  un as ScheduleForm,
  un as default
};
