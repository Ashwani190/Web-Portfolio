import { useMemo } from 'react';

/**
 * TextTicker — seamless, infinitely scrolling marquee.
 *
 * Props:
 *   items   – array of strings to display (joined by the separator glyph)
 *   speed   – animation duration in seconds for one full cycle (default 30)
 *   separator – glyph between items (default "✦")
 *
 * How it works:
 *   Two identical strips sit side-by-side. A single CSS animation slides
 *   the wrapper by exactly -50% (one strip width), then jumps back.
 *   Because the second strip is a clone, the jump is invisible → seamless loop.
 */
const TextTicker = ({ items, speed = 30, separator = '✦' }) => {
  // Build the repeated content string
  const content = useMemo(() => {
    if (!items || items.length === 0) {
      items = [
        'Available for Freelance',
        'UI/UX Design',
        'Frontend Development',
        'React & Next.js',
        'Creative Solutions',
      ];
    }
    return items.map((text) => `${separator} ${text} `).join('');
  }, [items, separator]);

  return (
    <div className="ticker-wrap" id="text-ticker">
      <div
        className="ticker-track"
        style={{ '--ticker-speed': `${speed}s` }}
      >
        {/* Two identical strips for the seamless illusion */}
        <span className="ticker-strip" aria-hidden="false">
          {content}
        </span>
        <span className="ticker-strip" aria-hidden="true">
          {content}
        </span>
      </div>
    </div>
  );
};

export default TextTicker;
