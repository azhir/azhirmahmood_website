(function () {

  /* ==========================================================
     ERIDANUS — PARTICLE CONSTELLATION
     ==========================================================

     particles.js handles:
       - continuous particle movement
       - naturally forming / disappearing connections
       - the anonymous celestial field

     This layer additionally:
       - nominates real particles as named stars
       - gives those stars authored home positions
       - gently guides them toward those homes
       - removes hard orbit / rubber-band behaviour
       - lets labels follow them
       - preserves particle state between site pages
     ========================================================== */


  /* ==========================================================
     SETUP
     ========================================================== */

  const svg =
    document.getElementById('eridanus-chart');

  const particleField =
    document.getElementById('eridanus-particles');

  const labelsG =
    document.getElementById('eridanus-labels');


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


    Object.entries(attrs)
      .forEach(
        function ([key, value]) {

          el.setAttribute(
            key,
            value
          );

        }
      );


    parent.appendChild(el);


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
             PARTICLE COUNT

             More = richer graph
             Less = airier chart
             -------------------------------------------------- */

          number: {

            value: 34,

            density: {
              enable: false
            }

          },


          /* --------------------------------------------------
             COLOUR
             -------------------------------------------------- */

          color: {
            value: '#9b7a3c'
          },


          /* --------------------------------------------------
             SHAPE
             -------------------------------------------------- */

          shape: {

            type: 'circle',

            stroke: {
              width: 0,
              color: '#9b7a3c'
            }

          },


          /* --------------------------------------------------
             OPACITY

             Particles themselves remain persistent.

             The lines are the ephemeral part.
             -------------------------------------------------- */

          opacity: {

            value: 0.62,

            random: true,

            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.2,
              sync: false
            }

          },


          /* --------------------------------------------------
             SIZE

             Random sizing helps anonymous stars feel like the
             same sky rather than uniform particles.
             -------------------------------------------------- */

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
             CONNECTIONS

             Nearby stars automatically form relationships.

             Larger distance = more connections.
             -------------------------------------------------- */

          line_linked: {

            enable: true,

            distance: 96,

            color: '#9b7a3c',

            opacity: 0.20,

            width: 0.75

          },


          /* --------------------------------------------------
             FIELD MOTION

             Anonymous stars remain lively.

             Named stars are calmed separately below.
             -------------------------------------------------- */

          move: {

            enable: true,

            speed: 1.35,

            direction: 'none',

            random: true,

            straight: false,

            /*
               Keep the same population within the chart.
            */

            out_mode: 'bounce',

            bounce: true,


            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }

          }

        },


        /* ----------------------------------------------------
           INTERACTIVITY

           Disabled because this is part of the masthead.
           ---------------------------------------------------- */

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
     NAMED STAR COMPOSITION

     These are home positions, not rigid coordinates.

     The stars may drift, but continuously gravitate toward
     these locations.

     The geometry is intentionally spread across the chart
     rather than forcing a literal river shape.
     ========================================================== */

  const namedStarConfig = {

    cursa: {
      x: 229,
      y: 15,

      r: 2.10,

      homeStrength: 0.00135,
      damping: 0.993,
      maxSpeed: 0.38
    },


    beid: {
      x: 182,
      y: 34,

      r: 1.45,

      homeStrength: 0.00115,
      damping: 0.994,
      maxSpeed: 0.40
    },


    keid: {
      x: 225,
      y: 59,

      r: 1.55,

      homeStrength: 0.00125,
      damping: 0.993,
      maxSpeed: 0.38
    },


    rana: {
      x: 170,
      y: 65,

      r: 1.85,

      homeStrength: 0.00105,
      damping: 0.994,
      maxSpeed: 0.40
    },


    /* --------------------------------------------------------
       AZHA

       Slightly off-centre so it feels like a node inside the
       graph rather than an isolated emblem.
       -------------------------------------------------------- */

    azha: {
      x: 136,
      y: 82,

      r: 3.00,

      homeStrength: 0.0020,
      damping: 0.989,
      maxSpeed: 0.16
    },


    zaurak: {
      x: 187,
      y: 96,

      r: 1.85,

      homeStrength: 0.00105,
      damping: 0.994,
      maxSpeed: 0.40
    },


    angetenar: {
      x: 169,
      y: 127,

      r: 1.45,

      homeStrength: 0.00120,
      damping: 0.994,
      maxSpeed: 0.38
    },


    acamar: {
      x: 102,
      y: 139,

      r: 1.80,

      homeStrength: 0.00120,
      damping: 0.994,
      maxSpeed: 0.38
    },


    achernar: {
      x: 42,
      y: 149,

      r: 2.35,

      homeStrength: 0.00140,
      damping: 0.993,
      maxSpeed: 0.34
    }

  };


  /* ==========================================================
     LABEL CONFIGURATION
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
     PARTICLE STATE PERSISTENCE

     Jekyll navigation reloads the page.

     Save the current constellation before leaving, then
     restore it on the next page so the sky does not fully
     regenerate every time the user follows a site link.
     ========================================================== */

  function saveParticleState(
    instance
  ) {

    try {

      const state =
        instance.particles.array.map(
          function (particle) {

            return {

              /*
                 Save NORMALISED coordinates.

                 This makes the saved state tolerant of
                 different chart sizes after navigation.
              */

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
                instance.canvas.w

            };

          }
        );


      sessionStorage.setItem(
        'eridanus-particle-state',
        JSON.stringify(state)
      );

    } catch (error) {

      /*
         sessionStorage may be unavailable in unusual browser
         contexts.

         The animation can still work perfectly without it.
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
        JSON.parse(saved);

    } catch (error) {

      return false;

    }


    if (
      !Array.isArray(state)
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


        particle.vx =
          old.vx;


        particle.vy =
          old.vy;


        particle.radius =
          old.radius *
          instance.canvas.w;

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
     SET UP NAMED PARTICLES
     ========================================================== */

  function setupNamedParticles(
    instance
  ) {

    const particles =
      instance.particles.array;


    /*
       These are genuine particles.js particles.

       Therefore they naturally:
         - move
         - form connections
         - lose connections
         - interact with anonymous field stars
    */

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


    /* --------------------------------------------------------
       RESTORE PREVIOUS SKY IF AVAILABLE
       -------------------------------------------------------- */

    const restored =
      restoreParticleState(
        instance
      );


    /* --------------------------------------------------------
       CONFIGURE NAMED PARTICLES
       -------------------------------------------------------- */

    Object.entries(
      namedParticles
    )
      .forEach(
        function (
          [name, particle]
        ) {

          const config =
            namedStarConfig[name];


          /*
             Only force the authored starting position on the
             first page load.

             During internal navigation, keep the restored sky.
          */

          if (!restored) {

            placeParticle(
              instance,
              particle,
              config.x,
              config.y,
              config.r
            );

          }


          const canvas =
            instance.canvas;


          /*
             Regardless of current position, the permanent
             gravitational home remains authored.
          */

          particle.eridanusHomeX =
            (
              config.x /
              260
            ) *
            canvas.w;


          particle.eridanusHomeY =
            (
              config.y /
              160
            ) *
            canvas.h;


          particle.eridanusHomeStrength =
            config.homeStrength;


          particle.eridanusDamping =
            config.damping;


          particle.eridanusMaxSpeed =
            config.maxSpeed;


          /*
             On initial load, calm the random velocity that
             particles.js gave this particle.

             On a restored page, preserve existing velocity.
          */

          if (!restored) {

            particle.vx *=
              0.36;


            particle.vy *=
              0.36;

          }

        }
      );


    /* --------------------------------------------------------
       AZHA

       Warm orange focal star.

       Because it is still a real particle, its line
       connections remain fully native to particles.js.
       -------------------------------------------------------- */

    const azha =
      namedParticles.azha;


    azha.color = {

      rgb: {
        r: 217,
        g: 150,
        b: 47
      }

    };


    /* --------------------------------------------------------
       SAVE SKY WHEN LEAVING
       -------------------------------------------------------- */

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
     PLACE PARTICLE FROM SVG COORDINATES
     ========================================================== */

  function placeParticle(
    instance,
    particle,
    svgX,
    svgY,
    radius
  ) {

    const canvas =
      instance.canvas;


    particle.x =
      (
        svgX /
        260
      ) *
      canvas.w;


    particle.y =
      (
        svgY /
        160
      ) *
      canvas.h;


    const scale =
      canvas.w /
      260;


    particle.radius =
      radius *
      scale;

  }


  /* ==========================================================
     GENTLE GRAVITATIONAL HOME

     There is NO orbit boundary.

     Every frame:
       - tiny attraction toward home
       - gentle damping
       - speed cap

     Because the force is always active, there is no point
     where a "rubber band" suddenly engages.
     ========================================================== */

  function guideNamedParticles(
    namedParticles
  ) {

    Object.values(
      namedParticles
    )
      .forEach(
        function (particle) {

          const dx =
            particle.eridanusHomeX -
            particle.x;


          const dy =
            particle.eridanusHomeY -
            particle.y;


          /* --------------------------------------------------
             CONTINUOUS HOME GRAVITY
             -------------------------------------------------- */

          particle.vx +=
            dx *
            particle.eridanusHomeStrength;


          particle.vy +=
            dy *
            particle.eridanusHomeStrength;


          /* --------------------------------------------------
             DAMPING

             Keeps named stars calm and prevents momentum from
             accumulating.
             -------------------------------------------------- */

          particle.vx *=
            particle.eridanusDamping;


          particle.vy *=
            particle.eridanusDamping;


          /* --------------------------------------------------
             SPEED CAP
             -------------------------------------------------- */

          const speed =
            Math.hypot(
              particle.vx,
              particle.vy
            );


          const maxSpeed =
            particle.eridanusMaxSpeed;


          if (
            speed >
            maxSpeed
          ) {

            const scale =
              maxSpeed /
              speed;


            particle.vx *=
              scale;


            particle.vy *=
              scale;

          }

        }
      );

  }


  /* ==========================================================
     CANVAS → SVG COORDINATES
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
        160

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


    /* --------------------------------------------------------
       FOLLOW NAMED PARTICLES
       -------------------------------------------------------- */

    function updateLabels() {

      guideNamedParticles(
        namedParticles
      );


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