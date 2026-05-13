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
            Integrate your service into the Germany App.
          </Translate>
        </p>
        <p style={{ maxWidth: 720, margin: '1rem auto', fontSize: '1.05rem' }}>
          <Translate id="home.description">
            The Germany App is the trusted superapp where citizens access digital services bound to a verified mobile identity. Add Login, Chat and Payments to your service in five clear steps.
          </Translate>
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            className="button button--secondary button--lg"
            to="/get-credentials"
          >
            <Translate id="home.cta.start">Step 1 — Get Credentials →</Translate>
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/"
          >
            <Translate id="home.cta.overview">Read the overview</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

function StepCard({ to, number, title, description, time }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '1.25rem 1.5rem',
        border: '1px solid var(--ifm-color-emphasis-200)',
        borderRadius: 8,
        textDecoration: 'none',
        color: 'inherit',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ifm-color-primary)' }}>{number}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-600)' }}>{time}</span>
      </div>
      <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{title}</h3>
      <p style={{ marginBottom: 0, color: 'var(--ifm-color-emphasis-700)', fontSize: '0.95rem' }}>{description}</p>
    </Link>
  );
}

function Steps() {
  const steps = [
    {
      to: '/get-credentials',
      number: 'STEP 1',
      time: '15 min',
      title: translate({ id: 'home.step1.title', message: 'Get Credentials' }),
      description: translate({ id: 'home.step1.desc', message: 'Two OIDC clients in your tenant — one for user login, one for server-to-server.' }),
    },
    {
      to: '/login',
      number: 'STEP 2',
      time: '30 min',
      title: translate({ id: 'home.step2.title', message: 'Add Login' }),
      description: translate({ id: 'home.step2.desc', message: 'Sign-in via mobile identity. Biometric confirmation in the user\'s mIdentity app.' }),
    },
    {
      to: '/chat',
      number: 'STEP 3',
      time: '30 min',
      title: translate({ id: 'home.step3.title', message: 'Add Chat' }),
      description: translate({ id: 'home.step3.desc', message: 'Server-to-user messaging with cryptographic delivery proof. Replies via webhook.' }),
    },
    {
      to: '/payments',
      number: 'STEP 4',
      time: '45 min',
      title: translate({ id: 'home.step4.title', message: 'Add Payments' }),
      description: translate({ id: 'home.step4.desc', message: 'User-signed transactions inside mIdentity. No card-network integration on your side.' }),
    },
    {
      to: '/go-live',
      number: 'STEP 5',
      time: '30 min',
      title: translate({ id: 'home.step5.title', message: 'Go Live' }),
      description: translate({ id: 'home.step5.desc', message: 'Production checklist — every item has bitten at least one real launch.' }),
    },
  ];

  return (
    <section style={{ padding: '3rem 1rem' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Translate id="home.steps.title">The 5-step partner path</Translate>
        </h2>
        <div className="row">
          {steps.map((s) => (
            <div key={s.to} className="col col--4" style={{ marginBottom: '1.5rem' }}>
              <StepCard {...s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title={translate({ id: 'home.title', message: 'Germany App – Partner Integration' })}
      description={translate({
        id: 'home.metaDescription',
        message: 'Integrate your service into the Germany App. Step-by-step partner guide in English and German.',
      })}
    >
      <Hero />
      <Steps />
    </Layout>
  );
}
