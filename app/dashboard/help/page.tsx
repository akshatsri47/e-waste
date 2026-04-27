export default function HelpPage() {
  const faqs = [
    { q: 'How do I schedule a pickup?', a: 'Click "New Request" on the dashboard or in the sidebar. Fill the 4-step form — item type, details, photos, and pickup address.' },
    { q: 'How long does pickup take?', a: 'Our team typically arrives within the time slot you select. You\'ll receive a status update once the pickup is completed.' },
    { q: 'How do I earn points?', a: 'Points are awarded when your pickup is marked Completed by our admin team. Different devices earn different points.' },
    { q: 'Can I cancel a pickup?', a: 'Contact support if you need to cancel. Admin can cancel scheduled pickups from the admin panel.' },
    { q: 'What items can I recycle?', a: 'We accept phones, laptops, tablets, TVs, small appliances, cables, and other electronics.' },
    { q: 'Is my data safe?', a: 'Yes. Your data is stored securely on Supabase. We only use it to manage your pickups and calculate environmental impact.' },
  ]

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-neutral-900)' }}>Help Center</h1>
      <p style={{ fontSize: '14px', color: 'var(--color-neutral-500)', marginBottom: '28px' }}>Frequently asked questions</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-neutral-100)',
            padding: '20px 22px',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: '8px', display: 'flex', gap: '10px' }}>
              <span style={{ color: 'var(--color-primary)' }}>Q.</span> {faq.q}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-neutral-700)', lineHeight: 1.7, paddingLeft: '22px' }}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '24px', padding: '24px',
        background: 'var(--color-primary-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-primary-pale)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '20px', marginBottom: '8px' }}>📧</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '4px' }}>Still need help?</div>
        <div style={{ fontSize: '13px', color: 'var(--color-neutral-500)' }}>
          Email us at <a href="mailto:support@evolve.in" style={{ color: 'var(--color-primary)' }}>support@evolve.in</a>
        </div>
      </div>
    </div>
  )
}
