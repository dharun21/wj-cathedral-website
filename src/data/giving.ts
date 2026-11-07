/**
 * Giving details supplied and approved by the client on 7 November 2026.
 *
 * This local record keeps the static website useful before Supabase is
 * connected. Once Supabase is configured, the public page only displays the
 * owner-verified, published settings returned by the CMS.
 */
export const approvedGivingDetails = {
  accountName: 'WORSHIP TO JESUS MINISTRIES',
  bankName: 'State Bank of India (SBI)',
  bankBranch: 'Nannilam',
  accountNumber: '31416070895',
  ifsc: 'SBIN0000261',
  gpayNumber: '9788056467',
  gpayName: 'Zeehan Paul (Pastor of Worship to Jesus Cathedral)',
  upiId: 'zeehan739@okaxis',
  qrUrl: './giving/gpay-qr.jpg',
} as const
