    (function () {
      var postLoadDelayMs = 2000; // 2 seconds after window.load
      var fallbackTimeoutMs = 2000; // safety fallback

      function onReady(fn) {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', fn);
        } else {
          fn();
        }
      }

      onReady(function () {
        var loader = document.getElementById('loader');
        if (!loader) return;

        function hideLoader() {
          if (!loader) return;
          loader.classList.add('hidden');
          loader.setAttribute('aria-busy', 'false');

          function removeAfter() {
            if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
            loader.removeEventListener('transitionend', removeAfter);
          }
          loader.addEventListener('transitionend', removeAfter);
        }

        if (document.readyState === 'complete') {
          setTimeout(hideLoader, postLoadDelayMs);
        } else {
          window.addEventListener('load', function onLoad() {
            window.removeEventListener('load', onLoad);
            setTimeout(hideLoader, postLoadDelayMs);
          });
        }

        setTimeout(hideLoader, fallbackTimeoutMs);

        window.hideLoader = hideLoader;
        window.showLoader = function () {
          if (!loader) return;
          if (!document.body.contains(loader)) document.body.appendChild(loader);
          loader.classList.remove('hidden');
          loader.setAttribute('aria-busy', 'true');
        };
      });
    })();