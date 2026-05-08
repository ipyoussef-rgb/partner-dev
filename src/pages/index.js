import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header
      className={clsx('hero', 'hero--primary')}
      style={{ padding: '4rem 1rem' }}
    >
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">
          <Translate id="home.tagline">
            Build your Super App on KOBIL — partner integration guide.
          </Translate>
        </p>
        <p style={{ maxWidth: 720, margin: '1rem auto', fontSize: '1.05rem' }}>
          <Translate id="home.description">
            Verified endpoints, body schemas, sequence diagrams, and a 60-minute end-to-end quickstart for partners integrating KOBIL Identity, Chat and Pay.
          </Translate>
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            className="button button--secondary button--lg"
            to="/superapp-services/before-you-start"
          >
            <Translate id="home.cta.start">0. Start here →</Translate>
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/superapp-services/quickstart"
          >
            <Translate id="home.cta.quickstart">1. Quickstart (60 min)</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({ to, title, description }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '1.5rem',
        border: '1px solid var(--ifm-color-emphasis-200)',
        borderRadius: 8,
        textDecoration: 'none',
        color: 'inherit',
        height: '100%',
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ marginBottom: 0, color: 'var(--ifm-color-emphasis-700)' }}>{description}</p>
    </Link>
  );
}

function Features() {
  return (
    <section style={{ padding: '3rem 1rem' }}>
      <div className="container">
        <div className="row">
          <div className="col col--6" style={{ marginBottom: '1.5rem' }}>
            <FeatureCard
              to="/superapp-services/core-integrations/kobil-identity"
              title={translate({ id: 'home.feat.identity.title', message: 'KOBIL Identity' })}
              description={translate({
                id: 'home.feat.identity.desc',
                message: 'OIDC login backed by Keycloak, with the second factor in mIdentity.',
              })}
            />
          </div>
          <div className="col col--6" style={{ marginBottom: '1.5rem' }}>
            <FeatureCard
              to="/superapp-services/core-integrations/kobil-chat"
              title={translate({ id: 'home.feat.chat.title', message: 'KOBIL Chat (mPower)' })}
              description={translate({
                id: 'home.feat.chat.desc',
                message: 'Server → user messaging with reply webhooks. Verified body schema, gotchas listed.',
              })}
            />
          </div>
          <div className="col col--6" style={{ marginBottom: '1.5rem' }}>
            <FeatureCard
              to="/superapp-services/core-integrations/kobil-pay"
              title={translate({ id: 'home.feat.pay.title', message: 'KOBIL Pay (mPay)' })}
              description={translate({
                id: 'home.feat.pay.desc',
                message: 'Merchant transactions signed in mIdentity. Full 12-status table and persistence rule included.',
              })}
            />
          </div>
          <div className="col col--6" style={{ marginBottom: '1.5rem' }}>
            <FeatureCard
              to="/superapp-services/reference/production-checklist"
              title={translate({ id: 'home.feat.prod.title', message: 'Production Checklist' })}
              description={translate({
                id: 'home.feat.prod.desc',
                message: 'Everything to verify before flipping a KOBIL integration to production traffic.',
              })}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({ id: 'home.title', message: 'KOBIL Partner Dev' })}
      description={translate({
        id: 'home.metaDescription',
        message: 'Build your Super App on KOBIL — partner integration documentation in English and German.',
      })}
    >
      <Hero />
      <Features />
    </Layout>
  );
}
