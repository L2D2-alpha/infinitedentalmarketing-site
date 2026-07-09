/* ============================================================
   Demo call player
   - Loads a timestamped transcript from /assets/demo/transcript.json
   - Autoplays MUTED when scrolled into view (browsers allow this)
   - Highlights transcript lines in sync with the audio ("karaoke")
   - Shows a CSS-animated visualizer while muted; switches to a
     REAL visualizer (Web Audio API) once the user taps unmute,
     because browsers only allow audio analysis after a user tap.
   ============================================================ */

(function () {
  var player = document.getElementById('demo-player');
  if (!player) return;

  var audio = document.getElementById('demo-audio');
  var playBtn = document.getElementById('play-btn');
  var unmuteBtn = document.getElementById('unmute-btn');
  var transcriptEl = document.getElementById('transcript');
  var timeMeta = document.getElementById('time-meta');
  var vizBars = document.querySelectorAll('#viz span');

  var lines = [];        // transcript lines loaded from JSON
  var lineEls = [];      // the <p> elements we render
  var audioCtx = null;   // Web Audio context (created on unmute)
  var analyser = null;

  /* ---------- 1. Load and render the transcript ---------- */

  fetch(transcriptEl.dataset.src || '/assets/demo/transcript.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      lines = data;
      lines.forEach(function (line) {
        var p = document.createElement('p');
        var who = document.createElement('span');
        who.className = 'who who-' + line.speaker;
        who.textContent = line.speaker === 'brooke' ? 'Brooke' : 'Patient';
        p.appendChild(who);
        p.appendChild(document.createTextNode(' — ' + line.text));
        transcriptEl.appendChild(p);
        lineEls.push(p);
      });
      // Show the first line right away so the widget never looks empty
      if (lineEls.length) lineEls[0].classList.add('live');
    })
    .catch(function () {
      transcriptEl.innerHTML =
        '<p class="live"><span class="who who-brooke">Brooke</span> — Demo recording coming soon. Call the number above to hear her live.</p>';
    });

  /* ---------- 2. Autoplay (muted) when scrolled into view ---------- */

  if ('IntersectionObserver' in window) {
    var seen = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen) {
          seen = true;
          audio.play().catch(function () { /* autoplay blocked: fine, user can tap play */ });
        }
      });
    }, { threshold: 0.4 });
    io.observe(player);
  }

  /* ---------- 3. Play / pause button ---------- */

  playBtn.addEventListener('click', function () {
    if (audio.paused) { audio.play(); } else { audio.pause(); }
  });

  audio.addEventListener('play', function () { playBtn.textContent = '❚❚'; });
  audio.addEventListener('pause', function () { playBtn.textContent = '▶'; });

  /* ---------- 4. Transcript sync ---------- */

  audio.addEventListener('timeupdate', function () {
    var t = audio.currentTime;
    var activeIndex = -1;

    for (var i = 0; i < lines.length; i++) {
      if (lines[i].t <= t) activeIndex = i;
    }

    lineEls.forEach(function (el, i) {
      el.classList.toggle('live', i <= activeIndex);
    });

    // Keep the active line scrolled into view inside the transcript box
    if (activeIndex >= 0 && lineEls[activeIndex]) {
      var el = lineEls[activeIndex];
      transcriptEl.scrollTop = el.offsetTop - transcriptEl.offsetTop - 60;
    }

    if (audio.duration) {
      timeMeta.textContent =
        format(t) + ' / ' + format(audio.duration);
    }
  });

  function format(sec) {
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ---------- 5. Unmute + real visualizer ---------- */

  unmuteBtn.addEventListener('click', function () {
    if (audio.muted) {
      audio.muted = false;
      unmuteBtn.textContent = '🔊 Mute';
      startRealVisualizer();
      if (audio.paused) audio.play();
    } else {
      audio.muted = true;
      unmuteBtn.textContent = '🔇 Tap to unmute';
      player.classList.add('simulated'); // back to CSS animation
    }
  });

  function startRealVisualizer() {
    player.classList.remove('simulated'); // stop the CSS fake bars

    // Only build the audio graph once
    if (!audioCtx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return; // very old browser: keep CSS bars
      audioCtx = new Ctx();
      var source = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();

    var data = new Uint8Array(analyser.frequencyBinCount);

    function draw() {
      if (audio.muted) return; // CSS animation takes over again
      analyser.getByteFrequencyData(data);
      for (var i = 0; i < vizBars.length; i++) {
        // Map a frequency bin to each bar; 20–100% height
        var v = data[i + 2] / 255;
        vizBars[i].style.height = Math.round(20 + v * 80) + '%';
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
})();
