/*
  When should mosquito control start? Dengue in Colombo, 2017 - interactive demo.
  Runs the notebook's SIR model (RK4, h = 0.1 week) in the browser on 200 posterior draws
  from the MCMC fit, so every result comes with a 95% credible interval.
*/
"use strict";

/* ---------- 1. Fixed inputs and data (notebook sections 2, 3 and 5.5) ---------- */
const N = 2480000;                    // Colombo district population, 2017 mid-year estimate
const GAMMA = 7 / 6.5;                // recovery rate per week (infectious for about 6.5 days)
const W = 0.5;                        // width of the smooth on/off switch, in weeks
const STEPS_PER_WEEK = 10;            // RK4 time step h = 0.1 week
const FIRST_WEEK = 12, LAST_WEEK = 42;
const N_WEEKS = LAST_WEEK - FIRST_WEEK + 1;

/* Reported dengue cases in Colombo, weeks 12-42 of 2017: [week, first day of the week, cases].
   Source: Epidemiology Unit, Ministry of Health, Sri Lanka (via the denguedatahub package). */
const REPORTED = [
  [12, "2017-03-18", 528], [13, "2017-03-25", 497], [14, "2017-04-01", 664],
  [15, "2017-04-08", 332], [16, "2017-04-15", 823], [17, "2017-04-22", 751],
  [18, "2017-04-29", 777], [19, "2017-05-06", 772], [20, "2017-05-13", 845],
  [21, "2017-05-20", 939], [22, "2017-05-27", 821], [23, "2017-06-03", 914],
  [24, "2017-06-10", 1032], [25, "2017-06-17", 1267], [26, "2017-06-24", 1338],
  [27, "2017-07-01", 1779], [28, "2017-07-08", 1762], [29, "2017-07-15", 1972],
  [30, "2017-07-22", 1958], [31, "2017-07-29", 1713], [32, "2017-08-05", 836],
  [33, "2017-08-12", 674], [34, "2017-08-19", 397], [35, "2017-08-26", 358],
  [36, "2017-09-02", 273], [37, "2017-09-09", 219], [38, "2017-09-16", 216],
  [39, "2017-09-23", 185], [40, "2017-09-30", 207], [41, "2017-10-07", 234],
  [42, "2017-10-14", 161]
];

/* 200 posterior draws [beta, delta, tau, I0, bg] from the MCMC fit, picked and rounded in
   notebook section 5.5 (seed 42 + 7). The notebook prints the same fingerprint as this page. */
const DRAWS = [
  [1.17573,0.5247,31.7802,250.97,182.64], [1.18626,0.73597,32.5224,198.21,229.77], [1.17021,0.55119,32.1624,277.27,174.14],
  [1.18114,0.47295,31.4459,241.38,174.17], [1.20455,0.51015,31.2814,188.52,194.72], [1.19432,0.54959,31.7279,182.98,199.94],
  [1.18473,0.50811,31.6782,230.29,191.52], [1.18463,0.4624,31.6325,235.8,157.29], [1.18007,0.59562,31.7963,237.55,179.17],
  [1.18551,0.50203,31.6492,233.99,177.08], [1.19056,0.59859,31.8148,208.19,230.32], [1.18288,0.46257,31.5263,222.43,172.86],
  [1.17204,0.49873,31.5217,269.22,176.26], [1.18818,0.63635,31.7654,211.15,206.42], [1.18288,0.54553,31.9673,240.4,177.99],
  [1.17416,0.61268,32.1083,268.16,214.37], [1.18951,0.59354,31.7138,196.7,214.71], [1.17387,0.48009,31.7012,243.81,192.15],
  [1.18293,0.65785,32.1264,236.42,205.07], [1.18736,0.53623,32.1056,210.95,193.34], [1.19258,0.50052,31.4416,207.67,176.92],
  [1.16997,0.44146,31.9938,257.67,144.28], [1.15561,0.46579,31.8482,320.75,186.17], [1.18946,0.49549,31.6319,216.62,171.58],
  [1.17324,0.45104,31.5303,261.87,168.47], [1.18306,0.55242,31.6898,221.96,209.1], [1.18081,0.53782,32.0157,225.42,200.78],
  [1.18049,0.55368,31.8448,238.81,193.26], [1.17041,0.567,32.0435,288.58,206.57], [1.18031,0.46986,31.3741,252.53,178.69],
  [1.17253,0.74022,32.8071,241.43,235.98], [1.19423,0.53833,31.5304,208.44,203.65], [1.16944,0.5675,32.16,300.89,187.32],
  [1.16898,0.53726,32.0373,283.66,177.11], [1.18103,0.44695,31.3694,242.66,176.49], [1.17977,0.51512,32.0261,231.89,173.63],
  [1.17496,0.55176,31.7646,262.07,196.88], [1.17778,0.63331,32.348,234.6,201.63], [1.17079,0.61875,32.3821,246.67,227.75],
  [1.18213,0.58228,31.7785,225.58,205.12], [1.18553,0.55229,32.1379,220.44,184.68], [1.19442,0.57257,31.7094,189.76,197.87],
  [1.17175,0.50027,31.4658,297.17,199.58], [1.18105,0.52295,31.8322,239.4,195.37], [1.18267,0.66468,32.0504,249.08,210.52],
  [1.17345,0.53075,32.0824,258.4,167.87], [1.1675,0.44571,31.5009,255.33,213.21], [1.19239,0.58158,31.6857,190.32,218.83],
  [1.1871,0.53183,31.6157,198.94,201.06], [1.17878,0.44453,31.3977,259.72,170.34], [1.17343,0.51024,31.7164,248.61,189.43],
  [1.18561,0.5171,31.3893,215.24,202.59], [1.17884,0.46806,31.5153,228.05,190.47], [1.18335,0.54193,31.8835,236.52,175.09],
  [1.19355,0.48287,31.4413,205.69,193.37], [1.1924,0.57068,31.8962,200.52,221.67], [1.18566,0.55956,31.7906,215.84,208.91],
  [1.18791,0.53385,31.9644,208.14,213.42], [1.17385,0.52632,31.8339,249.5,168.71], [1.1831,0.47304,31.518,225.68,177.52],
  [1.18329,0.58481,32.0179,243.19,180.64], [1.17355,0.53408,32.0239,245.13,207.27], [1.18302,0.51838,31.3405,234.29,224.84],
  [1.17891,0.47577,31.3169,233.44,182.58], [1.19417,0.48173,31.534,202.45,178.23], [1.19252,0.5065,31.2917,211.64,178.37],
  [1.1886,0.54192,31.4479,224.25,220.29], [1.18273,0.52699,32.003,237.34,182.96], [1.17771,0.59877,32.4775,236.97,219.41],
  [1.19206,0.54084,31.5067,218.65,183.96], [1.16387,0.48606,31.6717,339.27,173.94], [1.17718,0.47927,31.9795,244.4,168.28],
  [1.1897,0.57861,31.7283,219.68,214.93], [1.17531,0.55925,32.0879,242.93,212.56], [1.18213,0.5581,31.9599,244.16,179.91],
  [1.18111,0.5293,32.2719,230.77,175.55], [1.18572,0.49338,31.6625,215.08,192.92], [1.16112,0.41999,31.613,276.03,181.3],
  [1.18218,0.4658,31.5671,235.54,168.57], [1.16197,0.4198,31.6661,276.49,183.85], [1.17302,0.4604,31.614,253.63,157.89],
  [1.17412,0.52434,31.9227,245.1,183.9], [1.17031,0.42836,31.641,276.31,164.2], [1.19434,0.51585,31.6474,192.2,210.92],
  [1.19735,0.60247,31.8054,198.41,193.34], [1.18113,0.54592,31.5676,232.38,182.37], [1.16309,0.66109,32.7358,265.71,208.44],
  [1.194,0.50922,31.6476,201.68,177.11], [1.18201,0.54469,31.7297,227.37,209.22], [1.15814,0.59662,32.4876,323.15,177.63],
  [1.1873,0.49846,31.5005,216.58,212.37], [1.18324,0.60243,31.9117,226.79,195.52], [1.18554,0.54364,31.7826,244.27,171.12],
  [1.17725,0.51297,31.7359,256.02,185.99], [1.1818,0.45608,31.5572,260.57,156.07], [1.17517,0.47908,31.3989,278.38,180.74],
  [1.17954,0.50221,31.6966,223.5,206.98], [1.18081,0.53238,32.2162,209.79,220.36], [1.18511,0.57665,31.9965,252.36,174.07],
  [1.18769,0.56138,31.67,205.15,227.64], [1.17685,0.57378,32.1488,258.64,168.85], [1.18887,0.50996,31.7065,208.33,178.9],
  [1.18421,0.57551,31.6053,235.08,202.6], [1.18083,0.60633,32.1234,234.08,202.58], [1.18916,0.51749,31.6759,205.2,204.46],
  [1.18405,0.54413,31.5835,226.88,207.02], [1.1643,0.55204,32.0824,297.79,192.65], [1.188,0.50551,31.4495,220.33,188.48],
  [1.17862,0.54183,31.7516,237,182.1], [1.18566,0.54301,31.7886,219.43,209.87], [1.1711,0.44131,31.6812,274.41,175.73],
  [1.18343,0.52773,31.9378,226.36,191.84], [1.17271,0.47013,31.4243,275.1,187.99], [1.18898,0.51178,31.595,217.78,195.32],
  [1.19384,0.65601,31.803,201.69,210.97], [1.16507,0.62121,32.3587,283.21,193.42], [1.17219,0.59716,32.2054,251.2,206.56],
  [1.17747,0.49184,31.6876,247.52,177.95], [1.16666,0.46429,31.8311,293.92,174.33], [1.17791,0.5416,31.8541,276.13,183.02],
  [1.18695,0.53405,31.4703,240.33,180.75], [1.18059,0.54454,31.7126,234.8,199.74], [1.16003,0.46977,32.027,320.06,154.84],
  [1.17399,0.50146,31.7807,252.32,193.39], [1.17593,0.41264,31.3331,262.28,165.65], [1.17897,0.58129,32.0415,236.65,209.22],
  [1.19188,0.47822,31.0889,207.53,222.54], [1.18704,0.56134,31.9756,219.35,181.27], [1.18819,0.63539,31.9378,215.78,216.2],
  [1.18167,0.50007,31.7399,249.37,164.72], [1.17723,0.53776,31.5953,260.4,184.92], [1.16595,0.48348,31.7749,276.05,210.3],
  [1.17287,0.53018,31.6996,258.38,203.03], [1.1941,0.43776,31.148,223.77,155.39], [1.16381,0.48083,31.7567,324.29,153.8],
  [1.18095,0.45641,31.4231,256.95,160.96], [1.1904,0.47387,31.6409,193.69,184.33], [1.1689,0.60647,32.2433,262.79,207.96],
  [1.16595,0.50958,31.974,267.22,202.98], [1.15874,0.48807,31.9541,298.42,183.17], [1.18058,0.5835,31.9784,242.12,194.71],
  [1.17949,0.61473,32.2622,225.32,205.59], [1.18203,0.44054,31.4151,239.44,156.94], [1.18471,0.59248,32.1378,186.65,217.04],
  [1.15969,0.60865,32.347,308.2,182.81], [1.17574,0.52737,31.9857,264.02,179.14], [1.17769,0.58341,32.2406,240.09,196.99],
  [1.17676,0.47231,31.4983,251.95,190.28], [1.18716,0.57701,31.8698,208.8,186.05], [1.18705,0.56466,32.1317,211.82,167.73],
  [1.18763,0.55021,31.8244,208.53,186.56], [1.17127,0.4802,31.7347,254.06,199.21], [1.18928,0.61907,32.0052,196.69,218.22],
  [1.19542,0.53651,31.6735,188.82,220.95], [1.18337,0.54168,31.8996,218.65,202.05], [1.18717,0.57991,31.6138,228,192.32],
  [1.17427,0.4841,31.4491,249.93,202.49], [1.17809,0.49325,31.3739,264.11,181.59], [1.19146,0.59811,31.7501,211.12,224.26],
  [1.193,0.5032,31.4637,231.82,153.59], [1.1901,0.5358,31.6862,204.6,187.09], [1.17294,0.59375,32.384,272.72,187.08],
  [1.16661,0.49099,31.6648,284.54,190.18], [1.18213,0.505,31.3522,247.98,199.83], [1.176,0.4927,31.7286,244.41,186.58],
  [1.18015,0.46369,31.7618,230.67,151.88], [1.17675,0.52516,31.8598,237.16,209.74], [1.1847,0.58561,31.8021,243.51,194.65],
  [1.16723,0.47162,31.8819,278.13,170.66], [1.18734,0.60764,32.0677,210.31,220.14], [1.18339,0.46934,31.5567,254.78,154.34],
  [1.19493,0.58223,31.9898,176.78,191.62], [1.19943,0.59183,31.8173,181.46,216.87], [1.17566,0.51131,31.9141,245.55,184.12],
  [1.18273,0.56838,32.3975,208.8,215.39], [1.20029,0.49832,31.2905,184.45,203.24], [1.19928,0.57346,31.3818,202,206.51],
  [1.18427,0.5547,31.8205,244.57,174.59], [1.17368,0.425,31.3177,269.86,174.4], [1.18235,0.54296,31.8393,226.88,217.86],
  [1.17934,0.48863,31.455,268.93,180.41], [1.185,0.47816,31.5693,232.85,176.49], [1.17973,0.49613,31.8279,245.52,164.77],
  [1.16959,0.5621,32.2546,262.25,202.46], [1.1776,0.58178,32.0959,258.57,199.26], [1.17818,0.47086,31.7478,281.44,150.98],
  [1.19162,0.63068,32.1124,200.36,207.08], [1.17085,0.55801,32.0983,265.81,212.3], [1.17321,0.465,31.8547,268.07,150.34],
  [1.17881,0.549,32.3457,199.9,192.22], [1.19032,0.54255,31.7889,209.12,211.81], [1.17534,0.50917,31.5615,246.8,192.13],
  [1.17321,0.53188,31.7972,247.79,206.41], [1.18638,0.69713,32.2615,205.71,223.29], [1.17065,0.54582,31.9722,257.39,207.31],
  [1.17565,0.64716,31.9016,274.23,217.67], [1.18418,0.56679,31.6496,215.85,203.43], [1.18573,0.49984,31.6338,223.62,187.73],
  [1.15686,0.54674,32.399,311.45,184.71], [1.1929,0.55475,31.7626,205.56,184.86]
];
/* ---------- 2. The model: the same equations, constants and steps as the notebook ---------- */

function smoothStep(x) {                       // logistic switch: 0 well before x = 0, 1 well after
  return 1 / (1 + Math.exp(-Math.min(50, Math.max(-50, x))));
}

function transmissionRate(t, d, control) {     // beta(t) in infections per week; d = one posterior draw
  let beta = d[0] * (1 - d[1] * smoothStep((t - d[2]) / W));
  if (control) {                               // mosquito control: cut beta by a fraction while it runs
    const on = smoothStep((t - control.start) / W) - smoothStep((t - control.start - control.weeks) / W);
    beta = beta * (1 - control.cut * on);
  }
  return beta;
}

function sirRates(t, S, I, d, control) {       // dS/dt, dI/dt, dR/dt and dC/dt (C counts all infections)
  const newInfections = transmissionRate(t, d, control) * S * I / N;
  const recoveries = GAMMA * I;
  return [-newInfections, newInfections - recoveries, recoveries, newInfections];
}

function simulate(d, control) {                // expected reported cases for weeks 12-42, solved with RK4
  const h = 1 / STEPS_PER_WEEK;
  let S = N - d[3], I = d[3], R = 0, C = 0, cAtWeekStart = 0;
  const cases = new Float64Array(N_WEEKS);
  for (let k = 0; k < N_WEEKS * STEPS_PER_WEEK; k++) {
    const t = FIRST_WEEK + k * h;
    const k1 = sirRates(t, S, I, d, control);
    const k2 = sirRates(t + h / 2, S + h / 2 * k1[0], I + h / 2 * k1[1], d, control);
    const k3 = sirRates(t + h / 2, S + h / 2 * k2[0], I + h / 2 * k2[1], d, control);
    const k4 = sirRates(t + h, S + h * k3[0], I + h * k3[1], d, control);
    S = S + h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    I = I + h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    R = R + h / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
    C = C + h / 6 * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);
    if ((k + 1) % STEPS_PER_WEEK === 0) {      // end of a calendar week: new infections + background
      cases[(k + 1) / STEPS_PER_WEEK - 1] = (C - cAtWeekStart) + d[4];
      cAtWeekStart = C;
    }
  }
  return cases;
}

/* ---------- 3. Statistics over the 200 draws ---------- */

function quantile(values, q) {                 // linear interpolation, as numpy.percentile does
  const s = Float64Array.from(values).sort();
  const pos = q * (s.length - 1), lo = Math.floor(pos), hi = Math.min(lo + 1, s.length - 1);
  return s[lo] + (s[hi] - s[lo]) * (pos - lo);
}
const summary = (values) => ({ median: quantile(values, 0.5), lo: quantile(values, 0.025), hi: quantile(values, 0.975) });
const argmax = (a) => a.reduce((best, v, i) => (v > a[best] ? i : best), 0);
const total = (a) => a.reduce((s, v) => s + v, 0);

function weeklyBands(runs) {                   // median and 95% band of the curves, week by week
  return Array.from({ length: N_WEEKS }, (_, j) => summary(runs.map((r) => r[j])));
}

const BASE_RUNS = DRAWS.map((d) => simulate(d));        // no extra control: computed once
const BASE_BANDS = weeklyBands(BASE_RUNS);

function runScenario(settings) {               // settings: cut (%), weeksBefore, length (weeks or Infinity)
  const reduction = [], shift = [], averted = [], starts = [], runs = [];
  DRAWS.forEach((d, i) => {
    const base = BASE_RUNS[i];
    const basePeak = argmax(base);
    const start = FIRST_WEEK + basePeak - settings.weeksBefore;   // k weeks before this draw's own peak
    const ctrl = simulate(d, { cut: settings.cut / 100, start, weeks: settings.length });
    const baseMax = base[basePeak];
    reduction.push(100 * (baseMax - Math.max(...ctrl)) / baseMax);
    shift.push(argmax(ctrl) - basePeak);
    averted.push(100 * (total(base) - total(ctrl)) / total(base));
    starts.push(start);
    runs.push(ctrl);
  });
  return {
    reduction: summary(reduction), shift: quantile(shift, 0.5), averted: summary(averted),
    startWeek: Math.round(quantile(starts, 0.5)), bands: weeklyBands(runs),
  };
}

const CRITICAL_CUT = summary(DRAWS.map((d) => 100 * (1 - GAMMA / d[0])));        // c* = 1 - 1/R0
const FINGERPRINT = [0, 1, 2, 3, 4].map((j) => total(DRAWS.map((d) => d[j])) / DRAWS.length);

/* ---------- 4. Reference result from the notebook (section 5.5, same 200 draws) ---------- */
const DEFAULTS = { cut: 20, weeksBefore: 4, length: 21 };          // length 21 on the slider = rest of season
const REFERENCE = { reduction: 37.0, reductionCI: [31.0, 41.1], averted: 26.7, avertedCI: [24.4, 31.6], tolerance: 0.1 };

/* ---------- 5. The page ---------- */
if (typeof document !== "undefined") {
  const $ = (id) => document.getElementById(id);
  const ui = {
    cut: $("cut"), weeksBefore: $("weeks-before"), length: $("length"), speed: $("speed"),
    start: $("start"), pause: $("pause"), reset: $("reset"),
    canvas: $("chart"), tooltip: $("tooltip"), readout: $("readout"),
  };
  const fmt1 = (x) => (Math.abs(x) < 0.05 ? 0 : x).toFixed(1);
  const fmtInt = (x) => Math.round(x).toLocaleString("en-US");
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const setText = (id, text) => { $(id).textContent = text; };
  const dateOf = (j) => {
    const d = new Date(REPORTED[j][1] + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  let scenario = null;       // results for the current slider settings
  let clock = LAST_WEEK + 1; // the week the animation has reached; past the end = whole season shown
  let playing = false, lastFrame = 0, lastReadoutWeek = null, hoverWeek = null;

  function settings() {
    const len = Number(ui.length.value);
    return { cut: Number(ui.cut.value), weeksBefore: Number(ui.weeksBefore.value), length: len >= 21 ? Infinity : len };
  }

  function lengthText(len) { return len === Infinity ? "for the rest of the season" : `for ${plural(len, "week")}`; }

  /* --- results text --- */
  function updateResults() {
    const s = settings();
    scenario = runScenario(s);
    const r = scenario.reduction, a = scenario.averted, shift = Math.round(scenario.shift);

    setText("cut-value", `${s.cut}%`);
    setText("weeks-before-value", s.weeksBefore === 0 ? "in the peak week" : `${plural(s.weeksBefore, "week")} before the peak`);
    setText("length-value", s.length === Infinity ? "rest of the season" : plural(s.length, "week"));

    setText("q-cut", `${s.cut}%`);
    setText("q-length", lengthText(s.length));
    setText("q-start", s.weeksBefore === 0 ? "in the peak week" : `${plural(s.weeksBefore, "week")} before the peak`);
    setText("q-reduction", `${fmt1(r.median)}% lower`);
    setText("q-ci", `${fmt1(r.lo)}–${fmt1(r.hi)}%`);
    setText("q-timing", shift === 0 ? "in the same week" : `${plural(Math.abs(shift), "week")} ${shift < 0 ? "earlier" : "later"}`);

    setText("out-reduction", `${fmt1(r.median)}%`);
    setText("out-reduction-ci", `95% credible interval ${fmt1(r.lo)} to ${fmt1(r.hi)}%`);
    setText("out-timing", shift === 0 ? "Same week" : `${plural(Math.abs(shift), "week")} ${shift < 0 ? "earlier" : "later"}`);
    setText("out-timing-note", `Control starts in week ${scenario.startWeek} for a typical draw`);
    setText("out-averted", `${fmt1(a.median)}%`);
    setText("out-averted-ci", `95% credible interval ${fmt1(a.lo)} to ${fmt1(a.hi)}%`);
    setText("out-critical", `${fmt1(CRITICAL_CUT.median)}%`);
    setText("out-critical-note", s.cut > CRITICAL_CUT.hi
      ? `Your ${s.cut}% cut is above it, so cases stop growing as soon as control starts.`
      : s.cut < CRITICAL_CUT.lo
        ? `Your ${s.cut}% cut is below it, so control only slows the growth.`
        : `Your ${s.cut}% cut is close to it, so cases roughly level off.`);

    updateCheck(s);
    updateTable();
    draw();
  }

  /* --- comparison with the notebook --- */
  function updateCheck(s) {
    setText("fp-demo", FINGERPRINT.map((v) => v.toFixed(4)).join("  "));
    const isDefault = s.cut === DEFAULTS.cut && s.weeksBefore === DEFAULTS.weeksBefore && s.length === Infinity;
    const box = $("check");
    if (!isDefault) {
      box.dataset.state = "off";
      setText("check-status", "Not comparable");
      setText("check-detail", "The settings differ from the reference scenario. Press Reset to compare with the notebook.");
      return;
    }
    const d1 = Math.abs(scenario.reduction.median - REFERENCE.reduction);
    const d2 = Math.abs(scenario.averted.median - REFERENCE.averted);
    const pass = d1 <= REFERENCE.tolerance && d2 <= REFERENCE.tolerance;
    box.dataset.state = pass ? "pass" : "fail";
    setText("check-status", pass ? "Matches the notebook" : "Does not match the notebook");
    setText("check-detail",
      `This page gives a ${fmt1(scenario.reduction.median)}% peak reduction and ${fmt1(scenario.averted.median)}% of cases averted. ` +
      `The differences from the notebook are ${d1.toFixed(2)} and ${d2.toFixed(2)} percentage points, ` +
      (pass ? "inside" : "outside") + ` the ±${REFERENCE.tolerance} tolerance.`);
  }

  /* --- table view of the chart --- */
  function updateTable() {
    const body = $("table-body");
    body.replaceChildren();
    REPORTED.forEach(([week, , cases], j) => {
      const row = document.createElement("tr");
      [String(week), dateOf(j), fmtInt(cases), fmtInt(BASE_BANDS[j].median), fmtInt(scenario.bands[j].median)]
        .forEach((text) => { const cell = document.createElement("td"); cell.textContent = text; row.append(cell); });
      body.append(row);
    });
  }

  /* --- the chart --- */
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const Y_MAX = Math.ceil(Math.max(...REPORTED.map((r) => r[2]), ...BASE_BANDS.map((b) => b.hi)) / 500) * 500;
  let geom = null;

  function draw() {
    if (!scenario) return;
    const canvas = ui.canvas, dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const m = { left: 52, right: 16, top: 22, bottom: 44 };
    const x = (week) => m.left + (week - (FIRST_WEEK - 0.5)) / (N_WEEKS) * (width - m.left - m.right);
    const y = (v) => height - m.bottom - (v / Y_MAX) * (height - m.top - m.bottom);
    geom = { x, m, width, height };
    const font = (size, weight = 400) => `${weight} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    const shown = Math.min(clock, LAST_WEEK + 0.5);

    // control period (for a typical draw)
    const s = settings();
    const cStart = scenario.startWeek, cEnd = Math.min(cStart + s.length, LAST_WEEK + 0.5);
    if (s.cut > 0) {
      ctx.fillStyle = css("--control-wash");
      ctx.fillRect(x(cStart), m.top, x(cEnd) - x(cStart), height - m.top - m.bottom);
      ctx.fillStyle = css("--text-muted"); ctx.font = font(12);
      ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      ctx.fillText("Control on", x(cStart) + 6, m.top - 4);
    }

    // gridlines and y axis labels
    ctx.font = font(12); ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (let v = 0; v <= Y_MAX; v += 500) {
      ctx.strokeStyle = v === 0 ? css("--axis") : css("--grid");
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(m.left, Math.round(y(v)) + 0.5); ctx.lineTo(width - m.right, Math.round(y(v)) + 0.5); ctx.stroke();
      ctx.fillStyle = css("--text-muted");
      ctx.fillText(fmtInt(v), m.left - 8, y(v));
    }
    // x axis labels
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (let w = 15; w <= LAST_WEEK; w += 5) ctx.fillText(String(w), x(w), height - m.bottom + 8);
    ctx.fillText("Week of 2017", m.left + (width - m.left - m.right) / 2, height - m.bottom + 26);

    // everything up to the animation clock
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, x(shown) + 5, height); ctx.clip();
    const band = (bands, color) => {
      ctx.fillStyle = color; ctx.beginPath();
      bands.forEach((b, j) => ctx.lineTo(x(FIRST_WEEK + j), y(b.hi)));
      for (let j = N_WEEKS - 1; j >= 0; j--) ctx.lineTo(x(FIRST_WEEK + j), y(bands[j].lo));
      ctx.closePath(); ctx.fill();
    };
    const line = (bands, color) => {
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.beginPath(); bands.forEach((b, j) => ctx.lineTo(x(FIRST_WEEK + j), y(b.median))); ctx.stroke();
    };
    band(BASE_BANDS, css("--base-wash"));
    if (s.cut > 0) band(scenario.bands, css("--ctrl-wash"));
    ctx.fillStyle = css("--reported");
    REPORTED.forEach(([week, , cases]) => { ctx.beginPath(); ctx.arc(x(week), y(cases), 3, 0, 2 * Math.PI); ctx.fill(); });
    line(BASE_BANDS, css("--base"));
    if (s.cut > 0) line(scenario.bands, css("--ctrl"));

    // peak markers with labels
    const peaks = [[BASE_BANDS, css("--base"), "above"]];
    if (s.cut > 0) peaks.push([scenario.bands, css("--ctrl"), "below"]);
    peaks.forEach(([bands, color, where]) => {
      const j = argmax(bands.map((b) => b.median)), px = x(FIRST_WEEK + j), py = y(bands[j].median);
      if (FIRST_WEEK + j > shown) return;
      ctx.beginPath(); ctx.arc(px, py, 6, 0, 2 * Math.PI); ctx.fillStyle = css("--surface"); ctx.fill();
      ctx.beginPath(); ctx.arc(px, py, 4, 0, 2 * Math.PI); ctx.fillStyle = color; ctx.fill();
      ctx.font = font(12, 600); ctx.fillStyle = css("--text-secondary");
      ctx.textAlign = px > width - 150 ? "right" : "left";
      ctx.textBaseline = where === "above" ? "bottom" : "top";
      ctx.fillText(`Peak ${fmtInt(bands[j].median)}, week ${FIRST_WEEK + j}`, px + (ctx.textAlign === "left" ? 9 : -9), py + (where === "above" ? -6 : 8));
    });
    ctx.restore();

    // animation clock line
    if (clock <= LAST_WEEK + 0.5) {
      ctx.strokeStyle = css("--text-secondary"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(Math.round(x(shown)) + 0.5, m.top); ctx.lineTo(Math.round(x(shown)) + 0.5, height - m.bottom); ctx.stroke();
    }
    // hover crosshair
    if (hoverWeek !== null) {
      ctx.strokeStyle = css("--axis"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(Math.round(x(hoverWeek)) + 0.5, m.top); ctx.lineTo(Math.round(x(hoverWeek)) + 0.5, height - m.bottom); ctx.stroke();
    }
    updateReadout(shown);
  }

  /* --- live readout during the animation --- */
  function updateReadout(shown) {
    const week = Math.min(Math.floor(shown), LAST_WEEK);
    const key = clock > LAST_WEEK + 0.5 ? "all" : week;
    if (key === lastReadoutWeek) return;
    lastReadoutWeek = key;
    if (key === "all") {
      ui.readout.textContent = "The whole season is shown. Press Start to replay weeks 12 to 42 of 2017.";
      return;
    }
    if (week < FIRST_WEEK) { ui.readout.textContent = "Week 12 of 2017 is about to start."; return; }
    const j = week - FIRST_WEEK;
    let avoided = 0;
    for (let i = 0; i <= j; i++) avoided += BASE_BANDS[i].median - scenario.bands[i].median;
    ui.readout.textContent =
      `Week ${week} (from ${dateOf(j)}): ${fmtInt(scenario.bands[j].median)} cases with control, ` +
      `${fmtInt(BASE_BANDS[j].median)} without. Cases avoided so far: about ${fmtInt(Math.max(0, avoided))}.`;
  }

  /* --- hover and keyboard tooltip --- */
  function showTooltip(week) {
    const shown = Math.min(clock, LAST_WEEK + 0.5);
    if (week === null || week > shown || !geom) { hoverWeek = null; ui.tooltip.hidden = true; draw(); return; }
    hoverWeek = week;
    const j = week - FIRST_WEEK, b = BASE_BANDS[j], c = scenario.bands[j];
    $("tt-week").textContent = `Week ${week}, from ${dateOf(j)}`;
    $("tt-reported").textContent = fmtInt(REPORTED[j][2]);
    $("tt-base").textContent = fmtInt(b.median);
    $("tt-base-ci").textContent = `${fmtInt(b.lo)}–${fmtInt(b.hi)}`;
    $("tt-ctrl").textContent = fmtInt(c.median);
    $("tt-ctrl-ci").textContent = `${fmtInt(c.lo)}–${fmtInt(c.hi)}`;
    ui.tooltip.hidden = false;
    const px = geom.x(week), tipWidth = ui.tooltip.offsetWidth;
    ui.tooltip.style.left = `${px + 14 + tipWidth > geom.width ? px - 14 - tipWidth : px + 14}px`;
    ui.tooltip.style.top = `${geom.m.top + 8}px`;
    draw();
  }
  ui.canvas.addEventListener("pointermove", (e) => {
    if (!geom) return;
    const rect = ui.canvas.getBoundingClientRect(), px = e.clientX - rect.left;
    let best = null, bestDist = Infinity;
    for (let w = FIRST_WEEK; w <= LAST_WEEK; w++) {
      const dist = Math.abs(geom.x(w) - px);
      if (dist < bestDist) { best = w; bestDist = dist; }
    }
    showTooltip(px < geom.m.left - 10 ? null : best);
  });
  ui.canvas.addEventListener("pointerleave", () => showTooltip(null));
  ui.canvas.addEventListener("blur", () => showTooltip(null));
  ui.canvas.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const last = Math.min(LAST_WEEK, Math.floor(Math.min(clock, LAST_WEEK + 0.5)));
    const current = hoverWeek === null ? FIRST_WEEK : hoverWeek + (e.key === "ArrowRight" ? 1 : -1);
    showTooltip(Math.max(FIRST_WEEK, Math.min(last, current)));
  });

  /* --- Start / Pause / Reset --- */
  function setPlaying(on) {
    playing = on;
    ui.start.disabled = on; ui.pause.disabled = !on;
    if (on) { lastFrame = performance.now(); requestAnimationFrame(step); }
  }
  function step(now) {
    if (!playing) return;
    clock += (now - lastFrame) / 1000 * Number(ui.speed.value);
    lastFrame = now;
    if (clock >= LAST_WEEK + 0.5) { clock = LAST_WEEK + 1; setPlaying(false); }
    draw();
    if (playing) requestAnimationFrame(step);
  }
  ui.start.addEventListener("click", () => {
    if (clock > LAST_WEEK + 0.5) clock = FIRST_WEEK - 0.5;   // finished: replay from the start
    lastReadoutWeek = null;
    setPlaying(true);
  });
  ui.pause.addEventListener("click", () => setPlaying(false));
  ui.reset.addEventListener("click", () => {
    setPlaying(false);
    ui.cut.value = DEFAULTS.cut; ui.weeksBefore.value = DEFAULTS.weeksBefore; ui.length.value = DEFAULTS.length;
    clock = LAST_WEEK + 1; lastReadoutWeek = null; hoverWeek = null; ui.tooltip.hidden = true;
    updateResults();
  });
  [ui.cut, ui.weeksBefore, ui.length].forEach((el) => el.addEventListener("input", () => { lastReadoutWeek = null; updateResults(); }));

  /* --- redraw when the size or the colour scheme changes --- */
  new ResizeObserver(() => draw()).observe(ui.canvas);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => draw());

  setText("ref-reduction", `${fmt1(REFERENCE.reduction)}% (${fmt1(REFERENCE.reductionCI[0])} to ${fmt1(REFERENCE.reductionCI[1])})`);
  setText("ref-averted", `${fmt1(REFERENCE.averted)}% (${fmt1(REFERENCE.avertedCI[0])} to ${fmt1(REFERENCE.avertedCI[1])})`);
  setText("tolerance", `±${REFERENCE.tolerance} percentage points`);
  updateResults();
}