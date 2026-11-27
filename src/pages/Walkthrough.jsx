import React, { useCallback, useEffect, useRef, useState } from 'react';
import './Walkthrough.css';

const FEATURE_COUNT = 5;

const FEATURE_DESCRIPTIONS = {
  1: 'Browse a featured title and personalized rows from one home screen.',
  2: 'Set Energy, Suspense, Humour, and Familiarity to shape your mood mix.',
  3: 'Your slider choices bring the closest mood-based recommendations forward.',
  4: 'Choose a bold genre leap or a nearby twist to discover something new.',
  5: 'Blend two genres to uncover recommendations with a fresh combination.',
};

const TUTORIAL_STEPS = [
  {
    id: 'home-screen',
    featureNumber: 1,
    featureTitle: 'Netflix Main Screen',
    route: '/home?walkthrough=1',
    title: 'Explore the home screen',
    instruction: 'When you’re ready, select Start to continue to Mood DJ.',
    buttonLabel: 'Start',
    nextOnContinue: 'mood-energy',
  },
  {
    id: 'mood-energy',
    featureNumber: 2,
    featureTitle: 'Mood-based DJ',
    route: '/prototype/mood?walkthrough=1',
    focus: 'mood-energy',
    target: '.mood-slider-card:first-child',
    scrollBlock: 'end',
    title: 'Set the energy',
    instruction: 'Drag the Energy slider to set how high-energy you want your mix to feel.',
    action: 'change',
    actionTarget: '.mood-slider-card:first-child input[type="range"]',
    nextOnAction: 'mood-suspense',
  },
  {
    id: 'mood-suspense',
    featureNumber: 2,
    featureTitle: 'Mood-based DJ',
    route: '/prototype/mood?walkthrough=1',
    focus: 'mood-suspense',
    target: '.mood-slider-card:nth-child(2)',
    title: 'Choose the suspense level',
    instruction: 'Adjust Suspense to set how calm or edge-of-your-seat your picks should be.',
    action: 'change',
    actionTarget: '.mood-slider-card:nth-child(2) input[type="range"]',
    nextOnAction: 'mood-humour',
  },
  {
    id: 'mood-humour',
    featureNumber: 2,
    featureTitle: 'Mood-based DJ',
    route: '/prototype/mood?walkthrough=1',
    focus: 'mood-humour',
    target: '.mood-slider-card:nth-child(3)',
    title: 'Set the humour balance',
    instruction: 'Move Humour to balance funny picks with other moods.',
    action: 'change',
    actionTarget: '.mood-slider-card:nth-child(3) input[type="range"]',
    nextOnAction: 'mood-familiarity',
  },
  {
    id: 'mood-familiarity',
    featureNumber: 2,
    featureTitle: 'Mood-based DJ',
    route: '/prototype/mood?walkthrough=1',
    focus: 'mood-familiarity',
    target: '.mood-slider-card.is-editable',
    title: 'Adjust or rename Familiarity',
    instruction: 'Set Familiarity, or edit its label to a genre you like. This last slider is customizable.',
    action: 'change',
    actionTarget: '.mood-slider-card.is-editable input',
    nextOnAction: 'mood-generate',
  },
  {
    id: 'mood-generate',
    featureNumber: 2,
    featureTitle: 'Mood-based DJ',
    route: '/prototype/mood?walkthrough=1',
    focus: 'mood-generate',
    target: '.mood-generate',
    title: 'Generate your mood mix',
    instruction: 'Click Generate for Me to build recommendations from your slider settings.',
    action: 'click',
    actionTarget: '.mood-generate',
    nextOnAction: 'mood-wait',
  },
  {
    id: 'mood-wait',
    featureNumber: 2,
    featureTitle: 'Mood-based DJ',
    title: 'Mixing your mood',
    instruction: 'Your settings are being matched with titles. Your picks will appear here shortly.',
    route: '/prototype/mood?walkthrough=1',
    hidden: true,
  },
  {
    id: 'mood-picks',
    featureNumber: 3,
    featureTitle: 'Mood-based picks',
    route: '/prototype/mood?walkthrough=1',
    focus: 'mood-picks',
    target: '.mood-card-wrap:first-child',
    title: 'Your mood-matched picks',
    instruction: 'These recommendations are matched to your mood. Explore the results, then continue.',
    buttonLabel: 'Continue to Surprise Me',
    nextOnContinue: 'surprise-mode',
  },
  {
    id: 'surprise-mode',
    featureNumber: 4,
    featureTitle: 'Surprise Me',
    route: '/prototype/surprise-me?walkthrough=1',
    focus: 'surprise-mode',
    target: '.surprise-options',
    scrollTarget: '.surprise-heading',
    scrollBlock: 'start',
    title: 'Choose a discovery style',
    instruction: 'Select a style: explore something completely different or try an adjacent genre.',
    action: 'click',
    actionTarget: '.surprise-options input[type="radio"]',
    nextOnAction: 'surprise-generate',
  },
  {
    id: 'surprise-generate',
    featureNumber: 4,
    featureTitle: 'Surprise Me',
    route: '/prototype/surprise-me?walkthrough=1',
    focus: 'surprise-generate',
    target: '.surprise-cta',
    title: 'Find an unexpected pick',
    instruction: 'Click Surprise Me to generate recommendations in the style you chose.',
    action: 'click',
    actionTarget: '.surprise-cta',
    nextOnAction: 'surprise-wait',
  },
  {
    id: 'surprise-wait',
    featureNumber: 4,
    featureTitle: 'Surprise Me',
    title: 'Finding a surprise',
    instruction: 'Your discovery style is being matched to fresh picks.',
    route: '/prototype/surprise-me?walkthrough=1',
    hidden: true,
  },
  {
    id: 'surprise-results',
    featureNumber: 4,
    featureTitle: 'Surprise Me',
    route: '/prototype/surprise-me?walkthrough=1',
    focus: 'surprise-results',
    target: '.surprise-card-wrap:first-child',
    title: 'Your surprise picks',
    instruction: 'Explore the recommendations, then continue to the genre-mix demonstration.',
    buttonLabel: 'Continue to Genre Collision',
    nextOnContinue: 'genre-mix',
  },
  {
    id: 'genre-mix',
    featureNumber: 5,
    featureTitle: 'Genre Collision',
    route: '/prototype/surprise-me?walkthrough=1',
    focus: 'genre-mix',
    target: '.surprise-mix-chip:first-child > button:first-child',
    title: 'Try a genre collision',
    instruction: 'Choose a highlighted genre pair to see recommendations that blend both genres.',
    action: 'click',
    actionTarget: '.surprise-mix-chip:first-child > button:first-child',
    nextOnAction: 'genre-wait',
  },
  {
    id: 'genre-wait',
    featureNumber: 5,
    featureTitle: 'Genre Collision',
    title: 'Blending the genres',
    instruction: 'Finding titles that bring both sides of your genre pair together.',
    route: '/prototype/surprise-me?walkthrough=1',
    hidden: true,
  },
  {
    id: 'genre-results',
    featureNumber: 5,
    featureTitle: 'Genre Collision',
    route: '/prototype/surprise-me?walkthrough=1',
    focus: 'genre-results',
    target: '.surprise-results-heading',
    title: 'Explore the genre blend',
    instruction: 'You made it! Browse the blended picks or finish the tutorial and explore on your own.',
    buttonLabel: 'Finish tutorial',
    nextOnContinue: 'complete',
  },
];

function ArrowIcon({ direction = 'right' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {direction === 'left'
        ? <path d="m15 18-6-6 6-6" />
        : <path d="M5 12h14m-6-6 6 6-6 6" />}
    </svg>
  );
}

function Intro({ onStart }) {
  return (
    <main className="walkthrough-intro">
      <div className="intro-grain" aria-hidden="true" />
      <header className="walkthrough-brand">
        <span className="brand-n">N</span>
        <span>NETFLIX</span>
        <span className="brand-divider" />
        <span className="brand-label">PRODUCT WALKTHROUGH</span>
      </header>
      <section className="intro-content">
        <p className="intro-eyebrow"><i /> A NEW WAY TO FIND YOUR NEXT WATCH</p>
        <h1>Netflix — Rethinking<br /><span>Content Discovery</span></h1>
        <p className="intro-description">An interactive walkthrough of a more intuitive,<br className="desktop-break" /> mood-driven viewing experience.</p>
        <div className="start-here-cue"><span>START HERE</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6" /></svg></div>
        <button className="start-walkthrough" type="button" onClick={onStart}>
          Start walkthrough <ArrowIcon />
        </button>
        <span className="intro-note">{FEATURE_COUNT} features · all interactive</span>
      </section>
      <div className="intro-backdrop" aria-hidden="true">
        <div className="intro-orbit orbit-one" />
        <div className="intro-orbit orbit-two" />
        <div className="intro-poster poster-one"><span>YOUR<br />NEXT<br />STORY</span></div>
        <div className="intro-poster poster-two"><span>INTO<br />THE<br />UNKNOWN</span></div>
        <div className="intro-poster poster-three"><span>TONIGHT<br />FEELS<br />DIFFERENT</span></div>
      </div>
      <footer className="intro-footer"><span>AN INTERACTIVE PRODUCT CASE STUDY</span><span>SCROLL LESS. FEEL MORE.</span></footer>
    </main>
  );
}

export default function Walkthrough() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loadedRoute, setLoadedRoute] = useState(null);
  const frameRef = useRef(null);
  const step = TUTORIAL_STEPS[stepIndex];

  const sendGuide = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage({
      type: 'netflix-walkthrough-guide',
      step: finished ? null : step,
    }, window.location.origin);
  }, [finished, step]);

  useEffect(() => {
    sendGuide();
  }, [sendGuide]);

  useEffect(() => {
    const handleDemoMessage = (event) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;

      if (event.data?.type === 'netflix-walkthrough-ready') {
        sendGuide();
        return;
      }

      if (event.data?.type === 'netflix-walkthrough-action') {
        if (event.data.stepId !== step.id) return;
        const nextStep = step.nextOnAction;
        if (nextStep === 'complete') {
          setFinished(true);
          return;
        }
        const nextIndex = TUTORIAL_STEPS.findIndex((item) => item.id === nextStep);
        if (nextIndex >= 0) setStepIndex(nextIndex);
        return;
      }

      if (event.data?.type === 'netflix-walkthrough-mood-results' && step.id === 'mood-wait') {
        setStepIndex(TUTORIAL_STEPS.findIndex((item) => item.id === 'mood-picks'));
        return;
      }
      if (event.data?.type === 'netflix-walkthrough-surprise-results' && step.id === 'surprise-wait') {
        setStepIndex(TUTORIAL_STEPS.findIndex((item) => item.id === 'surprise-results'));
        return;
      }
      if (event.data?.type === 'netflix-walkthrough-surprise-results' && step.id === 'genre-wait') {
        setStepIndex(TUTORIAL_STEPS.findIndex((item) => item.id === 'genre-results'));
      }
    };

    window.addEventListener('message', handleDemoMessage);
    return () => window.removeEventListener('message', handleDemoMessage);
  }, [sendGuide, step]);

  const continueTutorial = () => {
    if (step.nextOnContinue === 'complete') {
      setFinished(true);
      return;
    }
    const nextIndex = TUTORIAL_STEPS.findIndex((item) => item.id === step.nextOnContinue);
    if (nextIndex >= 0) setStepIndex(nextIndex);
  };

  if (!started) return <Intro onStart={() => setStarted(true)} />;

  return (
    <main className="walkthrough-shell">
      <header className="walkthrough-topbar">
        <a className="walkthrough-wordmark" href="/" aria-label="Return to walkthrough intro">N</a>
        <div className="topbar-title"><span>INTERACTIVE TUTORIAL</span><i /> {finished ? 'TUTORIAL COMPLETE' : step.featureTitle}</div>
        <div className="topbar-actions">
          <span className="topbar-step">FEATURE 0{step.featureNumber} / 05</span>
          <button className="topbar-restart" type="button" aria-label="Restart tutorial" onClick={() => { setFinished(false); setStepIndex(0); }}>
            <span aria-hidden="true">↺</span><span className="restart-label">Restart tutorial</span>
          </button>
        </div>
      </header>

      <div className="walkthrough-layout">
        <aside className="walkthrough-guidance" aria-live="polite">
          <div className="guidance-step-meta">
            <span>FEATURE 0{step.featureNumber} / 05</span>
            <span>{step.hidden ? 'IN PROGRESS' : 'GUIDED STEP'}</span>
          </div>
          <p className="guidance-eyebrow">{finished ? 'WALKTHROUGH COMPLETE' : 'NOW EXPLORING'}</p>
          <h1 className="guidance-feature-title">{finished ? 'Ready to explore' : step.featureTitle}</h1>
          <h2 className="guidance-step-title">{finished ? 'You’re all set' : step.title}</h2>
          <p className="guidance-description">{FEATURE_DESCRIPTIONS[step.featureNumber]}</p>
          <div className="guidance-instruction">
            <span>{step.hidden ? 'IN PROGRESS' : step.action ? 'TRY THIS' : 'NEXT'}</span>
            <p>{finished ? 'Explore the prototype at your own pace, or restart the tutorial any time.' : step.instruction}</p>
          </div>
          {step.action && !step.hidden && <p className="guidance-pointer-note">Use the highlighted control in the preview.</p>}
          {step.buttonLabel && !finished && (
            <button type="button" className="guidance-continue" onClick={continueTutorial}>
              {step.buttonLabel}<ArrowIcon />
            </button>
          )}
        </aside>

        <section className="live-demo" aria-label="Interactive Netflix prototype">
          <div className="live-demo-heading">
            <div className="live-indicator"><i /> LIVE TUTORIAL</div>
            <span className="live-demo-name">{finished ? 'Explore the prototype on your own' : step.featureTitle}</span>
            <span className="live-demo-count">FEATURE 0{step.featureNumber} / 05</span>
          </div>
          <div className="device-frame">
            <div className="device-topbar" aria-hidden="true">
              <span className="device-lights"><i /><i /><i /></span>
              <span className="device-address"><b /> guided prototype</span>
              <span className="device-actions">•••</span>
            </div>
            <iframe
              key={step.route}
              ref={frameRef}
              src={step.route}
              className={loadedRoute === step.route ? 'is-loaded' : 'is-loading'}
              title={`Interactive tutorial: ${step.featureTitle}`}
              onLoad={() => { setLoadedRoute(step.route); sendGuide(); }}
              allow="autoplay"
            />
          </div>
          <p className="live-demo-caption"><span>↖</span> {step.target ? 'Follow the pointer and highlight. Your actions move the tutorial forward.' : 'Select Start in the guide to continue to Mood DJ.'}</p>
        </section>
      </div>
      <div className="walkthrough-progress" role="progressbar" aria-label="Tutorial progress" aria-valuenow={step.featureNumber} aria-valuemin={1} aria-valuemax={5}>
        <span style={{ width: `${(step.featureNumber / 5) * 100}%` }} />
      </div>
    </main>
  );
}
