import classNames from 'classnames';
import { ReactNode } from 'react';
import { MockupFrame } from '../ui/mockup-frame.component';

/**
 * Shared inner-page hero: eyebrow → h1 → lead → optional actions, with an
 * optional product mockup on the right in a glass frame, over an animated
 * gradient-mesh background. Entrance animation + reduced-motion handled in CSS.
 */
export const PageHero = (props: {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  actions?: ReactNode;
  visual?: ReactNode;
  visualLabel?: string;
}) => (
  <section
    className={classNames('mkt-page-hero', {
      'mkt-page-hero--split': props.visual,
    })}
  >
    <div className="mkt-page-hero__mesh" aria-hidden="true" />
    <div className="mkt-container mkt-page-hero__inner">
      <div className="mkt-page-hero__copy">
        <span className="mkt-eyebrow">{props.eyebrow}</span>
        <h1 className="mkt-page-hero__title">{props.title}</h1>
        <p className="mkt-page-hero__lead">{props.lead}</p>
        {props.actions && (
          <div className="mkt-page-hero__actions">{props.actions}</div>
        )}
      </div>

      {props.visual && (
        <div className="mkt-page-hero__visual">
          <MockupFrame onInk={false} label={props.visualLabel}>
            {props.visual}
          </MockupFrame>
        </div>
      )}
    </div>
  </section>
);
