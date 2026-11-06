import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MarketingFooter } from './marketing-footer.component';

// Regression tests for the findings in plan.md. Each `it` names the finding it
// locks down, so a future change that reintroduces one fails here.

describe('MarketingFooter', () => {
  describe('F-4: the placeholder registration number', () => {
    it('is not rendered anywhere in the footer', () => {
      const { container } = render(<MarketingFooter />);
      expect(container.textContent).not.toMatch(/RC\s*1234567/);
      expect(container.textContent).not.toMatch(/SparkPay Technologies Ltd/);
    });
  });

  describe('F-2: the footer logo', () => {
    it('is a link to the home page', () => {
      render(<MarketingFooter />);
      const brand = screen.getByLabelText('SparkPay home');
      expect(brand.tagName).toBe('A');
      expect(brand).toHaveAttribute('href', '/');
    });
  });

  describe('F-6: landmarks and heading levels', () => {
    it('wraps the link columns in a labelled nav landmark', () => {
      render(<MarketingFooter />);
      expect(screen.getByRole('navigation', { name: 'Footer' })).toBeTruthy();
    });

    it('does not use a heading element for the column titles', () => {
      const { container } = render(<MarketingFooter />);
      expect(container.querySelectorAll('h1,h2,h3,h4,h5,h6')).toHaveLength(0);
    });
  });

  describe('F-7: labels agree with the nav', () => {
    it('calls /product "Product overview", not "Overview"', () => {
      render(<MarketingFooter />);
      expect(screen.getByText('Product overview')).toHaveAttribute(
        'href',
        '/product',
      );
      expect(screen.queryByText('Overview')).toBeNull();
    });

    it('does not list Sign in under a Resources heading', () => {
      const { container } = render(<MarketingFooter />);
      expect(container.textContent).not.toMatch(/Resources/);
      expect(screen.getByText('Sign in')).toHaveAttribute('href', '/login');
    });
  });

  describe('every footer link points at a real route', () => {
    it('has no empty or placeholder hrefs', () => {
      const { container } = render(<MarketingFooter />);
      const hrefs = Array.from(container.querySelectorAll('a')).map((a) =>
        a.getAttribute('href'),
      );
      expect(hrefs.length).toBeGreaterThan(0);
      hrefs.forEach((href) => {
        expect(href).toBeTruthy();
        expect(href).not.toBe('#');
        expect(href!.startsWith('/')).toBe(true);
      });
    });
  });

  describe('the newsletter form', () => {
    it('is not rendered — nothing recorded the address, so it was removed', () => {
      const { container } = render(<MarketingFooter />);
      expect(container.querySelector('form')).toBeNull();
      expect(container.querySelector('input')).toBeNull();
      expect(container.textContent).not.toMatch(/we.ll be in touch/i);
      expect(container.textContent).not.toMatch(/subscribe/i);
    });
  });

  describe('F-8: the copyright year', () => {
    it('renders the current year', () => {
      const { container } = render(<MarketingFooter />);
      const base = container.querySelector('.mkt-footer__base')!;
      expect(
        within(base as HTMLElement).getByText(/All rights reserved/),
      ).toHaveTextContent(String(new Date().getFullYear()));
    });
  });
});
