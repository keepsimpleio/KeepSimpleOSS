import { expect, test } from '../fixtures/base';

test.describe('P1 @audio — Company Management pyramid audio', () => {
  test('clicking the audio player toggles play/pause icons', async ({
    page,
    dismissCookieBanner,
  }) => {
    // Headless Chromium ships without proprietary codecs, so `audio.play()`
    // on the MP4 source rejects and AudioPlayer's try/catch skips the
    // `setIsPlaying` flip — the icons would never toggle. Stub play/pause
    // to no-op Promise resolutions so we're exercising the UI wiring, not
    // the codec stack.
    await page.addInitScript(() => {
      const proto = HTMLMediaElement.prototype as HTMLMediaElement;
      Object.defineProperty(proto, 'play', {
        configurable: true,
        value: function () {
          return Promise.resolve();
        },
      });
      Object.defineProperty(proto, 'pause', {
        configurable: true,
        value: function () {},
      });
    });

    await page.goto('/company-management');
    await dismissCookieBanner();

    const audioButton = page.locator('[data-cy="audio-player"]').first();
    const playIcon = page.locator('[data-cy="pyramid-play-icon"]').first();
    const pauseIcon = page.locator('[data-cy="pyramid-pause-icon"]').first();

    // Initial: paused — play icon shown, pause icon hidden.
    // AudioPlayer toggles a .playing class on the button; the icons' visibility
    // is driven by CSS (AudioPlayer.module.scss), which Playwright's toBeVisible
    // respects.
    await audioButton.scrollIntoViewIfNeeded();
    await expect(playIcon).toBeVisible();
    await expect(pauseIcon).toBeHidden();

    // AudioPlayer sets `all: unset` on the button (AudioPlayer.module.scss:1-4),
    // which leaves the button's bounding box effectively zero — the icons
    // inside are absolutely positioned. Playwright's normal click pipeline
    // (even with `force: true`) rejects the attempt as "outside the viewport".
    // `dispatchEvent('click')` triggers the React onClick handler directly,
    // which is what we actually want to test — the UI wiring between click
    // and state toggle, not native hit testing on a zero-area button.
    await audioButton.dispatchEvent('click');

    await expect(pauseIcon).toBeVisible();
    await expect(playIcon).toBeHidden();

    await audioButton.dispatchEvent('click');

    await expect(playIcon).toBeVisible();
    await expect(pauseIcon).toBeHidden();
  });
});
