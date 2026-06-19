import { useMemo } from 'react';

/**
 * TextTicker — seamless, infinitely scrolling marquee.
 *
 * Props:
 *   items     – array of { text, icon_url? } objects to display
 *   speed     – animation duration in seconds for one full cycle (default 30)
 *   separator – glyph between items (default "✦")
 *
 * How it works:
 *   Two identical strips sit side-by-side. A single CSS animation slides
 *   the wrapper by exactly -50% (one strip width), then jumps back.
 *   Because the second strip is a clone, the jump is invisible → seamless loop.
 */
const TextTicker = ({ items = [], speed = 30, separator = '✦' }) => {
  // Normalise: accept strings or { text, icon_url } objects
  const normalised = useMemo(() => {
    if (!items || items.length === 0) {
      return [
        { text: 'Available for Freelance' },
        { text: 'UI/UX Design' },
        { text: 'Frontend Development' },
        { text: 'React & Next.js' },
        { text: 'Creative Solutions' },
      ];
    }
    return items.map((item) =>
      typeof item === 'string' ? { text: item } : item,
    );
  }, [items]);

  // Build one strip of ticker content as JSX
  const StripContent = () => (
    <>
      {normalised.map((item, idx) => (
        <span key={idx} className="ticker-item">
          <span className="ticker-separator">{separator}</span>
          {item.icon_url && (
            <img
              src={item.icon_url}
              alt=""
              className="ticker-icon"
              loading="lazy"
            />
          )}
          <span>{item.text}</span>
        </span>
      ))}
    </>
  );

  if (normalised.length === 0) return null;

  return (
    <div className="ticker-wrap" id="text-ticker">
      <div
        className="ticker-track"
        style={{ '--ticker-speed': `${speed}s` }}
      >
        {/* Two identical strips for the seamless illusion */}
        <span className="ticker-strip" aria-hidden="false">
          <StripContent />
        </span>
        <span className="ticker-strip" aria-hidden="true">
          <StripContent />
        </span>
      </div>
    </div>
  );
};

export default TextTicker;
