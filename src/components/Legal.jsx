import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Legal({ type }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const lastUpdated = 'May 23, 2026';

  return (
    <div style={{ background: 'var(--ivory)', color: 'var(--dark)', minHeight: '100vh', paddingTop: '100px' }}>
      <Helmet>
        <title>{title} | Stitches Custom Designer Wear</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <style>{`
        .legal-nav { padding: 20px 60px; border-bottom: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: space-between; }
        .legal-logo { font-family: var(--font-display); font-size: 2rem; color: var(--dark); text-decoration: none; }
        .legal-back { font-family: var(--font-body); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; color: var(--rose); text-decoration: none; }
        .legal-container { max-width: 800px; margin: 0 auto; padding: 60px 20px; }
        .legal-title { font-family: var(--font-heading); font-size: 3rem; margin-bottom: 10px; }
        .legal-date { font-family: var(--font-body); font-size: 0.9rem; color: var(--soft); margin-bottom: 40px; }
        .legal-content h2 { font-family: var(--font-heading); font-size: 1.8rem; margin: 40px 0 15px; color: var(--dark); }
        .legal-content p { font-family: var(--font-body); font-size: 1rem; line-height: 1.7; color: var(--mid); margin-bottom: 20px; }
        .legal-content ul { margin-left: 20px; margin-bottom: 20px; }
        .legal-content li { font-family: var(--font-body); font-size: 1rem; line-height: 1.7; color: var(--mid); margin-bottom: 10px; list-style-type: disc; }
      `}</style>
      
      <nav className="legal-nav">
        <Link to="/" className="legal-logo">Stitches</Link>
        <Link to="/" className="legal-back">← Back to Home</Link>
      </nav>

      <div className="legal-container">
        <h1 className="legal-title">{title}</h1>
        <p className="legal-date">Last Updated: {lastUpdated}</p>
        
        <div className="legal-content">
          {isPrivacy ? (
            <>
              <p>At Stitches, accessible from stitches-coimbatore.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Stitches and how we use it.</p>
              
              <h2>1. Information We Collect</h2>
              <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
              <ul>
                <li><strong>Contact Information:</strong> When you book a consultation, we may collect your name, phone number, and style preferences.</li>
                <li><strong>Measurements:</strong> Physical measurements taken during fittings are stored securely for your current and future orders.</li>
              </ul>
              
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect in various ways, including to:</p>
              <ul>
                <li>Provide, operate, and maintain our bespoke tailoring services.</li>
                <li>Improve, personalize, and expand our website and physical studio offerings.</li>
                <li>Communicate with you via WhatsApp or Email regarding your orders, fittings, and appointments.</li>
              </ul>
              
              <h2>3. Cookies and Web Beacons</h2>
              <p>Like any other website, Stitches uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
              
              <h2>4. Contact Us</h2>
              <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at stitches.cbe@gmail.com.</p>
            </>
          ) : (
            <>
              <p>Welcome to Stitches. These terms and conditions outline the rules and regulations for the use of the Stitches Custom Designer Wear website and bespoke tailoring services.</p>
              
              <h2>1. Appointments and Consultations</h2>
              <p>Consultations at our Coimbatore studio are by appointment only. We request that you arrive on time. Cancellations must be made at least 24 hours in advance.</p>
              
              <h2>2. Custom Orders and Fittings</h2>
              <ul>
                <li><strong>Measurements:</strong> While we take utmost care, weight fluctuations between the measurement date and fitting date are the client's responsibility.</li>
                <li><strong>Alterations:</strong> Up to two rounds of minor alterations are included in the bespoke price. Major design changes after the fabric is cut will incur additional charges.</li>
                <li><strong>Fabric:</strong> If you provide your own fabric, Stitches is not liable for its durability, color bleeding, or shrinkage after stitching.</li>
              </ul>
              
              <h2>3. Payment Terms</h2>
              <p>A non-refundable advance payment of 50% is required to commence work on any custom order. The remaining balance must be cleared before or at the time of final delivery/pickup.</p>
              
              <h2>4. Deliveries and Timelines</h2>
              <p>Estimated delivery dates are provided during consultation. While we strive to meet these deadlines, intricate hand-embroidery and sourcing delays may occasionally extend timelines. We will communicate any delays promptly.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
