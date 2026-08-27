(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const WIDTH = 260;
  const HEIGHT = 110;

  const svg = document.getElementById('eridanus-chart');
  if (!svg) return;

  /* ==========================================================
     CONFIG

     These are the main values to experiment with.
     ========================================================== */

  const CONFIG = {
    bridgeStars: {
      enabled: true,

      // Try 8 / 12 / 16.
      count: 12,

      minOpacity: 0.10,
      maxOpacity: 0.34,

      fadeMinSeconds: 24,
      fadeMaxSeconds: 52,

      minRadius: 0.62,
      maxRadius: 1.12,

      // Maximum graph degree for anonymous stars.
      maxConnections: 3
    },

    graph: {
      // New connections appear inside this distance.
      connectAt: 35,

      // Existing connections survive until this distance.
      // Gives hysteresis, preventing flicker.
      disconnectAt: 42,

      // Named stars may support slightly richer topology.
      maxNamedConnections: 4,

      minEdgeOpacity: 0.045,
      maxEdgeOpacity: 0.30,

      // Smoothing rate for lines.
      fadeSpeed: 0.075,

      // Higher = labels require more local connectivity
      // before becoming prominent.
      labelInfluence: 1.55
    },

    labels: {
      maxSecondaryOpacity: 0.64,
      fadeSpeed: 0.055,

      // Produces: Azha · ازها
      separator: ' · ',

      arabicScale: 0.82,

      // Extra gap before Arabic text.
      gap: 3.2
    }
  };

  const reduceMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

  /*
     Normalized bounds.

     Authored orbits are automatically reduced when necessary
     so named and bridge stars cannot escape the chart.
  */
  const SAFE = {
    left: 0.035,
    right: 0.965,
    top: 0.075,
    bottom: 0.925
  };

  /* ==========================================================
     NAMED STAR CONFIGURATION

     This deliberately preserves the character of the original
     implementation:

       ellipse
       flow
       wave
       loop

     Each star retains:
       - its own home position
       - its own orbit
       - amplitude
       - rotation
       - direction
       - velocity
       - deformation

     Speeds are time-based rather than frame-based.
     ========================================================== */

  const namedStarConfig = {
    achernar: {
      x: 0.10,
      y: 0.23,
      r: 2.35,

      path: 'ellipse',
      radiusX: 0.16,
      radiusY: 0.070,

      rotation: 0.20,
      speed: 0.114,
      deformation: 0.12,

      label: 'Achernar',

      dx: 7,
      dy: -5,
      anchor: 'start',

      size: 8.2,
      baseLabelOpacity: 0.16
    },

    acamar: {
      x: 0.20,
      y: 0.38,
      r: 1.80,

      path: 'flow',
      radiusX: 0.19,
      radiusY: 0.085,

      rotation: -0.12,
      speed: -0.132,
      deformation: 0.18,

      label: 'Acamar',
      arabic: 'آخر النهر',

      dx: -7,
      dy: -5,
      anchor: 'end',

      size: 7.5,
      baseLabelOpacity: 0.13
    },

    azha: {
      x: 0.30,
      y: 0.69,
      r: 3.00,

      path: 'ellipse',
      radiusX: 0.125,
      radiusY: 0.052,

      rotation: -0.22,
      speed: 0.087,
      deformation: 0.10,

      label: 'Azha',
      arabic: 'ازها',

      dx: 9,
      dy: -2,
      anchor: 'start',

      size: 10.5,
      baseLabelOpacity: 0.96,

      primary: true
    },

    rana: {
      x: 0.47,
      y: 0.43,
      r: 1.85,

      path: 'flow',
      radiusX: 0.22,
      radiusY: 0.095,

      rotation: 0.27,
      speed: -0.150,
      deformation: 0.21,

      label: 'Rana',

      dx: 7,
      dy: -4,
      anchor: 'start',

      size: 7.8,
      baseLabelOpacity: 0.12
    },

    beid: {
      x: 0.59,
      y: 0.62,
      r: 1.45,

      path: 'ellipse',
      radiusX: 0.18,
      radiusY: 0.085,

      rotation: -0.35,
      speed: 0.126,
      deformation: 0.14,

      label: 'Beid',
      arabic: 'البيض',

      dx: -7,
      dy: -5,
      anchor: 'end',

      size: 7.1,
      baseLabelOpacity: 0.10
    },

    zaurak: {
      x: 0.71,
      y: 0.50,
      r: 1.85,

      path: 'wave',
      radiusX: 0.20,
      radiusY: 0.090,

      rotation: 0.18,
      speed: -0.138,
      deformation: 0.19,

      label: 'Zaurak',
      arabic: 'زورق',

      dx: 7,
      dy: -4,
      anchor: 'start',

      size: 7.9,
      baseLabelOpacity: 0.13
    },

    angetenar: {
      x: 0.66,
      y: 0.76,
      r: 1.45,

      path: 'loop',
      radiusX: 0.17,
      radiusY: 0.075,

      rotation: -0.28,
      speed: 0.156,
      deformation: 0.17,

      label: 'Angetenar',

      dx: 7,
      dy: 3,
      anchor: 'start',

      size: 6.7,
      baseLabelOpacity: 0.08
    },

    keid: {
      x: 0.81,
      y: 0.69,
      r: 1.55,

      path: 'flow',
      radiusX: 0.17,
      radiusY: 0.080,

      rotation: 0.34,
      speed: -0.141,
      deformation: 0.16,

      label: 'Keid',
      arabic: 'القيد',

      dx: 7,
      dy: -4,
      anchor: 'start',

      size: 7.1,
      baseLabelOpacity: 0.10
    },

    cursa: {
      x: 0.88,
      y: 0.42,
      r: 2.10,

      path: 'ellipse',
      radiusX: 0.14,
      radiusY: 0.065,

      rotation: -0.26,
      speed: 0.111,
      deformation: 0.11,

      label: 'Cursa',
      arabic: 'الكرسي',

      dx: -7,
      dy: -5,
      anchor: 'end',

      size: 8.4,
      baseLabelOpacity: 0.15
    }
  };

  /* ==========================================================
     SVG HELPERS
     ========================================================== */

  function createSvg(tag, attrs, parent) {
    const element =
      document.createElementNS(
        SVG_NS,
        tag
      );

    Object.entries(
      attrs || {}
    ).forEach(
      ([key, value]) => {
        element.setAttribute(
          key,
          String(value)
        );
      }
    );

    parent.appendChild(element);

    return element;
  }

  function clamp01(value) {
    return Math.max(
      0,
      Math.min(1, value)
    );
  }

  function lerp(current, target, amount) {
    return (
      current +
      (target - current) *
      amount
    );
  }

  /* ==========================================================
     DETERMINISTIC RANDOMNESS

     Bridge stars should look irregular without completely
     changing identity every reload.
     ========================================================== */

  function hash01(seed) {
    let x = seed | 0;

    x =
      Math.imul(
        x ^ (x >>> 16),
        0x45d9f3b
      );

    x =
      Math.imul(
        x ^ (x >>> 16),
        0x45d9f3b
      );

    x =
      x ^
      (x >>> 16);

    return (
      (x >>> 0) /
      4294967295
    );
  }

  function seeded(index, channel) {
    return hash01(
      (index + 1) *
      73856093 ^
      (channel + 1) *
      19349663
    );
  }

  /* ==========================================================
     ORIGINAL PATH CHARACTER
     ========================================================== */

  function getOrbitPoint(star, angle) {
    const d =
      star.deformation;

    let x;
    let y;

    switch (star.path) {
      case 'flow':
        x =
          Math.cos(angle) +
          d *
          Math.sin(
            angle * 2.0
          );

        y =
          Math.sin(angle) +
          d *
          0.55 *
          Math.cos(
            angle * 1.5
          );

        break;

      case 'wave':
        x =
          Math.cos(angle) +
          d *
          Math.cos(
            angle * 2.5
          );

        y =
          Math.sin(angle) +
          d *
          0.50 *
          Math.sin(
            angle * 2.0
          );

        break;

      case 'loop':
        x =
          Math.cos(angle) +
          d *
          0.75 *
          Math.sin(
            angle * 2.0
          );

        y =
          Math.sin(angle) +
          d *
          0.65 *
          Math.cos(
            angle * 3.0
          );

        break;

      case 'ellipse':
      default:
        x =
          Math.cos(angle) +
          d *
          0.35 *
          Math.sin(
            angle * 2.0
          );

        y =
          Math.sin(angle) +
          d *
          0.30 *
          Math.cos(
            angle * 2.0
          );

        break;
    }

    return {
      x,
      y
    };
  }

  /* ==========================================================
     SAFE ORBIT CALCULATION
     ========================================================== */

  function calculateSafeOrbitScale(star) {
    const samples = 360;

    let minX = Infinity;
    let maxX = -Infinity;

    let minY = Infinity;
    let maxY = -Infinity;

    const cosR =
      Math.cos(
        star.rotation
      );

    const sinR =
      Math.sin(
        star.rotation
      );

    for (
      let i = 0;
      i < samples;
      i += 1
    ) {
      const angle =
        (
          i /
          samples
        ) *
        Math.PI *
        2;

      const point =
        getOrbitPoint(
          star,
          angle
        );

      const localX =
        point.x *
        star.radiusX;

      const localY =
        point.y *
        star.radiusY;

      const rotatedX =
        localX *
        cosR -
        localY *
        sinR;

      const rotatedY =
        localX *
        sinR +
        localY *
        cosR;

      minX =
        Math.min(
          minX,
          rotatedX
        );

      maxX =
        Math.max(
          maxX,
          rotatedX
        );

      minY =
        Math.min(
          minY,
          rotatedY
        );

      maxY =
        Math.max(
          maxY,
          rotatedY
        );
    }

    let scale = 1;

    const availableLeft =
      star.x -
      SAFE.left;

    const availableRight =
      SAFE.right -
      star.x;

    const availableTop =
      star.y -
      SAFE.top;

    const availableBottom =
      SAFE.bottom -
      star.y;

    if (minX < 0) {
      scale =
        Math.min(
          scale,
          availableLeft /
          Math.abs(minX)
        );
    }

    if (maxX > 0) {
      scale =
        Math.min(
          scale,
          availableRight /
          maxX
        );
    }

    if (minY < 0) {
      scale =
        Math.min(
          scale,
          availableTop /
          Math.abs(minY)
        );
    }

    if (maxY > 0) {
      scale =
        Math.min(
          scale,
          availableBottom /
          maxY
        );
    }

    return Math.max(
      0,
      Math.min(
        1,
        scale
      )
    );
  }

  /* ==========================================================
     POSITION CALCULATION
     ========================================================== */

  function positionNamedStar(
    star,
    seconds
  ) {
    if (reduceMotion) {
      return {
        x:
          star.x *
          WIDTH,

        y:
          star.y *
          HEIGHT
      };
    }

    const angle =
      star.phase +
      seconds *
      star.speed;

    const point =
      getOrbitPoint(
        star,
        angle
      );

    const scale =
      star.orbitScale;

    const localX =
      point.x *
      star.radiusX *
      scale;

    const localY =
      point.y *
      star.radiusY *
      scale;

    const cosR =
      Math.cos(
        star.rotation
      );

    const sinR =
      Math.sin(
        star.rotation
      );

    const rotatedX =
      localX *
      cosR -
      localY *
      sinR;

    const rotatedY =
      localX *
      sinR +
      localY *
      cosR;

    return {
      x:
        (
          star.x +
          rotatedX
        ) *
        WIDTH,

      y:
        (
          star.y +
          rotatedY
        ) *
        HEIGHT
    };
  }

  /* ==========================================================
     BRIDGE STARS

     Anonymous stars:
       - have no labels
       - have deterministic but irregular trajectories
       - softly fade in/out
       - participate in the graph
     ========================================================== */

  function createBridgeStars(count) {
    const paths = [
      'ellipse',
      'flow',
      'wave',
      'loop'
    ];

    const bridges = {};

    for (
      let i = 0;
      i < count;
      i += 1
    ) {
      const id =
        `bridge-${i + 1}`;

      const homeX =
        0.08 +
        seeded(i, 0) *
        0.84;

      const homeY =
        0.12 +
        seeded(i, 1) *
        0.76;

      const path =
        paths[
          Math.floor(
            seeded(i, 2) *
            paths.length
          ) %
          paths.length
        ];

      const direction =
        seeded(i, 3) > 0.5
          ? 1
          : -1;

      const star = {
        id,
        named: false,

        x: homeX,
        y: homeY,

        r:
          CONFIG.bridgeStars.minRadius +
          seeded(i, 4) *
          (
            CONFIG.bridgeStars.maxRadius -
            CONFIG.bridgeStars.minRadius
          ),

        path,

        radiusX:
          0.025 +
          seeded(i, 5) *
          0.055,

        radiusY:
          0.018 +
          seeded(i, 6) *
          0.040,

        rotation:
          -0.6 +
          seeded(i, 7) *
          1.2,

        speed:
          direction *
          (
            0.055 +
            seeded(i, 8) *
            0.085
          ),

        deformation:
          0.08 +
          seeded(i, 9) *
          0.15,

        phase:
          seeded(i, 10) *
          Math.PI *
          2,

        fadePhase:
          seeded(i, 11) *
          Math.PI *
          2,

        fadePeriod:
          CONFIG.bridgeStars.fadeMinSeconds +
          seeded(i, 12) *
          (
            CONFIG.bridgeStars.fadeMaxSeconds -
            CONFIG.bridgeStars.fadeMinSeconds
          )
      };

      star.orbitScale =
        calculateSafeOrbitScale(
          star
        );

      bridges[id] =
        star;
    }

    return bridges;
  }

  function bridgeVisibility(
    star,
    seconds
  ) {
    if (reduceMotion) {
      return 0.22;
    }

    const wave =
      0.5 +
      0.5 *
      Math.sin(
        (
          seconds /
          star.fadePeriod
        ) *
        Math.PI *
        2 +
        star.fadePhase
      );

    /*
       Smoothstep-like shaping.
    */
    const shaped =
      wave *
      wave *
      (
        3 -
        2 *
        wave
      );

    return (
      CONFIG.bridgeStars.minOpacity +
      shaped *
      (
        CONFIG.bridgeStars.maxOpacity -
        CONFIG.bridgeStars.minOpacity
      )
    );
  }

  function distance(a, b) {
    return Math.hypot(
      a.x - b.x,
      a.y - b.y
    );
  }

  /* ==========================================================
     BUILD SVG SCENE
     ========================================================== */

  svg.setAttribute(
    'viewBox',
    `0 0 ${WIDTH} ${HEIGHT}`
  );

  svg.setAttribute(
    'preserveAspectRatio',
    'xMidYMid meet'
  );

  /*
     Clear any old markup from previous versions.
  */
  svg.textContent = '';

  const edgeLayer =
    createSvg(
      'g',
      {
        class:
          'chart-edges'
      },
      svg
    );

  const bridgeLayer =
    createSvg(
      'g',
      {
        class:
          'chart-bridge-stars'
      },
      svg
    );

  const namedLayer =
    createSvg(
      'g',
      {
        class:
          'chart-named-stars'
      },
      svg
    );

  const labelLayer =
    createSvg(
      'g',
      {
        class:
          'chart-labels'
      },
      svg
    );

  /* ==========================================================
     INITIALISE NAMED STARS
     ========================================================== */

  const namedStars = {};

  const namedNames =
    Object.keys(
      namedStarConfig
    );

  namedNames.forEach(
    (name, index) => {
      const config =
        namedStarConfig[name];

      const star = {
        ...config,

        id: name,
        named: true,

        phase:
          (
            index /
            namedNames.length
          ) *
          Math.PI *
          2
      };

      star.orbitScale =
        calculateSafeOrbitScale(
          star
        );

      namedStars[name] =
        star;
    }
  );

  const bridgeStars =
    CONFIG.bridgeStars.enabled
      ? createBridgeStars(
          CONFIG.bridgeStars.count
        )
      : {};

  const allStars = {
    ...namedStars,
    ...bridgeStars
  };

  const allNames =
    Object.keys(
      allStars
    );

  /* ==========================================================
     RUNTIME STATE
     ========================================================== */

  const runtime = {
    positions: {},
    visibility: {},

    /*
       Map allows graph edges to persist independently from
       each frame's set of active pairs.
    */
    edges:
      new Map(),

    labels: {},

    raf: 0,

    running: false,

    elapsedMs: 0,
    lastStartedAt: 0
  };

  /* ==========================================================
     CREATE BRIDGE STAR ELEMENTS
     ========================================================== */

  Object.values(
    bridgeStars
  ).forEach(
    (star) => {
      star.element =
        createSvg(
          'circle',
          {
            class:
              'chart-bridge-star',

            cx:
              star.x *
              WIDTH,

            cy:
              star.y *
              HEIGHT,

            r:
              star.r,

            opacity:
              CONFIG.bridgeStars.minOpacity
          },
          bridgeLayer
        );
    }
  );

  /* ==========================================================
     CREATE NAMED STARS + LABELS
     ========================================================== */

  Object.values(
    namedStars
  ).forEach(
    (star) => {

      /*
         Azha gets a very subtle breathing halo.
      */
      if (star.primary) {
        star.halo =
          createSvg(
            'circle',
            {
              class:
                'chart-star-halo',

              cx:
                star.x *
                WIDTH,

              cy:
                star.y *
                HEIGHT,

              r:
                star.r *
                2.25
            },
            namedLayer
          );
      }

      star.element =
        createSvg(
          'circle',
          {
            class:
              `chart-star${
                star.primary
                  ? ' chart-star--azha'
                  : ''
              }`,

            cx:
              star.x *
              WIDTH,

            cy:
              star.y *
              HEIGHT,

            r:
              star.r
          },
          namedLayer
        );

      /*
         One SVG group owns the whole bilingual label.

         English, separator and Arabic therefore always share:
           - position
           - color
           - opacity
           - connectivity fading
      */
      const group =
        createSvg(
          'g',
          {
            class:
              `chart-label-group chart-label-${star.id}`,

            opacity:
              star.baseLabelOpacity
          },
          labelLayer
        );

      const english =
        createSvg(
          'text',
          {
            class:
              'chart-label chart-label-english',

            'font-size':
              star.size,

            x: 0,
            y: 0
          },
          group
        );

      english.textContent =
        star.label;

      let separator = null;
      let arabic = null;

      if (star.arabic) {
        separator =
          createSvg(
            'text',
            {
              class:
                'chart-label chart-label-separator',

              'font-size':
                star.size,

              x: 0,
              y: 0
            },
            group
          );

        separator.textContent =
          CONFIG.labels.separator;

        arabic =
          createSvg(
            'text',
            {
              class:
                'chart-label chart-label-arabic',

              'font-size':
                star.size *
                CONFIG.labels.arabicScale,

              direction:
                'rtl',

              'unicode-bidi':
                'isolate',

              x: 0,
              y: 0
            },
            group
          );

        arabic.textContent =
          star.arabic;
      }

      runtime.labels[
        star.id
      ] = {
        group,
        english,
        separator,
        arabic,

        opacity:
          star.baseLabelOpacity,

        totalWidth: 0,
        anchorOffset: 0
      };
    }
  );

  /* ==========================================================
     LABEL LAYOUT

     Each script is measured independently so mixed LTR / RTL
     remains predictable across browsers and fonts.

     Result:
       Azha · ازها
     ========================================================== */

  function layoutLabel(name) {
    const star =
      namedStars[name];

    const label =
      runtime.labels[name];

    if (
      !star ||
      !label
    ) {
      return;
    }

    const englishBox =
      label.english
        .getBBox();

    const separatorBox =
      label.separator
        ? label.separator
            .getBBox()
        : null;

    const arabicBox =
      label.arabic
        ? label.arabic
            .getBBox()
        : null;

    const englishWidth =
      englishBox.width;

    const separatorWidth =
      separatorBox
        ? separatorBox.width
        : 0;

    const arabicWidth =
      arabicBox
        ? arabicBox.width
        : 0;

    const gap =
      label.arabic
        ? CONFIG.labels.gap
        : 0;

    const total =
      englishWidth +
      separatorWidth +
      arabicWidth +
      gap;

    label.totalWidth =
      total;

    /*
       The whole bilingual label behaves as one block.
    */
    label.anchorOffset =
      star.anchor === 'end'
        ? -total
        : 0;

    /*
       Correct for each element's actual rendered bounding box.
    */
    label.english
      .setAttribute(
        'transform',
        `translate(${
          -englishBox.x
        } 0)`
      );

    if (
      label.separator &&
      separatorBox
    ) {
      const separatorLeft =
        englishWidth;

      label.separator
        .setAttribute(
          'transform',
          `translate(${
            separatorLeft -
            separatorBox.x
          } 0)`
        );
    }

    if (
      label.arabic &&
      arabicBox
    ) {
      const arabicLeft =
        englishWidth +
        separatorWidth +
        gap;

      label.arabic
        .setAttribute(
          'transform',
          `translate(${
            arabicLeft -
            arabicBox.x
          } 0)`
        );
    }
  }

  function layoutAllLabels() {
    namedNames.forEach(
      layoutLabel
    );
  }

  /*
     Initial layout.
  */
  layoutAllLabels();

  /*
     Re-measure after webfonts are available because the width
     of Fraunces/system Arabic fonts can differ substantially
     from fallback metrics.
  */
  if (
    document.fonts &&
    document.fonts.ready
  ) {
    document.fonts.ready
      .then(
        layoutAllLabels
      )
      .catch(
        () => {
          /*
             Fallback font layout is still valid.
          */
        }
      );
  }

  /* ==========================================================
     GRAPH HELPERS
     ========================================================== */

  function edgeKey(a, b) {
    return (
      a < b
        ? `${a}|${b}`
        : `${b}|${a}`
    );
  }

  function ensureEdge(a, b) {
    const key =
      edgeKey(a, b);

    let edge =
      runtime.edges
        .get(key);

    if (!edge) {
      const line =
        createSvg(
          'line',
          {
            class:
              'chart-edge',

            x1: 0,
            y1: 0,

            x2: 0,
            y2: 0,

            opacity: 0
          },
          edgeLayer
        );

      edge = {
        key,
        a,
        b,

        line,

        /*
           latched = currently inside hysteresis relationship.
        */
        latched: false,

        /*
           selected = survives degree-limit filtering this frame.
        */
        selected: false,

        opacity: 0,
        targetOpacity: 0,

        removeWhenHidden: false
      };

      runtime.edges.set(
        key,
        edge
      );
    }

    return edge;
  }

  /* ==========================================================
     UPDATE POSITIONS
     ========================================================== */

  function updatePositions(seconds) {
    Object.values(
      namedStars
    ).forEach(
      (star) => {
        const pos =
          positionNamedStar(
            star,
            seconds
          );

        runtime.positions[
          star.id
        ] = pos;

        runtime.visibility[
          star.id
        ] = 1;

        star.element
          .setAttribute(
            'cx',
            pos.x.toFixed(2)
          );

        star.element
          .setAttribute(
            'cy',
            pos.y.toFixed(2)
          );

        /*
           Azha remains stable, with just a tiny halo breath.
        */
        if (star.halo) {
          const breath =
            reduceMotion
              ? 1
              :
                1 +
                Math.sin(
                  seconds *
                  0.55
                ) *
                0.035;

          star.halo
            .setAttribute(
              'cx',
              pos.x.toFixed(2)
            );

          star.halo
            .setAttribute(
              'cy',
              pos.y.toFixed(2)
            );

          star.halo
            .setAttribute(
              'r',
              (
                star.r *
                2.25 *
                breath
              ).toFixed(2)
            );
        }
      }
    );

    Object.values(
      bridgeStars
    ).forEach(
      (star) => {
        const pos =
          positionNamedStar(
            star,
            seconds
          );

        const visibility =
          bridgeVisibility(
            star,
            seconds
          );

        runtime.positions[
          star.id
        ] = pos;

        runtime.visibility[
          star.id
        ] = visibility;

        star.element
          .setAttribute(
            'cx',
            pos.x.toFixed(2)
          );

        star.element
          .setAttribute(
            'cy',
            pos.y.toFixed(2)
          );

        star.element
          .setAttribute(
            'opacity',
            visibility.toFixed(3)
          );
      }
    );
  }

  /* ==========================================================
     DYNAMIC PROXIMITY GRAPH

     This recreates the important "living" quality from the old
     particles.js version:

       - new edges can emerge
       - old edges can die
       - any nearby nodes may connect
       - topology evolves continuously

     Improvements over raw particle proximity:
       - hysteresis
       - maximum degree
       - edge fading
       - bridge visibility affects line visibility
     ========================================================== */

  function updateGraph() {
    const degrees = {};
    const connectivity = {};
    const eligible = [];

    allNames.forEach(
      (name) => {
        degrees[name] = 0;
        connectivity[name] = 0;
      }
    );

    /*
       Reset selection each frame, but retain hysteresis state.
    */
    runtime.edges.forEach(
      (edge) => {
        edge.selected = false;
        edge.targetOpacity = 0;
      }
    );

    /*
       Evaluate every pair.

       With 21 nodes this is only 210 pairs — trivial for the
       browser and considerably smaller than most particle
       simulations.
    */
    for (
      let i = 0;
      i < allNames.length;
      i += 1
    ) {
      for (
        let j = i + 1;
        j < allNames.length;
        j += 1
      ) {
        const a =
          allNames[i];

        const b =
          allNames[j];

        const pa =
          runtime.positions[a];

        const pb =
          runtime.positions[b];

        const d =
          distance(
            pa,
            pb
          );

        const key =
          edgeKey(
            a,
            b
          );

        let edge =
          runtime.edges
            .get(key);

        /*
           Disconnect only after the wider threshold.
        */
        if (
          edge &&
          edge.latched &&
          d >
          CONFIG.graph.disconnectAt
        ) {
          edge.latched =
            false;
        }

        /*
           Create / reconnect inside the tighter threshold.
        */
        if (
          (
            !edge ||
            !edge.latched
          ) &&
          d <
          CONFIG.graph.connectAt
        ) {
          edge =
            edge ||
            ensureEdge(
              a,
              b
            );

          edge.latched =
            true;

          edge.removeWhenHidden =
            false;
        }

        if (
          edge &&
          edge.latched
        ) {
          eligible.push({
            a,
            b,
            d,
            edge
          });
        } else if (edge) {
          edge.removeWhenHidden =
            true;
        }
      }
    }

    /*
       Prefer the shortest/local relationships when degree
       limits are reached.
    */
    eligible.sort(
      (x, y) =>
        x.d -
        y.d
    );

    function maxDegree(name) {
      return allStars[name].named
        ? CONFIG.graph.maxNamedConnections
        : CONFIG.bridgeStars.maxConnections;
    }

    eligible.forEach(
      ({
        a,
        b,
        d,
        edge
      }) => {
        if (
          degrees[a] >=
          maxDegree(a) ||
          degrees[b] >=
          maxDegree(b)
        ) {
          return;
        }

        edge.selected =
          true;

        edge.removeWhenHidden =
          false;

        /*
           Stronger when closer.
        */
        const distanceStrength =
          clamp01(
            1 -
            (
              d -
              8
            ) /
            (
              CONFIG.graph.disconnectAt -
              8
            )
          );

        /*
           Faint bridge stars should not have disproportionately
           strong connections.
        */
        const visibilityStrength =
          Math.min(
            runtime.visibility[a],
            runtime.visibility[b]
          );

        const strength =
          distanceStrength *
          visibilityStrength;

        edge.targetOpacity =
          CONFIG.graph.minEdgeOpacity +
          strength *
          (
            CONFIG.graph.maxEdgeOpacity -
            CONFIG.graph.minEdgeOpacity
          );

        degrees[a] += 1;
        degrees[b] += 1;

        /*
           Connectivity drives named-label prominence.
        */
        connectivity[a] +=
          strength;

        connectivity[b] +=
          strength;
      }
    );

    /* ========================================================
       FADE / REMOVE EDGES
       ======================================================== */

    runtime.edges.forEach(
      (edge) => {
        if (!edge.selected) {
          edge.targetOpacity =
            0;
        }

        edge.opacity =
          lerp(
            edge.opacity,
            edge.targetOpacity,

            reduceMotion
              ? 1
              :
                CONFIG.graph.fadeSpeed
          );

        const a =
          runtime.positions[
            edge.a
          ];

        const b =
          runtime.positions[
            edge.b
          ];

        edge.line
          .setAttribute(
            'x1',
            a.x.toFixed(2)
          );

        edge.line
          .setAttribute(
            'y1',
            a.y.toFixed(2)
          );

        edge.line
          .setAttribute(
            'x2',
            b.x.toFixed(2)
          );

        edge.line
          .setAttribute(
            'y2',
            b.y.toFixed(2)
          );

        edge.line
          .setAttribute(
            'opacity',
            edge.opacity.toFixed(3)
          );

        /*
           Remove dead DOM lines once their fade completes.
        */
        if (
          !edge.latched &&
          edge.opacity <
          0.002
        ) {
          edge.line.remove();

          runtime.edges.delete(
            edge.key
          );
        }
      }
    );

    return connectivity;
  }

  /* ==========================================================
     CONNECTIVITY-DRIVEN LABELS
     ========================================================== */

  function updateLabels(
    connectivity
  ) {
    namedNames.forEach(
      (name) => {
        const star =
          namedStars[name];

        const label =
          runtime.labels[name];

        const pos =
          runtime.positions[name];

        /*
           Move the complete bilingual unit.
        */
        label.group
          .setAttribute(
            'transform',
            `translate(${
              (
                pos.x +
                star.dx +
                label.anchorOffset
              ).toFixed(2)
            } ${
              (
                pos.y +
                star.dy
              ).toFixed(2)
            })`
          );

        const importance =
          clamp01(
            connectivity[name] /
            CONFIG.graph.labelInfluence
          );

        /*
           Azha is always readable.

           Secondary names emerge as their neighborhood becomes
           more connected.
        */
        const targetOpacity =
          star.primary
            ? 0.96
            :
              Math.min(
                CONFIG.labels.maxSecondaryOpacity,

                star.baseLabelOpacity +
                importance *
                0.52
              );

        label.opacity =
          lerp(
            label.opacity,
            targetOpacity,

            reduceMotion
              ? 1
              :
                CONFIG.labels.fadeSpeed
          );

        /*
           Parent-group opacity means English, separator and
           Arabic ALWAYS fade together.
        */
        label.group
          .setAttribute(
            'opacity',
            label.opacity.toFixed(3)
          );
      }
    );
  }

  /* ==========================================================
     RENDER
     ========================================================== */

  function renderAt(milliseconds) {
    const seconds =
      milliseconds /
      1000;

    updatePositions(
      seconds
    );

    const connectivity =
      updateGraph();

    updateLabels(
      connectivity
    );
  }

  /* ==========================================================
     ANIMATION LIFECYCLE
     ========================================================== */

  function frame(now) {
    if (!runtime.running) {
      return;
    }

    const elapsed =
      runtime.elapsedMs +
      (
        now -
        runtime.lastStartedAt
      );

    renderAt(
      elapsed
    );

    runtime.raf =
      requestAnimationFrame(
        frame
      );
  }

  function start() {
    if (
      reduceMotion ||
      runtime.running ||
      document.hidden
    ) {
      return;
    }

    runtime.running =
      true;

    runtime.lastStartedAt =
      performance.now();

    runtime.raf =
      requestAnimationFrame(
        frame
      );
  }

  function stop() {
    if (!runtime.running) {
      return;
    }

    runtime.elapsedMs +=
      performance.now() -
      runtime.lastStartedAt;

    runtime.running =
      false;

    cancelAnimationFrame(
      runtime.raf
    );
  }

  /*
     Always create a valid static first frame.
  */
  renderAt(0);

  start();

  /*
     Don't animate hidden tabs.

     This saves CPU and resumes at the same simulation time
     when the user returns.
  */
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    }
  );

})();