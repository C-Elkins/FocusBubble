# Post-Publish Promotion Checklist for FocusBubble

## 🎯 Immediate Actions (Day 1)

### Update Repository

- [ ] Add store badges to README.md:
  ```markdown
  [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/YOUR_EXTENSION_ID.svg)](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
  [![Mozilla Add-on](https://img.shields.io/amo/v/focusbubble.svg)](https://addons.mozilla.org/firefox/addon/focusbubble/)
  [![Microsoft Edge](https://img.shields.io/badge/edge-available-blue)](https://microsoftedge.microsoft.com/addons/detail/YOUR_ID)
  ```

- [ ] Create GitHub Release:
  ```bash
  git tag v1.0.0
  git push origin v1.0.0
  # Create release on GitHub with changelog
  ```

- [ ] Update README.md with store links:
  ```markdown
  ## 🚀 Install FocusBubble
  
  - [Chrome Web Store](https://chrome.google.com/webstore/detail/YOUR_ID)
  - [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/focusbubble/)
  - [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/YOUR_ID)
  - [Opera Add-ons](https://addons.opera.com/extensions/details/YOUR_ID)
  ```

### Create Demo Assets

- [ ] Record 30-60 second demo video
- [ ] Create demo GIF (< 10MB for GitHub):
  ```bash
  # Using ffmpeg to create GIF from video
  ffmpeg -i demo.mp4 -vf "fps=10,scale=800:-1:flags=lanczos" -loop 0 demo.gif
  ```

- [ ] Take high-quality screenshots for social media
- [ ] Create Twitter/X card image (1200x630)
- [ ] Create Open Graph image for website

---

## 📱 Social Media Announcements

### Twitter/X Launch Post

**Template:**
```
🫧 Introducing FocusBubble - your new favorite focus timer! 

✅ Floating bubble that follows you
✅ Automatic distraction tracking
✅ AI-powered insights
✅ Beautiful analytics

Available now:
🔗 Chrome: [link]
🔗 Firefox: [link]
🔗 Edge: [link]

#productivity #focus #chrome #firefox [demo.gif]
```

**Follow-up Tweets (Thread):**
1. Feature highlight: Floating bubble demo
2. Feature highlight: Analytics dashboard
3. Privacy-first approach
4. Free and open source

### LinkedIn Post

**Template:**
```
Excited to launch FocusBubble 🫧 - a privacy-first focus timer for modern knowledge workers!

After months of development, FocusBubble is now available on Chrome, Firefox, and Edge. 

Key features:
• Floating timer visible on any website
• Automatic distraction tracking
• Beautiful session analytics
• Optional AI insights (using your own API key)
• Completely privacy-focused - all data stays local

Perfect for remote workers, developers, students, and anyone battling digital distractions.

Built with React, Manifest V3, and love by the Krubles Team.

Try it out: [links]

#productivity #browserextension #opensource #remotework
```

### Reddit Posts

**r/productivity** (Read rules first, check if self-promotion allowed):
```
Title: I built a focus timer that actually helps me understand my distractions [Demo GIF]

Body:
Hey r/productivity! I'm a developer who struggled with context-switching, so I built FocusBubble - a browser extension that's helped me improve my focus.

What makes it different:
• Floating bubble timer that's always visible (unlike tab-based timers I'd forget)
• Automatically detects when I switch tabs during focus sessions
• Shows me exactly when and where I lose focus
• Privacy-first: all data stored locally

It's free, open source, and available for Chrome/Firefox/Edge.

I'd love feedback from this community! [Links]

[Attach demo GIF]
```

**r/chrome_extensions**:
```
Title: FocusBubble - Built a distraction-aware focus timer with Manifest V3

Body:
Just launched FocusBubble, a focus timer extension I've been working on.

Tech stack: React, Manifest V3, content scripts, service workers

Features:
• Floating draggable bubble using content scripts
• Background timer via service worker + alarms API
• Session analytics dashboard
• Optional AI insights (OpenAI/Claude)

Open source, privacy-first (local storage only).

Would appreciate any technical feedback! [GitHub link] [Store link]
```

**r/webdev** (if discussing technical aspects):
```
Title: Built a Manifest V3 extension - lessons learned & tech stack

Body:
Sharing my experience building FocusBubble, a focus timer browser extension.

Key challenges solved:
• Service worker lifecycle management (stays alive for timers)
• Content script injection across diverse websites
• Cross-browser API compatibility (browser.* vs chrome.*)
• Performance optimization for floating UI

Tech: React, Webpack, Manifest V3, chrome.storage, alarms API

Open source: [GitHub link]
Live: [Store links]

Happy to answer questions about MV3 development!
```

---

## 🚀 Product Hunt Launch

**Preparation (1 week before):**
- [ ] Create Product Hunt account
- [ ] Prepare "maker" profile with photo
- [ ] Write compelling tagline (< 60 chars): "Distraction-aware focus timer with AI insights"
- [ ] Prepare first comment (detailed explanation)
- [ ] Schedule for Tuesday-Thursday (best days)
- [ ] Recruit 5-10 early supporters to upvote/comment

**Launch Day:**
- [ ] Post to Product Hunt: https://www.producthunt.com/posts/create
- [ ] Fill in details:
  - Name: FocusBubble
  - Tagline: "Focus timer that tracks distractions automatically"
  - Description: (copy from store listing)
  - Link: Chrome Web Store link (primary)
  - Gallery: Upload 5 screenshots + demo GIF
  - Topics: Productivity, Browser Extensions, Focus, Time Tracking

- [ ] Post first comment explaining the "why":
  ```
  Hey Product Hunt! 👋
  
  I'm Chase from Krubles Team. I built FocusBubble because I kept losing track of time 
  when switching between tasks.
  
  Unlike traditional timers that hide in a tab, FocusBubble follows you with a floating 
  bubble. It also automatically detects distractions, helping you understand your patterns.
  
  It's free, open source, and privacy-first (all data stays local).
  
  Would love your feedback! Happy to answer any questions.
  ```

- [ ] Respond to ALL comments quickly
- [ ] Share PH link on Twitter/LinkedIn
- [ ] Pin to GitHub repo

---

## 📰 Content Marketing

### Blog Post Ideas

1. **"Building a Browser Extension in 2025"** (Technical)
   - Manifest V3 migration lessons
   - Service worker challenges
   - Cross-browser compatibility
   - Post on: Dev.to, Medium, your blog

2. **"The Science of Focus: Why Traditional Timers Fail"** (Product)
   - Psychology of focus
   - Why FocusBubble is different
   - Case studies / testimonials
   - Post on: Medium, your blog, LinkedIn articles

3. **"Privacy-First Browser Extensions"** (Values)
   - Why local storage matters
   - Transparent data practices
   - Open source benefits
   - Post on: Dev.to, Hacker News

### Dev.to Post

```markdown
---
title: Building FocusBubble: A Manifest V3 Browser Extension Journey
published: true
tags: javascript, webdev, productivity, chrome
---

# Building FocusBubble: A Manifest V3 Browser Extension

I just launched FocusBubble, a focus timer browser extension. Here's what I learned...

[Technical content about challenges, solutions, code snippets]

Try it: [links]
GitHub: [link]
```

---

## 🌐 Landing Page (Optional but Recommended)

### Quick GitHub Pages Setup

1. Create `index.html` in repo root or `docs/` folder
2. Enable GitHub Pages in repo settings
3. URL: `https://c-elkins.github.io/focusbubble`

**Simple Landing Page Template:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>FocusBubble - Focus Timer with AI Insights</title>
    <!-- Meta tags for social sharing -->
    <meta property="og:title" content="FocusBubble - Focus Timer">
    <meta property="og:description" content="Distraction-aware focus timer for Chrome, Firefox, and Edge">
    <meta property="og:image" content="https://your-domain.com/og-image.png">
</head>
<body>
    <header>
        <h1>🫧 FocusBubble</h1>
        <p>The focus timer that helps you work smarter</p>
    </header>
    
    <section id="install">
        <a href="chrome-store-link">Install for Chrome</a>
        <a href="firefox-link">Install for Firefox</a>
        <a href="edge-link">Install for Edge</a>
    </section>
    
    <section id="features">
        <!-- Feature highlights with screenshots -->
    </section>
    
    <section id="demo">
        <video src="demo.mp4" autoplay loop muted></video>
    </section>
    
    <footer>
        <a href="privacy.html">Privacy Policy</a>
        <a href="https://github.com/C-Elkins/focusbubble">GitHub</a>
    </footer>
</body>
</html>
```

---

## 📧 Outreach

### Tech Bloggers / Influencers

Find 10-15 productivity/tech bloggers and send personalized emails:

**Email Template:**
```
Subject: Thought you'd like FocusBubble (new focus timer extension)

Hi [Name],

I'm Chase from Krubles Team. I've been reading your blog and love your content 
on [specific topic they wrote about].

I recently launched FocusBubble, a browser extension that takes a different 
approach to focus timers. Instead of hiding in a tab, it shows a floating bubble 
that follows you around. It also automatically tracks distractions.

I thought it might interest your readers given your focus on [productivity/tools/etc].

Would you be interested in checking it out? Happy to provide a demo or answer questions.

Links:
- Chrome: [link]
- Firefox: [link]
- GitHub: [link]

Thanks for your time!
Chase
```

### YouTube Reviewers

Search for: "productivity apps", "browser extensions", "focus tools"

Reach out to channels with 10k-100k subscribers (more responsive than large channels):

```
Subject: Extension review opportunity: FocusBubble

Hi [Channel Name],

I'm a developer who just launched FocusBubble, a focus timer browser extension 
with some unique features (floating timer, automatic distraction tracking, AI insights).

I think it would resonate with your audience based on your [specific video title].

Would you be interested in reviewing it? I can provide:
- Early access to upcoming features
- Direct support
- Any assets you need

Links:
[Store links]

Let me know if interested!
```

---

## 🎬 Video Content

### YouTube Video Ideas

1. **Demo & Tutorial** (3-5 min)
   - Quick overview
   - Installation
   - Key features walkthrough
   - Tips & tricks

2. **Behind the Scenes** (5-10 min)
   - Why I built it
   - Technical challenges
   - Code walkthrough
   - Future roadmap

3. **Shorts/TikToks** (< 60 sec)
   - "This extension changed how I work"
   - Quick feature demos
   - Before/after productivity

---

## 📊 Analytics & Tracking

### Set Up Monitoring

- [ ] Chrome Web Store developer dashboard (daily check)
- [ ] Firefox AMO statistics page
- [ ] GitHub star tracking
- [ ] Google Analytics (if landing page)
- [ ] Social media engagement metrics

### Key Metrics to Track

- Daily active users (DAU)
- Installation rate
- Uninstall rate
- Review ratings
- GitHub stars/forks
- Website traffic
- Social shares

---

## 🔄 Ongoing Promotion (Weeks 2-4)

### Week 2
- [ ] Post to relevant Discord servers (productivity, dev)
- [ ] Share case study / user testimonials
- [ ] Cross-post on different subreddits (spacing out)
- [ ] Engage with comments/reviews

### Week 3
- [ ] Publish technical blog post
- [ ] Reach out to newsletter curators (e.g., JavaScript Weekly, Hacker Newsletter)
- [ ] Create comparison guide (FocusBubble vs other timers)
- [ ] Post update thread on Product Hunt

### Week 4
- [ ] Share analytics/growth story
- [ ] Post "1 month later" retrospective
- [ ] Thank early adopters publicly
- [ ] Plan first update based on feedback

---

## 📝 Newsletter Curators to Contact

- **JavaScript Weekly**: https://javascriptweekly.com/
- **Hacker Newsletter**: https://hackernewsletter.com/
- **Dense Discovery** (design/tech): https://www.densediscovery.com/
- **TLDR Newsletter** (tech): https://tldr.tech/

**Submission Template:**
```
Headline: FocusBubble - Distraction-aware focus timer browser extension

Description: New open-source browser extension that helps track focus sessions 
and automatically detects distractions. Built with Manifest V3 for Chrome, 
Firefox, and Edge. Privacy-first with local-only data storage.

Link: [Chrome Web Store link]
GitHub: [repo link]
```

---

## 💬 Community Engagement

### Respond to Reviews

- [ ] Reply to all Chrome Web Store reviews within 48 hours
- [ ] Reply to Firefox reviews
- [ ] Thank positive reviews
- [ ] Address negative reviews constructively
- [ ] Fix bugs mentioned in reviews ASAP

### GitHub Community

- [ ] Add CONTRIBUTING.md
- [ ] Set up issue templates
- [ ] Welcome first-time contributors
- [ ] Create "good first issue" labels
- [ ] Respond to issues within 24 hours

---

## 🎯 30-Day Promotion Summary

**Week 1:** Launch, social media, Product Hunt, Reddit  
**Week 2:** Blogger outreach, Discord, engagement  
**Week 3:** Content marketing, newsletters, comparisons  
**Week 4:** Retrospective, testimonials, next update

**Goal Metrics:**
- 1,000 installations (first month)
- 4.5+ star rating
- 50+ GitHub stars
- 10+ positive reviews

---

Execute this checklist systematically, and your launch will be successful! 🚀
