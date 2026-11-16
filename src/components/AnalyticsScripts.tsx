'use client';

import Script from 'next/script';
import { ANALYTICS_CONFIG } from '@/config/analytics';

/**
 * Memuat skrip Meta Pixel dan Google Analytics 4 secara otomatis
 * apabila ID sudah diisi pada src/config/analytics.ts atau Environment Variables.
 */
export function AnalyticsScripts() {
  const { metaPixelId, gaMeasurementId } = ANALYTICS_CONFIG;

  return (
    <>
      {gaMeasurementId && (
        <>
          <script
            id="ga4-bootstrap"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                window.gtag('js', new Date());
                window.gtag('config', '${gaMeasurementId}', { send_page_view: true });
              `,
            }}
          />
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`}
            strategy="afterInteractive"
          />
        </>
      )}

      {metaPixelId && (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${encodeURIComponent(metaPixelId)}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}
