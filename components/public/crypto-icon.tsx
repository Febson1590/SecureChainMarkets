/**
 * CryptoIcon — recognizable brand-mark SVGs for major crypto assets.
 * Faithful approximations of the official logos, embedded as React
 * components so we don't need to ship a separate icon package or
 * depend on a third-party CDN.
 */

type Props = { size?: number; className?: string };

export function CryptoIcon({ symbol, size = 24, className }: Props & { symbol: string }) {
  const Icon = ICONS[symbol.toUpperCase()] ?? GenericIcon;
  return <Icon size={size} className={className} />;
}

const ICONS: Record<string, React.ComponentType<Props>> = {
  BTC:  BtcIcon,
  ETH:  EthIcon,
  USDT: UsdtIcon,
  USDC: UsdcIcon,
  BNB:  BnbIcon,
  SOL:  SolIcon,
  XRP:  XrpIcon,
  ADA:  AdaIcon,
  DOGE: DogeIcon,
  AVAX: AvaxIcon,
  DOT:  DotIcon,
  LINK: LinkIcon,
  LTC:  LtcIcon,
  TRX:  TrxIcon,
  MATIC: MaticIcon,
  POL:  MaticIcon,
};

/* Bitcoin — orange disc with the classic ₿ glyph */
function BtcIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        fill="#FFFFFF"
        d="M21.83 14.36c.3-2-1.22-3.07-3.31-3.79l.68-2.71-1.65-.41-.66 2.64c-.43-.11-.88-.21-1.32-.32l.66-2.66-1.65-.41-.68 2.71-3.34-.83-.44 1.76 1.21.3c.66.16.78.6.76 1l-1.92 7.69c-.09.21-.31.53-.79.41-.21-.05-1.21-.3-1.21-.3l-.82 1.89 3.16.78-.7 2.78 1.65.41.69-2.71c.45.12.89.24 1.31.34l-.69 2.7 1.65.41.7-2.78c2.81.53 4.92.32 5.81-2.22.72-2.05-.04-3.23-1.52-4 1.08-.25 1.89-.96 2.11-2.43Zm-3.78 5.3c-.51 2.05-3.97.94-5.09.66l.91-3.65c1.12.28 4.71.84 4.18 2.99Zm.51-5.32c-.46 1.86-3.34.92-4.27.69l.83-3.31c.93.23 3.93.66 3.44 2.62Z"
      />
    </svg>
  );
}

/* Ethereum — navy disc with the classic two-tone diamond */
function EthIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <g fillRule="nonzero">
        <path fill="#FFFFFF" fillOpacity="0.6" d="M16.5 4v8.87l7.5 3.35z" />
        <path fill="#FFFFFF" d="M16.5 4 9 16.22l7.5-3.35z" />
        <path fill="#FFFFFF" fillOpacity="0.6" d="M16.5 21.97v6.03L24 17.62z" />
        <path fill="#FFFFFF" d="M16.5 28v-6.03L9 17.62z" />
        <path fill="#FFFFFF" fillOpacity="0.2" d="M16.5 20.57 24 16.22l-7.5-3.35z" />
        <path fill="#FFFFFF" fillOpacity="0.6" d="M9 16.22l7.5 4.35v-7.7z" />
      </g>
    </svg>
  );
}

/* Tether — green disc with white T */
function UsdtIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path
        fill="#FFFFFF"
        d="M17.92 17.38v-.01c-.11.01-.69.04-1.97.04-1.03 0-1.75-.03-2-.04v.01c-3.93-.17-6.85-.85-6.85-1.67s2.93-1.5 6.85-1.68v2.67c.26.02.99.06 2.02.06 1.23 0 1.84-.05 1.95-.06v-2.67c3.92.18 6.84.86 6.84 1.68s-2.92 1.5-6.84 1.67Zm0-3.62v-2.39h5.46V7.73H8.59v3.64h5.46v2.39c-4.45.21-7.79.99-7.79 1.92s3.34 1.71 7.79 1.92v7.66h3.87v-7.66c4.44-.21 7.78-.99 7.78-1.92s-3.34-1.71-7.78-1.92Z"
      />
    </svg>
  );
}

/* USDC — blue disc */
function UsdcIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#2775CA" />
      <path
        fill="#FFFFFF"
        d="M20.33 18.13c0-2.3-1.39-3.09-4.16-3.42-1.98-.26-2.38-.79-2.38-1.71s.66-1.51 1.98-1.51c1.19 0 1.85.4 2.18 1.39.07.2.26.33.46.33h1.06c.26 0 .46-.2.46-.46v-.07c-.26-1.45-1.45-2.57-2.97-2.71v-1.59c0-.26-.2-.46-.53-.53h-.99c-.26 0-.46.2-.53.53v1.52c-1.98.26-3.23 1.59-3.23 3.23 0 2.18 1.32 3.03 4.09 3.36 1.85.33 2.44.73 2.44 1.78s-.92 1.78-2.18 1.78c-1.71 0-2.31-.73-2.51-1.71-.07-.26-.26-.4-.46-.4H12.1c-.26 0-.46.2-.46.46v.07c.26 1.65 1.32 2.84 3.49 3.16v1.59c0 .26.2.46.53.53h.99c.26 0 .46-.2.53-.53v-1.59c1.98-.33 3.16-1.71 3.16-3.49Z"
      />
      <path
        fill="#FFFFFF"
        d="M12.63 25.5c-5.16-1.85-7.81-7.61-5.89-12.71 1-2.65 3.09-4.68 5.89-5.69.26-.13.4-.33.4-.66v-.92c0-.26-.13-.46-.4-.53-.07 0-.2 0-.26.07-6.28 1.98-9.7 8.66-7.72 14.94 1.19 3.69 4.03 6.54 7.72 7.72.26.13.53 0 .59-.26.07-.07.07-.13.07-.26v-.92c0-.2-.2-.46-.4-.59ZM19.7 5.07c-.26-.13-.53 0-.59.26-.07.07-.07.13-.07.26v.92c0 .26.2.53.4.66 5.16 1.85 7.81 7.61 5.89 12.71-1 2.65-3.09 4.68-5.89 5.69-.26.13-.4.33-.4.66v.92c0 .26.13.46.4.53.07 0 .2 0 .26-.07 6.28-1.98 9.7-8.66 7.72-14.94-1.19-3.76-4.09-6.61-7.72-7.79Z"
      />
    </svg>
  );
}

/* BNB — gold square / rotated diamonds */
function BnbIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
      <path
        fill="#FFFFFF"
        d="m12.12 14.69 3.88-3.88 3.88 3.88 2.26-2.26L16 6.55l-6.14 6.14 2.26 2.26ZM6.55 16l2.26-2.26L11.07 16l-2.26 2.26L6.55 16Zm5.57 1.31 3.88 3.88 3.88-3.88 2.26 2.26L16 25.45l-6.14-6.14 2.26-2.26Zm8.81-1.31 2.26-2.26L25.45 16l-2.26 2.26L20.93 16Zm-2.69-.05L16 13.71l-2.24 2.24-.31.31.31.31L16 18.81l2.24-2.24.31-.31-.31-.31Z"
      />
    </svg>
  );
}

/* Solana — black disc with the gradient stripes */
function SolIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <defs>
        <linearGradient id="sol-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="#0F0F0F" />
      <g fill="url(#sol-g1)">
        <path d="M9 21.5h12.4c.3 0 .4.4.2.6l-2 2c-.1.1-.3.2-.5.2H6.7c-.3 0-.4-.4-.2-.6l2.3-2.1c.1-.1.2-.1.4-.1Z" />
        <path d="M9 8.5h12.4c.3 0 .4.4.2.6l-2 2c-.1.1-.3.2-.5.2H6.7c-.3 0-.4-.4-.2-.6l2.3-2.1c.1-.1.2-.1.4-.1Z" />
        <path d="M21.4 15h-12.4c-.2 0-.3-.1-.4-.1l-2.3-2.1c-.2-.2-.1-.6.2-.6h13.4c.2 0 .4.1.5.2l2 2c.2.2.1.6-.2.6h-.8Z" />
      </g>
    </svg>
  );
}

/* XRP — stylized X */
function XrpIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#23292F" />
      <path
        fill="#FFFFFF"
        d="M22.05 8h2.62l-5.45 5.4a4.51 4.51 0 0 1-6.34 0L7.43 8H10.05l4.14 4.1c1 .98 2.62.98 3.62 0L22.05 8Zm-12.04 16h-2.6l5.49-5.43a4.51 4.51 0 0 1 6.34 0L24.7 24h-2.6l-4.18-4.13c-1-.98-2.62-.98-3.62 0L9.91 24h.1Z"
      />
    </svg>
  );
}

/* Cardano */
function AdaIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#0033AD" />
      <g fill="#FFFFFF">
        <circle cx="16" cy="16" r="2.4" />
        <circle cx="10.5" cy="13.5" r="1.1" /><circle cx="10.5" cy="18.5" r="1.1" />
        <circle cx="21.5" cy="13.5" r="1.1" /><circle cx="21.5" cy="18.5" r="1.1" />
        <circle cx="13.5" cy="9.5" r="1" /><circle cx="18.5" cy="9.5" r="1" />
        <circle cx="13.5" cy="22.5" r="1" /><circle cx="18.5" cy="22.5" r="1" />
        <circle cx="7" cy="16" r="1" /><circle cx="25" cy="16" r="1" />
        <circle cx="16" cy="7" r="1" /><circle cx="16" cy="25" r="1" />
      </g>
    </svg>
  );
}

/* Dogecoin */
function DogeIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#C2A633" />
      <path
        fill="#FFFFFF"
        d="M14.18 9.9h3.16c2.4 0 4.06.62 5.06 1.85 1 1.23 1.5 2.93 1.5 5.1s-.5 3.87-1.5 5.1c-1 1.23-2.66 1.85-5.06 1.85h-3.16v-4.32h2.36c1.05 0 1.79-.27 2.22-.81.43-.54.65-1.4.65-2.6 0-1.2-.22-2.06-.65-2.6-.43-.54-1.17-.81-2.22-.81h-2.36v4.6h-2.16v-4.6h-1.6v-1.96h1.6V9.9h2.16Z"
      />
    </svg>
  );
}

/* Avalanche — red triangle */
function AvaxIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#E84142" />
      <path fill="#FFFFFF" d="M21.4 22h3.5c.5 0 .8-.5.5-1l-4.6-8.1c-.2-.4-.8-.4-1 0l-1.1 2c-.4.7-.4 1.6 0 2.3l2.1 3.7c.2.4-.1.7-.4.7H7.7c-.5 0-.8.5-.5 1l1.5 2.7c.2.4.6.6 1.1.6h11.6Zm-9.7-3.8 2.3-4c.3-.5 0-1-.5-1H8.6c-.5 0-.8.5-.5 1l2.3 4c.2.4.8.4 1 0Z" />
    </svg>
  );
}

/* Polkadot */
function DotIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#E6007A" />
      <g fill="#FFFFFF">
        <ellipse cx="16" cy="9" rx="3" ry="1.7" />
        <ellipse cx="16" cy="23" rx="3" ry="1.7" />
        <ellipse cx="10" cy="12.5" rx="3" ry="1.7" transform="rotate(-60 10 12.5)" />
        <ellipse cx="22" cy="19.5" rx="3" ry="1.7" transform="rotate(-60 22 19.5)" />
        <ellipse cx="10" cy="19.5" rx="3" ry="1.7" transform="rotate(60 10 19.5)" />
        <ellipse cx="22" cy="12.5" rx="3" ry="1.7" transform="rotate(60 22 12.5)" />
      </g>
    </svg>
  );
}

/* Chainlink — blue cube */
function LinkIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#2A5ADA" />
      <path fill="#FFFFFF" d="m16 6 1.85 1.07 5.05 2.93 1.85 1.07v9.86l-1.85 1.07-5.05 2.93L16 26l-1.85-1.07-5.05-2.93L7.25 20.93v-9.86l1.85-1.07 5.05-2.93L16 6Zm-4.7 5.93v8.14L16 22.93l4.7-2.86v-8.14L16 9.07l-4.7 2.86Z" />
    </svg>
  );
}

/* Litecoin */
function LtcIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#345D9D" />
      <path fill="#FFFFFF" d="m12.4 23.6 1.05-3.95 2.55-.97-.7 2.6h6.1l-.85 3.18H12.4Zm1.5-5.6L15.95 9.4h3.3l-1.7 6.4 2.55-.97-.7 2.6-2.55.97-.5 1.97h-3.55l.5-1.97-1.4.6Z" />
    </svg>
  );
}

/* Tron */
function TrxIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#EF0027" />
      <path fill="#FFFFFF" d="m22.32 11.4-9.66-1.78c-.2-.04-.41.04-.55.2-.13.16-.16.39-.07.58l5.96 13.05c.09.2.29.34.5.34h.04c.23-.02.42-.18.49-.4l3.66-11.27c.07-.22 0-.46-.18-.6-.06-.05-.13-.09-.21-.12Zm-7.96-.3 6.3 1.16-2.32 2.36-3.98-3.52Zm5.34 2.95 2.06 1.83-1.05 3.23-1.01-5.06Zm-.9-1.04-2.95 7.51-3.4-7.45 6.35-.06Z" />
    </svg>
  );
}

/* Polygon */
function MaticIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#8247E5" />
      <path fill="#FFFFFF" d="M21.1 12.4c-.4-.2-.9-.2-1.3 0l-2.9 1.7-2 1.1-2.9 1.7c-.4.2-.9.2-1.3 0l-2.3-1.3c-.4-.2-.7-.7-.7-1.2v-2.6c0-.5.2-.9.7-1.2l2.3-1.3c.4-.2.9-.2 1.3 0l2.3 1.3c.4.2.7.7.7 1.2v1.7l2-1.2v-1.7c0-.5-.2-.9-.7-1.2l-4.3-2.5c-.4-.2-.9-.2-1.3 0l-4.4 2.5c-.4.2-.7.7-.7 1.2v5c0 .5.2.9.7 1.2l4.3 2.5c.4.2.9.2 1.3 0l2.9-1.7 2-1.2 2.9-1.7c.4-.2.9-.2 1.3 0l2.3 1.3c.4.2.7.7.7 1.2v2.6c0 .5-.2.9-.7 1.2l-2.3 1.3c-.4.2-.9.2-1.3 0l-2.3-1.3c-.4-.2-.7-.7-.7-1.2v-1.7l-2 1.2v1.7c0 .5.2.9.7 1.2l4.3 2.5c.4.2.9.2 1.3 0l4.3-2.5c.4-.2.7-.7.7-1.2v-5c0-.5-.2-.9-.7-1.2l-4.4-2.5Z" />
    </svg>
  );
}

/* Generic fallback — initial in a slate disc */
function GenericIcon({ size = 24, className }: Props) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#64748B" />
      <text x="16" y="21" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="14" fontWeight="700" fill="#FFFFFF">?</text>
    </svg>
  );
}
