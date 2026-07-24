import classNames from 'classnames';
import { useState } from 'react';

export type FaqItem = { q: string; a: string };

/**
 * Single-open accordion (guide §5). The page also emits FAQPage JSON-LD from
 * the same data — see each page's <Head>.
 */
export const FaqAccordion = (props: { items: FaqItem[] }) => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mkt-faq">
      {props.items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            className={classNames('mkt-faq__item', { 'is-open': isOpen })}
            key={item.q}
          >
            <button
              type="button"
              className="mkt-faq__q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{item.q}</span>
              <span className="mkt-faq__chevron" aria-hidden="true">
                ⌄
              </span>
            </button>
            <div className="mkt-faq__a-wrap">
              <div className="mkt-faq__a">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
