(function () {

  /* ==========================================================
     ERIDANUS — LIVING CONSTELLATION
     ==========================================================

     DESIGN

     particles.js:
       - renders all stars
       - moves anonymous/background stars
       - draws proximity-based graph connections

     Named stars:
       - are still real particles.js particles
       - follow independent mathematical paths
       - do NOT exert forces on each other
       - do NOT use springs, steering or gravity
       - never bounce from chart boundaries

     Each named star has:
       - a normalized home position
       - its own orbit/path type
       - its own width and height
       - its own rotation
       - its own speed and direction
       - subtle smooth path deformation

     Requested paths are automatically reduced only when
     necessary to guarantee they remain inside the chart.
     ========================================================== */


  /* ==========================================================
     SETUP
     ========================================================== */

  const svg =
    document.getElementById(
      'eridanus-chart'
    );

  const particleField =
    document.getElementById(
      'eridanus-particles'
    );

  const labelsG =
    document.getElementById(
      'eridanus-labels'
    );


  if (
    !svg ||
    !particleField ||
    !labelsG
  ) {
    return;
  }


  const NS =
    'http://www.w3.org/2000/svg';


  const reduceMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  /* ==========================================================
     SAFE CHART BOUNDS

     Named stars never cross these boundaries.

     Because orbit dimensions are calculated in advance,
     there is no clamp during animation and therefore no
     flattened/janky edge motion.
     ========================================================== */

  const SAFE_LEFT =
    0.025;

  const SAFE_RIGHT =
    0.975;

  const SAFE_TOP =
    0.055;

  const SAFE_BOTTOM =
    0.945;


  /* ==========================================================
     HELPERS
     ========================================================== */

  function makeEl(
    tag,
    attrs,
    parent
  ) {

    const el =
      document.createElementNS(
        NS,
        tag
      );


    Object.entries(
      attrs
    )
      .forEach(
        function (
          [key, value]
        ) {

          el.setAttribute(
            key,
            value
          );

        }
      );


    parent.appendChild(
      el
    );


    return el;

  }


  /* ==========================================================
     PARTICLES.JS
     ========================================================== */

  if (
    !reduceMotion &&
    typeof particlesJS === 'function'
  ) {

    particlesJS(
      'eridanus-particles',
      {

        particles: {

          /* --------------------------------------------------
             15 NODES

             9 named stars
             6 anonymous bridge nodes
             -------------------------------------------------- */

          number: {

            value: 15,

            density: {
              enable: false
            }

          },


          color: {
            value: '#9b7a3c'
          },


          shape: {

            type: 'circle',

            stroke: {
              width: 0,
              color: '#9b7a3c'
            }

          },


          opacity: {

            value: 0.72,

            random: true,

            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.2,
              sync: false
            }

          },


          size: {

            value: 1.7,

            random: true,

            anim: {
              enable: false,
              speed: 1,
              size_min: 0.5,
              sync: false
            }

          },


          /* --------------------------------------------------
             GRAPH CONNECTIONS

             Keep this selective.

             Connections should appear and disappear as the
             constellation changes rather than everything
             remaining permanently connected.
             -------------------------------------------------- */

          line_linked: {

            enable: true,

            distance: 96,

            color: '#9b7a3c',

            opacity: 0.30,

            width: 0.85

          },


          /* --------------------------------------------------
             ANONYMOUS NODE MOTION

             Only anonymous nodes actually use particles.js
             velocity.

             Named particles are repositioned directly below.
             -------------------------------------------------- */

          move: {

            enable: true,

            speed: 1.15,

            direction: 'none',

            random: true,

            straight: false,

            out_mode: 'bounce',

            bounce: true,


            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }

          }

        },


        interactivity: {

          detect_on: 'canvas',

          events: {

            onhover: {
              enable: false,
              mode: 'grab'
            },

            onclick: {
              enable: false,
              mode: 'push'
            },

            resize: true

          }

        },


        retina_detect: true

      }
    );

  }


  /* ==========================================================
     NAMED STAR CONFIGURATION

     ALL GEOMETRY IS NORMALIZED.

     x / y:
       home position

     radiusX / radiusY:
       desired orbit dimensions

       These can be intentionally large.

       The system calculates a safe scale automatically if
       the requested orbit would leave the chart.

     rotation:
       radians

       0      = horizontal
       0.785  = about 45 degrees
       -0.785 = about -45 degrees

     speed:
       positive = one direction
       negative = opposite direction

     path:
       ellipse
       flow
       wave
       loop

     deformation:
       how strongly the orbit departs from a perfect ellipse
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

      speed: 0.00190,

      deformation: 0.12

    },


    acamar: {

      x: 0.20,
      y: 0.38,

      r: 1.80,

      path: 'flow',

      radiusX: 0.19,
      radiusY: 0.085,

      rotation: -0.12,

      speed: -0.00220,

      deformation: 0.18

    },


    /* --------------------------------------------------------
       AZHA

       Still calmer than the rest, but its orbit is now large
       enough to visibly alter nearby connections.
       -------------------------------------------------------- */

    azha: {

      x: 0.30,
      y: 0.69,

      r: 3.00,

      path: 'ellipse',

      radiusX: 0.125,
      radiusY: 0.052,

      rotation: -0.22,

      speed: 0.00145,

      deformation: 0.10

    },


    rana: {

      x: 0.47,
      y: 0.43,

      r: 1.85,

      path: 'flow',

      radiusX: 0.22,
      radiusY: 0.095,

      rotation: 0.27,

      speed: -0.00250,

      deformation: 0.21

    },


    beid: {

      x: 0.59,
      y: 0.62,

      r: 1.45,

      path: 'ellipse',

      radiusX: 0.18,
      radiusY: 0.085,

      rotation: -0.35,

      speed: 0.00210,

      deformation: 0.14

    },


    zaurak: {

      x: 0.71,
      y: 0.50,

      r: 1.85,

      path: 'wave',

      radiusX: 0.20,
      radiusY: 0.090,

      rotation: 0.18,

      speed: -0.00230,

      deformation: 0.19

    },


    angetenar: {

      x: 0.66,
      y: 0.76,

      r: 1.45,

      path: 'loop',

      radiusX: 0.17,
      radiusY: 0.075,

      rotation: -0.28,

      speed: 0.00260,

      deformation: 0.17

    },


    keid: {

      x: 0.81,
      y: 0.69,

      r: 1.55,

      path: 'flow',

      radiusX: 0.17,
      radiusY: 0.080,

      rotation: 0.34,

      speed: -0.00235,

      deformation: 0.16

    },


    cursa: {

      x: 0.88,
      y: 0.42,

      r: 2.10,

      path: 'ellipse',

      radiusX: 0.14,
      radiusY: 0.065,

      rotation: -0.26,

      speed: 0.00185,

      deformation: 0.11

    }

  };


  /* ==========================================================
     LABEL CONFIGURATION

     Labels remain in SVG coordinates because the SVG uses:

       viewBox="0 0 260 110"
     ========================================================== */

  const labels = [

    {

      star: 'cursa',

      text: 'Cursa',
      arabic: 'الكرسي',

      dx: -9,
      dy: -6,

      adx: -9,
      ady: 2,

      anchor: 'end',

      size: 8.6,
      arabicSize: 7.1,

      opacity: 0.58

    },


    {

      star: 'beid',

      text: 'Beid',
      arabic: 'البيض',

      dx: -8,
      dy: -5,

      adx: -8,
      ady: 3,

      anchor: 'end',

      size: 7.2,
      arabicSize: 6.1,

      opacity: 0.45

    },


    {

      star: 'keid',

      text: 'Keid',
      arabic: 'القيد',

      dx: 8,
      dy: -3,

      adx: 8,
      ady: 5,

      anchor: 'start',

      size: 7.2,
      arabicSize: 6.1,

      opacity: 0.45

    },


    {

      star: 'rana',

      text: 'Rana',

      dx: 8,
      dy: -3,

      anchor: 'start',

      size: 7.8,

      opacity: 0.50

    },


    {

      star: 'azha',

      text: 'Azha',
      arabic: 'ازها',

      dx: 10,
      dy: -2,

      adx: 10,
      ady: 7,

      anchor: 'start',

      size: 10.7,
      arabicSize: 8.3,

      opacity: 0.96

    },


    {

      star: 'zaurak',

      text: 'Zaurak',
      arabic: 'زورق',

      dx: 9,
      dy: -3,

      adx: 9,
      ady: 5,

      anchor: 'start',

      size: 7.9,
      arabicSize: 6.6,

      opacity: 0.54

    },


    {

      star: 'angetenar',

      text: 'Angetenar',

      dx: 8,
      dy: 2,

      anchor: 'start',

      size: 6.8,

      opacity: 0.41

    },


    {

      star: 'acamar',

      text: 'Acamar',
      arabic: 'آخر النهر',

      dx: -8,
      dy: -3,

      adx: -8,
      ady: 5,

      anchor: 'end',

      size: 7.6,
      arabicSize: 6.3,

      opacity: 0.49

    },


    {

      star: 'achernar',

      text: 'Achernar',

      dx: -8,
      dy: -5,

      anchor: 'end',

      size: 8.3,

      opacity: 0.55

    }

  ];


  /* ==========================================================
     PATH FUNCTIONS

     These produce LOCAL coordinates.

     Their approximate ranges remain around:

       x: -1 → +1
       y: -1 → +1

     Small smooth deformations make the movement feel less
     mechanical without introducing noise or impulses.
     ========================================================== */

  function getOrbitPoint(
    particle,
    angle
  ) {

    const deformation =
      particle.eridanusDeformation;


    let x;
    let y;


    switch (
      particle.eridanusPath
    ) {


      /* ------------------------------------------------------
         FLOW

         Long celestial-looking path with gentle asymmetry.
         ------------------------------------------------------ */

      case 'flow':

        x =
          Math.cos(
            angle
          )
          +
          deformation *
          Math.sin(
            angle * 2.0
          );


        y =
          Math.sin(
            angle
          )
          +
          deformation *
          0.55 *
          Math.cos(
            angle * 1.5
          );

        break;


      /* ------------------------------------------------------
         WAVE

         More horizontally wandering.

         Useful for changing graph topology.
         ------------------------------------------------------ */

      case 'wave':

        x =
          Math.cos(
            angle
          )
          +
          deformation *
          Math.cos(
            angle * 2.5
          );


        y =
          Math.sin(
            angle
          )
          +
          deformation *
          0.50 *
          Math.sin(
            angle * 2.0
          );

        break;


      /* ------------------------------------------------------
         LOOP

         Slightly more complex but still continuous and calm.
         ------------------------------------------------------ */

      case 'loop':

        x =
          Math.cos(
            angle
          )
          +
          deformation *
          0.75 *
          Math.sin(
            angle * 2.0
          );


        y =
          Math.sin(
            angle
          )
          +
          deformation *
          0.65 *
          Math.cos(
            angle * 3.0
          );

        break;


      /* ------------------------------------------------------
         ELLIPSE

         Not perfectly mathematical: gets a very small
         harmonic deformation.
         ------------------------------------------------------ */

      case 'ellipse':

      default:

        x =
          Math.cos(
            angle
          )
          +
          deformation *
          0.35 *
          Math.sin(
            angle * 2.0
          );


        y =
          Math.sin(
            angle
          )
          +
          deformation *
          0.30 *
          Math.cos(
            angle * 2.0
          );

        break;

    }


    return {
      x: x,
      y: y
    };

  }


  /* ==========================================================
     CALCULATE SAFE ORBIT SCALE

     Rather than clamp animated positions at the edges, sample
     the complete requested orbit and find its maximum extent.

     We then scale the whole orbit uniformly so every point
     remains within the chart.

     This preserves the shape and smoothness of the path.
     ========================================================== */

  function calculateSafeOrbitScale(
    particle
  ) {

    const samples =
      720;


    let minOffsetX =
      Infinity;

    let maxOffsetX =
      -Infinity;

    let minOffsetY =
      Infinity;

    let maxOffsetY =
      -Infinity;


    const cosRotation =
      Math.cos(
        particle.eridanusRotation
      );


    const sinRotation =
      Math.sin(
        particle.eridanusRotation
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
          particle,
          angle
        );


      const localX =
        point.x *
        particle.eridanusRequestedRadiusX;


      const localY =
        point.y *
        particle.eridanusRequestedRadiusY;


      const rotatedX =
        localX *
        cosRotation
        -
        localY *
        sinRotation;


      const rotatedY =
        localX *
        sinRotation
        +
        localY *
        cosRotation;


      minOffsetX =
        Math.min(
          minOffsetX,
          rotatedX
        );


      maxOffsetX =
        Math.max(
          maxOffsetX,
          rotatedX
        );


      minOffsetY =
        Math.min(
          minOffsetY,
          rotatedY
        );


      maxOffsetY =
        Math.max(
          maxOffsetY,
          rotatedY
        );

    }


    /* --------------------------------------------------------
       AVAILABLE SPACE AROUND THIS STAR'S HOME
       -------------------------------------------------------- */

    const availableLeft =
      particle.eridanusHomeX -
      SAFE_LEFT;


    const availableRight =
      SAFE_RIGHT -
      particle.eridanusHomeX;


    const availableTop =
      particle.eridanusHomeY -
      SAFE_TOP;


    const availableBottom =
      SAFE_BOTTOM -
      particle.eridanusHomeY;


    let scale =
      1;


    if (
      minOffsetX < 0
    ) {

      scale =
        Math.min(
          scale,
          availableLeft /
          Math.abs(
            minOffsetX
          )
        );

    }


    if (
      maxOffsetX > 0
    ) {

      scale =
        Math.min(
          scale,
          availableRight /
          maxOffsetX
        );

    }


    if (
      minOffsetY < 0
    ) {

      scale =
        Math.min(
          scale,
          availableTop /
          Math.abs(
            minOffsetY
          )
        );

    }


    if (
      maxOffsetY > 0
    ) {

      scale =
        Math.min(
          scale,
          availableBottom /
          maxOffsetY
        );

    }


    /*
       Never enlarge beyond the requested orbit.

       We only reduce it if necessary.
    */

    return Math.min(
      1,
      Math.max(
        0,
        scale
      )
    );

  }


  /* ==========================================================
     PERSISTENCE
     ========================================================== */

  function saveParticleState(
    instance
  ) {

    try {

      const state =
        instance.particles.array.map(
          function (particle) {

            return {

              x:
                particle.x /
                instance.canvas.w,

              y:
                particle.y /
                instance.canvas.h,

              vx:
                particle.vx,

              vy:
                particle.vy,

              radius:
                particle.radius /
                instance.canvas.w,

              orbitPhase:
                particle.eridanusOrbitPhase

            };

          }
        );


      sessionStorage.setItem(
        'eridanus-particle-state',
        JSON.stringify(state)
      );

    } catch (error) {

      /*
         Persistence is optional.
      */

    }

  }


  function restoreParticleState(
    instance
  ) {

    let saved;


    try {

      saved =
        sessionStorage.getItem(
          'eridanus-particle-state'
        );

    } catch (error) {

      return false;

    }


    if (!saved) {
      return false;
    }


    let state;


    try {

      state =
        JSON.parse(
          saved
        );

    } catch (error) {

      return false;

    }


    if (
      !Array.isArray(
        state
      )
    ) {
      return false;
    }


    instance.particles.array.forEach(
      function (
        particle,
        index
      ) {

        const old =
          state[index];


        if (!old) {
          return;
        }


        particle.x =
          old.x *
          instance.canvas.w;


        particle.y =
          old.y *
          instance.canvas.h;


        if (
          Number.isFinite(
            old.vx
          )
        ) {

          particle.vx =
            old.vx;

        }


        if (
          Number.isFinite(
            old.vy
          )
        ) {

          particle.vy =
            old.vy;

        }


        if (
          Number.isFinite(
            old.radius
          )
        ) {

          particle.radius =
            old.radius *
            instance.canvas.w;

        }


        if (
          Number.isFinite(
            old.orbitPhase
          )
        ) {

          particle.eridanusOrbitPhase =
            old.orbitPhase;

        }

      }
    );


    return true;

  }


  /* ==========================================================
     WAIT FOR PARTICLES.JS
     ========================================================== */

  function initialiseNamedParticles() {

    const check =
      window.setInterval(
        function () {

          if (
            !window.pJSDom ||
            !window.pJSDom.length
          ) {
            return;
          }


          const instance =
            window.pJSDom[
              window.pJSDom.length - 1
            ].pJS;


          if (
            !instance ||
            !instance.particles ||
            !instance.particles.array ||
            instance.particles.array.length < 9
          ) {
            return;
          }


          window.clearInterval(
            check
          );


          setupNamedParticles(
            instance
          );

        },
        50
      );

  }


  /* ==========================================================
     NAMED PARTICLE SETUP
     ========================================================== */

  function setupNamedParticles(
    instance
  ) {

    const particles =
      instance.particles.array;


    const namedParticles = {

      cursa:
        particles[0],

      beid:
        particles[1],

      keid:
        particles[2],

      rana:
        particles[3],

      azha:
        particles[4],

      zaurak:
        particles[5],

      angetenar:
        particles[6],

      acamar:
        particles[7],

      achernar:
        particles[8]

    };


    const restored =
      restoreParticleState(
        instance
      );


    const namedCount =
      Object.keys(
        namedParticles
      ).length;


    Object.entries(
      namedParticles
    )
      .forEach(
        function (
          [name, particle],
          index
        ) {

          const config =
            namedStarConfig[name];


          /* --------------------------------------------------
             HOME
             -------------------------------------------------- */

          particle.eridanusHomeX =
            config.x;


          particle.eridanusHomeY =
            config.y;


          /* --------------------------------------------------
             PATH CHARACTER
             -------------------------------------------------- */

          particle.eridanusPath =
            config.path;


          particle.eridanusRequestedRadiusX =
            config.radiusX;


          particle.eridanusRequestedRadiusY =
            config.radiusY;


          particle.eridanusRotation =
            config.rotation;


          particle.eridanusOrbitSpeed =
            config.speed;


          particle.eridanusDeformation =
            config.deformation;


          /* --------------------------------------------------
             PHASE

             Different initial phases stop the constellation
             looking synchronized.
             -------------------------------------------------- */

          if (
            !Number.isFinite(
              particle.eridanusOrbitPhase
            )
          ) {

            particle.eridanusOrbitPhase =
              (
                index /
                namedCount
              ) *
              Math.PI *
              2;

          }


          /* --------------------------------------------------
             SAFE ORBIT

             Calculate once because the geometry is normalized
             and therefore survives responsive resizing.
             -------------------------------------------------- */

          particle.eridanusOrbitScale =
            calculateSafeOrbitScale(
              particle
            );


          /* --------------------------------------------------
             INITIAL STAR SIZE
             -------------------------------------------------- */

          particle.eridanusRadius =
            config.r;


          if (!restored) {

            particle.x =
              config.x *
              instance.canvas.w;


            particle.y =
              config.y *
              instance.canvas.h;

          }


          /*
             Named particles do not use particles.js velocity.
          */

          particle.vx =
            0;


          particle.vy =
            0;

        }
      );


    /* ========================================================
       AZHA COLOUR
       ======================================================== */

    namedParticles.azha.color = {

      rgb: {
        r: 217,
        g: 150,
        b: 47
      }

    };


    /* ========================================================
       SAVE STATE
       ======================================================== */

    window.addEventListener(
      'pagehide',
      function () {

        saveParticleState(
          instance
        );

      },
      {
        once: true
      }
    );


    initialiseLabels(
      instance,
      namedParticles
    );

  }


  /* ==========================================================
     SMOOTH INDEPENDENT NAMED-STAR MOTION

     This is deliberately NOT physics.

     Every star simply evaluates its own continuous path.

     Therefore:
       - no overshoot
       - no spring effect
       - no gravity
       - no pendulum
       - no inter-star influence
       - no boundary bounce
     ========================================================== */

  function guideNamedParticles(
    instance,
    namedParticles
  ) {

    Object.values(
      namedParticles
    )
      .forEach(
        function (particle) {


          /* --------------------------------------------------
             ADVANCE INDIVIDUAL ORBIT
             -------------------------------------------------- */

          particle.eridanusOrbitPhase +=
            particle.eridanusOrbitSpeed;


          const angle =
            particle.eridanusOrbitPhase;


          /* --------------------------------------------------
             GET THIS STAR'S UNIQUE PATH
             -------------------------------------------------- */

          const pathPoint =
            getOrbitPoint(
              particle,
              angle
            );


          const scale =
            particle.eridanusOrbitScale;


          /* --------------------------------------------------
             APPLY REQUESTED ORBIT DIMENSIONS
             -------------------------------------------------- */

          const localX =
            pathPoint.x *
            particle.eridanusRequestedRadiusX *
            scale;


          const localY =
            pathPoint.y *
            particle.eridanusRequestedRadiusY *
            scale;


          /* --------------------------------------------------
             ROTATE ORBIT

             This prevents every path from lying horizontally.
             -------------------------------------------------- */

          const cosRotation =
            Math.cos(
              particle.eridanusRotation
            );


          const sinRotation =
            Math.sin(
              particle.eridanusRotation
            );


          const rotatedX =
            localX *
            cosRotation
            -
            localY *
            sinRotation;


          const rotatedY =
            localX *
            sinRotation
            +
            localY *
            cosRotation;


          /* --------------------------------------------------
             FINAL NORMALIZED POSITION

             No clamp is required.

             calculateSafeOrbitScale() guarantees these remain
             within our safe chart area.
             -------------------------------------------------- */

          const normalizedX =
            particle.eridanusHomeX +
            rotatedX;


          const normalizedY =
            particle.eridanusHomeY +
            rotatedY;


          /* --------------------------------------------------
             CONVERT TO CURRENT CANVAS

             This automatically adapts to responsive resizing.
             -------------------------------------------------- */

          particle.x =
            normalizedX *
            instance.canvas.w;


          particle.y =
            normalizedY *
            instance.canvas.h;


          /*
             Prevent particles.js motion from fighting the
             authored orbit.
          */

          particle.vx =
            0;


          particle.vy =
            0;


          /*
             Responsive named-star radius.
          */

          particle.radius =
            particle.eridanusRadius *
            (
              instance.canvas.w /
              260
            );

        }
      );

  }


  /* ==========================================================
     CANVAS → SVG
     ========================================================== */

  function canvasToSvg(
    instance,
    particle
  ) {

    return {

      x:
        (
          particle.x /
          instance.canvas.w
        ) *
        260,


      y:
        (
          particle.y /
          instance.canvas.h
        ) *
        110

    };

  }


  /* ==========================================================
     LABELS
     ========================================================== */

  function initialiseLabels(
    instance,
    namedParticles
  ) {

    const labelElements =
      {};


    labels.forEach(
      function (label) {

        const english =
          makeEl(
            'text',
            {

              class:
                `chart-label chart-label-${label.star}`,

              'text-anchor':
                label.anchor,

              'font-size':
                label.size,

              opacity:
                label.opacity

            },
            labelsG
          );


        english.textContent =
          label.text;


        let arabic =
          null;


        if (
          label.arabic
        ) {

          arabic =
            makeEl(
              'text',
              {

                class:
                  `chart-label chart-label-arabic chart-label-${label.star}`,

                'text-anchor':
                  label.anchor,

                'font-size':
                  label.arabicSize,

                opacity:
                  label.opacity *
                  0.68,

                direction:
                  'rtl'

              },
              labelsG
            );


          arabic.textContent =
            label.arabic;

        }


        labelElements[
          label.star
        ] = {

          english:
            english,

          arabic:
            arabic,

          config:
            label

        };

      }
    );


    /* ========================================================
       ANIMATION LOOP
       ======================================================== */

    function updateLabels() {

      /* ------------------------------------------------------
         MOVE NAMED STARS
         ------------------------------------------------------ */

      guideNamedParticles(
        instance,
        namedParticles
      );


      /* ------------------------------------------------------
         MOVE LABELS WITH THEIR STARS
         ------------------------------------------------------ */

      Object.entries(
        labelElements
      )
        .forEach(
          function (
            [name, label]
          ) {

            const particle =
              namedParticles[name];


            const point =
              canvasToSvg(
                instance,
                particle
              );


            label.english.setAttribute(
              'x',
              point.x +
              label.config.dx
            );


            label.english.setAttribute(
              'y',
              point.y +
              label.config.dy
            );


            if (
              label.arabic
            ) {

              label.arabic.setAttribute(
                'x',
                point.x +
                label.config.adx
              );


              label.arabic.setAttribute(
                'y',
                point.y +
                label.config.ady
              );

            }

          }
        );


      requestAnimationFrame(
        updateLabels
      );

    }


    updateLabels();

  }


  /* ==========================================================
     START
     ========================================================== */

  if (
    !reduceMotion
  ) {

    initialiseNamedParticles();

  }

})();