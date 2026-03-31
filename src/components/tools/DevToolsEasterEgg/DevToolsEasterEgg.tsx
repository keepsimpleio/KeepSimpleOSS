import { FC, useEffect, useRef } from 'react';

const DEVTOOLS_THRESHOLD = 160;
const CONSOLE_IMAGE_URL = '/keepsimple_/assets/tools/console/angel-ascii.png';
const LOG_STYLE =
  'color: #f4c16b; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-weight: 600;';

const FRAME_LINES = [
  '+~+~~+~+~~+~+~~+~+~~+~+~~+~+~~+~+~~+~+',
  '+                                          +',
  '~  Angels on the sideline,                ~',
  '+  Baffled and confused.                  +',
  '~  Father blessed them all with reason,   ~',
  '+  And this is what they choose?          +',
];

const FINAL_TEXT_LINE =
  '~  Monkey ' +
  'kil' +
  'ling monkey ' +
  'kil' +
  'ling monkey over pieces of the ground. ~';

const logConsoleImage = () => {
  const image = new window.Image();

  image.onload = () => {
    const width = Math.min(720, image.width);
    const height = Math.round((image.height / image.width) * width);
    const imageStyle = [
      `font-size: 1px`,
      `padding: ${Math.max(1, Math.round(height / 2))}px ${Math.max(1, Math.round(width / 2))}px`,
      `line-height: ${height}px`,
      `background-image: url("${CONSOLE_IMAGE_URL}")`,
      'background-repeat: no-repeat',
      'background-size: contain',
      'background-position: center center',
      'display: inline-block',
    ].join(';');

    console.log('%c ', imageStyle);
  };

  image.src = CONSOLE_IMAGE_URL;
};

const DevToolsEasterEgg: FC = () => {
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    const printFramedText = () => {
      if (hasLoggedRef.current) {
        return;
      }

      hasLoggedRef.current = true;
      FRAME_LINES.forEach(line => {
        console.log('%c' + line, LOG_STYLE);
      });
      console.log('%c' + FINAL_TEXT_LINE, LOG_STYLE);
      console.log('%c+                                          +', LOG_STYLE);
      console.log('%c+~+~~+~+~~+~+~~+~+~~+~+~~+~+~~+~+~~+~+', LOG_STYLE);
      logConsoleImage();
    };

    const isDevToolsOpen = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      return widthDiff > DEVTOOLS_THRESHOLD || heightDiff > DEVTOOLS_THRESHOLD;
    };

    const checkDevTools = () => {
      if (isDevToolsOpen()) {
        printFramedText();
      }
    };

    checkDevTools();
    window.addEventListener('resize', checkDevTools);
    const intervalId = window.setInterval(checkDevTools, 1000);

    return () => {
      window.removeEventListener('resize', checkDevTools);
      window.clearInterval(intervalId);
    };
  }, []);

  return null;
};

export default DevToolsEasterEgg;
